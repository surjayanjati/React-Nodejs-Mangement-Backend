// Requirirng The Management Collection From The Database---------------------------------------------->
const managementCollection=require("../model/managementModel");
// Requirirng The Jsonwebtoken ------------------------------------------------------------------------>
const jwt=require("jsonwebtoken");


const roleFinding=async(req,res,next)=>{
        try {
            const userObj=await managementCollection.findOne({_id:req.userId});
            if(userObj && userObj.role==="Admin"){
                 req.details={id:req.userId,role:"Admin",data:[]};
                 next();
            }else if(userObj && userObj.role==="manager"){
                req.details={id:req.userId,role:"manager",adminId:userObj.adminId,data:[]};
                next();
            }else if(userObj && userObj.role==="employee") {
                   req.details={id:req.userId,role:"employee",data:userObj};
                   next();
            }else{
            res.send({msg:"Can't Proceed",status:401,success:false});
            }
        } catch (error) {
            res.send({msg:"Internal Server Error",status:500,success:false});
        }
};



module.exports={
    roleFinding:roleFinding
}