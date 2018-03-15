const { RTMClient, WebClient } = require('@slack/client');

const bot_token = 'xoxb-330103983009-IqyyUITJ7pevYnN9GBeGO6SL';
const rtm       = new RTMClient(bot_token);
const web       = new WebClient(bot_token);

const robotName   = 'wfhbot';

let users = [];
let wfhUsers = [];

function executeCommand(command, args) {
    console.log(command, args);
}

function updateUsers(data) {
    users = data.members;
}

function getUsernameFromId(id) {
    const user = users.find(user => user.id === id);
    return user ? user.name : 'unknown member';
}

web.users.list((err, data) => {
    if (err) {
        console.error('web.users.list Error:', err);
    } else {
        updateUsers(data);
    }
});

rtm.start();

rtm.on('message', function handleRtmMessage(message) {
    if (message.text) {
        const userName = getUsernameFromId(message.user);
        if (userName !== robotName) {
            if (message.text.trim().toLowerCase() === '!wfh help') {
                rtm.sendMessage('Hey ' + userName + '! To add yourself to the WFH list, simply enter !wfh. To get the WFH list, enter !wfhlist', message.channel);
            }
            if (message.text.trim().toLowerCase() === '!wfhlist') {
                var returnMessage = 'Users that are working from home: ';
                var userCount = wfhUsers.length;
                wfhUsers.forEach(function(userName, index) {
                    returnMessage = returnMessage + userName;
                    if (index !== userCount - 1) {
                        returnMessage = returnMessage + ", ";
                    }
                });
                rtm.sendMessage(returnMessage, message.channel);
            }
            if (message.text.toLowerCase().trim().toLowerCase() === ('!wfh')) {
                wfhUsers.push(userName);
                rtm.sendMessage('Added ' + userName + ' to WFH list.', message.channel);
            }
        }
    }
});