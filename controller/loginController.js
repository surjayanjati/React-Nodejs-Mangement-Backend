// Requiring The Collection From The Model --------------------------------->
const managementCollection = require("../model/managementModel");
// Requiring The Bcrypt Module  -------------------------------------------->
const bcrypt = require("bcrypt");
// Requiring The Config/secretKey ------------------------------------------>
const secretKey = require("../config/secretKey");
// Requiring The Jsonwebtoken Module  -------------------------------------------->
const jwt = require("jsonwebtoken");

// Function For Post Request Of Login Page ------------------------------------------------------------------>
exports.postLoginPage = async (req, res) => {
  try {
    // Object Destrcuring for Getting The Values From Request Body -----------------------------/
    const { emailAddress, password } = req.body;
    if (emailAddress !== "" && password !== "") {
      // In The Case Input fld is Filled--/
      const findResult = await managementCollection.find({
        emailAddress: emailAddress,
      });
      if (findResult.length !== 0) {
        // Checking The Password is Matching or Not---/
        let passwordResult = await bcrypt.compare(
          password,
          findResult[0].password
        );
        if (passwordResult === true) {
          if (findResult[0].role === "Admin") {
            // So In The Case of Admin we will Send all The employee and user details this Admin has--------------------------->
            const userDetails = await managementCollection.find({
              adminId: findResult[0]._id,
            });
            if (userDetails.length !== 0) {
              // Creating The Token with Jsonwebtoken---/
              const token = jwt.sign({ id: findResult[0]._id }, secretKey, {
                expiresIn: "2h",
              });
              res.cookie("loginCookie", token, {
                expiresIn: new Date(Date.now() + 3000000),
              });
              res.send({
                msg: "Login Successfull",
                success: true,
                status: 200,
                token: token,
                role:"Admin",
                userDetails: userDetails,
              });
            } else {
              // When Admin Has no User Yet-----------------/
              const token = jwt.sign({ id: findResult[0]._id }, secretKey, {
                expiresIn: "2h",
              });
              res.cookie("loginCookie", token, {
                expiresIn: new Date(Date.now() + 3000000),
              });
              res.send({
                msg: "Login Successfull",
                success: true,
                status: 200,
                token: token,
                userDetails: [],
              });
            }
            // In The Case When The Login Person is Manager-------------------------------------------------------->/
          } else if (findResult[0].role === "manager") {
            // So In The Case of Admin we will Send all The employee and user details this Admin has-/
            const userDetails = await managementCollection.find({
              adminId: findResult[0].adminId,
              role:"employee"
            });
           
            if (userDetails.length !== 0) {
              // Creating The Token with Jsonwebtoken---/
              const token = jwt.sign({ id: findResult[0]._id }, secretKey, {
                expiresIn: "2h",
              });
              res.cookie("loginCookie", token, {
                expiresIn: new Date(Date.now() + 3000000),
              });
              res.send({
                msg: "Login Successfull",
                success: true,
                status: 200,
                token: token,
                role:"manager",
                userDetails: userDetails,
              });
            } else {
              // When Admin Has no User Yet-----------------/
              const token = jwt.sign({ id: findResult[0]._id }, secretKey, {
                expiresIn: "2h",
              });
              res.cookie("loginCookie", token, {
                expiresIn: new Date(Date.now() + 3000000),
              });
              res.send({
                msg: "Login Successfull",
                success: true,
                status: 200,
                token: token,
                userDetails: [],
              });
            }
            // When The Login User is only a Employee----------------------------------------------------->
          } else if (findResult[0].role === "employee") {
            const token = jwt.sign({ id: findResult[0]._id }, secretKey, {
              expiresIn: "2h",
            });
            res.cookie("loginCookie", token, {
              expiresIn: new Date(Date.now() + 3000000),
            });
            res.send({
              msg: "Login Successfull",
              success: true,
              status: 200,
              token: token,
              role:"employee",
              userDetails: findResult,
            });
          }
        } else {
          // In The Case When Password is not matching--/
          res.send({
            msg: "Kindly Check Your Password",
            success: false,
            status: 403,
          });
        }
      } else {
        // In The Case User is not There in The Database
        res.send({ msg: "User Doesn't Exists", success: false, status: 401 });
      }
    } else {
      // In The Case Input Fld is Not Filled -/
      res.send({
        msg: "Kindly Fill All The Details",
        success: false,
        status: 204,
      });
    }
  } catch (error) {
    res.send({ msg: "Internal Server Error", success: false, status: 500 });
  }
};
