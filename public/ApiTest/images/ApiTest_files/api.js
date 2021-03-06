
var currentCmd = "";
var currentTemplate = "";
var lastCall = "";
var lastNotification = "";
var lastDirection = "";
var lastDigitCollection = "";
var clientCorrelator = 0;
var party = [];
var partyId = '';
var puid;
var currentMethod = '';
var x2js = new X2JS();
var currentSelection = "";

var server = "https://dev.api.foundry.att.com";
var msisdn = "123456";

var tabCmdSelected = [];

var tabIndex = 0;
var replyName = "reply0";
var queryName = "query";
var reqBodyName = "reqBody0";
var activeName = "active0";
var postButton = "postButton0";
var getButton = "getButton0";
var delButton = "delButton0";
var partyA = "partyA0";
var partyB = "partyB0";
var partyC = "partyC0";
var partyAdivtext = "partyAdivtext0";
var partyBdivtext = "partyBdivtext0";
var partyCdivtext = "partyCdivtext0";
var events = "events0";
var cmdLayout = "cmdLayout0";
var communicationSettings = "";

var changeTemplateVector = [];

console.log("Domain = "+ document.domain);

var urlAtt = {};
urlAtt['CallSession'] = 'ParlayREST/thirdpartycall/v1/callSessions';
urlAtt['CallSessionParticipants'] = 'ParlayREST/thirdpartycall/v1/callSessions/{callId}/participants';
urlAtt['CallSessionParty'] = 'ParlayREST/thirdpartycall/v1/callSessions/{callId}/participants/{partyId}';
urlAtt['CallSessionCallId'] = 'ParlayREST/thirdpartycall/v1/callSessions/{callId}';

urlAtt['NotifSubscriptionCallEvent'] = 'v4/AluTest/callevents';
urlAtt['NotifSubscriptionCallEventNotifId'] = 'v4/AluTest/callevents/{notificationId}';

urlAtt['NotifSubscriptionCallDirection'] = 'v4/AluTest/calldirections';
urlAtt['NotifSubscriptionCallDirectionDirectionId'] = 'v4/AluTest/calldirections/{directionId}';

urlAtt['NotifSubscriptionCollection'] = 'ParlayREST/callnotification/v1/subscriptions/collection';
urlAtt['NotifSubscriptionCollectionDigitId'] = 'ParlayREST/callnotification/v1/subscriptions/collection/{digitId}';
urlAtt['AudioCallMsgText'] = 'ParlayREST/audiocall/v1/messages/text';
urlAtt['AudioCallMsgAudio'] = 'ParlayREST/audiocall/v1/messages/audio';
urlAtt['AudioCallMsgVideo'] = 'ParlayREST/audiocall/v1/messages/video';
urlAtt['AudioCallInteractCollection'] = 'ParlayREST/audiocall/v1/interactions/collection';
urlAtt['UserCapabilities'] = 'selfcare/1.0/capabilities/{puid}';
urlAtt['UserSettings'] = 'selfcare/1.0/settings/{puid}';
urlAtt['CallLogs'] = 'selfcare/1.0/callLog/{puid}';



var urlArray = urlAtt;

var jsondata = {};
jsondata['callMsg'] = 
	'{"callSessionInformation": {' 
	+ '"clientCorrelator": "{ClientCorrelator}",'
	+ '"participant": ['
	+ '{"participantAddress": "{partyA}", "participantName": "Max Muster" },'
	+ '{"participantAddress": "{partyB}", "participantName": "Peter E. Xample"} ]'
	+ '}}';

jsondata['callExtMsg'] = 
	'{"callSessionInformation": {' 
    + '"clientCorrelator": "{ClientCorrelator}",'
    + '"participant": ['
    + '{"participantAddress": "{partyA};ext={partyC}", "participantName": "Max Muster" },'
    + '{"participantAddress": "{partyB}", "participantName": "Peter E. Xample"} ]'
    + '}}';

