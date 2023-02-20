// Requiring The Express Module--------------------------------------------------->
const express=require("express");
// Requiring The Cookie Parser --------------------------------------------------->
const cookie=require("cookie-parser");


// Calling Express Function    -------------------------------------------------->
const app=express();



// Middleware--------------------------------------------------------------------->
app.use(express.json()) // :> So That The Server Can accept the Json Data
app.use(cookie())       // :> So That The Server Can Use The Cookie


// Requriring The Routes For The Signup Page--------------------------------------->
require("./routes/signupRoute")(app)
// Requriring The Routes For The Login Page--------------------------------------->
require("./routes/loginRoute")(app)
// Requiring The Routes For The management page------------------------------------>
require("./routes/curdRoutes")(app);




// Listening To The Port Number 5678 ---------------------------------------------->
app.listen(5678,()=>{
    console.log("Listening To Port Number 5678");
})