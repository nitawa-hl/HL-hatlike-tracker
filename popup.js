$(function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {txt:'run script'});
    });

    chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
        console.log(msg);
        if (msg.action === "updateIcon") {
            chrome.storage.local.get({'HLPstatus': 'defaultValue'}, function(items) {
                console.log(items);
                var info = items.HLPstatus;
                var content = '<table class= "greyGridTable">\
                        <tr><th>Player</th><th>Hat-like slots</th></tr>'
                for(var i = 0; i < items.HLPstatus.length; i++) {                    
                    if (i == items.HLPstatus.length - 2) {
                        $('#Qstate').text(items.HLPstatus[i]);
                    } else if (i == items.HLPstatus.length - 1) {
                        $('#turn').text(items.HLPstatus[i]);
                    } else {
                        content += '<tr><td>' + items.HLPstatus[i][0] + '</td><td>' + items.HLPstatus[i][3].join(', ') + '</td></tr>';
                    }
                }
                content += "</table>"
                $('#here_table').replaceWith(content);
            });
        }
    });
});