jsondata['callAnnouncementMsg'] = 
	'{"callSessionInformation": {' 
    + '"clientCorrelator": "{ClientCorrelator}",'
    + '"participant": ['
    + '{"participantAddress": "{partyA}", "participantName": "Max Muster" },'
    + '{"participantAddress": "{partyB}", "participantName": "Peter E. Xample"} ],'
    + '"originatorAnnouncement": "http://{domain}:8080/ApiTest/ann1.mp3;messageFormat=Audio"'
    + '}}';

jsondata['addPartyMsg'] = 
	'{"callParticipantInformation": {' 
    + '"clientCorrelator": "{ClientCorrelator}",'
    + '"participantAddress": "{partyC}", "participantName": "John E. Xample"'
    + '}}';

jsondata['textMsg'] = 
	'{"textMessage": {' 
    + '"clientCorrelator": "{ClientCorrelator}",'
    + '"callSessionIdentifier": "{callId}",'
    + '"callParticipant": [ "{partyB}" ],'
    + '"text": "http://{domain}:8080/ApiTest/test1.txt"'
    + '}}';

jsondata['audioMsg'] = 
	'{"audioMessage": {' 
    + '"clientCorrelator": "{ClientCorrelator}",'
    + '"callSessionIdentifier": "{callId}",'
    + '"callParticipant": [ "{partyB}" ],'
    + '"mediaType": "audio/mpeg",'
    + '"mediaUrl": "http://{domain}:8080/ApiTest/ann1.mp3"'
    + '}}';

jsondata['videoMsg'] = 
	'{"videoMessage": {' 
    + '"clientCorrelator": "{ClientCorrelator}",'
    + '"callSessionIdentifier": "{callId}",'
    + '"callParticipant": [ "{partyB}" ],'
    + '"mediaType": "video.mp4",'
    + '"mediaUrl": "http://{domain}:8080/ApiTest/video.mp4"'
    + '}}';

jsondata['collectDigitsMsg'] = 
	'{"digitCapture": {' 
    + '"clientCorrelator": "{ClientCorrelator}",'
    + '"callSessionIdentifier": "{callId}",'
    + '"callbackReference": { "notifyURL":"http://{domain}:8080/ApiTest/Servlet/digitsNotification", "notificationFormat": "JSON" }'
    + '}}';

jsondata['registerDigitsMsg'] = 
	'{"playAndCollectInteractionSubscription": {' 
    + '"clientCorrelator": "{ClientCorrelator}",'
    + '"callSessionIdentifier": "{callId}",'
    + '"callParticipant": [ "{partyB}" ],'
    + '"playingConfiguration": { '
    + ' "playFileLocation":"http://{domain}:8080/ApiTest/ann1.mp3",'
    + ' "messageFormat":"Audio",'
    + ' "mediaType":"audio/mpeg",'
    + ' "interruptMedia":"true" },'
    + '"digitConfiguration": { '
    + ' "minDigits":"1",'
    + ' "maxDigits":"4",'
    + ' "interruptMedia":"false" }'
    + '}}';

jsondata['registerMsg'] =
	'{ "address":"{partyB}",'
    + '"notifyURL":"http://{domain}:8080/callEvent?id={msidn}",'
    + '"criteria": [ {criteria} ],'
    + '"direction":"{direction}"'
    + '}';

jsondata['callDirectionMsg'] =
	'{ "address": "{partyB}",'
    + '"notifyURL":"http://{domain}:8080/callDirection?id={msidn}",'
    + '"criteria": [ {criteria} ]'
    + '}';

var msgdata = jsondata;


