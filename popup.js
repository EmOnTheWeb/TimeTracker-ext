let startBtn = document.getElementById('start-btn');

startBtn.onclick = function(element) {
    
    googleAuth(); 
	let client = document.getElementById('client').value; 
	let description = document.getElementById('description').value; 
	
	let timeStart = new Date().toTimeString(); 
	

  	tStartArray = timeStart.split(':'); 
    tStartFormatted = tStartArray[0] + ':' + tStartArray[1]; 

    let jobVals = {client,description,tStartFormatted}; 

    saveValues(jobVals); 
    displayValues(jobVals); 

};

function googleAuth() {

    chrome.extension.getBackgroundPage().openAuthTab();

	// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

}

function saveValues(vals) {

	chrome.storage.local.set({'current-job': vals}, function() {
        // console.log('Value is set to ' + JSON.stringify(vals));
    });

   // chrome.storage.local.get(['current-job'], function(result) {
   //    console.log('Value currently is ' + JSON.stringify(result));
   //  });
}

function displayValues(vals) {

	let displayOne = document.getElementById('display-one'); 
	displayOne.style.display = 'none';

	let displayTwo = document.getElementById('display-two'); 
	
	let insert = "<span id='icon-cancel'>x</span>"; 

	if(vals.client !== '') {  insert += '<p><span>Client</span>' + vals.client + '</p>'}; 
	if(vals.description !== '') insert += '<p><span>Description</span>' + vals.description + '</p>'; 
	insert += '<p><span>Time Start</span>' + vals.tStartFormatted + '</p>'; 

	insert += "<p><button id='end-btn'>Finish and Log</button></p>"

	displayTwo.innerHTML = insert; 
	displayTwo.style.display = 'block'; 

}



    