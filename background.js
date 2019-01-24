function authenticateWGoogle() {
    
    chrome.identity.getAuthToken({interactive: true}, function(token) {
       
        chrome.storage.local.set({ "auth_token": token }, function(){
            //console.log('token stored'); 
        });
    });
}