var errorMsg = [];
errorMsg['200'] = "Success";
errorMsg['201'] = "Created";
errorMsg['204'] = "No Content";
errorMsg['303'] = "See Other - The response to the request can be found under a different URI and should be retrieved using a GET method on that resource.";
errorMsg['304'] = "ConditionNotMet - The condition specified in the conditional header(s) was not met for a read operation. ";
errorMsg['307'] = "Temporarily Redirect";
errorMsg['400'] = "Invalid parameters in the request";
errorMsg['401'] = "Authentication failure ";
errorMsg['403'] = "Application don't have permissions to access resource due to the policy constraints (request rate limit, etc)";
errorMsg['404'] = "Not Found - The specified resource does not exist. ";
errorMsg['405'] = "Method not allowed by the resource";
errorMsg['406'] = "Not Acceptable";
errorMsg['409'] = "Conflict";
errorMsg['411'] = "Length Required: The Content-Length header was not specified.";
errorMsg['412'] = "Precondition Failed: The condition specified in the conditional header(s) was not met for a write operation.";
errorMsg['413'] = "RequestBodyTooLarge - Request Entity Too Large: The size of the request body exceeds the maximum size permitted.";
errorMsg['415'] = "Unsupported Media Type";
errorMsg['416'] = "InvalidRange - Requested Range Not Satisfiable: The range specified is invalid for the current size of the resource";
errorMsg['481'] = "OK Deleted";
errorMsg['500'] = "Internal server error";
errorMsg['503'] = "ServerBusy - Service Unavailable: The server is currently unable to receive requests. Please retry your request.";


function tabSelected(index) {
	tabIndex = index;
	replyName = "reply"+index;
	queryName = "query"+index;
	reqBodyName = "reqBody"+index;
	postButton = "postButton"+index;
	getButton = "getButton"+index;
	delButton = "delButton"+index;
	partyAdivtext = "partyAdivtext"+index;
	partyBdivtext = "partyBdivtext"+index;
	partyCdivtext = "partyCdivtext"+index;
	partyA = "partyA"+index;
	partyB = "partyB"+index;
	partyC = "partyC"+index;
	events = "events"+index;
	cmdLayout = "cmdLayout"+index;
	if (tabCmdSelected[tabIndex] != undefined) {
		changeTemplate(tabCmdSelected[tabIndex].e, tabCmdSelected[tabIndex].cmd, tabCmdSelected[tabIndex].key);
	} 	
}

function init()
{
	$('#tt').tabs({
		  onSelect: function(title,index){
			  console.log("Select tab:"+index);
			  tabSelected(index);
		  }
		});
	loadParties();
	loadSubscriptions();
	getLogs();
	updateSubscriptionTable();
	updateSessionTable();
	tabSelected(0);
	changeTemplateVector[0] = changeTemplatePRS;
	changeTemplateVector[1] = changeTemplatePRS;
	changeTemplateVector[2] = changeTemplatePRS;
	changeTemplateVector[3] = changeTemplatePRS;
	changeTemplateVector[4] = changeTemplatePCM;
	changeTemplateVector[5] = changeTemplatePCM;
	
	$("#mainLayout").layout('panel','center').panel({tools:[{ iconCls:'icon-no', handler:function(){clearLogs();}}]});
}



function sendMsg(method) {
	document.getElementById(replyName).value = "";
	var cmd = document.getElementById(queryName).value;
	var data = document.getElementById(reqBodyName).value;
	currentMethod = method;
	var contentType = "application/json";
	
	$.ajax({
		beforeSend : function(req) {
			req.setRequestHeader("Accept", "application/json");
			req.setRequestHeader("Content-Type", "application/json");
		},
		type : method,
		url : cmd,
		contentType : contentType,
		dataType : 'text',
		data : data,
		complete : onReply
	});
}

function load(key) {
    if (window.localStorage) {
    	return window.localStorage.getItem('com.alu.cts.'+key);
    }
    else return null;
}

function save(key,value)
{
    if (window.localStorage) {
        localStorage.setItem('com.alu.cts.'+key, value);
    }
}

