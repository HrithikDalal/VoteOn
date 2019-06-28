

// all the middleare goes here
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that!");
    res.redirect("/login");
}
middlewareObj.isAdmin=function(req,res,next){
    if(req.user.isAdmin==true){
        return next();
    }req.flash("error","You need to be a Admin to do that!");
    res.redirect("/home");
}

module.exports = middlewareObj;