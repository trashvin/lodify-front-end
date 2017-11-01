!function(e){function o(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,o),i.l=!0,i.exports}var t={};o.m=e,o.c=t,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:n})},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,o){return Object.prototype.hasOwnProperty.call(e,o)},o.p="",o(o.s=0)}([function(e,o,t){"use strict";function n(e){if(e&&e.__esModule)return e;var o={};if(null!=e)for(var t in e)Object.prototype.hasOwnProperty.call(e,t)&&(o[t]=e[t]);return o.default=e,o}function i(){return p.login()}function r(){E();s.collection("dict").find().then(function(e){f=e,C(),0===f.length&&(f=T(),$("#offline").show()),a.initialize(f),b(f),L(),$("#offline").hide()}).catch(function(e){C(),$("#offline").show(),console.log(e),f=T(),b(f)})}t(1);var l=t(2),a=n(l),d=t(3),c=n(d),u=void 0,p=void 0,s=void 0,f=[],g=!1,m=function(){try{return console.log("connecting to server....."),u=window.stitch,p=new u.StitchClient("i-lodi-fy-uhhdc"),s=p.service("mongodb","mongodb-atlas").db("lodi"),!0}catch(e){return console.log("error :",e),!1}},v=function(){C(),$("#offline").show(),f=T(),a.initialize(f),b(f),(g=m())&&y()},y=function(){i().then(r)},h=function(){var e=a.getCounter();i().then(function(){e.forEach(function(e){_(e).then(function(o){console.log(e+" count updated :",o)}).catch(function(e){console.log("Failed Update",e)})},void 0)})},_=function(e){return s.collection("dict").updateOne({_id:e},{$inc:{count:1}},{upsert:!1})},b=function(){var e=E(),o=document.createElement("ul");if(o.id="dict_list",o.className="dictionary",f.sort(function(e,o){var t=e.lodi.toUpperCase(),n=o.lodi.toUpperCase();return t<n?-1:t>n?1:0}),f.forEach(function(t){var n=1===t.approved;if(e&&(n=!0),n){var i=document.createElement("li"),r=t.lodi+" : "+t._id;0===t.approved&&(r+=" **"),i.innerText=r,i.className="dictionary",o.appendChild(i)}},void 0),o.className="dictionary",document.getElementById("lodictionary").appendChild(o),e){var t=document.createElement("p");t.style="font-size:12pt; padding:10px",t.innerHTML="Note : Suggestions were included, if quries were online. ** indicates suggestions.",document.getElementById("lodictionary").appendChild(t)}},x=function(){var e=E("include_suggstions_1");console.log("Suggestions :",e);var o=document.getElementById("clear_text").value;if(o.trim().length>0){var t=a.lodify(o);document.getElementById("result_text").innerHTML=t,document.getElementById("result_text").className="p-2 lodified",$("#result_div").show()}else alert("Oooooppps ! Empty text not allowed.");g&&(h(),y())},w=function(){C(),b(f),a.rebuildTable(f,E())},E=function(){return document.getElementById("include_suggestions").checked},C=function(){try{for(var e=document.getElementById("lodictionary");e.hasChildNodes();)e.removeChild(e.firstChild)}catch(e){console.log(e)}},I=function(){try{for(var e=document.getElementById("top_list");e.hasChildNodes();)e.removeChild(e.firstChild)}catch(e){console.log(e)}},B=function(){var e=E("include_suggstions_1");console.log("Suggestions :",e);var o=document.getElementById("clear_text").value;if(o.trim().length>0){var t=a.reverseLodify(o);document.getElementById("result_text").innerHTML=t,document.getElementById("result_text").className="p-2 lodified",$("#result_div").show()}else alert("Oooooppps ! Empty text not allowed.");g&&(h(),y())},L=function(){console.log("Updating top list");var e=E(),o=O(f);o.sort(function(e,o){return o.count-e.count}),o=o.slice(0,15),console.log("Consolidated :",o),I();var t=document.createElement("p"),n=0,i=document.createElement("label");i.innerHTML="<span class='badge badge-light'>top </span> terms: ",i.className="top_five",t.appendChild(i),o.forEach(function(o){var i=1===o.approved;if(e&&(i=!0),i){var r=document.createElement("label"),l=""+o.lodi;0===o.approved&&(l+=" **"),l=l+" <span class='badge badge-light'>"+o.count+"</span>",r.innerHTML=l,r.className="top_five",n+=1,n<=10&&o.count>0&&t.appendChild(r)}}),document.getElementById("top_list").appendChild(t)},O=function(){var e=[];return f.forEach(function(o){var t=e.findIndex(function(e){return e.lodi===o.lodi});t>=0?e[t].count+=o.count:e.push(o)}),e},T=function(){var e=[];return c.offline_terms.forEach(function(o){e.push({_id:o._id,lodi:o.lodi,example:o.example,count:o.count,approved:o.approved,type:o.type,flagged:o.flagged})}),console.log("OfflineDB:",e),e};window.lodify=x,window.reverseLodify=B,window.init=v,window.rebuildDictionary=w},function(e,o){},function(e,o,t){"use strict";function n(e){e.forEach(function(e){l.set(e._id.toLowerCase(),e.lodi)}),console.log("Translate_Table",l)}function i(e){return e.trim().split(" ").map(function(e){return e.toLowerCase()})}Object.defineProperty(o,"__esModule",{value:!0});var r=function(){function e(e,o){var t=[],n=!0,i=!1,r=void 0;try{for(var l,a=e[Symbol.iterator]();!(n=(l=a.next()).done)&&(t.push(l.value),!o||t.length!==o);n=!0);}catch(e){i=!0,r=e}finally{try{!n&&a.return&&a.return()}finally{if(i)throw r}}return t}return function(o,t){if(Array.isArray(o))return o;if(Symbol.iterator in Object(o))return e(o,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),l=new Map,a=[],d=(o.initialize=function(e){console.log("translates from db",e),e=e.filter(function(e){return 1===e.approved}),n(e)},o.rebuildTable=function(e,o){o||(e=e.filter(function(e){return 1===e.approved})),l.clear(),n(e)},o.lodify=function(e){var o="",t=i(e);return a=[],t.forEach(function(e){console.log("element",e),e=e.replace(/[^A-Za-z]/g,"");var t=l.get(e);void 0!==t?a.push(e):t=e,console.log(t),o+=t+" "},void 0),o},o.reverseLodify=function(e){var o="",t=i(e);return a=[],t.forEach(function(e){console.log(e),e=e.replace(/[^A-Za-z]/g,"");var t=d(e);console.log("reversi ",t),void 0!==t?a.push(t):t=e,o+=t+" "},void 0),o},function(e){var o=void 0,t=!0,n=!1,i=void 0;try{for(var a,d=l.entries()[Symbol.iterator]();!(t=(a=d.next()).done);t=!0){var c=r(a.value,2),u=c[0];if(c[1].trim().toLowerCase()===e.trim().toLowerCase()){o=u;break}}}catch(e){n=!0,i=e}finally{try{!t&&d.return&&d.return()}finally{if(n)throw i}}return o});o.getCounter=function(){return console.log("Counter :",a),a}},function(e,o,t){"use strict";Object.defineProperty(o,"__esModule",{value:!0});o.offline_terms=[{_id:"pare",lodi:"erps",example:"",approved:1,count:0,type:0,flagged:0},{_id:"pre",lodi:"erps",example:"",approved:1,count:0,type:0,flagged:0},{_id:"idol",lodi:"lodi",example:"",approved:1,count:0,type:0,flagged:0},{_id:"idols",lodi:"lodis",example:"",approved:1,count:0,type:0,flagged:0},{_id:"kain",lodi:"enka",example:"",approved:1,count:0,type:0,flagged:0},{_id:"kaen",lodi:"enka",example:"",approved:1,count:0,type:0,flagged:0},{_id:"salamat",lodi:"matsala",example:"",approved:1,count:0,type:0,flagged:0},{_id:"bro",lodi:"orb",example:"",approved:1,count:0,type:0,flagged:0},{_id:"bros",lodi:"orbs",example:"",approved:1,count:0,type:0,flagged:0},{_id:"brother",lodi:"orb",example:"",approved:1,count:0,type:0,flagged:0},{_id:"brothers",lodi:"orbs",example:"",approved:1,count:0,type:0,flagged:0},{_id:"malupit",lodi:"petmalu",example:"",approved:1,count:0,type:0,flagged:0},{_id:"malupet",lodi:"petmalu",example:"",approved:1,count:0,type:0,flagged:0},{_id:"ambulance",lodi:"ecnalubma",example:"",approved:1,count:0,type:0,flagged:0},{_id:"ambulansya",lodi:"ecnalubma",example:"",approved:1,count:0,type:0,flagged:0},{_id:"power",lodi:"werpa",example:"",approved:1,count:0,type:0,flagged:0},{_id:"pawer",lodi:"werpa",example:"",approved:1,count:0,type:0,flagged:0},{_id:"sarap",lodi:"rapsa",example:"",approved:1,count:0,type:0,flagged:0},{_id:"busog",lodi:"sogbu",example:"",approved:1,count:0,type:0,flagged:0},{_id:"broski",lodi:"orbski",example:"",approved:1,count:0,type:0,flagged:0},{_id:"girlfriend",lodi:"rema",example:"",approved:1,count:0,type:0,flagged:0},{_id:"mare",lodi:"rema",example:"",approved:1,count:0,type:0,flagged:0}]}]);