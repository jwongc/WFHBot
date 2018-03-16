const { RTMClient, WebClient } = require('@slack/client');

const bot_token = 'PUT YOUR AUTH TOKEN HERE';
const rtm = new RTMClient(bot_token);
const web = new WebClient(bot_token);

const botUser = 'U9Q3142E5';
const botUserChannel = 'D9Q31UYKB';
const channel = 'C9QKB61MG';
const slackbotUser = 'USLACKBOT';

let wfhUsers = [];

function removeWfhUser(element) {
    var index = wfhUsers.indexOf(element);
    if (index > -1) {
        wfhUsers.splice(index, 1);
    }
}
rtm.start();

rtm.on('message', (message) => {
    if (message.text) {
        if (message.channel === channel) {
            if (message.text.trim().toLowerCase() === '!wfh help') {
                rtm.sendMessage('Hey <@' + message.user + '>! To add yourself to the WFH list, simply enter !wfh. To remove yourself, simply type !wfh again. To get the WFH list, enter !wfh list', message.channel);
            }
            if (message.text.trim().toLowerCase() === '!wfh list' || (message.text.toLowerCase().indexOf('update burn down') > -1 && message.user === slackbotUser)) {
                var returnMessage = 'Users that are working from home: ';
                var userCount = wfhUsers.length;
                wfhUsers.forEach(function (user, index) {
                    returnMessage = returnMessage + '<@' + user + '>';
                    if (index !== userCount - 1) {
                        returnMessage = returnMessage + ", ";
                    }
                });
                returnMessage = returnMessage + '. If you are on this list but are not working from home, type !wfh to remove yourself.';
                if (wfhUsers.length > 0) {
                    rtm.sendMessage(returnMessage, message.channel);
                }
                else {
                    rtm.sendMessage('There are no users working from home. If you are working from home, type !wfh to add yourself to the list.', message.channel);
                }
            }
            if (message.text.toLowerCase().trim().toLowerCase() === ('!wfh')) {
                if (!wfhUsers.includes(message.user)) {
                    wfhUsers.push(message.user);
                    rtm.sendMessage('Added <@' + message.user + '> to WFH list.', message.channel);
                } else {
                    for (var i = wfhUsers.length; i > 0; i--) {
                        if (wfhUsers[i - 1] === message.user) {
                            removeWfhUser(message.user);
                            rtm.sendMessage('Removed <@' + message.user + '> from WFH list.', message.channel);
                            break;
                        }
                    }
                }
            }
        }

        if (message.text.trim().toLowerCase().startsWith('!wfh') && message.channel !== channel) {
            rtm.sendMessage('This bot only works in <#' + channel + '>. Please contact Jeffrey if you would like to add this to your channel.', message.channel);
        }
    }
});