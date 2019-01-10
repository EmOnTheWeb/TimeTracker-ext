function openAuthTab() {
    
    var manifest = chrome.runtime.getManifest();

    var clientId = encodeURIComponent(manifest.oauth2.client_id);
    var scopes = encodeURIComponent(manifest.oauth2.scopes.join(' '));
    var redirectUri = encodeURIComponent('urn:ietf:wg:oauth:2.0:oob:auto');

    var url = 'https://accounts.google.com/o/oauth2/auth' + 
              '?client_id=' + clientId + 
              '&response_type=id_token' + 
              '&access_type=offline' + 
              '&redirect_uri=' + redirectUri + 
              '&scope=' + scopes;

    chrome.tabs.create({'url': 'about:blank'}, function(authenticationTab) {

        chrome.tabs.onUpdated.addListener(function googleAuthorizationHook(tabId, changeInfo, tab) {
            
            if (tabId === authenticationTab.id) {
                alert(tab.title); 
                if(tab.title.indexOf('id_token=') > -1) {

                    let tokenKeyValue = tab.title.split(' ',2)[1]; 
                    const TOKEN = tokenKeyValue.split('=')[1]; 

                    chrome.tabs.onUpdated.removeListener(googleAuthorizationHook);
                    chrome.tabs.remove(tabId); 

                    chrome.storage.local.set({ "auth_token": TOKEN }, function(){
                        //console.log('token stored'); 
                    });
                }
            }
        });

        chrome.tabs.update(authenticationTab.id, {'url': url});
    });
}


