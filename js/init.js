//Names for the months
var monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"];

//Get current date, set time to midnight (00:00:00) on the day
var now = new Date();
now.setHours(0,0,0);

//URL to Google Spreadsheet with list of events - JSON-callback
var EVENTSURL = 'https://spreadsheets.google.com/feeds/list/1n4GwSrPCq439gsotoixBkuWgeM2jEx7SwiI-W_QxG20/1/public/basic?alt=json';
var MEMBERSURL = 'https://spreadsheets.google.com/feeds/list/12t973vlQj85qEobwE1U9OQ8weOTGXhNStpJlUnyi-AU/1/public/basic?alt=json';

//Import JSON
var events = [];
var members = [];

function getEvents(data){
	var rows = [];
	var cells = data.feed.entry;

	for (var i = 0; i < cells.length; i++){
		var rowObj = {};
		rowObj.date = cells[i].title.$t;
		var rowCols = cells[i].content.$t.split(',');
		for (var j = 0; j < rowCols.length; j++){
			var keyVal = rowCols[j].split(/:(.+)/);
			rowObj[keyVal[0].trim()] = keyVal[1].trim();
		}
		rows.push(rowObj);
	}

	for (var i = 0; i < rows.length; i++) {
		var nextEvent = rows[i];

		var eventLink = "";

		if(nextEvent.link != "N/A") {
			eventLink = nextEvent.link;
		}

		var image = "";

		if(nextEvent.image != "N/A") {
			image = nextEvent.image;
		}

		events.push({
			name: nextEvent.name,
			date: new Date(nextEvent.date),
			link: eventLink,
			image: image
		});
	};
}

function getMembers(data){
	var rows = [];
	var cells = data.feed.entry;

	for (var i = 0; i < cells.length; i++){
		var rowObj = {};
		rowObj.name = cells[i].title.$t;
		var rowCols = cells[i].content.$t.split(',');
		for (var j = 0; j < rowCols.length; j++){
			var keyVal = rowCols[j].split(/:(.+)/);
			rowObj[keyVal[0].trim()] = keyVal[1].trim();
		}
		rows.push(rowObj);
	}

	for (var i = 0; i < rows.length; i++) {
		var nextMember = rows[i];

		var image = "";

		if(nextMember.image != "N/A") {
			image = nextMember.image;
		}

		members.push({
			name: nextMember.name,
			programme: nextMember.programme,
			position: nextMember.position,
			image: image
		});
	};
}


//--------------FRONT PAGE------------------------
//Get HTML-string for front-page from event
//Find the next upcoming event
function getNextEvent() {
	for (var i = 0; i < events.length; i++) {
		//Check if the current event is
		if(events[i].date > now) {
			return events[i];
		}
	};
}

function getHeadlineFromEvent(gatewayEvent) {
	if(gatewayEvent == null) {
		return "<h3>Check back soon for more events!</h3><h1></h1><h2></h2><h2></h2>";
	}

	var linkString = gatewayEvent.link;

	if(linkString == "") {
		linkString = "<h2>Facebook Event currently unavailable.</h2>";
	}
	else {
		linkString = "</h2><h2>Read more <a target=\"_blank\" href=\"" + linkString + "\">here</a></h2>";
	}

	var eventString = "<h3>NEXT EVENT:</h3><h1>" + 
	gatewayEvent.name + "</h1><h2>" + 
	monthNames[gatewayEvent.date.getMonth()] + 
	" " + gatewayEvent.date.getDate() + ", " + 
	gatewayEvent.date.getFullYear() + linkString;

	return eventString;
}



//--------------EVENT PAGE------------------------
//Get HTML-string for individual event
function getEventHTML(gatewayEvent) {
	var imageString = gatewayEvent.image;
	if(imageString == "") {
		imageString = "images/events/placeholder.png";
	}

	var dateString = monthNames[gatewayEvent.date.getMonth()] + " " + gatewayEvent.date.getDate();

	if(gatewayEvent.date.getDate() == 31 && gatewayEvent.date.getMonth() == 11) {
		dateString = "Date TBD";
	}

	var linkString = gatewayEvent.link;

	if(gatewayEvent.link == "Internal") {
		linkString = "<a href=\"#join\"><h3>Join Us!</h3></a>";
	}
	else if(linkString == "") {
		linkString = "<h3>FB Event Not Available</h3>";
	}
	else {
		linkString = "<a href=\"" + linkString + "\" target=\"_blank\"><h3>Facebook Event</h3></a>";
	}

	var htmlString = "<div class=\"event\"><img src=\"" + imageString + "\" class=\"event-image\"><h2>" + 
	gatewayEvent.name + "</h2><h3>" + dateString + "</h3>" + linkString + "</div>";

	return htmlString;
}

//Find years for all events
function findYears() {
	var years = [];
	for (var i = 0; i < events.length; i++) {
		currentYear = events[i].date.getFullYear();

		var foundYear = false;
		for (var j = 0; j < years.length; j++) {
			if(currentYear == years[j]) {
				foundYear = true;
				break;
			}
		};

		if(!foundYear) {
			years.push(currentYear);
		}
	};
	return years;
}

