const CNevents = {
    "CN: 24/6/21 ~ 8/7/21":"Inscription of Labyrinth",
    "CN: 14/3/21 ~ 11/4/21":"Echo Aria",
    "CN: 1/10/20 ~ 29/10/20":"Firn Night",
    "CN: 22/7/21 ~ 19/8/21":"The Last Spark",
    "CN: 27/11/20 ~ 24/12/20":"Fake Ascension",
    "CN: 1/6/21 ~ 29/6/21":"Inscription Of Labyrinth",
    "CN: 5/12/19 ~11/12/19":"CN Launch",
    "CN: 14/3/20 ~ 21/3/20":"Fallen Star",
    "CN: 14/8/20 ~ 11/9/20":"Grand Blue",
    "CN RE: 15/7/20 ~ 29/7/20":"The Last Spark",
    "CN: 4/2/21 ~ 25/2/21":"Untold Naraka",
    "CN: 10/6/20 ~ 9/7/20":"Kowloong Metropolis",
    "CN: 15/7/21 ~ 12/8/21":"The Last Spark",
    "CN: 5/12/19":"CN Launch",
    "CN: 20/12/19 ~ 31/12/19":"Frozen Darkness",
    "CN: 8/4/21 ~ 26/5/21":"Imprisoned Sight",
    "CN: 26/11/20 ~ 4/1/21":"Fake Ascension",
    "CN: 30/9/21 ~ 1/11/21":"The Survival Lucem",
    "CN: 9/7/20 ~ 6/8/20":"Kowloong Metropolis",
    "CN RE: 15/7/21 ~ 29/7/21":"The Last Spark",
    "CN: 1/10/21 ~ 29/10/21":"The Survival Lucem",
    "CN: 20/5/20 ~ 18/6/20":"Nona Ouroboros",
    "CN: 9/7/20 ~ 6/8/20":"Kowloong Metropolis",
    "CN RE: 15/7/21 ~ 29/7/21":"The Last Spark",
    "CN: 11/3/22 ~ 8/4/22":"???",
    "CN: 20/1/20 ~ 29/1/20":"Frozen Darkness",
    "CN: 19/8/20 ~ 16/9/20":"Grand Blue",
    "CN RE: 15/7/21 ~ 29/7/21":"The Last Spark",
    "CN: 1/5/21 ~29/5/21":"Imprisoned Sight",
    "CN: 31/12/21 ~ 27/1/22":"Wandering Dream with Whale",
    "CN: 29/10/20 ~ 19/11/20":"Lost Chapter",
    "CN: 27/1/22 ~ 25/2/22":"Her Last Bow",
    "CN: ??/10/20 ~ 25/10/20":"Firn Night, unlocks after beating world boss Amberia",
    "CN: 9/4/21 ~ 6/5/21":"Imprisoned Sight",
    "CN: 12/11/21 ~ 10/12/21":"Recitativo di Fantasia ",
    "CN: 1/5/20 ~ 31/5/20":"Nona Ouroboros",
    "CN RE: 10/6/21 ~ 24/6/21":"Inscription of Labyrinth",
    "CN: 5/12/20 ~ 2/1/21":"Fake Ascension",
    "CN: 27/1/22~ 25/2/22":"Her Last Bow",
    "CN: 11/11/21":"Recitativo di Fantasia",
    "CN: 4/2/21 ~ 4/3/21":"Untold Naraka",
    "CN RE: 26/8/21 ~ 23/9/21":"Evernight Beat",
    "CN 7/1/21 ~ 4/2/21":"Untold Naraka",
    "CN: 4/2/21 ~ 18/2/21":"Untold Naraka",
    "CN: 1/7/21 ~ 5/8/21":"The Last Spark"
}
const ENrvents = {
    "EN: 23/12/21 ~ 7/1/22":"Kowloong Metropolis",
    "JP: 24/12/20 ~ 31/12/20":"???",
    "EN: 12/3/22 ~ 26/3/22":"Firn Night",
    "JP: 1/1/21 ~ 7/1/21":"Frozen Darkness",
    "EN: 10/9/21 ~ 24/9/21":"Fallen Star",
    "JP RE: 4/12/21 ~ 22/12/21":"Untold Naraka",
    "EN: 13/2/22 ~ 6/3/22":"Grand Blue",
    "EN: 23/12/21 ~ 25/1/22":"Kowloong Metropolis",
    "EN: 23/12/21 ~ 7/1/22":"Kowloong Metropolis",
    "EN: 9/9/21 ~ 11/10/21":"Fallen star",
    "EN: 27/1/22 ~ 1/3/22":"Grand Blue",
    "JP: 14/2/21 ~ 20/2/21":"???",
    "EN: 12/3/22 ~ 26/3/22":"Firn Night",
    "EN: 26/1/22 ~ 23/2/22":"Grand Blue",
    "EN: 29/1/22 ~ 12/2/22":"Grand Blue",
    "EN: 13/2/22 ~ 6/3/22":"Grand Blue",
    "EN: 17/7/21 ~ 8/8/21":"EN Launch",
    "EN: 29/10/21 ~ 16/11/21":"Eternal Engine",
    "EN: 3/4/22 ~ 20/4/22":"Firn Night",
    "EN: 24/11/21 ~ 21/12/21":"Nona Ouroboros",
}
const Allevents = Object.assign(CNevents, ENrvents);

