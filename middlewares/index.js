// All middlewares goes here
var middlewareObj = {

};

middlewareObj.redirectLogin = (req,res,next) =>{
    if(!req.session.user_id){
        req.flash("error", "Log in Required")
        res.redirect("/")
    }else{  
        next()
    }
  }

middlewareObj.adminAccess = (req,res,next) =>{
    if(req.session.user_id != 1000){
        req.flash("error", "Access required to view admin page")
        res.redirect("/stationpage")
    }else{
        next()
    }
  }
middlewareObj.userAccess = (req,res,next) =>{
    if(req.session.user_id === 1000){
        req.flash("error", "Access required to view station page")
        res.redirect("/adminpage")
    }else{
        next()
    }
  }
module.exports = middlewareObj
       

 


      