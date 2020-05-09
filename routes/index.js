module.exports = function(app){
    app.use(require("./usermgt"))
    app.use(require("./stationmgt"))
}