/*
CREDITS:

Pruper - Head Developer
Broman - Developer

*/
let connection = new WebSocket('wss://Prupercord.leg3ndmagician.repl.co', "this-is-probably-a-protocol");

let username = "Client " + Math.floor(Math.random() * 1000000);

connection.onopen = function () {
    log("Connected!");
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
                    log("[" + message.data.sender + "] (" + getTimeFor(message.data.timestamp) + ") " + messageContent + "");
                    break;
                case "UserJoin":
                    log("\n" + message.data.name + " has entered the chat (" + message.data.newUserCount + " now online)\n");
                    break;
                case "UserLeave":
                    log("\n" + message.data.name + " has left the chat (" + message.data.newUserCount + " now online)\n");
                    break;
                default:
                    console.error("Could not interpret message: " + message);
            }
        } catch (error) {
            console.log(error);
        }
    }
}

function commandParser(command) {
    switch (command) {
        case "/astley":
        case "/rickroll":
        case "/banme":
            connection.send(Message.new("Message", { sender: username, content: "<img src=\"https://c.tenor.com/VFFJ8Ei3C2IAAAAM/rickroll-rick.gif\"></img>", timestamp: Date.now() }));
            break;
        default:
            log("\nUnknown command.\n")
    }
}

const EmojiList = [
    { identifier: ":moyai:", emoji: "🗿" },
    { identifier: ":thumbsup:", emoji: "👍" },
    { identifier: ":tm:", emoji: "™" },
    { identifier: ":poop:", emoji: "💩" }
]

function parseEmoji(text) {
    var parsedText = text;
    for (i = 0; i < EmojiList.length; i++) {
        parsedText = parsedText.replace(EmojiList[i].identifier, EmojiList[i].emoji);
    }
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
    }

    var time = hours + ":" + minutes.toString().padStart(2, '0') + daytime;
    return time;
}

function log(info) {
    element = document.getElementById('messages')
    element.innerHTML += "<p>" + info + "</p>";
    element.scrollTop = element.scrollHeight;
}
