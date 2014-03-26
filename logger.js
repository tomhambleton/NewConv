

function Subscriber(res) {
	this.time = new Date();
	this.res = res;
}

var myTimeout = 15000;
var fudgeValue = 2000;

function Logger() {
	console.log("Creating Logger");
	this.subscribers = new Array();
	this.logQueue = new Array();
	this.id = Math.random();
	
	this.logMsg = function(str) {
		//console.log("In logMsg:"+this.id);
		if (this.subscribers.length === 0) {
			this.logQueue.push(str);
		} else {
			while (this.subscribers.length > 0) {
	    		var subscriber = this.subscribers.shift();
	    		var results = { status:"MSG", msg: str};
	    		subscriber.res.contentType('json');
	    		subscriber.res.send(JSON.stringify(results));
	    	}
		}
	};
	this.handleGetMsg = function(req, res) {
		//console.log("In handleGetMsg:"+this.id);
	    if (this.logQueue.length > 0) {
	    	var msg = this.logQueue.shift();
	    	var results = { status:"MSG", msg: msg};
	    	res.contentType('json');
	    	res.send(JSON.stringify(results));
	    	while (this.subscribers.length > 0) {
	    		var subscriber = this.subscribers.shift();
	    		results = { status:"MSG", msg: msg};
	    		subscriber.res.contentType('json');
	    		subscriber.res.send(JSON.stringify(results));
	    	}
	    } else {
	    	this.subscribers.push(new Subscriber(res));
	    }
	};
	this.handleTimeout = function() {
		//console.log("In handleTimeout:"+this.id);
		var currentTime = new Date();
		var keepGoing = true;
		while (keepGoing && (this.subscribers.length > 0)) {
			var diff = (currentTime.getTime() - this.subscribers[0].time.getTime()) + fudgeValue;
			if (diff >= myTimeout) {
				var subscriber = this.subscribers.shift();
				var results = { status:"TIMEOUT", msg: "none"};
				subscriber.res.contentType('json');
				subscriber.res.send(JSON.stringify(results));
			} else {
				keepGoing = false;
			}
		}
	};
	var self = this;
	this.timerId = setInterval(function() { self.handleTimeout(); }, myTimeout/2);
}

var theLogger = new Logger();

module.exports = theLogger;

