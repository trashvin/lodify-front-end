/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__styles_styles_scss__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__styles_styles_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__styles_styles_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__js_lodifier__ = __webpack_require__(2);
var _this = this;



let stitch;
let client;
let db;
let data = [];
let online = false;
let check_image_index;

const connect = () => {
  try {
    console.log("connecting to server.....");
    stitch = window.stitch;
    client = new stitch.StitchClient("i-lodi-fy-uhhdc");
    db = client.service("mongodb", "mongodb-atlas").db("lodi");
    return true;
  } catch (err) {
    console.log("error :", err);
    return false;
  }
};
const init = () => {
  // clear dictionary display and initially show offline
  clear_lodictionary();
  $("#offline").show();
  data = getOfflineDB();
  // init the lodifier
  __WEBPACK_IMPORTED_MODULE_1__js_lodifier__["b" /* initialize */](data);
  //show dictionary
  buildDictionary(data);
  // try to get online data
  online = connect();
  if (online) {
    loadOnlineTerms();
  }
};
function stitchLogin() {
  return client.login();
}
const loadOnlineTerms = () => {
  stitchLogin().then(getTerms);
};

function getTerms() {
  const include = includeSuggestions();
  db.collection("dict").find().then(result => {
    data = result;
    clear_lodictionary();
    if (data.length === 0) {
      data = getOfflineDB();
      $("#offline").show();
    }
    __WEBPACK_IMPORTED_MODULE_1__js_lodifier__["b" /* initialize */](data);
    buildDictionary(data);
    $("#offline").hide();
  }).catch(err => {
    clear_lodictionary();
    $("#offline").show();
    console.log(err);
    data = getOfflineDB();
    buildDictionary(data);
  });
}
const addTerm = (term, lodi) => {
  return db.collection("dict").insertOne({ _id: term, lodi: lodi, meaning: "", approved: 0, counts: 0 });
};
const add = () => {
  const lodi = document.getElementById("new_term").value;
  const term = document.getElementById("equivalent").value;
  console.log(term + "|" + lodi);
  stitchLogin().then(() => {
    addTerm(term, lodi).then(() => {
      console.log("Adding Done");
      document.getElementById("equivalent").value = "";
      document.getElementById("new_term").value = "";
      $("#ind_1").toggle();
      $("#ind_1A").toggle();
      $("#submit_new").toggle();
      getTerms();
    }).catch(err => {
      console.log("Failed", err);
      alert("Failed adding the word.");
    });
  }).catch(err => {
    console.log(err);
    alert("Failed adding the word.");
  });
};
const updateCount = () => {
  const counts = __WEBPACK_IMPORTED_MODULE_1__js_lodifier__["getCounter"]();
  stitchLogin.login().then(() => {
    for (const word in counts) {
      update(word).then(() => {
        console.log(`${word} count updated`);
      }).catch(err => {
        console.log("Failed Update", err);
      });
    }
  });
};
const update = term => {
  return db.collection("dict").updateOne({ _id: term }, { $inc: { counts: 1 } }, { upsert: false });
};

const buildDictionary = () => {
  const include = includeSuggestions();
  const list = document.createElement("ul");
  list.id = "dict_list";
  list.className = "dictionary";
  data.sort((a, b) => {
    const nameA = a.lodi.toUpperCase(); // ignore upper and lowercase
    const nameB = b.lodi.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names must be equal
    return 0;
  });
  data.forEach(function (element) {
    let approved = element.approved === 1 ? true : false;
    if (include) {
      approved = true;
    }
    if (approved) {
      const item = document.createElement("li");
      let entry = `${element.lodi} : ${element._id}`;
      if (element.approved === 0) {
        entry = entry + " **";
      }
      item.innerText = entry;
      item.className = "dictionary";
      list.appendChild(item);
    }
  }, _this);

  list.className = "dictionary";
  document.getElementById("lodictionary").appendChild(list);
  if (include) {
    const note = document.createElement("p");
    note.style = "font-size:12pt; padding:10px";
    note.innerHTML = "Note : Suggestions were included, if quries were online. ** indicates suggestions.";
    document.getElementById("lodictionary").appendChild(note);
  }
};
function lodify() {
  const include = includeSuggestions("include_suggstions_1");
  console.log("Suggestions :", include);
  const clear = document.getElementById("clear_text").value;
  if (clear.trim().length > 0) {
    const lodified = __WEBPACK_IMPORTED_MODULE_1__js_lodifier__["c" /* lodify */](clear);
    document.getElementById("result_text").innerHTML = lodified;
    document.getElementById("result_text").className = "p-2 lodified";
    $("#result_div").show();
    updateCount();
  } else {
    alert("Oooooppps ! Empty text not allowed.");
  }
}
const rebuildDictionary = () => {
  clear_lodictionary();
  buildDictionary(data);
  __WEBPACK_IMPORTED_MODULE_1__js_lodifier__["d" /* rebuildTable */](data, includeSuggestions("include_suggstions_1"));
};

const includeSuggestions = () => {
  return document.getElementById("include_suggestions").checked;
};

const clear_lodictionary = () => {
  try {
    const dict_div = document.getElementById("lodictionary");
    // remove the child
    while (dict_div.hasChildNodes()) {
      dict_div.removeChild(dict_div.firstChild);
    }
  } catch (e) {
    console.log(e);
  }
};

function reverseLodify() {
  const include = includeSuggestions("include_suggstions_1");
  console.log("Suggestions :", include);
  const clear = document.getElementById("clear_text").value;
  if (clear.trim().length > 0) {
    const lodified = __WEBPACK_IMPORTED_MODULE_1__js_lodifier__["e" /* reverseLodify */](clear);
    document.getElementById("result_text").innerHTML = lodified;
    document.getElementById("result_text").className = "p-2 lodified";
    $("#result_div").show();
    updateCount();
  } else {
    alert("Oooooppps ! Empty text not allowed.");
  }
}