function loadParties() {
	if (load("partyA") != null) {
		document.getElementById("partyA0").value = load("partyA");
		document.getElementById("partyA1").value = load("partyA");
		document.getElementById("partyA2").value = load("partyA");
		document.getElementById("partyA3").value = load("partyA");
		document.getElementById("partyA4").value = load("partyA");
		document.getElementById("partyA5").value = load("partyA");

	}
	if(load("partyB") != null) {
		document.getElementById("partyB0").value = load("partyB");
		document.getElementById("partyB1").value = load("partyB");
		document.getElementById("partyB2").value = load("partyB");
		document.getElementById("partyB3").value = load("partyB");
	}
	if(load("partyC") != null) {
		document.getElementById("partyC0").value = load("partyC");
		document.getElementById("partyC1").value = load("partyC");
		document.getElementById("partyC2").value = load("partyC");
		document.getElementById("partyC3").value = load("partyC");
	}
}

function saveParties() {
	var partyAval = document.getElementById("partyA"+tabIndex).value;
	var partyBval = document.getElementById("partyB"+tabIndex).value;
	var partyCval = document.getElementById("partyC"+tabIndex).value;
    save("partyA",partyAval);
    save("partyB",partyBval);
    save("partyC",partyCval);
}

function loadSubscriptions() {
	if(load("callNotifId") != null)
		lastNotification = load("callNotifId");
	if(load("callDirectionId") != null)
		lastDirection = load("callDirectionId");
	if(load("digitCollectionId") != null)
		lastDigitCollection = load("digitCollectionId");
	if(load("callSessionId") != null)
		lastCall = load("callSessionId");
	console.log("loaded call session:"+lastCall);
	if (lastNotification == undefined)
		lastNotification = "";
	if (lastDirection == undefined)
		lastDirection = "";
	if (lastCall == undefined)
		lastCall = "";
	// Not sure what to do if Ids are no longer valid
	save("callNotifId","");
    save("callDirectionId","");
    save("digitCollectionId","");
    save("callSessionId","");
}

function saveSubscriptions() {
    save("callNotifId",lastNotification);
    save("callDirectionId",lastDirection);
    save("digitCollectionId",lastDigitCollection);
    save("callSessionId",lastCall);
}


function changePartyText(cmd, key) {
	switch (cmd) {
	case  'CallSession':
		switch (key) {
		case 'callMsg':
			$('#'+partyAdivtext).text("Calling Address");
			$('#'+partyCdivtext).text("Calling Address");
			break;
		case 'callExtMsg':
			$('#'+partyAdivtext).text("IMS Anchor Address");
			$('#'+partyCdivtext).text("Calling Address");
			break;
		case 'callAnnouncementMsg':
			$('#'+partyAdivtext).text("Calling Address");
			$('#'+partyCdivtext).text("Called Address");
			break;
		default:
			$('#'+partyAdivtext).text("Calling Address");
		    $('#'+partyCdivtext).text("Calling Address");
		}
		break;
	case  'CallSessionParticipants':
		$('#'+partyAdivtext).text("Calling Address");
		$('#'+partyCdivtext).text("Called Address");
		break;
	default:
		$('#'+partyAdivtext).text("Calling Address");
	    $('#'+partyCdivtext).text("Calling Address");
	}
}

function hideShowParty(id)
{
	var template = msgdata[currentTemplate];
	if(template)
	{
		if(template.indexOf(id) >=0)
			document.getElementById(id+"div"+tabIndex).style.display="inline";
		else
			document.getElementById(id+"div"+tabIndex).style.display="none";
	}
	else
		document.getElementById(id+"div"+tabIndex).style.display="none";
}

function changeTemplatePRS(e, cmd,key)
{
	tabCmdSelected[tabIndex]  = {e:e, cmd:cmd, key:key};
	
	console.log("name = "+e);
	$("a").removeClass("selected");
    e.classList.add("selected");
    
    currentSelection = cmd;
    
	document.getElementById(postButton).disabled = true;
	document.getElementById(getButton).disabled = true;
	document.getElementById(delButton).disabled = true;		

	switch (key) {
	case 'get':
		currentTemplate = "";
		document.getElementById(getButton).disabled = false;
		document.getElementById(reqBodyName).value = "";
		if (document.getElementById(events) != null) {
			document.getElementById(events).style.display = "none";
		}
		break;
	case  'delete':
		currentTemplate = "";
		document.getElementById(delButton).disabled = false;		
		document.getElementById(reqBodyName).value = "";
		if (document.getElementById(events) != null) {
			document.getElementById(events).style.display = "none";
		}
		break;
	default:
		document.getElementById(postButton).disabled = false;
	    currentTemplate = key;
	    updateTemplate();
	    genClientCorrelator();
	    if (document.getElementById(events) != null) {
			document.getElementById(events).style.display = "inline";
		}
	}
	changePartyText(cmd, key);
	hideShowParty("partyA");
	hideShowParty("partyB");
	hideShowParty("partyC");
	currentCmd = urlArray[cmd];
	updateCommand();
	
}

