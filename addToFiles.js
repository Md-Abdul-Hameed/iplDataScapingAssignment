let request = require("request");
let cheerio = require("cheerio");
const fs = require("fs");
const path = require("path")

let mainLink = "https://www.espncricinfo.com"
function addToFiles(url){
    request(url,cb);
}
//https://www.espncricinfo.com/series//wassets.hscicdn.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/live-cricket-score
function cb(err,response,html){
    if(err){
        console.error(err);
    }else{
        let ch_selector = cheerio.load(html);
        let matches = ch_selector(".col-md-8.col-16 .match-info-link-FIXTURES");
        
        for(let i = 0; i < 10; i++){
            let link = ch_selector(matches[i]).attr("href");
            //console.log(mainLink+link);
            request(mainLink+link,cb1)
        }
    }
    //https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard
}

function cb1(err,response,html){
    if(err){
        console.error(err);
    }else{
        let chSelector = cheerio.load(html);
    let bothMatches = chSelector(".event .teams>.team");
    let myTeam;
    for (let i = 0; i < bothMatches.length; i++) {
        let isLossing = chSelector(bothMatches[i]).hasClass("team-gray");
        if (isLossing == false) {
            let myTeamElem = chSelector(bothMatches[i]).find(".name-detail a");
            myTeam = myTeamElem.text();
        }
    }
    let colInnings = chSelector(".Collapsible");
    let bothInningsTeamName = chSelector
        (".Collapsible .header-title.label");
    for (let j = 0; j < bothInningsTeamName.length; j++) {
        let teamName = chSelector(bothInningsTeamName[j]).text();
        let teamFirstName = teamName.split("INNINGS")[0];
        teamFirstName = teamFirstName.trim();
        if (teamFirstName == myTeam) {
            let winTeamInning = chSelector(colInnings[j]);
            printTeamStats(winTeamInning, chSelector)
            
        }
    }
}
function printTeamStats(winTeamInning, chSelector) {
    let allRows = chSelector(winTeamInning)
        .find(".table.batsman tbody tr");

       

    for (let j = 0; j < allRows.length; j++) {
        let eachbatcol = chSelector(allRows[j]).find("td");
        if (eachbatcol.length == 8) {
            let playerName = chSelector(eachbatcol[0]).text();
            //let players = playerName.slice();
            //playerName = players[0]+players[1];
            let runs = chSelector(eachbatcol[2]).text();
            let ballPlayed = chSelector(eachbatcol[3]).text();
            let noOfFours = chSelector(eachbatcol[4]).text();
            let noOfSixes = chSelector(eachbatcol[5]).text();
            let SR = chSelector(eachbatcol[6]).text();
            //console.log(playerName+"  ",opponent+" ",runs+" ",ballPlayed+" ",noOfFours+" ",noOfSixes+" ",SR);
            //playerName = playerName.trim();
            
            //console.log(players[0],players[1]);

            let teamNames = chSelector(".match-info.match-info-MATCH .teams .team .name-link");
            //console.log(teamNames.length);
            let opponent ;
            let myTeam;
            if(chSelector(teamNames[0]).hasClass(".team.team-gray")){
                opponent = chSelector(teamNames[0]).text();
                myTeam = chSelector(teamNames[1]).text();
            }else{
                opponent = chSelector(teamNames[1]).text();
                myTeam = chSelector(teamNames[0]).text();
            }
            //console.log(opponent," ",myTeam);
            
            
            let venue_date = chSelector(".match-info.match-info-MATCH .description").text().split(",");
            let a={
                Name : playerName,
                Runs : runs,
                Balls : ballPlayed,
                Fours : noOfFours,
                Sixes : noOfSixes,
                StrikeRate : SR,
                b : {
                    Opponent : opponent,
                    Venue : venue_date[1],
                    Date : venue_date[2]
    
                }
            }

            let fullPath = path.join(process.cwd(),"ipl2020");
            fullPath = path.join(fullPath,myTeam);
            fullPath = path.join(fullPath,playerName+".json");
            if(fs.existsSync(fullPath)){
                let contentInFile = fs.readFileSync(fullPath);
                    let arr = JSON.parse(contentInFile);
                    arr.push(a);
                    // fs.appendFileSync(filePath, content);   
                    fs.writeFileSync(fullPath, JSON.stringify(arr,null,4))
            }else{
                let arr1 = [];
                arr1.push(a);
                let contentInEmptyFile = JSON.stringify(arr1,null,4);
                fs.writeFileSync(fullPath, contentInEmptyFile);
                    
                
            }
        }
        }

    }
}

module.exports={
    fn:addToFiles
}