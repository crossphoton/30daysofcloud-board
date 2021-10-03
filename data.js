const csv = require("csv-parser");
const fs = require("fs");
const results = [];

const track1 = "# of Skill Badges Completed in Track 1",
  track2 = "# of Skill Badges Completed in Track 2";

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
    fs.writeFile(
      "data/data.json",
      JSON.stringify({
        results,
        buildDate: new Date(Date.now()).toDateString(),
        institute,
      }),
      (err) => {
        if (err) throw err;
        console.log("Data file has been saved!");
      }
    );
  });
