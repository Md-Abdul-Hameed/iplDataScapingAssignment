//Making folder naming ipl 2020

const fs = require("fs");
const cheerio  = require("cheerio");
const request = require("request");
const path = require("path");
const addTo = require("./addToFiles");
const mkdirsSync = function(dirname) {
    if (fs.existsSync(dirname)) {
      return true;
    }
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
}

let cwd=process.cwd();
let dir=path.join(cwd,"ipl2020");
mkdirsSync(dir)

let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
request(url,cb);

function cb(err,response,html){
    if(err){

        console.error(err);
    }else{
        let ch_selector = cheerio.load(html);
        let menu = ch_selector(".jsx-850418440.custom-scroll").find("a");
        tableLink = ch_selector(menu[2]).attr("href");
        tableLink = "https://www.espncricinfo.com"+tableLink;
        //console.log("https://www.espncricinfo.com/series/ipl-2020-21-1210595/points-table-standings");
        //console.log(tableLink);

        request(tableLink,function(err,response,html){
            if(err){
                console.error(err);
            }else{
                let cheerioSelector = cheerio.load(html);
                let tableNames = cheerioSelector(".header-title.label");
                let dir_name = dir;
                for(let i = 1; i < tableNames.length; i++){
                    let Name = cheerioSelector(tableNames[i]).text();
                    if(Name == "Punjab Kings"){
                        Name = "Kings XI Punjab"
                    }
                    dir=path.join(dir_name,Name);
                    mkdirsSync(dir)
                }
                addTo.fn(url+"/match-results");
            }
        })
    }
}
