// Import module // 
import * as messaging from "messaging";
import document from "document";
import fs from "fs";
import { Accelerometer } from "accelerometer";
import { BodyPresenceSensor } from "body-presence";
import { display } from "display";
import { listDirSync } from "fs";
import { readFileSync } from "fs";
import { me } from "appbit";
import { memory } from "system";

me.appTimeoutEnabled = false;


// Declare variable // 
const accelLabel = document.getElementById("accel-label");
const accelData = document.getElementById("accel-data");
const appTitle = document.getElementById("App-Title");
const appNameData = document.getElementById("App-name");
const bpsLabel = document.getElementById("bps-label");
const bpsData = document.getElementById("bps-data");
const sensors = [];


// Declare function //
// 1) Listen for the onopen event //
messaging.peerSocket.onopen = function() {
  // Ready to send messages
  sendMessage();
}
// 2) Listen for the onerror event //
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}

// Send a message to the companion //
function sendMessage(data) {
    for(var i in data) {
    //console.log("Send data to companion... "+data[i]);
    messaging.peerSocket.send(data[i]);
    }
};


/* MAIN PART */
// 1) Check connection with companion(원내 방문 여부를 확인 가능!)
if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
   console.log("Connection complete with companion!");
    
   //check file list in device*/
   var listDir = listDirSync("/private/data/");
   var dirIter;
  
   while((dirIter = listDir.next()) && !dirIter.done) {
      console.log("check datafile in device: "+ dirIter.value);
    }
   var text = readFileSync(dirIter.value, 'cbor');
   console.log("JS memory: " + memory.js.used + "/" + memory.js.total);
   // 태블릿 PC로 전송
   sendMessage(text);

}
// 2) 원외 상황에서의 데이터 수집 부분   
else {
  //데이터 담을 빈 array 정의
  const json_array = new Array();
  
  if (Accelerometer && BodyPresenceSensor){

  const accel = new Accelerometer({ frequency: 1 });
  const bps = new BodyPresenceSensor({ frequency: 1 });
  
  bps.addEventListener && accel.addEventListener("reading", () => {
    
    let file_save_date = String(new Date().toLocaleString());
    let tmp_name = file_save_date.substring(4,24).replace(/ /gi, '').replace(/:/gi,'');
    
    let bps_value = String(bps.present);

    let x_value = String(accel.x).substring(0,6);
    let y_value = String(accel.y).substring(0,6);
    let z_value =  String(accel.z).substring(0,6);

    let data_summed = JSON.stringify({time : tmp_name,
                     wear : bps_value,
                     X : x_value,
                     Y : y_value,
                     Z : z_value });

    console.log(data_summed);
    json_array.push(data_summed);
    console.log("json_array1: "+json_array.length);
  
    if (json_array.length == 400){
      fs.writeFileSync(tmp_name+"cbor", json_array, "cbor");
      json_array =[];
      console.log("JS memory: " + memory.js.used + "/" + memory.js.total);
      };
  });
  accel.start();
  bps.start();
    
};
}; 
  