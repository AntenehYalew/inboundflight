//jshint esversion:6
const express        = require("express"),
      bodyParser     = require("body-parser"),
      cheerio        = require("cheerio"), //To manipultae the resluts from the data pulled 
      request        = require("request"),
     /*  rp             = require('request-promise'), */
      app             = express();


app.use(bodyParser.urlencoded({ extended: false }))
var jsonParser = bodyParser.json();
app.use(express.static("public"));


app.set("view engine", "ejs");

var flightnumdate = [];
var routing = [];
var scheduledeparture = [];
var actualdeparture = [];
var scheduledarrival = [];
var flightstatus = [];
var today= [];
var originalarrivals = [];
var newOrder = [];


var flightwztimezone = [{flight:"B62092", timezone:"America/New_York"},{flight:"B6170", timezone:"America/New_York"},
{flight:"AA1978", timezone:"America/New_York"}];


/* 
var flightwztimezone = [{flight:"B62092", timezone:"America/New_York"},{flight:"B6170", timezone:"America/New_York"},
{flight:"AA1978", timezone:"America/New_York"},{flight:"B6184", timezone:"America/New_York"},
{flight:"AC7676", timezone:"America/Toronto"},{flight:"B61336", timezone:"America/New_York"},
{flight:"B6488", timezone:"America/Los_Angeles"} ,{flight:"B6966", timeZone:"America/New_York"},
{flight:"B644", timeZone:"America/Barbados"},{flight:"B6640", timeZone:"America/New_York"},
{flight:"B62680", timeZone:"America/New_York"},{flight:"B62354", timeZone:"America/New_York"},
{flight:"B6334", timeZone:"America/Los_Angeles"},{flight:"PD949", timeZone:"America/New_York"},
{flight:"B6352", timeZone:"America/New_York"},{flight:"B61008", timeZone:"America/Santo_Domingo"},
{flight:"B61686", timeZone:"America/New_York"} ,{flight:"B61446", timeZone:"America/New_York"},
{flight:"B6696", timeZone:"America/New_York"},{flight:"B6222", timeZone:"America/New_York"},
{flight:"CM311", timeZone:"America/New_York"},{flight:"AA1728", timeZone:"America/New_York"},
{flight:"B6462", timeZone:"America/Santo_Domingo"}, {flight:"AC8048", timeZone:"America/Toronto"},
{flight:"B6760", timeZone:"America/New_York"},{flight:"B61138", timeZone:"America/Chicago"},
{flight:"B6598", timeZone:"America/Los_Angeles"},{flight:"B6400", timeZone:"America/Chicago"},
{flight:"AC8460", timeZone:"America/New_York"}, {flight:"B62580", timeZone:"America/New_York"},
{flight:"B6984", timeZone:"America/New_York"},{flight:"B6178", timeZone:"America/Los_Angeles"},
{flight:"AC8895", timeZone:"America/Halifax"},{flight:"AS30", timeZone:"America/Los_Angeles"},
{flight:"WS3606", timeZone:"America/Toronto"},{flight:"B6126", timeZone:"America/New_York"},
{flight:"B6570", timeZone:"America/New_York"},{flight:"B692", timeZone:"America/Anguilla"},
{flight:"B61066", timeZone:"America/New_York"},{flight:"B6992", timeZone:"America/New_York"},
{flight:"B6772", timeZone:"America/Cancun"},{flight:"AS1046", timeZone:"America/Los_Angeles"},
{flight:"B61440", timeZone:"America/New_York"},{flight:"B61282", timeZone:"America/New_York"},
{flight:"PD945", timeZone:"America/Toronto"},{flight:"B6494", timeZone:"America/Denver"},
{flight:"B6204", timeZone:"America/Bermuda"}]; */


request("https://www.flightradar24.com/data/flights/aa2264", (error, response, html) => {

    const $ = cheerio.load(html)    
    const extractData = $(".data-row").toArray();
    console.log(extractData)
}) 


