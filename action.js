var request = require('request');
var logger = require('./logger');

/**
 * New node file
 */
var server = "https://dev.api.foundry.att.com/v5/AluTest";

var defaultActions = {
		calledNumberActions: {
			endCallFlag: "false",
			routeFlag: "false",
			routeAddress: "",
			continueFlag: "true",
			playAnnouncementFlag: "false",
			collectDigitFlag: "false",
			deferredFlag: "false"
		},
		busyActions: {
			endCallFlag: "false",
			routeFlag: "false",
			routeAddress: "",
			continueFlag: "true",
			playAnnouncementFlag: "false",
			collectDigitFlag: "false",
			deferredFlag: "false"
		},
		disconnectedActions: {
			endCallFlag: "false",
			routeFlag: "false",
			routeAddress: "",
			continueFlag: "true",
			playAnnouncementFlag: "false",
			collectDigitFlag: "false",
			deferredFlag: "false"
		},
		noAnswerActions: {
			endCallFlag: "false",
			routeFlag: "false",
			routeAddress: "",
			continueFlag: "true",
			playAnnouncementFlag: "false",
			collectDigitFlag: "false",
			deferredFlag: "false"
		},
		notReachableActions: {
			endCallFlag: "false",
			routeFlag: "false",
			routeAddress: "",
			continueFlag: "true",
			playAnnouncementFlag: "false",
			collectDigitFlag: "false",
			deferredFlag: "false"
		} };

function DeferredAction(reqObj, retObj) {
	this.reqObj = subId;
	this.retObj = retObj;
}

function Action(actions) {
	console.log("Creating Action");
	this.actions = actions;
	this.deferredList = {};
	
	this.handleDeferredTimeout = function(id) {
		console.log("In handleTimeout: "+id);
		if (this.deferredList[id] !== undefined) {
			console.log("Send POST for deferred response");
			var url = server + 'calldirections/' + this.deferredList[id].reqObj.subId+'deferred';
		    var r = request.post(url, this.deferredList[id].retObj, function callback(err, response, body) {
		    	if (err) {
		    		console.log('POST failed'+ err);
		    	} else {
		    		console.log('POST success');
		    	}
		    });
			delete this.deferredList[id];
		} else {
			console.log("Unknown id");
		}
	};
	
	this.processEventAction = function(action, req, res) {
		var retObj = {
				action: "Continue"
		};
		if (action.endCallFlag == "true") {
			retObj.action = "EndCall";
		} else if (action.routeFlag == "true") {
			retObj.action = "Route";
			retObj.routingAddress = action.routeAddress;
		} else { // Continue
			console.log("continue");
		}
        if (action.deferredFlag == "true") {
        	var retStr = "DEFERRED ACTION: \n"+ JSON.stringify(retObj, null, 2);
    		logger.logMsg(retStr);
    		var id = Math.round(Math.random()*1000000);
    		this.deferredList[id]  = new DeferredAction(req.body, retObj);
    		var tmpObj = {
    				action: "Deferred",
    				decisionId: id.toString()
    		};
    		var self = this;
    		this.timerId = setTimeout(function() { self.handleDeferredTimeout(id); }, 500);
    		res.contentType('json');
    		res.send(JSON.stringify(tmpObj));
    		var retStr = "RETURN ACTION: \n"+ JSON.stringify(tmpObj, null, 2);
    		logger.logMsg(retStr);
        } else {
        	res.contentType('json');
    		res.send(JSON.stringify(retObj));
    		var retStr = "RETURN ACTION: \n"+ JSON.stringify(retObj, null, 2);
    		logger.logMsg(retStr);
        }
	};
	
	this.handleEvent = function(req, res) {
		var str = "CALL DIRECTION EVENT: \n"+ JSON.stringify(req.body, null, 2);
		logger.logMsg(str);
		switch(req.body.event) {
		case "CalledNumber":
			this.processEventAction(this.actions.calledNumberActions, req, res);
			break;
		case "Busy":
			this.processEventAction(this.actions.busyActions, req, res);
			break;
		case "NoAnswer":
			this.processEventAction(this.actions.noAnswerActions, req, res);
			break;
		case "Disconnected":
			this.processEventAction(this.actions.disconnectedActions, req, res);
			break;
		case "NotReachable":
			this.processEventAction(this.actions.notReachableActions, req, res);
			break;
		default:
			this.processEventAction(this.actions.calledNumberActions, req, res);
		}

	};
	
	this.setActions = function(actions) {
		this.actions = actions;
		// console.log(JSON.stringify(this.actions));
	};
	
}
var theAction = new Action(defaultActions);

module.exports = theAction;


