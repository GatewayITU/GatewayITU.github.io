//Names for the months
var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

//Get current date, set time to midnight (00:00:00) on the day
var now = new Date();
	now.setHours(0,0,0);

//Create upcoming events
var hangoutEvent = {name: "Gateway's Annual Multicultural Hangout", date: new Date("2017-02-01"), link: "https://www.facebook.com/events/1632810623688153/"};
var cheeseWineEvent = {name: "Cheese and Wine Tasting #2", date: new Date("2017-03-09"), link: "https://www.facebook.com/events/201926730284808/"};
var fitnessEvent = {name: "Fitness Tournament", date: new Date("2017-03-15"), link: "https://www.facebook.com/gatewayitu/"};
var pubCrawlEvent = {name: "Pub Crawl", date: new Date("2017-03-24"), link: "https://www.facebook.com/gatewayitu/"};
var fatFightEvent = {name: "Fat Fight Night", date: new Date("2017-04-07"), link: "https://www.facebook.com/gatewayitu/"};
var bingoEvent = {name: "Bingo Night", date: new Date("2017-05-05"), link: "https://www.facebook.com/gatewayitu/"};
var openAirEvent = {name: "Open-Air Cinema", date: new Date("2017-05-17"), link: "https://www.facebook.com/gatewayitu/"};
var coffeeEvent = {name: "Coffee Tasting", date: new Date("2017-12-31"), link: "https://www.facebook.com/gatewayitu/"};

//Add events to array of upcoming events (make sure these are in order of soonest date first)
var upcomingEvents = [
	hangoutEvent, cheeseWineEvent, fitnessEvent, pubCrawlEvent, bingoEvent, fatFightEvent, openAirEvent, coffeeEvent
]

//Get HTML-string from event
function getStringFromEvent(gatewayEvent) {
	if(gatewayEvent == null) {
		return "<h3>Check back soon for more events!</h3><h1></h1><h2></h2><h2></h2>";
	}

	var eventString = "<h3>NEXT EVENT:</h3><h1>" + 
			gatewayEvent.name + "</h1><h2>" + 
			monthNames[gatewayEvent.date.getMonth()] + 
			" " + gatewayEvent.date.getDate() + ", " + 
			gatewayEvent.date.getFullYear() +
			"</h2><h2>Read more <a target=\"_blank\" href=\"" + 
			gatewayEvent.link + "\">here</a></h2>";

	return eventString;
}

//Find the next upcoming event
function getNextEvent() {
	for (var i = 0; i < upcomingEvents.length; i++) {
		//Check if the current event is
		if(upcomingEvents[i].date > now) {
			return upcomingEvents[i];
		}
	};
}

//Get upcoming events
function getUpcomingEvents() {

}

//Setting op the Fullpage.js plugin
$(document).ready(function() {
	//Set info about next upcoming event on home page
	document.getElementById('next-event-info').innerHTML = getStringFromEvent(getNextEvent());

	//Check whether we are on a small mobile screen
	var screenSize = window.matchMedia( "(min-width: 480px)" );

	//Show labels, if not on mobile
	if(screenSize.matches) {
		$('#fullpage').fullpage({
			sectionsColor: ['#1C1C1C', '#F07C03', '#282D81', '#E71B72', '#971881', '#3FA8E1'],
			anchors: ['home', 'events', 'members', 'join', 'submit', 'about'],
			menu: '#menu',
			scrollingSpeed: 800,
			scrollBar: true,
			navigation: true,
			navigationTooltips: ['Home', 'Events', 'Members', 'Join', 'Submit', 'About'],
			showActiveTooltip: true,
			slidesNavigation: true,
			slidesNavPosition: 'bottom',
			scrollOverflow: true
		});
	} else {
		$('#fullpage').fullpage({
			sectionsColor: ['#1C1C1C', '#F07C03', '#282D81', '#E71B72', '#971881', '#3FA8E1'],
			anchors: ['home', 'events', 'members', 'join', 'submit', 'about'],
			menu: '#menu',
			scrollingSpeed: 800,
			scrollBar: true,
			navigation: true,
			//navigationTooltips: ['Home', 'Events', 'Members', 'Join', 'Submit', 'About'],
			//showActiveTooltip: true,
			slidesNavigation: true,
			slidesNavPosition: 'bottom',
			scrollOverflow: true
		});
	}
});