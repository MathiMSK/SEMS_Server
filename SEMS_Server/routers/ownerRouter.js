import express from "express";
import { createDept, createMenu,  getAllDept,  getAllMenu,getDeptById,getMenuById,getRoleById, 
    updateDept, updatemenu,  getAllRoles, newRole, updateRole, createCourse, getCourseById,
     getAllCourse, updateCourse, createGender, getGenderById, getAllGender, updateGender, 
     createSports, getSportsById, getAllSports, 
    updateSports} from "../controllers/ownerController.js";
import auth from "../middleware/auth.js";
import authZ from "../middleware/authz.js";

const router = express.Router();

// Roles
router.post("/role/newrole",[auth,authZ],newRole)
router.get("/role/getallrole",[auth,authZ],getAllRoles)
router.get("/role/getrolebyid/:id",[auth,authZ],getRoleById)
router.put("/role/updaterole",[auth,authZ],updateRole)

// Menus 
router.post("/menu/createmenu",[auth,authZ],createMenu)
router.get("/menu/viewmenu/:id",[auth,authZ],getMenuById)
router.get("/menu/getallmenu",[auth,authZ],getAllMenu)
router.put("/menu/upmenu",[auth,authZ],updatemenu)

// Department
router.post("/dept/createdept",[auth,authZ],createDept)
router.get("/dept/getdeptbyid/:id",[auth,authZ],getDeptById)
router.get("/dept/getalldept",[auth,authZ],getAllDept)
router.put("/dept/updatedept",[auth,authZ],updateDept)

//Course
router.post("/course/createcourse",[auth,authZ],createCourse)
router.get("/course/getcoursebyid/:id",[auth,authZ],getCourseById)
router.get("/course/getallcourse",[auth,authZ],getAllCourse)
router.put("/course/updatecourse",[auth,authZ],updateCourse)

//Gender
router.post("/gender/creategender",[auth,authZ],createGender)
router.get("/gender/getgenderbyid/:id",[auth,authZ],getGenderById)
router.get("/gender/getallgender",[auth,authZ],getAllGender)
router.put("/gender/updategender",[auth,authZ],updateGender)

//Sports
router.post("/sports/createsports",[auth,authZ],createSports)
router.get("/sports/getsportsbyid/:id",[auth,authZ],getSportsById)
router.get("/sports/getallsports",[auth,authZ],getAllSports)
router.put("/sports/updatesports",[auth,authZ],updateSports)

export default router;