let origin ="";
let destination="";
let readableFlightDate = "";
let std = "";
let atd = "";
let sta = "";
let statusTime = "";
let readableStatus = "";
let originalsta = "";
let wronglogin = "";
let userid = "";


function processdata(){
    
    today.push((new Date()).toLocaleString('en-US',{hour12: false}).slice(0,20)); 
flightwztimezone.forEach(function (fltfn) {

request("https://www.flightradar24.com/data/flights/" + fltfn["flight"], (error, response, html) => {
  

               if(!error && response.statusCode ==200){
    
                  const $ = cheerio.load(html)
                  const extractData = $(".data-row").toArray();
                  var d = (new Date()).toLocaleString().slice(0,9);
                  var z = 0;
                  var tz = fltfn["timezone"];
                 
                  while (z<extractData.length){
    
                      var options= {
                          hour12: false,
                          timeZone:tz
                      }
                      let flightDate =  ((new Date((extractData[z]["children"][2]["attribs"]["data-timestamp"])*1000)).toLocaleString('en-US',options)).slice(0,9);
                     if (flightDate=== d){
                         if ((extractData[z]["children"][4]["children"][0]["data"]) != "  —  "){
                            destination = (extractData[z]["children"][4]["children"][0]["next"]["children"][0]["data"]).slice(1,4);
                         } else{
                            destination = "-"
                         }
                         
                          if(destination=== "BOS"){
                              let sliceddate = ((new Date(flightDate)).toDateString()).slice(8,10);
                              let slicedmonth = ((new Date(flightDate)).toDateString()).slice(4,7);
                              readableFlightDate = sliceddate+slicedmonth;
                              origin =  (extractData[z]["children"][3]["children"][0]["next"]["children"][0]["data"]).slice(1,4);
                              std = ((new Date((extractData[z]["children"][7]["attribs"]["data-timestamp"]) *1000)).toLocaleString('en-US',options)).slice(11,16);
                              let atdtime = extractData[z]["children"][8]["attribs"]["data-timestamp"];
                              if (atdtime=== ""){
                                  atd = "-"
                              }else{
                                  atd = ((new Date((extractData[z]["children"][8]["attribs"]["data-timestamp"]) *1000)).toLocaleString('en-US',options)).slice(11,16);
                              }
                              sta = "-";
                              originalsta = "-"
                              if ((extractData[z]["children"][9]["attribs"]["data-timestamp"]) != ""){
                                sta = ((new Date((extractData[z]["children"][9]["attribs"]["data-timestamp"]) *1000)).toLocaleString('en-US',{hour12:false})).slice(11,16);
                                originalsta = ((new Date((extractData[z]["children"][9]["attribs"]["data-timestamp"]) *1000)).toLocaleString('en-US',{hour12:false})).slice(11,16); //TEST TEST
                              }

                              
                             let status = extractData[z]["children"][11]["attribs"]["data-prefix"];                           

                       
                             if (status === "Scheduled " || status === "Canceled " || status === "Unknown "){
                              statusTime = ""; //Tested - Scheduled - Canceled - Unknown
                              readableStatus= status;
                             } else if(status === "Estimated departure  "){
                              statusTime = ((new Date((extractData[z]["children"][11]["attribs"]["data-timestamp"]) *1000)).toLocaleString('en-US',options)).slice(11,16); //Tested
                              readableStatus="ETD";
                             }else if(status==="Landed "){
                              statusTime = ((new Date((extractData[z]["children"][11]["attribs"]["data-timestamp"]) *1000)).toLocaleString('en-US',{hour12:false})).slice(11,16); //Tested - Landed - Estimated
                              readableStatus= status;
                             }else if(status ==="Estimated "){
                              statusTime = ((new Date((extractData[z]["children"][11]["attribs"]["data-timestamp"]) *1000)).toLocaleString('en-US',{hour12:false})).slice(11,16); //Tested - Landed - Estimated
                              readableStatus="ETA"
                             }else if(status ==="Delayed "){
                                  if (atdtime===""){
                                      statusTime = ((new Date((extractData[z]["children"][11]["attribs"]["data-timestamp"]) *1000)).toLocaleString('en-US',options)).slice(11,16);
                                      readableStatus="ETD"
                                  }
                                  else{
                                      statusTime = ((new Date((extractData[z]["children"][11]["attribs"]["data-timestamp"]) *1000)).toLocaleString('en-US',{hour12:false})).slice(11,16);
                                      readableStatus="ETA"
                                  }
                             }
                             else if (status.includes("Diverted to") === true){
                                readableStatus= ((status.slice(0,11)) + " " + (status.slice(-8,-5)));
                             } else {
                                 readableStatus = status;
                             }

                             
                             flightnumdate.push(fltfn["flight"] + "/" + readableFlightDate);
                             routing.push(origin + " to " + destination);
                             scheduledeparture.push(std);
                             actualdeparture.push(atd);
                             scheduledarrival.push(sta);
                             originalarrivals.push(originalsta); //Not sorted
                             flightstatus.push(readableStatus + " " + statusTime);
                               
                          }
                      }  
                      z++;
                  }
          }
         
        });
 

       
    }) //End of the function

}

