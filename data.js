const csv = require("csv-parser");
const fs = require("fs");

const results = [];
const resultsWithRank = [];
const track1 = "# of Skill Badges Completed in Track 1", track2 = "# of Skill Badges Completed in Track 2";

fs.createReadStream("data/data.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", () => {
    let id = 0;
    let institute = results[0]["Institution"];
    results.forEach((result) => {
      delete result["Enrolment Date & Time"];
      delete result["Qwiklabs Profile URL"];
      delete result["Institution"];
      delete result["Student Email"];
      result.id = id++;
    });
    results.sort(
      (a, b) =>
        Number(b[track1]) +
          Number(b[track2]) -
          (Number(a[track1]) + Number(a[track2])) ||
        a["Student Name"] - b["Student Name"]
    );

    let rank = 1;
    
    //set first entry rank = 1 since the array is already sorted
    results[0]['Rank'] = rank;
    
    //iterate over entries, check if the number of quests completed are same as the previous entry. 
    //If they are same then give them the same rank else increment the rank
    for(let pointer = 1; pointer < results.length; pointer++) {
    
      let totalNumberOfQuestsCompletedByPreviousRank = Number(results[pointer - 1][track1]) + Number(results[pointer - 1][track2]);
      let totalNumberOfQuestsCompleted = Number(results[pointer][track1]) + Number(results[pointer][track2]);

      //if total # of quests completed is 0 then we increment the rank 
      if(totalNumberOfQuestsCompleted === 0) {
        rank++;
        results[pointer]['Rank'] = rank;
      }
      //if total # of quests completed is equal to the previous entry then we give them the same rank
      else if(totalNumberOfQuestsCompletedByPreviousRank === totalNumberOfQuestsCompleted) {
        results[pointer]['Rank'] = results[pointer - 1]['Rank']
      } else {
        rank++;
        results[pointer]['Rank'] = rank;
      }
      
    }

    //we want the rank column to be on the left of the name, hence create a new array of objects where the first key would be 'Rank'
    results.forEach((result) => {
      let obj = {
        "Rank": result["Rank"],
        "Student Name" : result['Student Name'],
        "Enrolment Status" : result['Enrolment Status'],
        "# of Skill Badges Completed in Track 1" : result[track1],
        "# of Skill Badges Completed in Track 2" : result[track2],
        "id" : result['id']
      }
      
      resultsWithRank.push(obj);
    })

    fs.writeFile(
      "data/data.json",
      JSON.stringify({
        resultsWithRank,
        buildDate: new Date(Date.now()).toLocaleString(),
        institute,
      }),
      (err) => {
        if (err) throw err;
        console.log("Data file has been saved!");
      }
    );
  });