function changeTemplatePCM(e, cmd,key)
{
	tabCmdSelected[tabIndex]  = {e:e, cmd:cmd, key:key};
	
	console.log("name = "+e);
	$("a").removeClass("selected");
    e.classList.add("selected");
    
    currentSelection = cmd;
    
	document.getElementById(postButton).disabled = true;
	document.getElementById(getButton).disabled = true;
	document.getElementById(delButton).disabled = true;		

	switch (key) {
	case 'get':
		currentTemplate = "";
		document.getElementById(getButton).disabled = false;
		if (document.getElementById(reqBodyName) !=undefined)
		    document.getElementById(reqBodyName).value = "";
		$('#'+cmdLayout).layout('collapse','west');
		break;
	case  'delete':
		currentTemplate = "";
		document.getElementById(delButton).disabled = false;
		if (document.getElementById(reqBodyName) !=undefined)
		    document.getElementById(reqBodyName).value = "";
		$('#'+cmdLayout).layout('collapse','west');
		break;
	default:
		$('#'+cmdLayout).layout('expand','west');
	    document.getElementById(reqBodyName).value = communicationSettings;
		document.getElementById(replyName).value = "";
		document.getElementById(postButton).disabled = false;
	    currentTemplate = key;
	    updateTemplatePCM();
	    genClientCorrelator();
	    
	}
	document.getElementById("partyAdiv"+tabIndex).style.display="inline";
	currentCmd = urlArray[cmd];
	updateCommand();
}

function changeTemplate(e, cmd,key) {
	changeTemplateVector[tabIndex](e, cmd, key);
}

function addEvent(template,id)
{
	if (document.getElementById(id+tabIndex) !=null) {
		var checkbox = document.getElementById(id+tabIndex).checked;
		if(checkbox)
			template = template.replace('{'+id+'}', ' <criteria>'+id+'</criteria>');
		else
			template = template.replace('{'+id+'}', '');
	}
	return template;
}

function addEventJson(eventStr,id)
{
	if (document.getElementById(id+tabIndex) !=null) {
		var checkbox = document.getElementById(id+tabIndex).checked;
		if(checkbox)
			eventStr += '"'+id+'",';	
	}
	return eventStr;
}


function addDirection(template,id)
{
	var x=document.getElementById("callDirectionSelect").selectedIndex;
	if(x == 0)
		template = template.replace('{'+id+'}', ' <addressDirection>Called</addressDirection>');
	else
		template = template.replace('{'+id+'}', ' <addressDirection>Calling</addressDirection>');
	return template;
}

function addDirectionJson(template,id)
{
	var x=document.getElementById("callDirectionSelect").selectedIndex;
	if(x == 0)
		template = template.replace('{direction}', 'Called');
	else
		template = template.replace('{direction}', 'Calling');
	return template;
}

function updateTemplatePCM() {
	
}

