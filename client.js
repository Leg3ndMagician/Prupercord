/*
CREDITS:

Pruper - Head Developer
Broman - The Cooler Developer 😎

*/
let connection = new WebSocket('wss://Prupercord.leg3ndmagician.repl.co', "this-is-probably-a-protocol");

let username = "Client " + Math.floor(Math.random() * 1000000);

connection.onopen = function () {
    log("Connected!");
    log("Tip: Use <b>/help</b> for information on commands.", Date.now(), 'lightblue');
    usernamePrompt = prompt("Connected to the server. Please enter a username.");
    if (usernamePrompt != "" && usernamePrompt != null) username = usernamePrompt;
    document.getElementById("inputName").value = username;

    connection.send(Message.new("UserJoin", { name: username, newUserCount: null }))
}
connection.onmessage = function (msg) {
    Message.interpret(msg.data.toString());
}
connection.onclose = function (e) {
    log("Connection has been closed!");
}
connection.onerror = function () {
    log("An error occured in your connection!");
}

window.onload = function () {
    document.getElementById("sendButton").onclick = function () {
        let text = document.getElementById("inputMessage").value;
        if (text == "") return;

        if (text.startsWith("/")) {
            // command
            commandParser(text);
        } else {
            // message
            connection.send(Message.new("Message", { sender: username, content: text, timestamp: null }));
        }
        document.getElementById("inputMessage").value = "";
    };

    document.getElementById("inputMessage").addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            document.getElementById("sendButton").onclick();
        }
    });
}

window.addEventListener("beforeunload", function (e) {
    connection.send(Message.new("UserLeave", { name: username, newUserCount: null }))
});

const Message = {
    new: function (messageType, data) {
        let messageToSend = {
            type: messageType,
            data: data
        }

        messageToSend = JSON.stringify(messageToSend);
        return messageToSend;
    },

    interpret: function (toInterpret) {
        try {
            var message = JSON.parse(toInterpret);
            switch (message.type) {
                case "Message":
                    var messageContent = parseEmoji(message.data.content);
                    messageContent = parseTextStyling(messageContent);
                    log("" + message.data.sender + ": " + messageContent, message.data.timestamp);
                    break;
                case "Image":
                    var image = "<img src=\"" + message.data.url + "\">";
                    log("" + message.data.sender + ": " + image, message.data.timestamp);
                    break;
                case "UserJoin":
                    log("" + message.data.name + " has entered the chat (" + message.data.newUserCount + " online)", message.data.timestamp, 'lightgreen');
                    break;
                case "UserLeave":
                    log("" + message.data.name + " has left the chat (" + message.data.newUserCount + " online)", message.data.timestamp, 'pink');
                    break;
                default:
                    console.error("Could not interpret message: " + message);
            }
        } catch (error) {
            console.log(error);
        }
    }
}

const CommandList = [
    { name: 'emoji', aliases: ['emojilist', 'el'], description: "Shows a list of emojis." },
    { name: 'rickroll', aliases: ['astley', 'banme'], description: "You know the rules, and so do I." },
    { name: 'sendimage {url}', aliases: ['image','img'], description: "Sends an image with a given url." },
    { name: 'help', aliases: ['commandlist','cl'], description: "Shows the command list." },
]

function commandParser(command) {
    var commandArguments = command.split(' ');
    var commandId = commandArguments.shift();

    switch (commandId) {
        case "/emoji":
        case "/emojilist":
        case "/el":
            var listText = "List of Emojis: <br>";
            for (i in EmojiList) {
                listText += "<br>" + EmojiList[i].emoji + " - " + EmojiList[i].identifier + "";
            }
            log(listText, Date.now(), 'lightblue')
            break;
        case "/rickroll":
        case "/astley":
        case "/banme":
            connection.send(Message.new("Image", { sender: username, url: "https://c.tenor.com/VFFJ8Ei3C2IAAAAM/rickroll-rick.gif", timestamp: null }));
            break;
        case "/sendimage":
        case "/image":
        case "/img":
            if (commandArguments[0]) {
                connection.send(Message.new("Image", { sender: username, url: commandArguments[0], timestamp: null }));
            } else {
                log("Please enter in a URL to send an image for.", Date.now(), 'lightblue');
            }
            break;
        case "/help":
        case "/commandlist":
        case "/cl":
            var listText = "List of Commands: <br>"
            for (i in CommandList) {
                listText += "<br><b>/" + CommandList[i].name + "</b> - " + CommandList[i].description + "";
            }
            log(listText, Date.now(), 'lightblue')
            break;
        default:
            log("Unknown command.", Date.now(), 'lightblue');
    }
}

