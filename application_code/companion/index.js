import * as messaging from "messaging";


// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  // Output the message to the console
  //console.log(+JSON.stringify(evt.data));
  var posted_data = JSON.stringify(evt.data);
  
  //console.log("Received from companion: ", posted_data);

  
  fetch('http://XX.XXX.XX.XXX:XXXX', {
  method: 'POST',
  //headers:{'Content-Type': 'application/json'},
  body: posted_data
    })
    .then(response => {console.log(response);})
    .catch(error => {console.log(error);})
    .then(response => {console.log(response);});
};