function updateTemplate()
{
	if (currentTemplate == "") return;

	var partyAval = document.getElementById(partyA).value;
	var partyBval = document.getElementById(partyB).value;
	var partyCval = document.getElementById(partyC).value;
	saveParties();
	var template = msgdata[currentTemplate];
	if (template == undefined) return;
	if(lastCall.length >0)
		template = template.replace('{callId}',lastCall);
	template = template.replace('{partyA}', partyAval);
	template = template.replace('{partyB}', partyBval);
	template = template.replace('{partyC}', partyCval);
	template = template.replace('{ClientCorrelator}', clientCorrelator);
	template = template.replace('{domain}', document.domain);
	template = template.replace('{msisdn}', msisdn);

	{
		var criteria = "";
		if (currentSelection != 'NotifSubscriptionCallDirection')
		    criteria = addEventJson(criteria,'Answer');
		criteria = addEventJson(criteria,'Busy');
		criteria = addEventJson(criteria,'NotReachable');
		criteria = addEventJson(criteria,'NoAnswer');
		criteria = addEventJson(criteria,'Disconnected');
		criteria = addEventJson(criteria,'CalledNumber');
		if (criteria.charAt(criteria.length - 1) == ',') {
			criteria = criteria.substr(0, criteria.length - 1);
			}
		template = template.replace('{criteria}', criteria);
		if (currentSelection != 'NotifSubscriptionCallDirection')
		    template = addDirectionJson(template,'Called');
		else 
			template = template.replace('{direction}', 'Called');
	} 
	var data = "";
	console.log(template);
	try {
		data = vkbeautify.json(template);
	}
	catch (err) {
		console.log("Error parsing data:"+err.message);
	}
	document.getElementById(reqBodyName).value = data;
}
function genClientCorrelator() {
    clientCorrelator = Math.round(Math.random()*10000);
}

function updateCommand()
{
	puid = document.getElementById(partyA).value;
	var idx = puid.indexOf(':');  // Strip off sip: prefix.
	if (idx != -1)
		puid = puid.slice(idx+1);

	var cmd  = currentCmd;
	if(lastCall.length >0)
		cmd = cmd.replace('{callId}', lastCall);
	if(lastNotification.length >0)
		cmd = cmd.replace('{notificationId}', lastNotification);	
	if(lastDirection.length >0)
		cmd = cmd.replace('{directionId}', lastDirection);	
	if(lastDigitCollection.length >0)
		cmd = cmd.replace('{digitId}', lastDigitCollection);	
	console.log("partyId = "+partyId);
	if (partyId != "")
	    cmd = cmd.replace('{partyId}', partyId);
	if (puid != "")
	    cmd = cmd.replace('{puid}', puid);
	console.log("cmd="+ cmd);
	
	if (server.indexOf('http') >= 0)
		cmd = server + "/" + cmd;
	else
		cmd = "http://" + server + "/" + cmd;

	document.getElementById(queryName).value = cmd;
}



function directionChanged() {
	updateTemplate();
}

function onReply(xhr, status) {
	console.log("status="+status);
	var tmpJsonFlag = true;
	var respType = xhr.getResponseHeader("Content-Type");
	{
		if (respType == "application/xml") {
			console.log("Response type not JSON!!!");
			tmpJsonFlag = false;
		}
	}
	var str = "";
	//console.log("responseText ="+ xhr.responseText);
	if (xhr.responseText.length > 0) {
		try {
			if (tmpJsonFlag) {
				str = vkbeautify.json(xhr.responseText);

			} else {
				str = vkbeautify.xml(xhr.responseText, 4);
			}
		}
		catch(err) {
			console.log("Error parsing response"+err.message);
		}
	}
	document.getElementById(replyName).value = xhr.getAllResponseHeaders() + "\n"
			+ xhr.statusText + "\n" + xhr.status + " " + errorMsg[xhr.status]
			+ "\n" + str;
    if (str.length > 0) {
    	if (tmpJsonFlag) {  // convert the JSON to xml and then run through parser
    		var jsonObj = jQuery.parseJSON(str);
    		str = x2js.json2xml_str(jsonObj);
    	}
    	var idx = str.indexOf("<CommunicationSettings");
    	if (idx != -1) {
    		communicationSettings = str.slice(idx);
    	}
    	console.log(str);
    	
    	var xmlDoc = jQuery.parseXML(str);
    	xml = jQuery(xmlDoc);
    	processXml(xml);
    }
    if (((currentMethod == "DELETE") &&(status == "success")) ||
    	((currentMethod == "DELETE") &&(xhr.status == 204)) ||
    	((currentMethod == "GET") &&(xhr.status == 404))	) {  // DELETE Success || GET not found
    	var cmd = document.getElementById(queryName).value;
    	if ((lastNotification.length >0) && (cmd.indexOf(lastNotification) != -1)) {
    		lastNotification = "";
    	}
    	if ((lastDirection.length >0) && (cmd.indexOf(lastDirection) != -1)) {
    		lastDirection = "";
    	}
    	if ((lastDigitCollection.length >0) && (cmd.indexOf(lastDigitCollection) != -1)) {
    		lastDigitCollection = "";
    	}
    	if ((lastCall.length >0) && (cmd.indexOf(lastCall) != -1)) {
    		if (cmd.indexOf("participants") == -1) {
    	   		lastCall = "";
        		partyId = "";
    		}
 
    	}
    	updateSubscriptionTable();
    	updateSessionTable();
    	updateCommand();
    } else {
    	updateSubscriptionTable();
    	updateSessionTable();
    }
}

