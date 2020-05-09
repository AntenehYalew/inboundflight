const express        = require("express"),
      mysql          = require("mysql"),
      con            = require("../models/dbmodels"),
      middleware     = require("../middlewares/index"),
      bcrypt         = require("bcrypt"),
      saltRounds     = 10,
      session        = require("express-session"),
      router         = express.Router();


router.route("/")
    .get((req,res)=>{
        if(!req.session.user_id){
            res.render("usermgt/login")
        }else{
            if(req.session.user_id===1){
                req.flash("error", "Already Logged in")
                res.redirect("/adminpage")
            }else{
                req.flash("error", "Already Logged in")
                res.redirect("/stationpage")
            }
        }
        
    })
    .post((req,res)=>{
        let user_name = (req.body.username).toUpperCase();
        let user_password = (req.body.password).toUpperCase();
        con.query("SELECT * FROM usermgt WHERE user_name ='"+user_name+"'", (err,foundUser)=>{
            if(foundUser && foundUser.length ===1 && foundUser[0].user_name === user_name){ 
                bcrypt.compare(user_password, foundUser[0].user_password, function(err, result) {
                    if(!err && result === true){
                        req.session.user_id = foundUser[0].user_id;
                        req.session.user_name = foundUser[0].user_name;
                        req.session.user_station = foundUser[0].user_station;
                        req.session.user_flightNumber = foundUser[0].user_flightNumber;
                        if(user_name=== "ADMIN"){ 
                            req.flash("success", "Succesfully Logged in")
                            res.redirect("/adminpage")
                        }else{
                            req.flash("success", "Succesfully Logged in")
                            res.redirect("/stationpage")
                        }
                        
                    }else{
                        req.flash("loginerror", "Wrong username or password")
                        res.redirect("/")
                    }
                    
                });
            }else{
                console.log(err)
                console.log("//login post")
                req.flash("loginerror", "Wrong username or password")
                res.redirect("/")
            }
        })
    })

router.use("/adminpage", middleware.redirectLogin, middleware.adminAccess);

router.route("/adminpage")
    .get((req,res)=>{
        con.query("SELECT user_id, user_name,user_station,user_flightNumber FROM usermgt WHERE user_id != 1000 ORDER BY user_id", (err,allUsers)=>{
            if(!err){
                res.render("usermgt/adminpage",{allUsers:allUsers})
            }else{
                console.log(err)
                console.log("//admin page get")
                req.flash("error", "Something went wrong, please log in again")
                res.redirect("/")
            }
        })
        
       
    })
   .post((req,res)=>{
        let user_name = (req.body.username).toUpperCase()
        let user_password = (req.body.password).toUpperCase();
        let user_station = (req.body.userstation).toUpperCase();
        let user_flightNumber = (req.body.userflightnumber).toUpperCase();
        con.query("SELECT * FROM usermgt WHERE user_name ='"+user_name+"'", (err, result)=>{
            if(!err){
                if(result && result.length===0){
                    bcrypt.hash(user_password, saltRounds, function(err, hashedpassword) {
                       if(!err){
                            con.query("INSERT INTO usermgt (user_name,user_password,user_station,user_flightNumber) VALUES ('"+user_name+"','"+hashedpassword+"','"+user_station+"','"+user_flightNumber+"')",(err,newUser)=>{
                                if(!err){
                                    req.flash("success", "New User Added")
                                    res.redirect("/adminpage")
                                }else{
                                    req.flash("error", "Unable to add user, please check the information provided")
                                    res.redirect("/adminpage")
                                }
                            })
                       }else{
                        req.flash("error", "Unable to add user, please check the information provided")
                           res.redirect("/adminpage")
                       }
                    });
                }else {
                    req.flash("error", "User already exists")
                    res.redirect("/adminpage")
                }
            }else{
                console.log(err)
                console.log("//login post admin")
                req.flash("error", "Unable to add user, please check the information provided")
                res.redirect("/adminpage")
            }
            
        }) 
   
    })

router.use("/adminpage/:id", middleware.redirectLogin, middleware.adminAccess);
router.route("/adminpage/:id")
    .delete((req,res)=>{
        let deleteId = req.params.id
        con.query("DELETE FROM usermgt WHERE user_id = "+deleteId, (err)=>{
            if(!err){
                req.flash("success", "User Deleted")
                res.redirect("/adminpage")
            }else{
                console.log(err)
                console.log("//admin id delete page")
                req.flash("error", "Unable to delete user, please check the information provided")
                res.redirect("/adminpage")
            }
        })
        
    })

    router.get('/logout', function(req, res){
        req.session.destroy((err)=>{
            if(!err){
                res.clearCookie(process.env.SESS_NAME)
                res.redirect('/');
            }
        })
       
      });


  
module.exports = router

      