function findAllEventsForYear(year) {
	var eventsForYear = [];

	for (var i = 0; i < events.length; i++) {
		if(events[i].date.getFullYear() == year) {
			eventsForYear.push(events[i]);
		}
	};

	return eventsForYear;
}

function getAllEventsForYearHTML(year) {
	var yearEvents = findAllEventsForYear(year);
	var eventsString = "";

	for (var i = 0; i < yearEvents.length; i++) {
		eventsString += getEventHTML(yearEvents[i]);
	};

	//Prev/next arrows have been temporarily removed - not sure of the best way to implement this
	var htmlString = "<div class=\"slide\"><div class=\"inner-section\"><div>" + "<div id=\"left-arrow\" class=\"fp-controlArrow fp-prev\"></div>" + "<h1>" + 
	year + " Events</h1>" + "<div  id=\"right-arrow\" class=\"fp-controlArrow fp-next\"></div>" + "</div>" +
	eventsString + 
	"</div></div>";

	return htmlString;
}

function getAllUpcomingEventsHTML() {
	var eventsString = "";

	for (var i = 0; i < events.length; i++) {
		if(events[i].date > now) {
			eventsString += getEventHTML(events.splice(i,1)[0]);
			i--;
		}
	};

	//Prev/next arrows have been temporarily removed - not sure of the best way to implement this
	var htmlString = "<div class=\"slide\"><div class=\"inner-section\"><div>"  + "<div id=\"left-arrow\" class=\"fp-controlArrow fp-prev\"></div>" + 
	"<h1>Upcoming Events</h1>" + "<div id=\"right-arrow\" class=\"fp-controlArrow fp-next\"></div>" + "</div>" +
	eventsString + 
	"</div></div>";

	return htmlString;
}


function getAllEventsHTML() {
	var finalString = "";

	finalString += getAllUpcomingEventsHTML();

	var years = findYears();

	for (var i = years.length - 1; i >= 0; i--) {
		finalString += getAllEventsForYearHTML(years[i]);
	};

	return finalString;
}


function getMemberHTML(member) {
	var htmlString = "<div class=\"member\"><img src=\"" + 
					member.image +"\" class=\"member-image\"><h3>" + 
					member.name + ", " + 
					member.programme + "</h3><h2>" + 
					member.position + "</h2></div>";

	return htmlString;
}

function getAllMembersHTML() {
	var finalString = "<h1>Organization</h1>";

	for (var i = 0; i < members.length; i++) {
		finalString += getMemberHTML(members[i]);
	};

	return finalString;
}



//--------------EXECUTION------------------------
$(document).ready(function() {
	//Load events from database
	$.ajax({
		url:EVENTSURL,
		success: function(data){
			getEvents(data);
		}
	});

	//Load members from database
	$.ajax({
		url:MEMBERSURL,
		success: function(data){
			getMembers(data);
		}
	});	
});

//Once data has been loaded, setup HTML and the Fullpage.js plugin
$(document).ajaxStop(function () {

  //Set info about next upcoming event on home page
  document.getElementById('next-event-info').innerHTML = getHeadlineFromEvent(getNextEvent());

  //Retrieve events
  document.getElementById('section-events').innerHTML = getAllEventsHTML();

  //Retrieve members
  document.getElementById('member-section').innerHTML = getAllMembersHTML();

  //Check whether we are on a small mobile screen
  var screenSize = window.matchMedia( "(min-width: 480px)" );

  //Show labels, if not on mobile
  if(screenSize.matches) {
  	$('#fullpage').fullpage({
  		sectionsColor: ['#1C1C1C', '#F07C03', '#282D81', '#E71B72', '#971881', '#3FA8E1'],
  		anchors: ['home', 'events', 'join', 'members', 'social-media', 'about'],
  		menu: '#menu',
  		scrollingSpeed: 800,
  		scrollBar: true,
  		navigation: true,
  		navigationTooltips: ['Home', 'Events', 'Join', 'Organization', 'Social Media', 'About'],
  		showActiveTooltip: true,
  		slidesNavigation: true,
  		slidesNavPosition: 'bottom',
  		scrollOverflow: true,
  		touchSensitivity: 30
  	});
  }
  // NOW YOU ARE ON MOBILE 
  else {
  	$('#fullpage').fullpage({
  		sectionsColor: ['#1C1C1C', '#F07C03', '#282D81', '#E71B72', '#971881', '#3FA8E1'],
  		anchors: ['home', 'events', 'join', 'members', 'social-media', 'about'],
  		menu: '#menu',
  		scrollingSpeed: 800,
  		scrollBar: true,
  		navigation: true,
  		slidesNavigation: true,
  		slidesNavPosition: 'bottom',
  		scrollOverflow: true,
  		touchSensitivity: 30
  	});
  }

  window.dispatchEvent(new Event('resize'));
});