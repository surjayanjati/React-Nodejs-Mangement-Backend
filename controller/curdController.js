// Requiring The managementCollection From The Model-------------------------------------------->
const { deleteOne } = require("../model/managementModel");
const managementCollection = require("../model/managementModel");
// Requiring The Bcyrpt ------------------------------------------------------------------------>
const bcrypt=require("bcrypt");

/// Function For Create/Post Request For Admin so he can create employee or user----------------->
exports.postAdminCreation = async (req, res) => {
  try {
    const adminId = req.userId;
    // Object Destrcuring For Getting The values From req Body---/
    const { userName, emailAddress, password, role, currentId } = req.body;
    console.log(req.body);
    if (
      userName !== "" &&
      emailAddress !== "" &&
      password !== "" &&
      role !== "" &&
      currentId !== ""
    ) {
      // In The Case Input fld is Filled--/
      const newData = new managementCollection({
        userName: userName,
        emailAddress: emailAddress,
        password: password,
        adminId: adminId,
        role: role,
        currentId: currentId,
      });
      const saveResult = await newData.save();
      if (saveResult !== null) {
        // In The Case The new Data has been successfully Created --/
        res.send({
          msg: `New ${saveResult.role} Has Been Created`,
          success: true,
          status: 201,
        });
      } else {
        // In The Case The new Data has not  been able to Created --/
        res.send({
          msg: `Unable To Create The User`,
          success: false,
          status: 400,
        });
      }
    } else {
      // In The Case Input Fld is Not Filled -/
      res.send({
        msg: "Kindly Fill All The Details",
        success: false,
        status: 204,
      });
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
};

/// Function For Create/Post Request For Admin so he can create employee or user----------------->
exports.adminDeleteUser=async(req,res)=>{
    try {
        const adminId=req.userId;
        if(adminId!=="" && adminId!==undefined){
            // In The Case The Admin is Valid-/
          const userId=req.body.currentId;
          const deleteUserResult=await managementCollection.deleteOne({adminId:adminId,currentId:userId});
          if(deleteUserResult.acknowledged===true){
            res.send({msg:"User Data Has Been Deleted",success:true,status:200})
          }else{
            res.send({msg:"Unable To Delete User",success:false,status:500})
          }
        }else{
            res.send({msg:"Kindly Authenticate Yourself",success:false,status:401})
        }
    } catch (error) {
        console.log(error);
        res.send({msg:"Unable To Delete User",success:false,status:500})
    }
}

/// Function For Put Request For Admin and Manager so he can create employee or user----------------->
exports.employeeUpdatePutRequest=async(req,res)=>{
          try {
            // Object Destrcuring For Getting The Values from Middleware----------------------------->
            const{id,role}=req.details;
            if(role==="Admin"){
              console.log("hitted");
              // In The Case it's Admin----------------------------------/
              const {userName,emailAddress,password,role,currentId}=req.body;
              if(userName!==""&& emailAddress!=="" && password!=="" && role!==""&& currentId!==""){
              const hashPassword=await bcrypt.hash(password,8);
               const updateResult=await managementCollection.updateOne({adminId:id,currentId:currentId},{$set:{userName:userName,emailAddress:emailAddress,password:hashPassword,role:role}});
               if(updateResult.acknowledged===true){
                res.send({msg:"Data Has Been Updated",success:true,status:201});
               }else{
                res.send({msg:"Unable To Update",success:false,status:500});
               }
              }else{
                res.send({
                  msg: "Kindly Fill All The Details",
                  success: false,
                  status: 204,
                });
              }
            }else if(role==="manager"){
              // In The Case it's Manager--------------------------------/
              const {userName,emailAddress,password,role,currentId}=req.body;
              if(userName!==""&& emailAddress!=="" && password!=="" && currentId!==""){
              const hashPassword=await bcrypt.hash(password,8);
               const updateResult=await managementCollection.updateOne({role:"employee",currentId:currentId},{$set:{userName:userName,emailAddress:emailAddress,password:hashPassword}});
               console.log(updateResult);
               if(updateResult.modifiedCount!==0){
                res.send({msg:"Data Has Been Updated",success:true,status:201});
               }else{
                res.send({msg:"Unable To Update",success:false,status:500});
               }
              }else{
                res.send({
                  msg: "Kindly Fill All The Details",
                  success: false,
                  status: 204,
                });
              }
            }else if(role==="employee"){
              res.send({msg:"Employee Not Allowed",success:false,status:403});
            }
          } catch (error) {
            res.send({msg:"Internal Server Error",status:500,success:false});
          }
}

// Controller For Geeting The Data of Users according To Your role ---------------------------------->
exports.getUserData=async(req,res)=>{
      try {
        // Object Destrucuring For Getting The Details From The Middleware----/4
        const {id,role,adminId,data}=req.details;
        if(role==="Admin"){
          const detailsofManagerAndEmployee=await managementCollection.find({adminId:id});
          if(detailsofManagerAndEmployee.length!==0){
            res.send({msg:"Details Fetching Successfull",role:"Admin",status:201,data:detailsofManagerAndEmployee});
          }else{
            // IN The Case This Admin don't have any Manager and Employee Yet
            res.send({msg:"Details Fetching Successfull",role:"Admin",status:201,data:[]});
          }
        }else if(role==="manager"){
            const detailsofEmployees=await managementCollection.find({adminId:adminId,role:"employee"});
            if(detailsofEmployees.length!==0){
              res.send({msg:"Details Fetching Successfull",role:"manager",status:201,data:detailsofEmployees})
            }else{
              // In The Case No Employee is There Yet For This Manager or Admin-/
              res.send({msg:"Details Fetching Successfull",role:"manager",status:201,data:[]});
            }
        }else if(role==="employee"){
          res.send({msg:"Details Fetching Successfull",role:"employee",status:201,data:data});
        }
      } catch (error) {
        res.send({msg:"Internal Server Error",succes:false,status:500})
      }
}