//Import the mongoose module
var mongoose = require('mongoose');
mongoose.set('debug', true)
//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/my_database';


const xlsx = require('node-xlsx').default;
    //NEEDS TO BE RUN IN UTC CLOCK
    //ELSE ENDS UP 2 HOURS TOO EARLY!!!!!!!!
const fs = require("fs")
var util = require("util");
const sheet = xlsx.parse(fs.readFileSync("./PGR.xlsx"));
sheet.shift()
sheet.shift()
sheet.shift()
// let num = 1
    //NEEDS TO BE RUN IN UTC CLOCK
    //ELSE ENDS UP 2 HOURS TOO EARLY!!!!!!!!
let dbArr = []
sheet.forEach(page => {

    let tempArr = [];
    let subArr = [];
    let charaName = page["name"];
    let pageData = page["data"].filter(item => item.length > 0); //remove empty cells/arrays

    // this splits the array into sub arrays for each frame 
    // pageData is an array of arrays
    // with the strcuture below
    // it repeats every 4 items
    // and each costume is a column

    pageData.forEach(cell => {
        cell = cell.filter(item => item !== undefined); //some cells were parsed as "holes" in arrays
        subArr.push(cell);
        if (subArr.length === 4) {
            tempArr.push(subArr);
            subArr = [];
        }
    });
    // if( charaName === "Sophia") {
    //     console.log(tempArr)
    // }
    
    // console.log("=== " + charaName + " ===")
    tempArr.forEach(frame => {
        // console.log(frame)
        let frameObj = {};
        // frame 0 = skin name
        // frame 1 = chara name
        // frame 2 = price
        // frame 3 = event

        //          / costume1 / costume2 /
        // name1    /          /          /
        // frame1   /          /          /
        // price1   /          /          /
        // event1   /          /          /
        // ---------------------------------
        // name2    /          /          /
        // frame2   /          /          /
        // price2   /          /          /
        // event2   /          /          /
        // ---------------------------------


        // frame[x][y]
        // x = each detail (ie name price)
        // y = each costume (ie ink veritas swimsuit lee)

        let skinNum = frame[0].length; //number of costumes = names first row

        frameObj["frameName"] =  frame[1][0];
        frameObj["charaName"] = charaName;
        // console.log(">>>> " + charaName);
        // console.log(">>>> " + frame[1][0]); //name of the frame (repeats with every costume btw)

        //probably could use more checking
        //but if there is a name but no matching events make sure it won't try looping over it 
        //its tied to lenghts which makes it uh long
        if (frame[0].length !== frame[3].length) {
            let missing = frame[0].length - frame[3].length;
            skinNum -= missing; // remove any incomplete costumes
        }
        
        let skinArr = [];

        //loop over the number of costumes
        for (let i = 0; i < skinNum; i++) {
            let skinObj = {};
            //and then details
            for (let j = 0; j < frame.length; j++) {

                switch (j) {
                    
                    case 0: //names
                        skinObj["skinName"] = frame[j][i]
                        // console.log(frame[j][i]);
                    break;
                    // frame is just one name in every costume column ie single item
                    // case 1: 
                    
                    // break;

                    case 2: //prices
                        /*
                          price: [{
                            value: {type: Number, required: [function() { return this.currency != null; }, "insert a value"]},
                            currency: { type: String,
                                        enum: { values: ["RC", "BC", "CB"], 
                                        message: "pick a currency: RC, BC, CB"},
                                        required: [function() { return this.value != null; }, "pick a currency: RC, BC, CB"]
                            },
                            name: {type: String, required: [function() { return this.value == null; }, "If no price is provided a message is required"]}
                          }],
                        */
                        
                        let priceArr = [];
                        //each price is a new line
                        frame[j][i].split(/\s\s+/g).forEach(price => {
                            let priceObj = {};
                            //splits prices to make parsing easier
                            let splitPrice = price.split(" ").filter(item => item.length > 0);
                            // console.log(splitPrice)

                            //a hack for discounted costumes since they are in a single line
                            //splits them into 2 separate dates
                            //there are tons of exceptions
                            if (splitPrice.at(-1) === "permanent") {
                                //console.log(splitPrice);
                                priceObj["value"] = splitPrice[1];
                                priceObj["currency"] = splitPrice[2];
                                priceObj["name"] = "Discounted";
                                priceArr.push(priceObj);
                                priceObj = {};
                                priceObj["value"] = splitPrice[4];
                                priceObj["currency"] = splitPrice[5];
                                priceObj["name"] = "Permanent";
                                // priceArr.push(priceObj);
                            }
                            //actully standard prices
                            // Cost price currency
                            else if (splitPrice.length === 3 && splitPrice[0] === "Cost") {
                                // console.log(splitPrice)
                                priceObj["value"] = splitPrice[1];
                                priceObj["currency"] = splitPrice[2];
                            }
                            //region specific prices 
                            //jp is only 3 cause yen is together with number
                            // jp cost price
                            else if (splitPrice.length === 3 && splitPrice[0] === "JP:") {
                                // console.log(splitPrice)
                                priceObj["value"] = splitPrice[2].substring(0,4);
                                priceObj["currency"] = splitPrice[2].substring(4);
                                priceObj["name"] = "JP";
                            }
                            // cn cost price currency
                            else if (splitPrice.length === 4 && splitPrice[0] === "CN:") {
                                // console.log(splitPrice)
                                priceObj["value"] = splitPrice[2];
                                priceObj["currency"] = splitPrice[3];
                                priceObj["name"] = "CN";
                            }
                            // cn cost price currency
                            else if (splitPrice.length === 4 && splitPrice[0] === "EN:") {
                                // console.log(splitPrice)
                                priceObj["value"] = splitPrice[2];
                                priceObj["currency"] = splitPrice[3];
                                priceObj["name"] = "EN";
                            }
                            // exception since 2 prices first is free
                            else if (frame[0][i] === "Oceanic Blues"&& splitPrice[0] === "RE:") {
                                // console.log(splitPrice[2])
                                // console.log(splitPrice[3])
                                priceObj["value"] = splitPrice[2];
                                priceObj["currency"] = splitPrice[3];
                                priceObj["name"] = "CN rerun";
                            }
                            //probably needs a better checker but this is reruns nier especially
                            else if (splitPrice[0] === "CN") {
                                //console.log(splitPrice)
                                priceObj["value"] = splitPrice[3];
                                priceObj["currency"] = splitPrice[4];
                                priceObj["name"] = "CN rerun";
                            }
                            //if nothing found just parse join the entire thing and parse it as name 
                            else {
                                priceObj["name"] = splitPrice.join(" ")
                            }
                            priceArr.push(priceObj);
                        });
                        // console.log(priceArr)
                        skinObj["price"] = priceArr;
                    break;

                    case 3:
                        //this is the dates
                        //since there are no names tied to dates
                        //they are stored in a separate object
                        //manually written bw
                        // date - name 
                        //also it parses newlines in a funny fashion
                        //there are several new lines s an s+ in regex
                        //allows spliting it with regex
                        //parsing each event for cn en jp easier
                        // console.log(frame[j][i].split(/\s\s+/g));
                        let dateArr = [];
                        frame[j][i].split(/\s\s+/g).map(date => {
                            /*
                            event: [{
                                start: {type: Date},
                                finish: {type: Date},
                                rerun: {type: Boolean, default: false},
                                disc: {type: Boolean, default: false},
                                name: {type: String, default: "-"},
                                region: { type: String, enum: {
                                          values: ["cn", "jp", "en"], 
                                          message: "pick a region: cn, jp, en"},
                                          required: [function() { return this.start != null; }, "If a date is provided, please provide the region too"]
                                }
                              }]
                            */
                            // object based on above schema
                            let dateOb = {};
                            // splits date strings into parseable dates (some items are len 0)
                            // first 1/2 items are indentifiers for regions and reruns
                            let splitDate = date.split(" ").filter(item => item.length > 0);
                            if (splitDate[0] !== "-") { // chara release skins
                                // console.log(splitDate)

                                // assigns event name to a date
                                for (let name in Allevents) {
                                    if (name === date) {
                                        dateOb["name"] = Allevents[name];
                                    }
                                }

                                //the standard split date is [region, start, ~, end]
                                let start = 1 
                                let end = 3;
                                //nonstandard 
                                if (splitDate.length !== 4) {
                                    //rerun dates
                                    if (splitDate[1] === 'RE:') {
                                        start += 1;
                                        end += 1;
                                        dateOb["rerun"] = true;
                                    }
                                    //discount periods
                                    if (splitDate.at(-1) === 'discounted') {
                                        dateOb["disc"] = true;
                                    }
                                }
                                // console.log(splitDate)
                                // console.log(start)
                                // console.log(end)

                                //start is for all including single day events
                                //flipDate accepts a string flips day and month
                                //returns a date
                                //cause the way how JS parses "unstandard" dates
                                //it gotta be US format
                                //NEEDS TO BE RUN IN UTC CLOCK
                                //ELSE ENDS UP 2 HOURS TOO EARLY!!!!!!!!
                                dateOb["start"] = flipDate(splitDate[start]);
                                
                                if (splitDate.length !== 2) { // = single day no end
                                    dateOb["finish"] = flipDate(splitDate[end]);
                                }
                                //region is the first item and its either CN EN or JP
                                dateOb["region"] = splitDate[0].substring(0,2)
                            }
                            else {
                                // release date costumes no date
                                dateOb["name"] = "-";
                            }
                            dateArr.push(dateOb);
                            // console.log(splitDate)
                        });
                    // console.log(dateArr);
                    skinObj["event"] = dateArr;
                    // break;
                }
            }
            skinArr.push(skinObj);
        }
        // else {console.log("tell  senus ")}
        frameObj["costumes"] = skinArr;
        dbArr.push(frameObj);
    });
    
});
//console.log(dbArr[2].costumes[1])
async function base() {
    await mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log("connected")).catch(err =>console.error(err));
    // var db = mongoose.connection;
    
    const characterSchema = new mongoose.Schema({
      frameName: {type: String, unique: true, required: true, dropDups: true},
      charaName: {type: String, required: true},
      costumes: [{
        skinName:  {type: String, unique: true, required: true, dropDups: true},
        price: [{
          value: {type: Number, required: [function() { return this.currency != null; }, "insert a value"]},
          currency: { type: String,
                      enum: { values: ["RC", "BC", "CB", "¥"], 
                      message: "pick a currency: RC, BC, CB, ¥"},
                      required: [function() { return this.value != null; }, "pick a currency: RC, BC, CB, ¥"]
          },
          name: {type: String, required: [function() { return this.value == null; }, "If no price is provided a message is required"]}
        }],
        event: [{
          start: {type: Date},
          finish: {type: Date},
          rerun: {type: Boolean, default: false},
          disc: {type: Boolean, default: false},
          name: {type: String, default: "-"},
          region: { type: String, enum: {
                    values: ["CN", "JP", "EN"], 
                    message: "pick a region: cn, jp, en"},
                    required: [function() { return this.start != null; }, "If a date is provided, please provide the region too"]
          }
        }]
      }]
    });
    // let Chara = mongoose.model('Character', characterSchema);
    // let heh = {
    //   frameName: "test",
    //   charaName: "test",
    //   costumes: {
    //     skinName:  "white", // String is shorthand for {type: String}
    //     price: {name: "test"},
    //     event: {}
    //   }
    // }
    //   let rosetta = new Chara(heh);
      // await rosetta.save(function (err) {
      //   if (err) throw (err);
      // console.log("hello")
      // });
    // const find_a_thing = await Chara.find()
    // console.log(util.inspect(find_a_thing, false, null, true /* enable colors */))
    //   Chara.insertMany(dbArr, function(error, docs) {
    //       if (error) throw error;
    //       console.log(docs)
    //   })

    // let Costume = require("./charasSchema");
    // Costume.findById("6273eaa250eb5037c4c3c5d4")
    //     .then(chara => {
    //         if (!chara) return console.log("chara not found");
    //         return chara.costumes.id("6273baa250eb5037c4c3c5d5");
    //     })
    //     .then(costume => {
    //         if (!costume) return console.log("costume not found");
    //         return costume.price.id("6273eaa250eb5037c4c3c5d6");
    //     })
    //     .then(price => {
    //         if (!price) return console.log("price not found");
    //         console.log(price);
    //     })
    // .catch(err => console.log(err));
    // //Bind connection to error event (to get notification of connection errors)
    // mongoose.connection.on('error', err => {
    //   console.log(err);
    //   console.log("??")
    // });
    let Chara = require("./charasSchema");
    let test = require("./findSubDoc");
    let params = {
        chara: "6273eaa250eb5037c4c3c5f4",
        costume: "6273eaa250eb5037c4c3c5f5",
        // event: "6273eaa250eb5037c4c3c5f7"
    }
    
    await test(Chara, params).then(res => console.log(res))
    await mongoose.disconnect()
  }
  base()
