const express        = require("express"),
      mysql          = require("mysql"),
      con            = require("../models/dbmodels"),
      middleware     = require("../middlewares/index"),
      session        = require("express-session"),
      cheerio        = require("cheerio"), //To manipultae the resluts from the data pulled 
      fetch          = require("node-fetch"),
      router         = express.Router();



router.use("/stationpage",middleware.redirectLogin, middleware.userAccess)
router.route("/stationpage")
    .get((req,res)=>{
        res.render("stationpage/index")
    })


router.use("/stationadmin",middleware.redirectLogin, middleware.userAccess)
router.route("/stationadmin")
    .get((req,res)=>{
        let user_id = req.session.user_id;
        let user_station = req.session.user_station;
        con.query("SELECT flight_id, flight_number, readable_time_zone FROM flights WHERE destination = '"+user_station+"' AND user_id = '"+user_id+"'",(err,allFlights)=>{
            if(!err){
                res.render("stationpage/stationadmin",{allFlights:allFlights})
            }else{
                console.log(err)
                console.log("//stationadmin get")
                req.flash("error","Unable to retrive data, Please check again")
                res.redirect("/stationpage")
            }
        })
      
    })
    .post((req,res)=>{
        let flight_number = (req.body.flight).toUpperCase();
        let timezone = JSON.parse(req.body.timezone);
        let standard_time_zone = timezone.time_zone;
        let readable_time_zone = timezone.readable_time_zone ;
        let user_id = req.session.user_id;
        let user_station = req.session.user_station;
        con.query("SELECT * FROM flights WHERE flight_number = '"+flight_number+"' AND user_id = '"+user_id+"' ",(err,result)=>{
            if(!err && result.length===0){
                  con.query("INSERT INTO flights (flight_number,standard_time_zone,readable_time_zone,destination,user_id) VALUES ('"+flight_number+"','"+standard_time_zone+"','"+readable_time_zone+"','"+user_station+"','"+user_id+"')",(err)=>{
                      if(!err){
                          res.redirect("/stationadmin")
                      }else{
                        req.flash("error", "Unable to add a new flight, check the information provided")
                        res.redirect("/stationadmin")
                      }
                  }) 
               
            }else{
                console.log(err)
                console.log("//stationadmin post")
                req.flash("error", "Unable to add a new flight, check the information provided")
                res.redirect("/stationadmin")
            }
        })
     

    })

router.route("/stationadmin/:id",middleware.redirectLogin, middleware.userAccess)
    .get((req,res)=>{
        let flightId = req.params.id
        con.query("SELECT * FROM flights WHERE flight_id = "+flightId, (err,selectedFlight)=>{
            if(!err){
               res.render("stationpage/stationedit",{selectedFlight:selectedFlight})
            }else{
                req.flash("error", "Something went wrong, please check again")
            }
        })
    })

    .put((req,res)=>{
        let flightId = req.params.id
        let flight_number = (req.body.flight).toUpperCase();
        let timezone = JSON.parse(req.body.timezone);
        let standard_time_zone = timezone.time_zone;
        let readable_time_zone = timezone.readable_time_zone ;
        con.query("SELECT * FROM flights WHERE flight_number = '"+flight_number+"' ",(err,result)=>{
            if(!err && result.length===0){
                con.query("UPDATE flights SET flight_number = '"+flight_number+"' , standard_time_zone = '"+standard_time_zone+"', readable_time_zone = '"+readable_time_zone+"' WHERE flight_id = "+flightId+"",(err)=>{
                    if(!err){
                        req.flash("success", "Flight updated succesfully")
                        res.redirect("/stationadmin")
                    }else{
                        req.flash("error", "Update not succesfull, please check the information provided")
                        res.redirect("/stationadmin")
                    }
            })  
            }else{
                req.flash("error", "Flight information already exists")
                res.redirect("/stationadmin")
            }
        })

    })

    .delete((req,res)=>{
        let flightId = req.params.id
        con.query("DELETE FROM flights WHERE flight_id = "+flightId+"",(err)=>{
                if(!err){
                    req.flash("success", "Flight deleted")
                    res.redirect("/stationadmin")
                }else{
                    req.flash("error", "Delete not succesfull")
                    res.redirect("/stationadmin")
                }
        })
    })
 
