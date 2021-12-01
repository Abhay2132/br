const { getResult} = require("./mods/webScrappers")

global.log = console.log;
global.j = require("path").join;
global.errLog = function (err){ if(err) log(err) }

let url = "http://results.indiaresults.com/ut/sdsuv-university/query.aspx?id=1900269978"

getResult(url);