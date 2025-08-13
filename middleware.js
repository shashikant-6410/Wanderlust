const isLoggedIn= (req,res,next)=>{
    console.log(req.user);
    if(!req.isAuthenticated()){
    req.flash("error","Login is required to create listings");
   return res.redirect("/login");
  }
  next();
}

module.exports = isLoggedIn;