function processXml(xml)
{	
	//
	// The resourceURL can show up for the call and for the participants.  We only want the for the call
	//
	var resource = null;
	var top = xml.children();
	if (top) {
		resource = top.children("resourceURL");
	}
	// If not at the top, look down through the tree
	if((resource != null) && (resource.length <=0)) {
		resource = xml.find("resourceURL");
	}
	if(resource.length <=0) return;
	
	var msgType = xml.find("callSessionInformation");
	if(msgType.length >0)
	{
		var index = 0;
	
		var sessionId = resource.eq(resource.length-1).text().split('callSessions/');
		lastCall = sessionId[1];
		party = [];
		$(xml).find('participant').each(function(){
			var participantAddress = $(this).find('participantAddress').text();
			var participantStatus = $(this).find('participantStatus').text();
			//var duration = $(this).find('duration').text();
			var resourceURL = $(this).find('resourceURL').text();
			var token = resourceURL.split('participants/');
			var item = {};
			item.id = token[1];
			item.party = participantAddress;
			item.status = participantStatus;
			party[index++] = item;
			if (index == 1) {
				partyId = item.id;
				console.log("Set partyId: "+ partyId);
			}
		});
	}
	
	msgType = xml.find("callParticipantList");
	if(msgType.length >0)
	{
		var index = 0;
	
		var sessionId = resource.eq(resource.length-1).text().split('callSessions/');
		lastCall = sessionId[1];
		var token = lastCall.split('/');
		lastCall = token[0];
		party = [];
		$(xml).find('participant').each(function(){
			var participantAddress = $(this).find('participantAddress').text();
			var participantStatus = $(this).find('participantStatus').text();
			//var duration = $(this).find('duration').text();
			var resourceURL = $(this).find('resourceURL').text();
			var token = resourceURL.split('participants/');
			var item = {};
			item.id = token[1];
			item.party = participantAddress;
			item.status = participantStatus;
			party[index++] = item;
			if (index == 1) {
				partyId = item.id;
				console.log("Set partyId: "+ partyId);
			}
		});
	}
	msgType = xml.find("callParticipantInformation");
	if(msgType.length >0)
	{
		var index = party.length;
		var participantAddress = xml.find('participantAddress').text();
		var participantStatus = xml.find('participantStatus').text();
		//var duration = $(this).find('duration').text();
		var resourceURL = xml.find('resourceURL').text();
		var token = resourceURL.split('participants/');
		var item = {};
		item.id = token[1];
		item.party = participantAddress;
		item.status = participantStatus;
		for(var i = 0;i<party.length;i++)
		{
			if (party[i].id == item.id) 
			{
				index = i;
				break;
			}
		}
		party[index++] = item;
		if (index == 1) {
			partyId = item.id;
		}
	}

	msgType = xml.find("callEventSubscription");
	if(msgType.length >0)
	{
		var token = resource.eq(0).text().split('callEvent/');
		if (token[1] != undefined)
		    lastNotification = token[1];
	}
	
	msgType = xml.find("callDirectionSubscription");
	if(msgType.length >0)
	{
		var token = resource.eq(0).text().split('callDirection/');
		if (token[1] != undefined)
		    lastDirection = token[1];
	}	
	
	msgType = xml.find("playAndCollectInteractionSubscription");
	if(msgType.length >0)
	{
		var token = resource.eq(0).text().split('collection/');
		if (token[1] != undefined)
		    lastDigitCollection = token[1];
	}	
	
}