const showCheckImage = () => {
  check_image_index = Math.round(Math.random() * 1000 % 9);
  document.getElementById("img_check").style.backgroundRepeat = "no-repeat";
  console.log("Random:", check_image_index);
  const image = `check_${check_image_index}.gif`;
  document.getElementById("img_check").style.backgroundImage = "url('./images/" + image + "')";
};
const verifyCheck = val => {
  const checks = { 0: 30, 1: 23, 2: 15, 3: 36, 4: 9, 5: 86, 6: 11, 7: 35, 8: 44, 9: 52 };
  console.log(data);
  console.log(checks[check_image_index]);
  if (checks[check_image_index] === +data) {
    return true;
  } else {
    return false;
  }
};

const getOfflineDB = () => {
  const offlineDB = [];
  for (const key in offlineTerms) {
    offlineDB.push({
      _id: key,
      lodi: offlineTerms[key],
      meaning: "",
      approved: 1,
      counts: 0
    });
  }
  console.log("OfflineDB:", offlineDB);
  return offlineDB;
};
const offlineTerms = {
  pare: "erp",
  pre: "erp",
  idol: "lodi",
  idols: "lodis",
  kain: "enka",
  kaen: "enka",
  salamat: "matsala",
  bro: "orb",
  bros: "orbs",
  brother: "orb",
  brothers: "orbs",
  malupit: "petmalu",
  malupet: "petmalu",
  ambulance: "ecnalubma",
  ambulansya: "ecnalubma"
};

//require("expose-loader?init");
//exports["init"] = init;
//module.exports = app;
window.lodify = lodify;
window.reverseLodify = reverseLodify;
window.init = init;
window.rebuildDictionary = rebuildDictionary;
window.add = add;
window.showCheckImage = showCheckImage;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = initialize;
/* harmony export (immutable) */ __webpack_exports__["d"] = rebuildTable;
/* harmony export (immutable) */ __webpack_exports__["c"] = lodify;
/* harmony export (immutable) */ __webpack_exports__["e"] = reverseLodify;
const translate_table = new Map();
const dictionary = [];
const valid_letter = /^[a-zA-Z]/;
let translates;
let counter = [];
function initialize(data) {
  // translates= stitch.getAllTerms();
  console.log("translates from db", data);
  data = data.filter(i => i.approved === 1);
  buildTable(data);
}
function rebuildTable(data, include) {
  if (!include) {
    data = data.filter(i => i.approved === 1);
  }
  translate_table.clear();
  buildTable(data);
}
function buildTable(data) {
  data.forEach(element => {
    translate_table.set(element._id.toLowerCase(), element.lodi);
  });
  console.log("Translate_Table", translate_table);
}

function splitAndLower(data) {
  const broken_text = data.trim().split(" ");
  return broken_text.map(word => word.toLowerCase());
}
function lodify(data) {

  let result = "";
  const words = splitAndLower(data);
  counter = [];

  words.forEach(element => {
    console.log("element", element);
    element = element.replace(/[^A-Za-z]/g, "");
    let translated_word = translate_table.get(element);
    if (translated_word !== undefined) {
      counter.push(element);
    } else {
      translated_word = element;
    }
    // translated_word = translated_word !== undefined ? translated_word : element;
    // todo: get a better algo to do this
    // make sure to bring back the stripped letter at the end
    // ex pare! => erp!
    // if( translated_word.length < element.length ) {
    //    translated_word += element[ element.length - 1];
    // }
    console.log(translated_word);
    result += translated_word + " ";
  }, this);

  return result;
}
function reverseLodify(data) {

  let result = "";
  const words = splitAndLower(data);
  counter = [];

  words.forEach(element => {
    console.log("element", element);
    element = element.replace(/[^A-Za-z]/g, "");
    let translated_word = getKey(element);
    console.log("reversi ", translated_word);
    if (translated_word === undefined) {
      counter.push(translated_word);
    } else {
      translated_word = element;
    }
    // translated_word = translated_word !== undefined ? translated_word : element;
    // todo: get a better algo to do this
    // make sure to bring back the stripped letter at the end
    // ex pare! => erp!
    // if( translated_word.length < element.length ) {
    //    translated_word += element[ element.length - 1];
    // }
    console.log(translated_word);
    result += translated_word + " ";
  }, this);
  return result;
}
const getKey = word => {
  let foundKey;
  for (const [key, value] of translate_table.entries()) {
    console.log(key, value);
    if (value.trim().toLowerCase() === word.trim().toLowerCase()) {
      foundKey = key;
      break;
    }
  }
  return foundKey;
};
const getCounter = () => {
  return counter;
};

// export function getOfflineDB() {
//   const offlineDB = [];
//   for (const key in offlineTerms) {
//     offlineDB.push({
//       _id: key,
//       lodi: offlineTerms[key],
//       meaning: "",
//       approved: 1,
//       counts: 0
//     });
//   }
//   console.log("OfflineDB:", offlineDB);
//   return offlineDB;
// }
// const offlineTerms = {
//   pare: "erp",
//   pre: "erp",
//   idol: "lodi",
//   idols: "lodis",
//   kain: "enka",
//   kaen: "enka",
//   salamat: "matsala",
//   bro: "orb",
//   bros: "orbs",
//   brother: "orb",
//   brothers: "orbs",
//   malupit: "petmalu",
//   malupet: "petmalu",
//   ambulance: "ecnalubma",
//   ambulansya: "ecnalubma"
// };

/***/ })
/******/ ]);