// Requiring The Controller From The adminCurdController page--------------------------->
const curdController=require("../controller/curdController");
// Requiring The adminAuthentication From The middleware-------------------------------->
const authentication=require("../middleware/adminAuth");
// Requiring The adminEmployeeAuth From The middleware  -------------------------------->
const secondAuthentication=require("../middleware/rolefindingAuth");




// Routes For The Admin When he's logged in So he can do curd operation ----------------->
module.exports=(app)=>{

    // Route For Admin,Manager or Employee to get Data According To Their role ----/
    app.get("/managementapp/api/v1/admin/readdatas",authentication.tokenCheck,secondAuthentication.roleFinding, curdController.getUserData);

    // Route For Admin if he wants to Create new employee or user--/
    app.post("/managementapp/api/v1/admin/createdatas",authentication.tokenCheck,authentication.adminCheck, curdController.postAdminCreation);

    
    // Route For Admin  if  he wants to Delete  employee or user--/
    app.delete("/managementapp/api/v1/admin/deletedatas",authentication.tokenCheck,authentication.adminCheck,curdController.adminDeleteUser);

    
    // Route For Admin and Manager  if  he wants to update  user--/
    app.put("/managementapp/api/v1/admin/updatedatas",authentication.tokenCheck,secondAuthentication.roleFinding, curdController.employeeUpdatePutRequest);
}