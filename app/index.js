import "./styles/styles.scss";
import * as lodifier from "./js/lodifier";
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
  } catch ( err) {
    console.log("error :", err);
    return false;
  }
}
const init = () => {
  // clear dictionary display and initially show offline
  clear_lodictionary();
  $("#offline").show();
  data = getOfflineDB();
  // init the lodifier
  lodifier.initialize(data);
  //show dictionary
  buildDictionary(data);
  // try to get online data
  online = connect();
  if ( online ) {
    loadOnlineTerms();   
  }
}
function stitchLogin() {
  return client.login();
}
const loadOnlineTerms = () => {
  stitchLogin().then(getTerms);
}
function getTerms() {
  const include = includeSuggestions();
  db
    .collection("dict")
    .find()
    .then(result => {
      data = result;
      clear_lodictionary();
      if (data.length === 0) {
        data = getOfflineDB();
        $("#offline").show();
      }
      lodifier.initialize(data);
      buildDictionary(data);
      getTopFiveTerms();
      $("#offline").hide();
    })
    .catch(err => {
      clear_lodictionary();
      $("#offline").show();
      console.log(err);
      data = getOfflineDB();
      buildDictionary(data);
    });
}
const addTerm = (term, lodi) => {
  return db
    .collection("dict")
    .insertOne({ _id: term, lodi: lodi, meaning: "", approved: 0, counts: 0 });
};
const add =() => {
  const lodi = document.getElementById("new_term").value;
  const term = document.getElementById("equivalent").value;
  console.log(term + "|" + lodi);
  stitchLogin()
    .then(() => {
      addTerm(term, lodi)
        .then(() => {
          console.log("Adding Done");
          document.getElementById("equivalent").value = "";
          document.getElementById("new_term").value = "";
          $("#ind_1").toggle();
          $("#ind_1A").toggle();
          $("#submit_new").toggle();
          getTerms();
        })
        .catch(err => {
          console.log("Failed", err);
          alert("Failed adding the word.");
        });
    })
    .catch(err => {
      console.log(err);
      alert("Failed adding the word.");
    });
}
const updateCount = () => {
  const counts = lodifier.getCounter();
  stitchLogin().then(()=> {
    counts.forEach(word => {
      update(word).then(res => {
        console.log(`${word} count updated :`,res);
      }).catch(err => {
        console.log("Failed Update", err);
      });
    },this);
  });
}
const update = (term) => {
  return db
  .collection("dict")
  .updateOne({_id:term},{$inc:{counts:1}},{upsert:false});
}
const buildDictionary = () => {
  const include = includeSuggestions();
  const list = document.createElement("ul");
  list.id = "dict_list";
  list.className="dictionary";
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
  data.forEach(function(element) {
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
      item.className="dictionary";
      list.appendChild(item);
    }
  }, this);

  list.className = "dictionary";
  document.getElementById("lodictionary").appendChild(list);
  if (include) {
    const note = document.createElement("p");
    note.style = "font-size:12pt; padding:10px";
    note.innerHTML =
      "Note : Suggestions were included, if quries were online. ** indicates suggestions.";
    document.getElementById("lodictionary").appendChild(note);
  }
};
const lodify = () => {
  const include = includeSuggestions("include_suggstions_1");
  console.log("Suggestions :", include);
  const clear = document.getElementById("clear_text").value;
  if (clear.trim().length > 0) {
    const lodified = lodifier.lodify(clear);
    document.getElementById("result_text").innerHTML = lodified;
    document.getElementById("result_text").className = "p-2 lodified";
    $("#result_div").show();
    updateCount();  
  } else {
    alert("Oooooppps ! Empty text not allowed.");
  }
  if ( online ) {
    loadOnlineTerms(); 
  }
}
const rebuildDictionary = () => {
  clear_lodictionary();
  buildDictionary(data);
  lodifier.rebuildTable(data, includeSuggestions("include_suggstions_1"));
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
const clearTopFive = () => {
  try {
    const top_div = document.getElementById("top_five");
    // remove the child
    while (top_div.hasChildNodes()) {
      top_div.removeChild(top_div.firstChild);
    }
  } catch (e) {
    console.log(e);
  }
};
const reverseLodify = () => {
  const include = includeSuggestions("include_suggstions_1");
  console.log("Suggestions :", include);
  const clear = document.getElementById("clear_text").value;
  if (clear.trim().length > 0) {
    const lodified = lodifier.reverseLodify(clear);
    document.getElementById("result_text").innerHTML = lodified;
    document.getElementById("result_text").className = "p-2 lodified";
    $("#result_div").show();
    updateCount();
  } else {
    alert("Oooooppps ! Empty text not allowed.");
  }
  if ( online ) {
    loadOnlineTerms(); 
  }
}
const getTopFiveTerms = () => {
  console.log("updating top 5");
  const include = includeSuggestions();
  const consolidated = consolidate(data);
  consolidated.sort((a,b) => {
    return b.counts - a.counts;
  });
  //get 10 in case suggestins were included
  const top_five = consolidated.slice(0,10);
  console.log("10 :",top_five);
  clearTopFive();
  const top = document.createElement("p");
  // top.className = "dictionary";
  // top.id = "top_list";
  let count = 0;
  top_five.forEach( word => {
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
      entry = entry + ` <span class='badge badge-light'>${word.counts}</span>`;
      // const span = document.createElement("span");
      // span.className ="badge badge-light";
      // span.innerText= +word.counts;
      // item.appendChild(span);
      item.innerHTML = entry;
      item.className="top_five";
      count += 1;
      if ( count <= 5 ) {
        top.appendChild(item);
      }
      
    }
  });
  document.getElementById("top_five").appendChild(top);
}
const consolidate = () => {
  let result = [];
  data.forEach( word => {
    const found = result.findIndex(i => i.lodi === word.lodi);
    if ( found >= 0) {
      result[found].counts += word.counts;
    } else {
      result.push(word);
    }
  });
  return result;
};
const showCheckImage = () => {
  check_image_index =Math.round( (Math.random() * 1000) % 9);
  document.getElementById("img_check").style.backgroundRepeat = "no-repeat";
  console.log("Random:",check_image_index);
  const image = `check_${check_image_index}.gif`;
  document.getElementById("img_check").style.backgroundImage = "url('./images/"+ image +"')";
}
const verifyCheck = (val) => {
  const checks = {0:30,1:23,2:15,3:36,4:9,5:86,6:11,7:35,8:44,9:52};
  console.log(data);
  console.log(checks[check_image_index]);
  if ( checks[check_image_index] === +data) {
    return true;
  } else {
    return false;
  }
}
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
}
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