const EmojiList = [
    { identifier: ':boom:', emoji: '💥' },
    { identifier: ':brain:', emoji: '🧠' },
    { identifier: ':cry:', emoji: '😭' },
    { identifier: ':crying:', emoji: '😢' },
    { identifier: ':eggplant:', emoji: '🍆' },
    { identifier: ':exclamation:', emoji: '❗' },
    { identifier: ':expressionless:', emoji: '😑' },
    { identifier: ':eye:', emoji: '👁️' },
    { identifier: ':eyes:', emoji: '👀' },
    { identifier: ':facepalm:', emoji: '🤦' },
    { identifier: ':flushed:', emoji: '😳' },
    { identifier: ':grimacing:', emoji: '😬' },
    { identifier: ':heart:', emoji: '❤️' },
    { identifier: ':joy:', emoji: '😂' },
    { identifier: ':mouth:', emoji: '👄' },
    { identifier: ':moyai:', emoji: '🗿' },
    { identifier: ':muscle:', emoji: '💪' },
    { identifier: ':okhand:', emoji: '👌' },
    { identifier: ':pensive:', emoji: '😔' },
    { identifier: ':poop:', emoji: '💩' },
    { identifier: ':pray:', emoji: '🙏' },
    { identifier: ':rofl:', emoji: '🤣' },
    { identifier: ':shrug:', emoji: '🤷' },
    { identifier: ':sleeping:', emoji: '😴' },
    { identifier: ':smile:', emoji: '😀' },
    { identifier: ':sunglasses:', emoji: '😎' },
    { identifier: ':sweat:', emoji: '😰' },
    { identifier: ':thumbsdown:', emoji: '👎' },
    { identifier: ':thumbsup:', emoji: '👍' },
    { identifier: ':tm:', emoji: '™' }
]

function parseEmoji(text) {
    var parsedText = text;
    for (i = 0; i < EmojiList.length; i++) {
        parsedText = parsedText.replaceAll(EmojiList[i].identifier, EmojiList[i].emoji);
    }
    return parsedText;
}

function parseTextStyling(text) {
    var parsedText = " " + text + " ";
    while ((parsedText.split("**").length > 2) {
        var start = parsedText.indexOf("**");
        parsedText = parsedText.substring(0, start) + (start + 2);
        var end = parsedText.indexOf("**");
        parsedText = parsedText.substring(0, start) + "<b>" + parsedText.substring(start, end) + "</b>" + parsedText.substring(end + 2);
        
    }
    parsedText = parsedText.substring(1, parsedText.length() - 1);
    return parsedText;
}

function getTimeFor(timestamp) {
    var date = new Date(timestamp);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var daytime = "AM";
    if (hours > 12) {
        hours -= 12;
        daytime = "PM";
    } else if (hours == 0) {
        hours += 12;
    }

    var time = hours + ":" + minutes.toString().padStart(2, '0') + " " + daytime;
    return time;
}

function log(info, timestamp = Date.now(), color = 'lightgray') {
    element = document.getElementById('messages')
    element.innerHTML += "<div style=\"padding:10px; margin:10px; border:3px solid black; border-radius:5px; background-color:" + color + "\">" + info + "<span style=\"float:right;\">" + getTimeFor(timestamp) + "</span><div>";
    element.scrollTop = element.scrollHeight;
}
