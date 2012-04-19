
var DATA_CACHE_EXPIRY = 60; // no of mins before the data should be updated from server;

$.ajaxSetup({
	url: "http://10.0.2.2/mquiz/api/?format=json",
	type: "POST",
	headers:{},
	dataType:'json',
	timeout: 20000
});


var store = new Store();
store.init();

function Store(){
	
	this.init = function(){
		if (!localStorage) {
			localStorage.setItem('username', null);
			localStorage.setItem('password', null);
			localStorage.setItem('lang', 'EN');
			localStorage.setItem('quizzes', null);
			localStorage.setItem('results', null);
		}
	}
	
	this.get = function(key){
		var value = localStorage.getItem(key);
	    return value && JSON.parse(value);
	}
	
	this.set = function(key,value){
		localStorage.setItem(key,JSON.stringify(value));
	}
	
	this.clear = function(){
		localStorage.clear();
	}
	
	this.clearKey = function(key){
		this.set(key,null);
	}
	
	this.addArrayItem = function(key,value){
		//get current array
		var c = this.get(key);
		//var count = 0;
		if(!c){
			c = [];
		} 
		c.unshift(value);
		this.set(key,c);
	}
	
}


function mQuizInit(){
	dataUpdate();
	$('#content').empty();
}

function showPage(hash){

	$('#content').empty();
	if(hash.substring(0,3) == '#qt'){
		loadQuiz(hash.substring(1));
	} else if(hash == '#quizzes'){
		showLocalQuizzes();
	} else if(hash == '#results'){
		showResults();
	} else {
		$('#content').append("Invalid quiz reference");
	}
	
}

function showLocalQuizzes(){
	$('#content').empty();
	var localQuizzes = $('<div>').attr({'id':'localq'}); 
	localQuizzes.append("Quizzes stored locally:");
	$('#content').append(localQuizzes);
	var qs = store.get('quizzes');
	for (var q in qs){
		addQuizListItem(qs[q],'#localq');
	}
}

function showResults(){
	$('#content').empty();
	var results = $('<div>').attr({'id':'results'}); 
	$('#content').append(results);
	var qs = store.get('results');
	if(qs && qs.length>0){
		var result = $('<div>').attr({'class':'th'});
		result.append($('<div>').attr({'class':'thrt'}).text("Quiz"));
		result.append($('<div>').attr({'class':'thrs'}).text("Score"));
		result.append($('<div>').attr({'class':'thrr'}).text("Rank"));
		result.append("<div style='clear:both'></div>");
		results.append(result);
	} else {
		results.append("You haven't taken any quizzes yet");
	}
	for (var q in qs){
		var result = $('<div>').attr({'class':'result'});
		var d = new Date(qs[q].quizdate);
		var str = qs[q].title + "<br/><small>"+dateFormat(d,'HH:MM d-mmm-yy')+"</small>";
		result.append($('<div>').attr({'class':'rest clickable','onclick':'document.location="#'+qs[q].quizid +'"','title':'try this quiz again'}).html(str));
		result.append($('<div>').attr({'class':'ress'}).text((qs[q].userscore*100/qs[q].maxscore).toFixed(0)+"%"));
		result.append($('<div>').attr({'class':'resr'}).text(qs[q].rank));
		result.append("<div style='clear:both'></div>");
		results.append(result);
	}
}

function doSearch(){
	var t = $('#searchterms').val().trim();
	if(t.length > 1){
		$('#searchresults').text('Searching...');
		$.ajax({
			   data:{'method':'search','t':t,'username':store.get('username'),'password':store.get('password')}, 
			   success:function(data){
				   //check for any error messages
				   if(data && !data.error){
					   $('#searchresults').empty();
					   if(data.length == 0){
						   $('#searchresults').append('No results found.');
					   } 
					   for(var q in data){
						   addQuizListItem(data[q],'#searchresults');
					   }
				   }
			   },
			   error:function(data){
				   $('#searchresults').empty();
				   alert("Connection timeout or no connection available. You need to be online to search.");
			   }
			});
	}
}

function loadQuiz(ref){
	document.location = "#"+ref;
	$('#content').empty();
	showLoading('quiz');
	// find if this quiz is already in the cache
	var quiz = quizInCache(ref);
	if(!quiz){
		// load from server
		$.ajax({
			   data:{'method':'getquiz','username':store.get('username'),'password':store.get('password'),'ref':ref}, 
			   success:function(data){
				   if(data.error){
					   alert(data.error);
					   inQuiz = false;
					   document.location = "#select";
					   return;
				   }
				   //check for any error messages
				   if(data && !data.error){
					   //save to local cache and then load
					   store.addArrayItem('quizzes', data);
					   showQuiz(ref);
				   }
			   }, 
			   error:function(data){
				   alert("No connection available. You need to be online to load this quiz.");
				   document.location = "#select";
			   }
			});
	} else {
		showQuiz(ref);
	}
}

