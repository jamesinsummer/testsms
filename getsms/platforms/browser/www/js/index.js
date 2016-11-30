/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
		
		initSMSApp();
		
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};



var smsList = [];
function initSMSApp() {
	if (! SMS ) {
		alert( 'SMS plugin not ready' ); return; 
	} 
	
	
	if (SMS) {
		$("#watching").html('SMS ready');
	}
	
	document.addEventListener('onSMSArrive', function(e){
		var data = e.data;
		smsList.push( data );
		
		alert('SMS arrived, count: ' + smsList.length );
		
		var divdata = $('div#data');
		divdata.html( divdata.html() + JSON.stringify( data ) );
		console.log(JSON.stringify( data ));
		alert("收到訊息 : " + data.body );
		/*
		{"address":"0975803938","body":"foody1234","date_sent":1480384325000,"date":1480384327149,"read":0,"seen":0,"status":0,"type":1,"service_center":"+886932400863"}
		*/
		
	});
}


function startWatch() {
	if(SMS) SMS.startWatch(function(){
		$("#watching").html('watching started');
		
	}, function(){
		$("#watching").html('failed to start watching');
	});
}
function stopWatch() {
	if(SMS) SMS.stopWatch(function(){
		$("#watching").html('watching stopped');
	}, function(){
		$("#watching").html('failed to stop watching');
	});
}


function sendSMS() {
	var sendto = "0975803938";
	var textmsg = "foody1234";
	if(sendto.indexOf(";") >=0) {
		sendto = sendto.split(";");
		for(i in sendto) {
			sendto[i] = sendto[i].trim();
		}
	}
	if(SMS) SMS.sendSMS(sendto, textmsg, function(){}, function(str){alert(str);});
}


/* 這會抓出 最新 10 筆 SMS */
function listSMS() {
    		
    		
        	if(SMS) SMS.listSMS({}, function(data){
    			alert('sms listed as json array');
    			//updateData( JSON.stringify(data) );
    			
    			var html = "";
        		if(Array.isArray(data)) {
        			for(var i in data) {
        				var sms = data[i];
        				smsList.push(sms);
        				html += sms.address + ": " + sms.body + "<br/>";
        			}
        		}
        		alert( html );
        		
        	}, function(err){
        		alert('error list sms: ' + err);
        	});
        }