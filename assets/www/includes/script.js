
function initMQuiz(){
	var opts = {
			'menu':[{'title':'Modules','link':'index.html#modules'},
			        {'title':'SAQs','link':'index.html#quizzes'},
			        {'title':'Results','link':'index.html#results'}],
			'allowregister': false,
			'url':'http://mquiz.org/api/?format=json'
			};
	$('#modules').hide();
	mQ.init(opts);
	mQ.onLogin = function(){
		$('#menu').show();
		$('#mq').empty();
		$('#modules').show();
		loadQuizzesFromCache();
	}
}

function inithome(page,section){
	initMQuiz();
	mQ.onLogout = function(){
		$('#modules').hide();
		$('#menu').hide();
		document.location = 'index.html';
	}
	
	drawHeader(page,section);
	if(mQ.loggedIn()){
		$('#modules').show();
		mQ.showMenu();
		mQ.showUsername();
	} else {
		$('#modules').hide();
		$('#menu').hide();
		mQ.showLogin('#modules');
	}
}

function hChange(){
	if($(location).attr('hash') && $(location).attr('hash') != '#modules' ){
		mQ.showPage($(location).attr('hash'));
		$('#modules').hide();
	} else if($(location).attr('hash') && $(location).attr('hash') == '#modules' ){
		$('#mq').empty();
		$('#content').empty();
		$('#modules').show();
	} else{
		document.location = '#modules';
	}
}

function init(page,section){
	initMQuiz();
	mQ.onLogout = function(){
		$('#modules').hide();
		$('#menu').hide();
		document.location = '../index.html';
	}
	drawHeader(page,section);
	if(mQ.loggedIn()){
		mQ.showUsername();
	} else {
		document.location = "../index.html";
	}
}


function drawHeader(page,section){	
	var ht = $('<div>').attr({'id':'header-title'});
	
	var h = $('<h1>').attr({'class':'clickable'}).text("HEAT");
	h.click(function(){
		if(page){
			document.location = '../index.html';
		} else {
			document.location = 'index.html';
		}
	});
	ht.append(h);
	
	
	if(page){
		ht.append("<h1> > </h1>");
		var s = $('<h1>').attr({'class':'clickable'}).text(page);
		s.click(function(){
			document.location = 'index.html';
		});
		ht.append(s);
	}
	
	$('#header').append(ht);
	var hr = $('<div>').attr({'id':'header-right'});
	$('#header').append(hr);
	
	$('#header').append("<div style='clear:both'></div>");
	
	if(section){
		ht.append("<h1> > "+parseInt(section,10)+"</h1>");
		var m = $('<div>').attr({'id':'menu'});
		var intro = $('<a>').attr({'href':section+'intro.html'}).text("Intro");
		var lo = $('<a>').attr({'href':section+'lo.html'}).text("Outcomes");
		var sum = $('<a>').attr({'href':section+'sum.html'}).text("Summary");
		var saq = $('<a>').attr({'href':section+'saq.html'}).text("SAQs");
		var div = " | ";
		m.append(intro);
		m.append(div);
		m.append(lo);
		m.append(div);
		m.append(sum);
		m.append(div);
		m.append(saq);
		$('#header').append(m);	
	}
	
	var un = $('<div>').attr({'id':'logininfo'});
	$('#footer').append(un);

	var about = $('<div>').attr({'id':'aboutinfo'});
	if(page){
		about.append($('<a>').attr({'href':'../about.html'}).text("About"));
	} else {
		about.append($('<a>').attr({'href':'about.html'}).text("About"));
	}
	$('#footer').append(about);
	
}

function playVid(file){
	window.plugins.videoPlayer.play("file:///sdcard/heat/"+file);
}
