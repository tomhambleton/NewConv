var request = require('needle');
var logger = require('./logger');
var async = require('async');

/**
 * New node file
 */
var access_token = "wyu1tjnlx3ox3iv4kekpeib0lxipb6qz";
var server = "https://dev.api.foundry.att.com/v5/AluTest";
var mediaFile = 'http://12.206.227.151:8080/ApiTest/ann1.mp3';

var defaultActions = {
	calledNumberActions : {
		endCallFlag : "false",
		routeFlag : "false",
		routeAddress : "",
		continueFlag : "true",
		playAnnouncementFlag : "false",
		collectDigitFlag : "false",
		deferredFlag : "false"
	},
	busyActions : {
		endCallFlag : "false",
		routeFlag : "false",
		routeAddress : "",
		continueFlag : "true",
		playAnnouncementFlag : "false",
		collectDigitFlag : "false",
		deferredFlag : "false"
	},
	disconnectedActions : {
		endCallFlag : "false",
		routeFlag : "false",
		routeAddress : "",
		continueFlag : "true",
		playAnnouncementFlag : "false",
		collectDigitFlag : "false",
		deferredFlag : "false"
	},
	noAnswerActions : {
		endCallFlag : "false",
		routeFlag : "false",
		routeAddress : "",
		continueFlag : "true",
		playAnnouncementFlag : "false",
		collectDigitFlag : "false",
		deferredFlag : "false"
	},
	notReachableActions : {
		endCallFlag : "false",
		routeFlag : "false",
		routeAddress : "",
		continueFlag : "true",
		playAnnouncementFlag : "false",
		collectDigitFlag : "false",
		deferredFlag : "false"
	}
};

function DeferredAction(reqObj, retObj) {
	this.reqObj = reqObj;
	this.retObj = retObj;
}

function Action(actions) {
	console.log("Creating Action");
	this.actions = actions;
	this.deferredList = {};

	this.handlePlayAnnouncement = function(id) {
		var self = this;
		async.waterfall([ function(callback) {
			console.log("id=" + id);
			console.log(self.deferredList[id].reqObj);
			var body = {
				callSessionId : self.deferredList[id].reqObj.callSessId,
				address : self.deferredList[id].reqObj.callingAddress,
				mediaURL : mediaFile,
				mediaType : "audio/mp3"
			};
			var url = server + '/ui/audio?access_token=' + access_token;
			var r = request.post(url, body, {
				json : true,
				rejectUnauthorized : false
			}, function(err, response, body) {
				callback(err, null);
			});
		}, ], function(err, results) {
			if (err) {
				console.log('Audio Message POST failed' + err);
			} else {
				console.log('Audio Message POST success');
			}
			console.log("Send POST for deferred response");
			var url = server + '/event/direction/'
					+ self.deferredList[id].reqObj.subId + '/deferredResponse';
			var r = request.post(url, self.deferredList[id].retObj, {
				json : true,
				rejectUnauthorized : false
			}, function callback(err, response, body) {
				if (err) {
					console.log('Deferred POST failed' + err);
				} else {
					console.log('Deferred POST success');
				}
			});
			delete self.deferredList[id];
		});
	};
	this.handleCollectDigit = function(id) {
		async.waterfall([ function(callback) {
			callback(null, null);
		}, function(input, callback) {
			callback(null, null);
		} ], function(err, results) {
			if (err) {

			} else {

			}
		});
	};

	this.handleDeferredTimeout = function(id) {
		console.log("In handleTimeout: " + id);
		if (this.deferredList[id] !== undefined) {
			console.log("Send POST for deferred response");
			var retStr = "RETURN ACTION: \n" + JSON.stringify(this.deferredList[id].retObj, null, 2);
			logger.logMsg(retStr);
			var url = server + '/event/direction/' + this.deferredList[id].reqObj.subId + '/deferredResponse';
			var r = request.post(url, this.deferredList[id].retObj, {
				json : true,
				rejectUnauthorized : false
			}, function callback(err, response, body) {
				if (err) {
					console.log('Deferred POST failed' + err);
				} else {
					console.log('Deferred POST success');
				}
			});
			delete this.deferredList[id];
		} else {
			console.log("Unknown id");
		}
	};

	this.processEventAction = function(action, req, res) {
		console.log(action);
		var retObj = {
			action : "Continue"
		};
		if (action.endCallFlag == "true") {
			retObj.action = "EndCall";
		} else if (action.routeFlag == "true") {
			retObj.action = "Route";
			retObj.routingAddress = action.routeAddress;
		} else { // Continue
			console.log("continue");
		}
		var deferredFlag = action.deferredFlag;
		var uiFlag = false;
		if ((action.playAnnouncementFlag == "true")
				|| (action.collectDigitFlag == "true")) {
			deferredFlag = "true";
			uiFlag = "true";
		}
		if (deferredFlag == "true") {
			var retStr = "DEFERRED ACTION: \n"
					+ JSON.stringify(retObj, null, 2);
			logger.logMsg(retStr);
			var id = Math.round(Math.random() * 1000000);
			this.deferredList[id] = new DeferredAction(req.body, retObj);
			var tmpObj = {
				action : "Deferred",
				decisionId : id.toString()
			};
			retObj.decisionId = id.toString();
			if (uiFlag == "true") {
				if (action.playAnnouncementFlag === "true") {
					this.handlePlayAnnouncement(id);
				} else if (action.collectDigitFlag == "true")
					this.handleCollectDigit(id);
				res.contentType('json');
				res.send(JSON.stringify(tmpObj));
				retStr = "RETURN ACTION: \n" + JSON.stringify(tmpObj, null, 2);
				logger.logMsg(retStr);
			} else {
				var self = this;
				this.timerId = setTimeout(function() {
					self.handleDeferredTimeout(id);
				}, 500);
				res.contentType('json');
				res.send(JSON.stringify(tmpObj));
				var retStr = "RETURN ACTION: \n" + JSON.stringify(tmpObj, null, 2);
				logger.logMsg(retStr);
			}

		} else {
			res.contentType('json');
			res.send(JSON.stringify(retObj));
			var retStr = "RETURN ACTION: \n" + JSON.stringify(retObj, null, 2);
			logger.logMsg(retStr);
		}
	};

	this.handleEvent = function(req, res) {
		var str = "CALL DIRECTION EVENT: \n"
				+ JSON.stringify(req.body, null, 2);
		logger.logMsg(str);
		switch (req.body.event) {
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
		console.log(JSON.stringify(this.actions));
	};

}

var theAction = new Action(defaultActions);

module.exports = theAction;
