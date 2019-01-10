 
//if there is current job - show that
//else show display one 
chrome.storage.local.clear(); 
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
            authenticateWGoogle(); //opens new tab and closes extension
        
        }); 
            console.log(AUTH_TOKEN);  
        sendToGoogleSheets();  
    }
    if(e.target && e.target.id=='icon-cancel') {
        
        chrome.storage.local.remove('current_job'); 
        displayTwo.style.display = 'none'; 
        displayOne.style.display = 'block'; 

    }
 }); 

let SPREADSHEET_ID = '1suoMG9Eng3E2z5uMdUuya1UHAJUySu36eVyujwEcjhM'; 
let API_KEY = 'AIzaSyDOfRX5NYJib0vU1Hjup3KOQyAJp3dIe3Y'; 
function sendToGoogleSheets() {

    // var endpoint = https://sheets.googleapis.com/v4/spreadsheets/1suoMG9Eng3E2z5uMdUuya1UHAJUySu36eVyujwEcjhM/values/test!A1:E1:append?valueInputOption=USER_ENTERED
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          console.log(this.responseText); 
        }
    };
    xhttp.open("POST", "https://sheets.googleapis.com/v4/spreadsheets/1suoMG9Eng3E2z5uMdUuya1UHAJUySu36eVyujwEcjhM/values/A1:E1:append?key=eyJhbGciOiJSUzI1NiIsImtpZCI6IjhhYWQ2NmJkZWZjMWI0M2Q4ZGIyN2U2NWUyZTJlZjMwMTg3OWQzZTgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiOTM2MDE0MzkxNDUxLXAwNmhub2ZpOWFhNmpvam5hOGFwZnJ2M3JrajNtdTd0LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiOTM2MDE0MzkxNDUxLXAwNmhub2ZpOWFhNmpvam5hOGFwZnJ2M3JrajNtdTd0LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA1NTYzMzM0OTI0MzYxOTA0MDg3IiwiaWF0IjoxNTQ3MTQzMzg1LCJleHAiOjE1NDcxNDY5ODUsImp0aSI6IjVhMjA4MGEzNTNiYTc1Nzk3NzgxZDIxMmUxNzRiNzRjYTQ5MmM3MzMifQ.UxtZg5DxlpHwXNiXftCBwa9_xvEe4z_r5kL5fIwrQqDRak5dBUrSDslivd-IPeHwYaK9a5tkzSYj58SdNLwrpsY2qyvVJlHETEDF6pmBL4jleCcDdcdBmnlaYX2fAkm5XLB37S-RMAA92qqX9fTReH3t7o6ZSGrsQ_H2nyU3W3wcBt_dozGl-IUvE_RnL4nrp4ycPahO6W4Zb0lmDEwcXMYp", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
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
                    reject(); 
                }
            } else {
                reject(); 
            } 
        });
    })   
}

function authenticateWGoogle() {

    chrome.extension.getBackgroundPage().openAuthTab();

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



    