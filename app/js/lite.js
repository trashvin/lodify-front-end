var data = [];
var translate_table = new Map();
var dictionary = [];
var valid_letter = /^[a-zA-Z]/;
var translates;
var init = function() {
  data = getOfflineDB();
  // init the lodifier
  initializeLodifier(data);
  buildDictionary();
}
var lodify = function() {
  var clear = document.getElementById("clear_text").value;
  if (clear.trim().length > 0) {
    var lodified = lodifier(clear);
    document.getElementById("lodified_text").value = lodified;
  } else {
    console.log("Empty Text")
    alert("Oooooppps ! Empty text not allowed.");
  }
}
function lodifier(data) {
  console.log("Lodifying :", data);
  var result="";
  var words = data.toLowerCase().trim().split(" ");
  for(var i=0;i<words.length;i++) {
    var translated = words[i].replace(/[^A-Za-z]/g, "");
    translated = translate_table.get(translated);
    translated = translated !== undefined ? translated : words[i];
    // todo: get a better algo for making sure removed punctuations are brought back
    result += translated + " ";
  }
  console.log("Lodified Term :",result);
  return result;
}
var reverseLodify = function() {
  var clear = document.getElementById("lodified_text").value;
  if (clear.trim().length > 0) {
    var reversi = reverseLodifier(clear);
    document.getElementById("clear_text").value = reversi;
  } else {
    console.log("Empty Text")
    alert("Oooooppps ! Empty text not allowed.");
  }
};
function reverseLodifier(data) {
  console.log("Reverse Lodifying :", data)
  var result = "";
  var words = data.toLowerCase().trim().split(" ");
  for(var i=0;i<words.length;i++) {
    var translated = words[i].replace(/[^A-Za-z]/g, "");
    translated = getKey(translated);
    translated = translated !== undefined ? translated : words[i];
    // todo: get a better algo for making sure removed punctuations are brought back
    result += translated + " ";
  }
  console.log("Reverse Lodified Term :",result);
  return result;
}
var getKey = function (word){
  var foundKey;
  for (var [key, value] of translate_table.entries()) {
    if (value === word) {
      foundKey = key;
      break;
    }
  }
  return foundKey;
};
function initializeLodifier(data) {
  buildTable(data);
}
function buildTable(data) {
   translate_table.clear();
   for(var i=0;i<data.length;i++) {
     translate_table.set(data[i]._id,data[i].lodi);
   }
  console.log("Translate Table :", translate_table);
}
function getOfflineDB() {
  var offlineDB = [];
  for(var i = 0;i<offline_terms.length;i += 1) {
    offlineDB.push({
      _id : offline_terms[i]._id,
      lodi : offline_terms[i].lodi,
      example : offline_terms[i].example,
      count : offline_terms[i].count,
      approved : offline_terms[i].approved,
      type : offline_terms[i].type,
      flagged : offline_terms[i].flagged,
    });
  };
  console.log("OfflineDB:", offlineDB);
  return offlineDB;
}
var offline_terms = [
  {"_id":"pare","lodi":"erps","example":"","approved":1,"count":0,"type":0,"flagged":0},
  {"_id":"pre","lodi":"erps","example":"","approved":1,"count":0,"type":0,"flagged":0},
  {"_id":"idol","lodi":"lodi","example":"","approved":1,"count":0,"type":0,"flagged":0},
  {"_id":"idols","lodi":"lodis","example":"","approved":1,"count":0,"type":0,"flagged":0},
  {"_id":"kain","lodi":"enka","example":"","approved":1,"count":0,"type":0,"flagged":0},
  {"_id":"kaen","lodi":"enka","example":"","approved":1,"count":0,"type":0,"flagged":0},
  {"_id":"salamat","lodi":"matsala","example":"","approved":1,"count":0,"type":0,"flagged":0},
  {"_id":"bro","lodi":"orb","example":"","approved":1,"count":0,"type":0,"flagged":0},
  {"_id":"bros","lodi":"orbs","example":"","approved":1,"count":0,"type":0,"flagged":0},
  {"_id":"brother","lodi":"orb","example":"","approved":1,"count":0,"type":0,"flagged":0},
  {"_id":"brothers","lodi":"orbs","example":"","approved":1,"count":0,"type":0,"flagged":0},
  {"_id":"malupit","lodi":"petmalu","example":"","approved":1,"count":0,"type":0,"flagged":0},
  {"_id":"malupet","lodi":"petmalu","example":"","approved":1,"count":0,"type":0,"flagged":0},
  {"_id":"ambulance","lodi":"ecnalubma","example":"","approved":1,"count":0,"type":0,"flagged":0},
  {"_id":"ambulansya","lodi":"ecnalubma","example":"","approved":1,"count":0,"type":0,"flagged":0},
  {"_id":"power","lodi":"werpa","example":"","approved":1,"count":0,"type":0,"flagged":0},
  {"_id":"pawer","lodi":"werpa","example":"","approved":1,"count":0,"type":0,"flagged":0},
  {"_id":"sarap","lodi":"rapsa","example":"","approved":1,"count":0,"type":0,"flagged":0},
  {"_id":"busog","lodi":"sogbu","example":"","approved":1,"count":0,"type":0,"flagged":0},
  {"_id":"broski","lodi":"orbski","example":"","approved":1,"count":0,"type":0,"flagged":0},
  {"_id":"girlfriend","lodi":"rema","example":"","approved":1,"count":0,"type":0,"flagged":0},
  {"_id":"mare","lodi":"rema","example":"","approved":1,"count":0,"type":0,"flagged":0}
];
function buildDictionary() {
  var main = document.createElement("ul");
  for (var i=0;i<data.length;i++) {
    var list = document.createElement("li");
    list.innerHTML = data[i]._id + " : " + data[i].lodi;
    main.appendChild(list);
  }
  document.getElementById("lodictionary").appendChild(main);
}


window.lodify = lodify;
window.reverseLodify = reverseLodify;
window.init = init;
// window.rebuildDictionary = rebuildDictionary;