function showQuiz(ref){
	$('#content').empty();
	Q = new Quiz();
	Q.init(quizInCache(ref));
	
	var qhead = $('<div>').attr({'id':'quizheader'});
	$('#content').append(qhead);
	
	var question = $('<div>').attr({'id':'question'});
	$('#content').append(question);
	
	var response = $('<div>').attr({'id':'response'});
	$('#content').append(response);
	
	var quiznav = $('<div>').attr({'id':'quiznav'});
	var quiznavprev = $('<div>').attr({'class':'quiznavprev'}).append($('<input>').attr({'id':'quiznavprevbtn','type':'button','class':'button','value':'<< Prev','onclick':'Q.loadPrevQuestion()'}));
	quiznav.append(quiznavprev);
	var quiznavnext = $('<div>').attr({'class':'quiznavnext'}).append($('<input>').attr({'id':'quiznavnextbtn','type':'button','class':'button','value':'Next >>','onclick':'Q.loadNextQuestion()'}));
	quiznav.append(quiznavnext);
	var clear = $('<div>').attr({'style':'clear:both'});
	$('#content').append(quiznav);
	Q.loadQuestion();

}

function showLoading(msg){
	var l = $('<div>').attr({'id':'loading'}).html("Loading "+msg+"...");
	$('#content').append(l);
}

function loggedIn(){
	if(store.get('username') == null){
		return false;
	} 
	return true;
}

function login(){
	var username = $('#username').val();
	var password = $('#password').val();
	if(username == '' || password == ''){
		alert("Please enter your username and password");
		return false;
	}
	
	$.ajax({
		   data:{'method':'login','username':username,'password':password}, 
		   success:function(data){
			   //check for any error messages
			   if(data.login){
				// save username and password
				   store.set('username',$('#username').val());
				   store.set('displayname',data.name);
				   store.set('password',data.hash);
				   store.set('lastlogin',Date());
				   $('#login').hide();
				   $('#content').show();
				   showUsername('index.html');
				   loadQuizzesFromCache();
				   
			   } else {
				   alert('Login failed');
			   }
		   }, 
		   error:function(data){
			   alert("No connection available. You need to be online to log in.");
		   }
		});
	return false;
}


function logout(home){
	var lo = confirm('Are you sure you want to log out?\n\nYou will need an active connection to log in again.');
	if(lo){
		store.clear();
		store.init();
		showUsername(home);
		document.location = home;
	}
}

function showUsername(home){
	$('#logininfo').empty();
	if(store.get('displayname') != null){
		$('#logininfo').text(store.get('displayname') + " ");
	} 
	if(store.get('username') != null){
		var lo = $('<a>').text("Logout");
		$('#logininfo').append(lo);
		lo.click(function(){
			logout(home);
		});
	}
}

function dataUpdate(){
	if(!loggedIn()){
		return;
	}
	// check when last update made, return if too early
	var now = new Date();
	var lastupdate = new Date(store.get('lastupdate'));
	if(lastupdate > now.addMins(-DATA_CACHE_EXPIRY)){
		return;
	} 

	// send any unsubmitted responses
	var unsent = store.get('unsentresults');
	
	if(unsent){
		for(var u in unsent){
			$.ajax({
				   data:{'method':'submit','username':store.get('username'),'password':store.get('password'),'content':unsent[u]}, 
				   success:function(data){
					   
					 //check for any error messages
					   if(data && !data.error){
						   unsent[u].rank = data.rank;
						   store.addArrayItem('results',unsent[u]);
						   store.set('lastupdate',Date());
						   store.clearKey('unsentresults');
					   }
					   
				   }, 
				   error:function(data){
					   // do nothing - will send on next update
				   }
				});
		}
	}
}

function cacheQuiz(ref){
	// check is already cached
	if(!quizInCache(ref)){
		$.ajax({
			   data:{'method':'getquiz','username':store.get('username'),'password':store.get('password'),'ref':ref}, 
			   success:function(data){
				   if(data && !data.error){
					   store.addArrayItem('quizzes', data);
				   }
			   }, 
			});
	}
}

function addQuizListItem(q,list){
	var ql= $('<div>').attr({'class':'quizlist clickable','onclick':'document.location="#'+q.ref +'"'});
	var quiz = $('<span>').attr({'class':'quiztitle'});
	quiz.append(q.title);
	$(list).append(ql.append(quiz));
	if(q.description != null && q.description != ""){
		var desc = $("<span>").attr({'class':'quizdesc'});
		desc.text(" - " + q.description);
		ql.append(desc);
	}
}

function quizInCache(ref){
	var qs = store.get('quizzes');
	for(var q in qs){
		if (qs[q].ref == ref){
			return qs[q];
		}
	}
	return false;
}

function setUpdated(){
	//$('#last_update').text(store.get('lastupdate'));
}

Date.prototype.addMins= function(m){
    this.setTime(this.getTime() + (m*60000));
    return this;
}

Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}

Date.prototype.addDays= function(d){
    this.setDate(this.getDate()+d);
    return this;
}

