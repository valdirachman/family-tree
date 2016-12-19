"use strict";
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
        let budi = repo.getPersonById("1");
        let bapakBudi = repo.getPersonById("2");
        let ibuBudi = repo.getPersonById("3");
        let stepIbuBudi = repo.getPersonById("4");
        let kakekBudi = repo.getPersonById("6");
        let x = repo.getPersonById("11");
        console.log(budi.relationTo(x));
        console.log(x.find("grand child of uncle"));
      });
    //return repo;
}

var repo = new Repo();
importPersonCSV("./person.csv", repo);
importMarriageCSV("./marriage.csv", repo);
