// Requiring The Secret Key From The Config Folder------------------------------>
const secretKey=require("../config/secretKey");
// Requiring The jsonwebtoke --------------------------------------------------->
const jwt=require("jsonwebtoken");
// Requiring The management Collection ------------------------------------------>
const managementCollection=require("../model/managementModel");


// Function For Checking the user is Admin or Not-------------------------------->
const tokenCheck=(req,res,next)=>{
    try {
        const token=req.headers['access-token'];
        if(token!=="" && token!==undefined){
            // In The case Token is There From Client side-----/
           jwt.verify(token,secretKey,function(err,decode){
            if(err){
                return res.send({msg:"Kindly Authenticate Yourself",success:false,status:401})
            }else{
                // Sending The admin Id in the Case The user is authenticated-/
                req.userId=decode.id;
                next();
            }
           })
        }else{
            res.send({msg:"Kindly Authenticate Yourself",success:false,status:401})
        }
    } catch (error) {
        res.send({msg:"Kindly Authenticate Yourself",type:error,success:false,status:401})
    }
}
const adminCheck=async (req,res,next)=>{
    try {
        const userObj=await managementCollection.findOne({_id:req.userId});
        console.log(userObj);
        if(userObj && userObj.role==="Admin"){
            next();
        }else{
            return res.send({msg:"Only Admin is Allowed",success:false,status:401});
        }
    } catch (error) {
        res.send({msg:"Error While Checking Admin",success:false,status:500})
    }
};

module.exports={
    tokenCheck:tokenCheck,
    adminCheck:adminCheck,
}