const translate_table = new Map();
const dictionary = [];
const valid_letter = /^[a-zA-Z]/;
let translates;
let counter = [];
export const initialize = (data) => {
  // translates= stitch.getAllTerms();
  console.log("translates from db", data);
  data = data.filter(i => i.approved === 1);
  buildTable(data);
}
export const rebuildTable = (data, include) => {
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
export const lodify = (data)=> {

  let result = "";
  const words = splitAndLower(data);
  counter = [];

  words.forEach(element => {
    console.log("element", element);
    element = element.replace(/[^A-Za-z]/g, "");
    let translated_word = translate_table.get(element);
    if ( translated_word !== undefined ) {
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
export const reverseLodify = (data) => {

  let result = "";
  const words = splitAndLower(data);
  counter = [];

  words.forEach(element => {
    console.log(element);
    element = element.replace(/[^A-Za-z]/g, "");
    let translated_word = getKey(element);
    console.log("reversi ", translated_word);
    if ( translated_word !== undefined ) {
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
  }, this);
  return result;
}
const getKey = word => {
  let foundKey;
  for (const [key, value] of translate_table.entries()) {
    if (value.trim().toLowerCase() === word.trim().toLowerCase()) {
      foundKey = key;
      break;
    }
  }
  return foundKey;
};
export const getCounter = () => {
  console.log("Counter :", counter);
  return counter;
}

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