function updateSubscriptionTable()
{
	document.getElementById('callSubId').value = lastNotification;
	document.getElementById('directionSubId').value = lastDirection;
	document.getElementById('digitSubId').value = lastDigitCollection;
	saveSubscriptions();
}

function selectParticipant(id) {
	partyId = id;
	updateCommand();
}

function updateSessionTable()
{
	var e = document.getElementById('participantsTable');
	if (lastCall.length == 0) {
		var list ="<br><table class=\"center\">";
		list+="</table>";
		e.innerHTML = list;
		document.getElementById('callSessionText').value = '';
		document.getElementById('callSession3').value = '';
		return;
	}
	document.getElementById('callSessionText').value = lastCall;
	document.getElementById('callSession3').value = lastCall;
	var list ="<br><table class=\"center\">";
	if (party.length > 0) {
		list+="<thead><tr><th>Address</th><th>Status</th><th>Id</th></tr></thead>";
		list+="<tbody>";
		for(var i = 0;i<party.length;i++)
		{
			var item = party[i];
			list+='<tr><td>'+item.party+'</td><td>'+item.status+'</td><td><a class="linkitem" href=# onClick="selectParticipant('+item.id+')">'+item.id+'</a></td></tr>';
		}
		list+="</tbody>";
	}
	list+="</table>";
	e.innerHTML = list;
}

function getLogs() {
	var cmd = "Servlet/getLogs?_=" + Math.random();
	jQuery.get(cmd, onLogs, "text");
}

function pollLogs() {
	var cmd = "Servlet/pollLogs?_=" + Math.random();
	jQuery.get(cmd, onLogs, "text");
}

function clearLogs() {
	var cmd = "Servlet/clearLogs?_=" + Math.random();
	jQuery.get(cmd);
}

function pauseLogsChanged()
{
	if(!document.getElementById('pauseLogs').checked)
		getLogs();
}


function onLogs(data) {
	document.getElementById("log").value = data;
	pollLogs();
}



function isSeparator(char)
{
	return ' /"<>\n\t\v&='.indexOf(char) >-1;
}

function selectWord(event) {
	event = event || window.event;

	var textarea = event.target;
    var caret = getCaretPosition(textarea);
    var text = textarea.value;
    var begin = caret - 1;
    while (begin >= 0) {
        if (isSeparator(text.charAt(begin))) break;
        else begin--;
    }

    if (begin >= -1) {
        var end = caret;
        while (end < text.length) {
            if (isSeparator(text.charAt(end))) break;
            else end++;
        }

        if (end < text.length)
            setSelection(textarea, begin+1, end-1);
    }
}

function getCaretPosition(el) {
    if (el.selectionStart) {
        return el.selectionStart;
    } else if (document.selection) {
        var r = document.selection.createRange();
        if (r == null) return 0;
        var re = el.createTextRange();
        var rc = re.duplicate();
        re.moveToBookmark(r.getBookmark());
        rc.setEndPoint('EndToStart', re);
        return rc.text.length;
    }
    return 0; 
}

function setSelection(el, begin, end) {
    if ("selectionStart" in el) {
        el.selectionStart = begin;
        el.selectionEnd = end + 1;
    } else if (document.selection) {
        var range = el.createTextRange();
        range.collapse(true);
        range.moveEnd('character', end + 1);
        range.moveStart('character', begin);
        range.select();
    }
}
