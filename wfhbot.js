const { RTMClient, WebClient } = require('@slack/client');

const bot_token = 'Placeholder for the actual token lol';
const rtm       = new RTMClient(bot_token);
const web       = new WebClient(bot_token);

const robotName   = 'wfhbot';
const channel = 'C9QKB61MG';

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

rtm.on('message', (message) => {
    if (message.text && message.channel === channel) {
        const userName = getUsernameFromId(message.user);
        if (userName !== robotName) {
            if (message.text.trim().toLowerCase() === '!wfh help') {
                rtm.sendMessage('Hey <@' + message.user + '>! To add yourself to the WFH list, simply enter !wfh. To get the WFH list, enter !wfhlist', message.channel);
            }
            if (message.text.trim().toLowerCase() === '!wfhlist') {
                var returnMessage = 'Users that are working from home: ';
                var userCount = wfhUsers.length;
                wfhUsers.forEach(function(user, index) {
                    returnMessage = returnMessage + '<@' + message.user + '>';
                    if (index !== userCount - 1) {
                        returnMessage = returnMessage + ", ";
                    }
                });
                rtm.sendMessage(returnMessage, message.channel);
            }
            if (message.text.toLowerCase().trim().toLowerCase() === ('!wfh')) {
                wfhUsers.push(message.user);
                rtm.sendMessage('Added <@' + message.user + '> to WFH list.', message.channel);
            }
        }
    }
});