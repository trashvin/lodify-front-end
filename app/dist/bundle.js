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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lodifier__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__data__ = __webpack_require__(3);
var _this = this;




let stitch;
let client;
let db;
let data = [];
let online = false;
let check_image_index;

const connect = function () {
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
const init = function () {
  // clear dictionary display and initially show offline
  clear_lodictionary();
  $("#offline").show();
  data = getOfflineDB();
  // init the lodifier
  __WEBPACK_IMPORTED_MODULE_1__lodifier__["b" /* initialize */](data);
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
const loadOnlineTerms = function () {
  stitchLogin().then(getTerms);
};
function getTerms() {
  const include = includeSuggestions();
  db.collection("dict").find().then(function (result) {
    data = result;
    clear_lodictionary();
    if (data.length === 0) {
      data = getOfflineDB();
      $("#offline").show();
    }
    __WEBPACK_IMPORTED_MODULE_1__lodifier__["b" /* initialize */](data);
    buildDictionary(data);
    getTopTerms();
    $("#offline").hide();
  }).catch(function (err) {
    clear_lodictionary();
    $("#offline").show();
    console.log(err);
    data = getOfflineDB();
    buildDictionary(data);
  });
}
const addTerm = function (term, lodi) {
  return db.collection("dict").insertOne({ _id: term, lodi: lodi, example: "", approved: 0, count: 0, flagged: 0 });
};
const add = function () {
  let lodi = document.getElementById("new_term").value;
  let term = document.getElementById("equivalent").value;
  // remove invalid chars
  term = term.replace(/[^A-Za-z]/g, "");
  lodi = lodi.replace(/[^A-Za-z]/g, "");
  console.log(term + "|" + lodi);
  stitchLogin().then(function () {
    addTerm(term.toLowerCase(), lodi.toLowerCase()).then(function () {
      console.log("Adding Done");
      document.getElementById("equivalent").value = "";
      document.getElementById("new_term").value = "";
      $("#ind_1").toggle();
      $("#ind_1A").toggle();
      $("#submit_new").toggle();
      getTerms();
    }).catch(function (err) {
      console.log("Failed", err);
      alert("Failed adding the word.");
    });
  }).catch(function (err) {
    console.log(err);
    alert("Failed adding the word.");
  });
};
const updateCount = function () {
  const counts = __WEBPACK_IMPORTED_MODULE_1__lodifier__["a" /* getCounter */]();
  stitchLogin().then(function () {
    counts.forEach(function (word) {
      update(word).then(function (res) {
        console.log(`${word} count updated :`, res);
      }).catch(function (err) {
        console.log("Failed Update", err);
      });
    }, _this);
  });
};
const update = function (term) {
  return db.collection("dict").updateOne({ _id: term }, { $inc: { count: 1 } }, { upsert: false });
};
const buildDictionary = function () {
  const include = includeSuggestions();
  const list = document.createElement("ul");
  list.id = "dict_list";
  list.className = "dictionary";
  data.sort(function (a, b) {
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
const lodify = function () {
  const include = includeSuggestions("include_suggstions_1");
  console.log("Suggestions :", include);
  const clear = document.getElementById("clear_text").value;
  if (clear.trim().length > 0) {
    const lodified = __WEBPACK_IMPORTED_MODULE_1__lodifier__["c" /* lodify */](clear);
    document.getElementById("result_text").innerHTML = lodified;
    document.getElementById("result_text").className = "p-2 lodified";
    $("#result_div").show();
    updateCount();
  } else {
    alert("Oooooppps ! Empty text not allowed.");
  }
  if (online) {
    loadOnlineTerms();
  }
};
const rebuildDictionary = function () {
  clear_lodictionary();
  buildDictionary(data);
  __WEBPACK_IMPORTED_MODULE_1__lodifier__["d" /* rebuildTable */](data, includeSuggestions());
};
const includeSuggestions = function () {
  return document.getElementById("include_suggestions").checked;
};
const clear_lodictionary = function () {
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
const clearTopList = function () {
  try {
    const top_div = document.getElementById("top_list");
    // remove the child
    while (top_div.hasChildNodes()) {
      top_div.removeChild(top_div.firstChild);
    }
  } catch (e) {
    console.log(e);
  }
};
const reverseLodify = function () {
  const include = includeSuggestions("include_suggstions_1");
  console.log("Suggestions :", include);
  const clear = document.getElementById("clear_text").value;
  if (clear.trim().length > 0) {
    const lodified = __WEBPACK_IMPORTED_MODULE_1__lodifier__["e" /* reverseLodify */](clear);
    document.getElementById("result_text").innerHTML = lodified;
    document.getElementById("result_text").className = "p-2 lodified";
    $("#result_div").show();
    updateCount();
  } else {
    alert("Oooooppps ! Empty text not allowed.");
  }
  if (online) {
    loadOnlineTerms();
  }
};
const getTopTerms = function () {
  console.log("Updating top list");
  const include = includeSuggestions();
  let consolidated = consolidate(data);
  consolidated.sort(function (a, b) {
    return b.count - a.count;
  });
  consolidated = consolidated.slice(0, 15);
  console.log("Consolidated :", consolidated);
  clearTopList();
  const top = document.createElement("p");
  // top.className = "dictionary";
  // top.id = "top_list";
  let count = 0;
  // let entry = "<span class='badge badge-light'>top terms :</span>"
  const label = document.createElement("label");
  label.innerHTML = "<span class='badge badge-light'>top </span> terms: ";
  label.className = "top_five";
  top.appendChild(label);
  consolidated.forEach(function (word) {
    let approved = word.approved === 1 ? true : false;
    if (include) {
      approved = true;
    }
    if (approved) {
      const item = document.createElement("label");
      let entry = `${word.lodi}`;
      if (word.approved === 0) {
        entry = entry + " **";
      }
      entry = entry + ` <span class='badge badge-light'>${word.count}</span>`;
      // const span = document.createElement("span");
      // span.className ="badge badge-light";
      // span.innerText= +word.counts;
      // item.appendChild(span);
      item.innerHTML = entry;
      item.className = "top_five";
      count += 1;
      if (count <= 10 && word.count > 0) {
        top.appendChild(item);
      }
    }
  });
  document.getElementById("top_list").appendChild(top);
};
const consolidate = function () {
  let result = [];
  data.forEach(function (word) {
    const found = result.findIndex(function (i) {
      return i.lodi === word.lodi;
    });
    if (found >= 0) {
      result[found].count += word.count;
    } else {
      result.push(word);
    }
  });
  return result;
};
const showCheckImage = function () {
  check_image_index = Math.round(Math.random() * 1000 % 9);
  document.getElementById("img_check").style.backgroundRepeat = "no-repeat";
  console.log("Random:", check_image_index);
  const image = `check_${check_image_index}.gif`;
  document.getElementById("img_check").style.backgroundImage = "url('./images/" + image + "')";
};
const verifyCheck = function (val) {
  const checks = { 0: 30, 1: 23, 2: 15, 3: 36, 4: 9, 5: 86, 6: 11, 7: 35, 8: 44, 9: 52 };
  console.log(checks[check_image_index]);
  if (checks[check_image_index] === +data) {
    return true;
  } else {
    return false;
  }
};
const getOfflineDB = function () {
  const offlineDB = [];
  __WEBPACK_IMPORTED_MODULE_2__data__["a" /* offline_terms */].forEach(function (term) {
    offlineDB.push({
      _id: term._id,
      lodi: term.lodi,
      example: term.example,
      count: term.count,
      approved: term.approved,
      type: term.type,
      flagged: term.flagged
    });
  });
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
var _this = this;

const translate_table = new Map();
const dictionary = [];
const valid_letter = /^[a-zA-Z]/;
let translates;
let counter = [];
const initialize = function (data) {
  // translates= stitch.getAllTerms();
  console.log("translates from db", data);
  data = data.filter(function (i) {
    return i.approved === 1;
  });
  buildTable(data);
};
/* harmony export (immutable) */ __webpack_exports__["b"] = initialize;

const rebuildTable = function (data, include) {
  if (!include) {
    data = data.filter(function (i) {
      return i.approved === 1;
    });
  }
  translate_table.clear();
  buildTable(data);
};
/* harmony export (immutable) */ __webpack_exports__["d"] = rebuildTable;

function buildTable(data) {
  data.forEach(function (element) {
    translate_table.set(element._id.toLowerCase(), element.lodi);
  });
  console.log("Translate_Table", translate_table);
}

function splitAndLower(data) {
  const broken_text = data.trim().split(" ");
  return broken_text.map(function (word) {
    return word.toLowerCase();
  });
}
const lodify = function (data) {

  let result = "";
  const words = splitAndLower(data);
  counter = [];

  words.forEach(function (element) {
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
  }, _this);

  return result;
};
/* harmony export (immutable) */ __webpack_exports__["c"] = lodify;

const reverseLodify = function (data) {

  let result = "";
  const words = splitAndLower(data);
  counter = [];

  words.forEach(function (element) {
    console.log(element);
    element = element.replace(/[^A-Za-z]/g, "");
    let translated_word = getKey(element);
    console.log("reversi ", translated_word);
    if (translated_word !== undefined) {
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
    result += translated_word + " ";
  }, _this);
  return result;
};
/* harmony export (immutable) */ __webpack_exports__["e"] = reverseLodify;

const getKey = function (word) {
  let foundKey;
  for (const [key, value] of translate_table.entries()) {
    if (value.trim().toLowerCase() === word.trim().toLowerCase()) {
      foundKey = key;
      break;
    }
  }
  return foundKey;
};
const getCounter = function () {
  console.log("Counter :", counter);
  return counter;
};
/* harmony export (immutable) */ __webpack_exports__["a"] = getCounter;


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

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const offline_terms = [{ "_id": "pare", "lodi": "erps", "example": "", "approved": 1, "count": 0, "type": 0, "flagged": 0 }, { "_id": "pre", "lodi": "erps", "example": "", "approved": 1, "count": 0, "type": 0, "flagged": 0 }, { "_id": "idol", "lodi": "lodi", "example": "", "approved": 1, "count": 0, "type": 0, "flagged": 0 }, { "_id": "idols", "lodi": "lodis", "example": "", "approved": 1, "count": 0, "type": 0, "flagged": 0 }, { "_id": "kain", "lodi": "enka", "example": "", "approved": 1, "count": 0, "type": 0, "flagged": 0 }, { "_id": "kaen", "lodi": "enka", "example": "", "approved": 1, "count": 0, "type": 0, "flagged": 0 }, { "_id": "salamat", "lodi": "matsala", "example": "", "approved": 1, "count": 0, "type": 0, "flagged": 0 }, { "_id": "bro", "lodi": "orb", "example": "", "approved": 1, "count": 0, "type": 0, "flagged": 0 }, { "_id": "bros", "lodi": "orbs", "example": "", "approved": 1, "count": 0, "type": 0, "flagged": 0 }, { "_id": "brother", "lodi": "orb", "example": "", "approved": 1, "count": 0, "type": 0, "flagged": 0 }, { "_id": "brothers", "lodi": "orbs", "example": "", "approved": 1, "count": 0, "type": 0, "flagged": 0 }, { "_id": "malupit", "lodi": "petmalu", "example": "", "approved": 1, "count": 0, "type": 0, "flagged": 0 }, { "_id": "malupet", "lodi": "petmalu", "example": "", "approved": 1, "count": 0, "type": 0, "flagged": 0 }, { "_id": "ambulance", "lodi": "ecnalubma", "example": "", "approved": 1, "count": 0, "type": 0, "flagged": 0 }, { "_id": "ambulansya", "lodi": "ecnalubma", "example": "", "approved": 1, "count": 0, "type": 0, "flagged": 0 }, { "_id": "power", "lodi": "werpa", "example": "", "approved": 1, "count": 0, "type": 0, "flagged": 0 }, { "_id": "pawer", "lodi": "werpa", "example": "", "approved": 1, "count": 0, "type": 0, "flagged": 0 }, { "_id": "sarap", "lodi": "rapsa", "example": "", "approved": 1, "count": 0, "type": 0, "flagged": 0 }, { "_id": "busog", "lodi": "sogbu", "example": "", "approved": 1, "count": 0, "type": 0, "flagged": 0 }, { "_id": "broski", "lodi": "orbski", "example": "", "approved": 1, "count": 0, "type": 0, "flagged": 0 }, { "_id": "girlfriend", "lodi": "rema", "example": "", "approved": 1, "count": 0, "type": 0, "flagged": 0 }, { "_id": "mare", "lodi": "rema", "example": "", "approved": 1, "count": 0, "type": 0, "flagged": 0 }];
/* harmony export (immutable) */ __webpack_exports__["a"] = offline_terms;


/***/ })
/******/ ]);