/* app.get("/", function(req,res){
    res.render("index",{wronglogin:wronglogin});
        
}) */ 
/* 
app.post("/", jsonParser, function(req,res){
    wronglogin="";
    userid = (req.body.userid).toUpperCase();
    var password = (req.body.password).toUpperCase();
    if ((userid === "BOSQR") && (password === "BOSTONQR")){
        res.redirect("/home");
    } else{
        wronglogin = "OOOpppsss! Wrong User Id or Password";
        res.redirect("/");
    }
})
 */

 processdata();
app.get("/home", function(req,res){
    flightnumdate = [];
    routing = [];
    scheduledeparture = [];
    actualdeparture = [];
    scheduledarrival = []; //sorted later
    flightstatus = [];
    today= [];
    originalarrivals = [];
    newOrder = [];
    processdata();
    setTimeout( function () {res.render("home", {userid:userid});} , 2000);
    
})


/* app.get("/", function(req,res){
    flightnumdate = [];
    routing = [];
    scheduledeparture = [];
    actualdeparture = [];
    scheduledarrival = []; //sorted later
    flightstatus = [];
    today= [];
    originalarrivals = [];
    newOrder = [];
    processdata();

    setTimeout( function () { res.render("home") } , 1000);
        
}) */

app.get("/display", function(req,res){

    if (flightnumdate.length === 0){
        res.redirect("/home")
    }
    else{

        var sortedSTA = (scheduledarrival.sort()).reverse();

        var filteredSTA = sortedSTA.filter(function(item,index){
            if (sortedSTA.indexOf(item) === index){
                return item;
            }

        })

        filteredSTA.forEach(function(x){
           var rearrangedSort = originalarrivals.lastIndexOf(x);

           while (rearrangedSort != -1){
               newOrder.push(rearrangedSort);
                rearrangedSort = (rearrangedSort > 0 ? originalarrivals.lastIndexOf(x, rearrangedSort - 1) : -1);
           }
        }); 
    

        res.render("display",{flightnumdate:flightnumdate,routing:routing,scheduledeparture:scheduledeparture,actualdeparture:actualdeparture, originalarrivals:originalarrivals,  flightstatus:flightstatus, today:today, newOrder:newOrder})
        flightnumdate = [];
        routing = [];
        scheduledeparture = [];
        actualdeparture = [];
        scheduledarrival = [];
        flightstatus = [];
        today= [];
        originalarrivals = [];
        newOrder = [];

    }
    

})

 app.post("/home", function(req,res){
    res.redirect("/display")
}) 

app.post("/display", function(req,res){
    res.redirect("/home");
})

app.listen(3000, function(){
    console.log("New app Connected to local server // New");
});
