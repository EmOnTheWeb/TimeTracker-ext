 
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
            authenticateWGoogle(); 
        
        }); 
    }
    if(e.target && e.target.id=='icon-cancel') {
        
        chrome.storage.local.remove('current_job'); 
        displayTwo.style.display = 'none'; 
        displayOne.style.display = 'block'; 

    }
 }); 



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



    