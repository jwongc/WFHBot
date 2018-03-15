const RtmClient  = require('@slack/client').RtmClient;
const WebClient  = require('@slack/client').WebClient;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

const bot_token = 'xoxb-330103983009-2XQLtvgz9roX3Idwnzbjv2CK';
const rtm       = new RtmClient(bot_token);
const web       = new WebClient(bot_token);

const robotName   = 'wfhbot';

let users = [];

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

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
    if (message.type === 'message' && message.text) {
        const userName = getUsernameFromId(message.user);
        if (userName !== robotName) {
            if (message.text.trim().toLowerCase() === '!wfh help') {
                rtm.sendMessage('Hey ' + userName + '! To add yourself to the WFH list, simply enter !wfh. To get the WFH list, enter !wfhlist', message.channel);
            }
            if (message.text.trim().toLowercase() === '!wfhlist') {
                var returnMessage = 'Users that are working from home: ';
                users.forEach(function(userName, index) {
                    returnMessage.concat(userName);
                    if (index > users.length - 1) {
                        returnMessage.concat(', ');
                    }
                });
                rtm.sendMessage(returnMessage);
            }
            if (message.text.toLowerCase().trim().toLowerCase() === ('!wfh')) {
                users.push(userName);
                rtm.sendMessage('Added ' + userName + ' to WFH list.', message.channel);
            }
        }
    }
});

web.users.list((err, data) => {
    if (err) {
        console.error('web.users.list Error:', err);
    } else {
        updateUsers(data);
    }
});

rtm.start();