// Requiring The Signup Page Controller --------------------------------->
const signupController=require("../controller/signupController");





// Routes For The Signup Page           ---------------------------------->
module.exports=(app)=>{

    // Signup Page Post Request Route For Creating new Data
    app.post("/managementapp/api/v1/users/signupusers",signupController.postSignupPage);
}