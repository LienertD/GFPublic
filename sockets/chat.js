/**
 * Created by Jonatan on 24/12/2015.
 */

module.exports = function (io) {
    var currentUsers = [];

    io.sockets.on('connection', function (socket) {

        socket.on('sharePosted', function (shareData) {
            io.emit('sharePostedNotify', shareData);
            console.log('tis geemit');
        });

        socket.on('logoutMessage', function (userid) {
            console.log("logout van user");

            for (var i = 0, len = currentUsers.length; i < len; i++) {
                if (currentUsers[i].currentUserId == userid) {
                    currentUsers.splice(i, 1); //verwijderen van de currentusersarray
                }
            }

        });

        socket.on('loginMessage', function (userid) {
            console.log("login van user");

            if (userid !== undefined && userid !== null) { //bepalen als zender toegevoegd moet worden aan currentUsers (lijst van de users met hun socketid)
                var userIsAlreadyKnown = false;
                for (var i = 0, len = currentUsers.length; i < len; i++) {
                    if (currentUsers[i].currentUserId == userid) {
                        userIsAlreadyKnown = true;

                        socketIdFromUserIsKnown = false;
                        for (var j = 0, silen = currentUsers[i].socketids.length; j < silen; j++) {
                            if (currentUsers[i].socketids[j] == socket.id) {
                                socketIdFromUserIsKnown = true; //socketid van userid reeds gekend, dus niet toevoegen aan lijst
                            }
                        }
                        if (!socketIdFromUserIsKnown) //socketid nog niet gekend, toeveogen aan lijst
                        {
                            currentUsers[i].socketids.push(socket.id);
                        }
                    }
                }

                if (!userIsAlreadyKnown) { //toevogen aan gekendeusers als hij nog niet gekend is
                    var arsocketids = []; //in een array steken want een userid kan op verschillende tabs/browsers chatten => meerdere socketids
                    arsocketids.push(socket.id);
                    var userIdObj = {
                        "currentUserId": userid,
                        "socketids": arsocketids
                    };
                    currentUsers.push(userIdObj);
                }
            }
        });

        socket.on('chatMessage', function (data) {
            console.log("chatmessage van user");
            var userIsKnown = false;
            for (i = 0, len = currentUsers.length; i < len; i++) {
                if (currentUsers[i].currentUserId == data.receiver) {
                    userIsKnown = true;
                    for (j = 0, silen = currentUsers[i].socketids.length; j < silen; j++) {
                        var receiverSocketId = currentUsers[i].socketids[j]; //sturen naar ELKE socketid van de ontvanger
                        socket.to(receiverSocketId).emit('chatMessage', data);
                    }
                }
            }
            if (!userIsKnown) {
                console.log("user with id " + data.receiver + " is not known yet, message could not be send!");
            }
        });
    });
};
