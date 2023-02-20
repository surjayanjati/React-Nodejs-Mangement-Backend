// Requiring The Mongooose Module      ------------------------------------------------>
const mongoose=require("mongoose");
// Requiring The Validator Module      ------------------------------------------------>
const validator=require("validator");
// Requiring The Bcrypt Module      ------------------------------------------------>
const bcrypt=require("bcrypt")
// Requiring The Config/secretkey File      ------------------------------------------------>
const secretkey=require("../config/secretKey");
mongoose.set('strictQuery', true);
// Connecting To The Mongodb with Mongoose -------------------------------------------->
mongoose.connect("mongodb://localhost/management",()=>{
    console.log("Connection TO The Database Has Been Successfull");
});



// Creating The Collection Shcmea with Mongoose Schema -------------------------------->
const managementSchema=new mongoose.Schema({
    userName:{
       type:String,
       required:true,
       index:true,
       unique:true,
    },
    emailAddress:{
     type:String,
     required:true,
     index:true,
     unique:true,
     validate(value){
        if(!validator.isEmail(value)){
         throw new Error ("Invalid Email")
        }
     }
    },
    password:{
     type:String,
     required:true
    },
    role:{
      type:String,
      default:"Admin"
    },
    adminId:{
      type:String,
    },
    currentId:{
      type:String,
    }
    // managersArray:[{
    //     managerUserName:{
    //          type:String,
    //          required:true
    //     },
    //     manageremailAddress:{
    //          type:String,
    //          required:true
    //     },
    //     managerPassword:{
    //          type:String,
    //          required:true
    //     },
    //     managerId:{
    //     type:String,
    //     required:true
    //     },
    //     role:{
    //      type:String,
    //      required:true,
    //     },
    // }],
    // employeesArray:[{
    //     employeeUserName:{
    //      type:String,
    //      required:true
    //     },
    //     employeeemailAddress:{
    //        type:String,
    //        required:true
    //     },
    //     employeePassword:{
    //       type:String,
    //       required:true
    //     },
    //     employeeId:{
    //       type:String,
    //       required:true
    //     },
    //     role:{
    //     type:String,
    //     required:true
    //     },
    // }]
});

// Hashing The Password Before Storing Inside The Database------------------------------->
managementSchema.pre("save",async function(next){
  if(this.isModified("password")){
    this.password=await bcrypt.hash(this.password,8)
  };
  next();
})


// Exporting The Collection ------------------------------------------------->
module.exports=mongoose.model("managementdetails",managementSchema);