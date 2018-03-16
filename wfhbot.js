const { RTMClient, WebClient } = require('@slack/client');

const bot_token = 'xoxb-330103983009-wRRJiK58xBqpyr3QabqSuMxs';
const rtm = new RTMClient(bot_token);
const web = new WebClient(bot_token);

const robotName = 'wfhbot';
const channel = 'C9QKB61MG';

let wfhUsers = [];

function removeWfhUser(element) {
    var index = wfhUsers.indexOf(element);
    if (index > -1) {
        wfhUsers.splice(index, 1);
    }
}
rtm.start();

rtm.on('message', (message) => {
    if (message.text && message.channel === channel) {
        if (message.text.trim().toLowerCase() === '!wfh help') {
            rtm.sendMessage('Hey <@' + message.user + '>! To add yourself to the WFH list, simply enter !wfh. To remove yourself, simply type !wfh again. To get the WFH list, enter !wfhlist', message.channel);
        }
        if (message.text.trim().toLowerCase() === '!wfhlist') {
            var returnMessage = 'Users that are working from home: ';
            var userCount = wfhUsers.length;
            wfhUsers.forEach(function (user, index) {
                returnMessage = returnMessage + '<@' + message.user + '>';
                if (index !== userCount - 1) {
                    returnMessage = returnMessage + ", ";
                }
            });
            rtm.sendMessage(returnMessage, message.channel);
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

    if (message.channel !== channel) {
        rtm.sendMessage('This bot only works in <#' + channel + '>. Please contact Jeffrey if you would like to add this to your channel.', message.channel);
    }
});