function flipDate(txt) {
    //NEEDS TO BE RUN IN UTC CLOCK
    //ELSE ENDS UP 2 HOURS TOO EARLY!!!!!!!!
    let arrnow = txt.split("/");
    // console.log(arrnow);
    [arrnow[1], arrnow[0]] = [arrnow[0], arrnow[1]];
    // console.log(arrnow);
    arrnow = arrnow.join("/");
    arrnow = new Date(arrnow);
    // console.log(arrnow);
    return arrnow;
}


















// arr.forEach(a => console.log(a))
// for (let i = 0; i < fixedSheet.length; i++) {
//     let cell = fixedSheet[i];
//     cell = cell.filter(item => item != undefined);
//     tempArr.push(cell);
//     // console.log(tempArr)
//     if (tempArr.length === 4) {
//         arr.push(tempArr);
//         tempArr = [];
//     }
    
// }

// arr.forEach(frame => {
//     // console.log(frame)
//     let skinNum = frame[0].length;
//     console.log(">>>> " + frame[1][0]);
//     for (let i = 0; i < skinNum; i++) {
//         // console.log("///")
//         for (let j = 0; j < frame.length; j++) {
//             if (j!==1) {
//                 console.log(frame[j][i]);
//             }
//             if (j===3) {
//                 frame[j][i].split(/\s\s+/g).map(date => {
//                     for (let name in Allevents) {
//                         if (name === date) {
//                             console.log(Allevents[name]);
//                         }
//                     }
//                 });
//             }
//         }
//         console.log("///");
//     }
    
