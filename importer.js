let {Repo} = require("./models.js");
var fs = require('fs');
var parse = require('csv-parse');

function importPersonCSV(filePath, repo) {
  fs.createReadStream(filePath)
      .pipe(parse({delimiter: ';'}))
      .on('data', function(csvrow) {
          var id = csvrow[0],
              name = csvrow[1],
              gender = csvrow[2],
              birthDate = csvrow[3],
              fatherId = csvrow[4],
              motherId = csvrow[5];
          repo.addPerson({id, name, gender, birthDate, fatherId, motherId});
      })
      .on('end', function() {
        console.log("Read " + filePath + " done");
      });
    //return repo;
}

function importMarriageCSV(filePath, repo) {
  fs.createReadStream(filePath)
      .pipe(parse({delimiter: ';'}))
      .on('data', function(csvrow) {
          var id = csvrow[0],
              husbandId = csvrow[1],
              wifeId = csvrow[2],
              startDate = csvrow[3],
              endDate = csvrow[4];
          if(endDate === "null"){
            endDate = null;
          }
          repo.addMarriage({id, husbandId, wifeId, startDate, endDate});
      })
      .on('end', function() {
        console.log("Read " + filePath + " done");
        console.log(repo);
      });
    //return repo;
}"use strict";

var repo = new Repo();
importPersonCSV("./person.csv", repo);
importMarriageCSV("./marriage.csv", repo);
