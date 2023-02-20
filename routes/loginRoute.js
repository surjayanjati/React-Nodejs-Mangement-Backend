// Requiring The Login Page Controller --------------------------------->
const loginController=require("../controller/loginController");





// Routes For The Signup Page           ---------------------------------->
module.exports=(app)=>{

    // Signup Page Post Request Route For Creating new Data
    app.post("/managementapp/api/v1/users/loginusers",loginController.postLoginPage);
}