router.use("/flightstatus",middleware.redirectLogin, middleware.userAccess)
router.route("/flightstatus")
    .get((req,res)=>{
        let user_id = req.session.user_id;
        let user_station = req.session.user_station;
        let user_flight = req.session.user_flightNumber;
        let user_timezone = "America/New_York";
        fetch("https://www.flightradar24.com/data/flights/"+user_flight)
        .then(res => res.text())
        .then(body => {
            const $ = cheerio.load(body)
            const localFlight = $(".data-row").toArray();
            var today = (new Date()).toLocaleString().slice(0,9);
            if(localFlight && localFlight.length>0){
                let operatingflight = false
                localFlight.forEach(local=>{
                    let localFlightDate =  ((new Date((local["children"][2]["attribs"]["data-timestamp"])*1000)).toLocaleString('en-US',{hour12:false, timeZone:user_timezone})).slice(0,9);
                    if (localFlightDate === today){
                        operatingflight = true;
                        localDeparture = local["children"][7]["attribs"]["data-timestamp"];
                      
                        /////////

                        con.query("SELECT flight_number, standard_time_zone, destination FROM flights WHERE user_id = "+user_id+" AND destination = '"+user_station+"'",(err,allFlights)=>{
                            if(!err && allFlights.length>0){
                                let retrivedFlightInfo = [];
                                allFlights.forEach(inFlight => {
                                    fetch("https://www.flightradar24.com/data/flights/"+inFlight.flight_number)
                                    .then(res => res.text())
                                    .then(body => {
                                        const $ = cheerio.load(body)
                                        const extractData = $(".data-row").toArray();
                                        if(extractData.length>0){
                                            var options= {
                                                hour12: false,
                                                timeZone:inFlight.standard_time_zone
                                            }
                     
                                            extractData.forEach(dataInfo => {
                                                let flightDate =  ((new Date((dataInfo["children"][2]["attribs"]["data-timestamp"])*1000)).toLocaleString('en-US',options)).slice(0,9);
                                                let flightDestination = (dataInfo["children"][4]["children"][0]["next"]["children"][0]["data"]).slice(1,4);
                                                if (flightDate === today && flightDestination === user_station){
                
                
                                                    let ATD ;
                                                    let STA;
                                                    let OSTA; //STA used to order the array
                                                    if (dataInfo["children"][8]["attribs"]["data-timestamp"]=== ""){
                                                         ATD = "-"
                                                    }else{
                                                         ATD = (new Date((dataInfo["children"][8]["attribs"]["data-timestamp"]) *1000)).toLocaleString('en-US',options).slice(10,15);
                                                    }
                                         
                                                    if (dataInfo["children"][9]["attribs"]["data-timestamp"]=== ""){
                                                         STA = "-"
                                                         OSTA="-"
                                                    }else{
                                                         STA = (new Date((dataInfo["children"][9]["attribs"]["data-timestamp"]) *1000)).toLocaleString('en-US',{hour12:false}).slice(10,15);
                                                         OSTA =dataInfo["children"][9]["attribs"]["data-timestamp"]
                                                    }
                
                
                                                    let status = dataInfo["children"][11]["attribs"]["data-prefix"];
                                                    let readableStatus ="";
                                                    let statusTime ="";
                                                    if(status === "Scheduled " || status === "Canceled " || status === "Unknown "){
                                                        statusTime = "";
                                                        readableStatus= status
                                                    }else if(status === "Estimated departure  "){
                                                        statusTime = ((new Date((dataInfo["children"][11]["attribs"]["data-timestamp"]) *1000)).toLocaleString('en-US',options)).slice(10,15);
                                                        readableStatus="ETD";
                                                    }else if(status==="Landed "){
                                                        statusTime = ((new Date((dataInfo["children"][11]["attribs"]["data-timestamp"]) *1000)).toLocaleString('en-US',options)).slice(10,15);
                                                        readableStatus=status;
                                                    }else if(status ==="Estimated "){
                                                        statusTime = ((new Date((dataInfo["children"][11]["attribs"]["data-timestamp"]) *1000)).toLocaleString('en-US',options)).slice(10,15);
                                                        readableStatus="ETA";
                                                    }else if(status ==="Delayed "){
                                                        if(dataInfo["children"][8]["attribs"]["data-timestamp"]=== ""){
                                                            statusTime = ((new Date((dataInfo["children"][11]["attribs"]["data-timestamp"]) *1000)).toLocaleString('en-US',options)).slice(10,15);
                                                            readableStatus="ETD"
                                                        }else{
                                                            statusTime = ((new Date((dataInfo["children"][11]["attribs"]["data-timestamp"]) *1000)).toLocaleString('en-US',{hour12:false})).slice(10,15);
                                                            readableStatus="ETA"
                                                        }
                                                    }else if (status.includes("Diverted to") === true){
                                                        readableStatus= ((status.slice(0,11)) + " " + (status.slice(-8,-5)));
                                                     } else {
                                                         readableStatus = status;
                                                     }
                                                        let retrivedFlight = {
                                                            "flightNumber":inFlight.flight_number,
                                                            "routing":(dataInfo["children"][3]["children"][0]["next"]["children"][0]["data"]).slice(1,4) + "/" + user_station,
                                                            "STA":STA,
                                                            "STD":((new Date((dataInfo["children"][7]["attribs"]["data-timestamp"]) *1000)).toLocaleString('en-US',options)).slice(10,15),
                                                            "ATD":ATD,
                                                            "OSTA":OSTA,
                                                            "status":readableStatus,
                                                            "statusTime": statusTime,
                                                        }
                                                        retrivedFlightInfo.push(retrivedFlight) 
                                                }
                                            });
                                        }
                                    })
                                    .catch((err) => 
                                        console.log(err),
                                        )
                                });
                               setTimeout(()=>{ 
                                retrivedFlightInfo.sort(function(a, b){
                                    return b.OSTA-a.OSTA
                                })   
                                res.render("stationpage/flightstatus",{retrivedFlightInfo:retrivedFlightInfo,localDeparture:localDeparture,today:today})},4000)
                           
                    
                            }else{
                                console.log(err)
                                console.log("//mainpage get")
                                req.flash("error","No data retrieved, Please check station admin page")
                                res.redirect("/stationpage")
                            }
                        })


                        //////////
                    }/* else{
                        req.flash("error", "You have no flights today"),
                        res.redirect("/stationpage")
                    } */
                })
                if(operatingflight === false){
                    req.flash("error", "You have no flights today"),
                    res.redirect("/stationpage")
                }
         
            }else{
                req.flash("error", "You have no flights today"),
                res.redirect("/stationpage")
            }
        })
        .catch(err=>{
            console.log(err)
        })
     
    })

module.exports = router

      