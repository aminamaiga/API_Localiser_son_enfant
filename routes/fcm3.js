const https = require('https');

var admin = require("firebase-admin");

var serviceAccount = require("../starry-compiler-309413-firebase-adminsdk-gtb76-7e651e55f0.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const registrationTokens = ['esw9NBVjRjerVu6VGdKWWf:APA91bHcxSYJElDJ0-d5XcDJexLmFPQCw0c76ey5rWMiMWBz74rKlPGn8q6KbCoqSEkdXjZWDVyjSinrvneWPMrZmXfkKNK_GW9gTP8qcbIR-ANYGsaaBh-yAjn-QgD57yEM-9sAxFDL'];
 const sendNotifications = (data) => {

    const dataString = JSON.stringify(data)

    const headers = {
        'Authorization': 'key=AAAAQYpglVU:APA91bGjTXt-xeJfW5bN3NWkokkyQ8_1wmAQ0emGXcsG2x9qKr_FWn4Gd9ZTVxWn5hSDqQLdjPqd__AK9Ej6tRGOMYuDb5Rd64vDrtNv4Uve6xdj6aGfeHWKeWFXVQ4Vu9A5j8Ow9ATw',
        'Content-Type': 'application/json',
        'Content-Length': dataString.length
    }

    const message = {
        data: {
          title: '850',
          body: 'test'
        },
      //  topic: "notification_parent",
       tokens: registrationTokens
      };

admin.messaging().sendMulticast(message)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });
   
}

exports.sendNotifications = sendNotifications;
