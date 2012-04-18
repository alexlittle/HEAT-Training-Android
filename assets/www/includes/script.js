function init(page,section){
	
	drawHeader(page,section);
	if(loggedIn()){
		showUsername('../index.html');
		dataUpdate();
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
		ht.append(" > ");
		var s = $('<h1>').attr({'class':'clickable'}).text(page);
		s.click(function(){
			document.location = 'index.html';
		});
		ht.append(s);
	}
	
	$('#header').append(ht);
	var hr = $('<div>').attr({'id':'header-right'});
	$('#header').append(hr);
	var un = $('<div>').attr({'id':'logininfo'});
	hr.append(un);
	$('#header').append("<div style='clear:both'></div>");
	
	if(section){
		ht.append(" > ");
		ht.append(parseInt(section));
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
	
	
}