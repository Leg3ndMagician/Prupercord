//let ipAddress = prompt("Please enter a server IP to connect to:");
let connection = new WebSocket('wss://Prupercord.leg3ndmagician.repl.co', "this-is-probably-a-protocol");

let username = "Client " + Math.round(Math.random() * 999999);

connection.onopen = function() {
    log("Connected!");
    usernamePrompt = prompt("Connected to the server. Please enter a username.");
    if (usernamePrompt != "" && usernamePrompt != null) username = usernamePrompt;
    document.getElementById("inputName").value = username;
}
connection.onmessage = function(msg) {
    Message.interpret(msg.data.toString());
}
connection.onclose = function(e) {
    log("Connection has been closed!");
}
connection.onerror = function() {
    log("An error occured in your connection!");
}

establishConnection = function() {
    if (!ipAddress) {
        establishConnection();
    } else {
        
    }
}

window.onload = function() {
    document.getElementById("sendButton").onclick = function() {
        let sender = username;
        let text = document.getElementById("inputMessage").value;
        if (text == "") return;
        connection.send(Message.new("Message", {sender: sender, content: text}));
        document.getElementById("inputMessage").value = "";
    };

    document.getElementById("inputMessage").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            document.getElementById("sendButton").onclick();
        }
    });
}

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
                    log("[" + message.data.sender + "] " + message.data.content);
                    break;
                default:
                    console.error("Could not interpret message: " + message);
            }
        } catch(error) {
            console.log(error);
        }
    }
}

function log(s) {
    element = document.getElementById('messages')
    element.innerHTML += "<p>" + s + "</p>";
    element.scrollTop = element.scrollHeight;
}