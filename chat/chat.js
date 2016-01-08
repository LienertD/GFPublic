//var socket = io.connect("http://localhost:667");
var socket = io.connect(window.location.protocol + "//" + location.hostname + ":667");

socket.on("usermessage", function (data) { //ontvangen bericht
    newTextBubble(data.sender, data.text);
});

function newTextBubble(sender, message) {
    /*var msg = document.createElement("li");
    msg.innerText = sender + ": " + message;
    var chatlist = document.getElementById("chatlist");
    chatlist.appendChild(msg);*/
    console.log(sender+": "/message);
}

function sendToServer() { //verzenden bericht

    var inputtext = document.getElementById("inputtext");
    var sender = document.getElementById("myname").value;
    var receiver = document.getElementById("receiver").value;

    var messageObj = new Object();
    messageObj.text = inputtext.value;
    messageObj.sender = sender;
    messageObj.receiver = receiver;

    socket.emit("clientMessage", messageObj);

    newTextBubble(sender, inputtext.value);
    inputtext.value ="";
}