// });























// CN: 4/2/21 ~ 4/3/21                               CN RE: 26/8/21 ~ 23/9/21	
	
	
	
	
	
	


// let xyz = 0;
// for (let i = 0; i < sheetLen; i++) {
//     // const element = array[i];
//     // if (xyz === i) {
//         console.log("hello")
//         console.log(i)
//         xyz = i++
//     // }
// }
// for (let i = 0; i < someNum; i++) {
//     console.log("{")
//     for (let j = 0; j < 4; j++) {
//         // console.log(fixedSheet[j + 4 * i])
//         let currCells = fixedSheet[j + 4 * i];
//         currCells = currCells.filter(i => i !== undefined);
//         let numberCostumes = fixedSheet[1 + 4 * i].filter(i => i !== undefined);
        
//         if (j ===1 ) [
//             console.log(currCells)
//         ]
        
//         for (let k = 0; k < currCells.length; k++) {
//             if (j!== 1) {
//                 const element = currCells[k];
//                 // obj[arrWithNames[j]] = element;
//                 console.log(arrWithNames[j], element)
//             }
//             const element = currCells[k];
//             // console.log(/*arrWithNames[j],*/element)
//             if (k ===0) {
//                 // console.log(/*arrWithNames[j],*/element)
//             }
//         }
//         // what.push(obj);
//         // console.log(obj)
//         // for (let k = 0; k < array.length; k++) {
//         //     const element = array[k];
            
//         // }
//     }
//     console.log("}")
// }
// console.log(what)


//     console.log(fixedSheet[1 + 4 * i])
//     // if (xyz === i) {
//     //     console.log("hewwo");
//     //     console.log(i);
//     //     xyz = i+4;
//     // } 1
//     // console.log(tempArr)
//     let cell = fixedSheet[i];
//     cell = cell.filter(item => item != undefined)
//     tempArr.push(cell)
//     // console.log(tempArr)
//     if (tempArr.length === 4) {
//         arr.push(tempArr);
//         tempArr = [];
//     }
//     // 0 + 4 * 0/1/2/3
//     // 1
//     // 2
//     // 3
// arr.map(item => item.filter(i => i!=undefined))
// console.log(arr)
// console.log(arr)
// // 1 + 4 + 6 

// // i + 4 * sheetLen/4
// 1 +  4 + 4 + 4
// // if (s) {}
// 9
// 13
