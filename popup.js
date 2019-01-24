//if there is current job - show that
//else show display one 
(function () {
   
    onAJob().then((jobDetails) => {

        displayValues(jobDetails);   

    },
    () => {
        //no job 
        let displayOne = document.getElementById('display-one'); 
        displayOne.style.display = 'block';

        document.getElementById('client').value = ''; 
        document.getElementById('description').value = ''; 

    }); 
})();

let startBtn = document.getElementById('start-btn');
let displayOne = document.getElementById('display-one'); 
let displayTwo = document.getElementById('display-two'); 

startBtn.onclick = function(element) {
  
	let client = document.getElementById('client').value; 
	let description = document.getElementById('description').value; 
	
	let timeStart = new Date().toTimeString(); 
  	tStartArray = timeStart.split(':'); 
    tStartFormatted = tStartArray[0] + ':' + tStartArray[1]; 

    let jobVals = {client,description,tStartFormatted}; 

    saveValues(jobVals); 
    displayValues(jobVals); 

};

let body = document.getElementsByTagName('body')[0]; 
body.addEventListener('click',async function(e){
    if(e.target && e.target.id== 'end-btn'){
            const AUTH_TOKEN = await getAuthToken().catch((err) => { 
            //no AUTH_TOKEN 
            authenticate(); 
            return; 
        
        }); 
          console.log('retrieved auth token', AUTH_TOKEN);
          var url = 'https://accounts.google.com/o/oauth2/revoke?token=' + AUTH_TOKEN;
window.fetch(url);

chrome.identity.removeCachedAuthToken({token: AUTH_TOKEN}, function (){
    
});
    
        sendToGoogleSheets(AUTH_TOKEN);  
    }
    if(e.target && e.target.id=='icon-cancel') {
        
        chrome.storage.local.remove('current_job'); 
        displayTwo.style.display = 'none'; 
        displayOne.style.display = 'block'; 

    }
 }); 

let SPREADSHEET_ID = '1suoMG9Eng3E2z5uMdUuya1UHAJUySu36eVyujwEcjhM'; 

function authenticate() {
    chrome.extension.getBackgroundPage().authenticateWGoogle(); 
}


function sendToGoogleSheets(token) {
    console.log('token used in api request',token); 
    // var endpoint = https://sheets.googleapis.com/v4/spreadsheets/1suoMG9Eng3E2z5uMdUuya1UHAJUySu36eVyujwEcjhM/values/test!A1:E1:append?valueInputOption=USER_ENTERED
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          console.log(this.responseText); 
        }
    };
    xhttp.open("POST", "https://sheets.googleapis.com/v4/spreadsheets/1suoMG9Eng3E2z5uMdUuya1UHAJUySu36eVyujwEcjhM/values/A4:E4:append?valueInputOption=USER_ENTERED", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader('Authorization','Basic ' + token);
    xhttp.send({"range": "A4:E4",
        "majorDimension": "ROWS",
        "values": [
            ["Door", "$15", "2", "3/15/2016"],
            ["Engine", "$100", "1", "3/20/2016"],
             ],
    });
// {"range": "test!A1:E1",
//   "majorDimension": "ROWS",
//   "values": [
//     ["Door", "$15", "2", "3/15/2016"],
//     ["Engine", "$100", "1", "3/20/2016"],
//   ],
// }
}

function getAuthToken() {
   
    return new Promise((resolve,reject) => {       
        chrome.storage.local.get(['auth_token'], function(items){
            if(items) {
                if(items.hasOwnProperty('auth_token')) {
                 
                    resolve(items['auth_token']);

                }
                else {
                    reject(false); 
                }
            } else {
                reject(false); 
            } 
        });
    })   
}


function saveValues(vals) {

	chrome.storage.local.set({'current_job': vals}, function() {
        // console.log('Value is set to ' + JSON.stringify(vals));
    });
}

function onAJob() {
    return new Promise((resolve,reject) => {
        chrome.storage.local.get(['current_job'], function(items) {
            if(items) {
                if(items.hasOwnProperty('current_job')) { 
                    resolve(items['current_job']);
                }
                else {
                    reject(false); 
                }
            }
            else {
                reject(false); 
            }
        });
    })
}

function displayValues(vals) {


	displayOne.style.display = 'none';
	
    let insert = "<span id='icon-cancel'>x</span>"; 

	if(vals.client !== '') {  insert += '<p><span>Client</span>' + vals.client + '</p>'}; 
	if(vals.description !== '') insert += '<p><span>Description</span>' + vals.description + '</p>'; 
	insert += '<p><span>Time Start</span>' + vals.tStartFormatted + '</p>'; 

	insert += "<p><button id='end-btn'>Finish and Log</button></p>"

	displayTwo.innerHTML = insert; 
	displayTwo.style.display = 'block'; 

}



    