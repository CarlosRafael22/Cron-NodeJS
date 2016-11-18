var firebase = require('firebase');
var request = require('request');

var API_KEY = "AIzaSyAcpLJ1f7mrQQrTe4Pp34eDA_oa7nNoBvU"; // Your Firebase Cloud Server API key

// firebase.initializeApp({
//   serviceAccount: ".json",
//   databaseURL: "https://.firebaseio.com/"
// });
var config = {
  apiKey: "AIzaSyAcpLJ1f7mrQQrTe4Pp34eDA_oa7nNoBvU",
  authDomain: "chron-399c2.firebaseapp.com",
  databaseURL: "https://chron-399c2.firebaseio.com/",
  storageBucket: "gs://chron-399c2.appspot.com",
};
firebase.initializeApp(config);

ref = firebase.database().ref();

function listenForNotificationRequests() {
  var requests = ref.child('notificationRequests');
  requests.on('child_added', function(requestSnapshot) {
    var request = requestSnapshot.val();
    sendNotificationToUser(
      request.username, 
      request.message,
      function() {
        //requestSnapshot.ref.remove();
      }
    );
  }, function(error) {
    console.error(error);
  });
};

function sendNotificationToUser(username, message, onSuccess) {
  request({
    url: 'https://fcm.googleapis.com/fcm/send',
    method: 'POST',
    headers: {
      'Content-Type' :' application/json',
      'Authorization': 'key='+API_KEY
    },
    body: JSON.stringify({
      "data" : {
        "message" : message,
        "username" : username
      },
      // "notification": {
      //   "title" : "Nova mensagem em ChatApp",
      //   "body" : username + " : " + message,
      //   "color" : "Blue"
      // },
      "to" : '/topics/chat1_the_eu'
    })
  }, function(error, response, body) {
    if (error) { console.error(error); }
    else if (response.statusCode >= 400) { 
      console.error('HTTP Error: '+response.statusCode+' - '+response.statusMessage); 
    }
    else {
      onSuccess();
    }
  });
}

// start listening
listenForNotificationRequests();