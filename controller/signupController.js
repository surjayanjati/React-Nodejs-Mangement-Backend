// Requiring The Collection From The Model --------------------------------->
const managementCollection=require("../model/managementModel");





// Post Request Controller For signupPage  --------------------------------->
exports.postSignupPage=async (req,res)=>{
    try {
        
        // object destructuring For Getting The Values from Request Body-/
        const {userName,userEmail,userPassword}=req.body;
        
        if(userName!=="" && userEmail!=="" && userPassword!==""){
         const insertData=new managementCollection({
            userName:userName,
            emailAddress:userEmail,
            password:userPassword
         });
         
         // Saving The Document Inside The Collection-------------------/
         const saveDataResult=await insertData.save();
         
         if(saveDataResult!==null){
            res.send({msg:"Signup Successfull",success:true,status:200});
         }else{
            res.send({msg:"Unable To Signup",success:true,status:500});
         }
        }else{
            // In The Case The user have left some input fld to fill-----/
            res.send({msg:"Kindly Fill All The Details",success:false,status:204})
        }
    } catch (err) {
        
        if(err.code===11000){
            const msg=err.message;
            // In The Case There is a duplicate Value inside The Database-/
           const positionOfuserName=msg.search("userName");
           const positionOfuserEmail=msg.search("emailAddress");
           if(positionOfuserEmail!==-1){
            res.send({msg:"Email Already Exists",success:false,status:204});
           }else if(positionOfuserName!==-1){
            res.send({msg:"Name Already Exists",success:false,status:204});
           }
        }else{
            // In The Email is Wrong ------------------------------------/
            const msg=err.message;
            const finalMessage=msg.slice(50)
            res.send({msg:finalMessage,success:false,status:406});
        }
        
    }
}