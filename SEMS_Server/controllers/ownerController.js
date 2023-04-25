import Role from "../models/roleModel.js";
import Menu from "../models/menuModel.js";
import Department from "../models/departmentModel.js";
import Course from "../models/courseModel.js";
import Gender from "../models/genderModel.js";
import Sports from "../models/sportsModel.js";


// Create and Save a new Role
export const newRole = async (req, res) => {
   try {
      let rolEname = req.body.roleName;
      if (!req.body.roleName) {
        return res.status(400).json({ message: "please enter role name" });
      }
      const arr = rolEname.split(" ");
      let roleN = arr.map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()).join(" ");
      let exRole = await Role.findOne({ roleName: roleN });
      if (exRole) return res.status(400).json({ message: "role already exists" });
      let roleCodeGen = async () => {
        let roleNa = req.body.roleName
          .replace(" ", "")
          .replace()
          .substring(0, 3)
          .toUpperCase();
        let genCode = Math.floor(Math.random() * (999 - 100 + 1) + 100);
        let sameCode = await Role.findOne({ roleCode: roleNa + genCode });
        return sameCode ? roleCodeGen() : roleNa + genCode;
      };
      let realRoleCode = await roleCodeGen();
      let role = new Role({
        roleName: roleN,
        roleCode: realRoleCode,
      });
      try {
        await role.save();
        res.status(201).json({ message: "role created successfully" });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // Retrieve all Roles from the database.
  export const getAllRoles = async (req, res) => {
    try {
      const { roleName, isActive, isBlock } = req.query;
      const filter = {};
      if (isActive) {
        filter.isActive = isActive;
      }
      if (isBlock) {
        filter.isBlock = isBlock;
      }
      const roles = await Role.find(filter);
      if (roles.length === 0)
        return res.status(200).json({ message: "no data found" });
      res.status(200).json({data:roles});
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
  
  
  // Find a single Role with an id
  export const getRoleById = async (req, res) => {   try {
      const role = await Role.findById({ _id: req.params.id });
      if (!role) return res.status(404).json({ message: "role not found" });
      res.status(200).json({data:role});
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
  
  // Update a Role by the id in the request
  export const updateRole = async (req, res) => {
     try {
      if (req.body.roleName) {
        let roleN =
          req.body.roleName.charAt(0).toUpperCase() +
          req.body.roleName.slice(1).toLowerCase();
        req.body.roleName = roleN;
      }
      const theRole = await Role.findById({ _id: req.query.id });
      if (!theRole) return res.status(404).json({ message: "role not found" });
      const params = Object.keys(req.body);
      const allowedUpdates = ["roleName", "isActive", "isBlock", "menuId"];
      const isValidOperation = params.every((param) =>
        allowedUpdates.includes(param)
      );
      if (!isValidOperation)
        return res.status(400).json({ message: "invalid key" });
        await Role.findByIdAndUpdate(
        { _id: req.query.id },
        { $set: req.body },
        { new: true }
      );
      res.status(200).json({ message: "role updated successfully" });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
    
  
  //Menu Controller
  export const createMenu = async (req, res) => {  
    let menu = req.body.menuName;
      if(!menu){return res.status(400).json({message:"please provide menu name"})}
      menu=menu?.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
      let menuName=menu?.replace(" ", "").substring(0,3).toUpperCase()
      let ranNo=Math.floor(Math.random()*(999-100+1)+100)
      let menuCode=menuName+ranNo;
     
      const found = await Menu.findOne({ menuName: menu });
      if (found) return res.status(400).json({ message: "Menu already exists" });
      try {
          const data = await new Menu({
              menuName: menu,
              menuCode: menuCode,
          });
          await data.save();
          res.status(201).json({ message: "Menu Created" });
      } catch (error) {
          res.status(400).json({ message: error.message });
      }
  };
  
  export const getMenuById = async (req, res) => {
        try {
          let id = req.params.id;
          const menu = await Menu.findById({ _id: id });
          if (!menu)  return res.status(400).json({ mesage: "Sorry no menu has right now for this menu id" });
          res.status(200).json({ data: menu });
      } catch (error) {
          res.status(400).json({ message: error.message });
      }
  };
  
  export const getAllMenu=async(req,res)=>{
    try {
        let {isActive,isBlock}=req.query
        let filter={}
        if(isActive) filter.isActive=isActive
        if(isBlock) filter.isBlock=isBlock
        const menu= await Menu.find(filter)
        if(menu.length==0) return res.status(400).json({mesage:"Sorry no menu has right now for menu"})
        res.status(200).json({data:menu})
    } catch (error) {
        res.status(400).json({message:error.message});
    }
  }
  
  export const updatemenu=async(req,res)=>{
       try {
        let id=req.query.id
        if(!id) return res.status(400).json({message:"please provide menu id in query"})
        const menuName = req.body.menuName
        const menuCode= req.body.menuCode 
        if(menuCode) return res.status(400).json({message:"sorry, you can't update menu code"})
        let xmenu = await Menu.findByIdAndUpdate({_id:id},{$set:req.body},{new:true})
        if(!xmenu) return res.status(404).json({message:`menu is not found`})
        res.status(200).json({message:"Menu Updated"})
    } catch (error) {
        res.status(400).json({message:error.message});
    }
  }
// Dept Controller
  export const getAllDept= async(req,res)=>{ 
    try {
        let {isActive,isBlock}=req.query
        let filter={}
        if(isActive) filter.isActive=isActive
        if(isBlock) filter.isBlock=isBlock
        const view = await Department.find(filter)
        if (view.length==0) return res.status(400).json({ message: "department not found" })
        res.status(200).json({ data: view })
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getDeptById = async (req, res) => {
  try {
    const view = await Department.findById({ _id:req.params.idid });
    res.status(200).json({ data: view });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createDept = async (req, res) => {
  try {
    let dept = req.body.deptName;
    let depName = dept?.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
      letter.toUpperCase()
    );
    if (!dept)
      return res
        .status(400)
        .json({ message: "please provide department name" });
    dept = dept?.charAt(0).toUpperCase() + dept.slice(1);
    let exDept = await Department.findOne({ deptName: dept });
    if (exDept) return res.status(400).json({ message: "Department already added" });
    let generateCode = async () => {
      let code = dept?.replace(" ", "")?.substring(0, 3).toUpperCase();
      let math = Math.floor(Math.random() * (999 - 100 + 1) + 100);
      let foundAlready = await Department.findOne({
        deptCode: `${code}${math}`,
      });
      return foundAlready ? generateCode() : code + math;
    };
    let deptCode = await generateCode();
    let createDept = new Department({
      deptName: depName,
      deptCode: deptCode,
    });
    try {
      await createDept.save();
      res.status(201).json({ message: "Department added success" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateDept=async(req,res)=>{
    try {
        let id=req.query.deptid
        if(req.body.deptName){
            req.body.deptName=req.body.deptName?.toLowerCase()
            req.body.deptName=req.body.deptName?.charAt(0).toUpperCase() + req.body.deptName.slice(1)
        } 
        if (!id) return res.status(400).json({ message: "please provide department id in query" })
        let found=await Department.findById({_id:id})
        if(!found) return res.status(400).json({message:"department not found"})
        let up=await Department.findByIdAndUpdate({_id:id},{$set:req.body},{new:true})
        res.status(200).json({message:"department Updated"})
    } catch (error) {
        res.status(400).json({message:error.message});
    }
};


/* Course Controller */
export const createCourse = async (req, res) => {
  try {
    let departmentId = req.query.departmentId;
    let couName= req.body.courseName;
    let courseName = couName?.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
      letter.toUpperCase()
    );
    if (!couName) return res.status(400).json({ message: "please provide course name" });
    if(!departmentId) return res.status(400).json({message:"please provide department id in query"})
    couName = couName?.charAt(0).toUpperCase() + couName.slice(1);
    let excourse = await Course.findOne({ courseName: couName });
    if (excourse) return res.status(400).json({ message: "Course already added" });
    let generateCode = async () => {
      let code = couName?.replace(" ", "")?.substring(0, 3).toUpperCase();
      let math = Math.floor(Math.random() * (999 - 100 + 1) + 100);
      let foundAlready = await Course.findOne({
        courseCode: `${code}${math}`,
      });
      return foundAlready ? generateCode() : code + math;
    };
    let courseCode = await generateCode();
    let createCourse = new Course({
      departmentId:departmentId,
      courseName: courseName,
      courseCode: courseCode,
    });
    try {
      await createCourse.save();
      res.status(201).json({ message: "Course added success" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCourse = async (req, res) => {
  let id = req.query.id;
  if (!id) return res.status(400).json({ message: "please provide Course id in query" });
  try {
    const courseCode = req.body.CourseCode;
    if (!courseCode) {
      let excourse = await Course.findByIdAndUpdate( { _id:id }, { $set: req.body }, { new: true } );
      if (!excourse) return res.status(404).json({ message: `Course not found` });
      res.status(200).json({ message: "Course updated success" });
    } else {
      res.status(400).json({ message: "cannot update Course code" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllCourse = async (req, res) => {
  try {
    let {isActive,isBlock}=req.query
    let filter={}
    if(isActive) filter.isActive=isActive
    if(isBlock) filter.isBlock=isBlock
    const course = await Course.find(filter).populate('departmentId');
    if (!course)
      return res.status(404).json({ mesage: "Sorry no Course data's" });
    res.status(200).json({ data: course });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const coursesingle = await Course.findById({ _id: req.params.id });
    if (!coursesingle)
      return res.status(404).json({ message: "Course not found" });
    res.status(200).json({ data: coursesingle });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* Gender Controller */
export const createGender = async (req, res) => {
  try {
    let couName= req.body.genderName;
    let genderName = couName?.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
      letter.toUpperCase()
    );
    if (!couName) return res.status(400).json({ message: "please provide gender name" });
    couName = couName?.charAt(0).toUpperCase() + couName.slice(1);
    let exgender = await Gender.findOne({ genderName: couName });
    if (exgender) return res.status(400).json({ message: "Gender already added" });
    let generateCode = async () => {
      let code = couName?.replace(" ", "")?.substring(0, 3).toUpperCase();
      let math = Math.floor(Math.random() * (999 - 100 + 1) + 100);
      let foundAlready = await Gender.findOne({
        genderCode: `${code}${math}`,
      });
      return foundAlready ? generateCode() : code + math;
    };
    let genderCode = await generateCode();
    let createGender = new Gender({
      genderName: genderName,
      genderCode: genderCode,
    });
    try {
      await createGender.save();
      res.status(201).json({ message: "Gender added success" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateGender = async (req, res) => {
  let id = req.query.id;
  if (!id) return res.status(400).json({ message: "please provide Gender id in query" });
  try {
    const genderCode = req.body.GenderCode;
    if (!genderCode) {
      let exgender = await Gender.findByIdAndUpdate( { _id:id }, { $set: req.body }, { new: true } );
      if (!exgender) return res.status(404).json({ message: `Gender not found` });
      res.status(200).json({ message: "Gender updated success" });
    } else {
      res.status(400).json({ message: "cannot update Gender code" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllGender = async (req, res) => {
  try {
    let {isActive,isBlock}=req.query
    let filter={}
    if(isActive) filter.isActive=isActive
    if(isBlock) filter.isBlock=isBlock
    const gender = await Gender.find(filter)
    if (!gender)
      return res.status(404).json({ mesage: "Sorry no Gender data's" });
    res.status(200).json({ data: gender });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getGenderById = async (req, res) => {
  try {
    const gendersingle = await Gender.findById({ _id: req.query .id });
    if (!gendersingle)
      return res.status(404).json({ message: "Gender not found" });
    res.status(200).json({ data: gendersingle });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* Sports Controller */
export const createSports = async (req, res) => {
  try {
    let genderId = req.query.genderId;
    let couName= req.body.sportsName;
    let sportsName = couName?.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
      letter.toUpperCase()
    );
    if (!couName) return res.status(400).json({ message: "please provide sports name" });
    if(!genderId) return res.status(400).json({message:"please provide gender id in query"})
    couName = couName?.charAt(0).toUpperCase() + couName.slice(1);
    let exsports = await Sports.findOne({ sportsName: couName,genderId:genderId });
    if (exsports) return res.status(400).json({ message: "Sports already added" });
    let generateCode = async () => {
      let code = couName?.replace(" ", "")?.substring(0, 3).toUpperCase();
      let math = Math.floor(Math.random() * (999 - 100 + 1) + 100);
      let foundAlready = await Sports.findOne({
        sportsCode: `${code}${math}`,
      });
      return foundAlready ? generateCode() : code + math;
    };
    let sportsCode = await generateCode();
    let createSports = new Sports({
      genderId:genderId,
      sportsName: sportsName,
      sportsCode: sportsCode,
    });
    try {
      await createSports.save();
      res.status(201).json({ message: "Sports added success" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSports = async (req, res) => {
  let id = req.query.id;
  if (!id) return res.status(400).json({ message: "please provide Sports id in query" });
  try {
    const sportsCode = req.body.SportsCode;
    if (!sportsCode) {
      let exsports = await Sports.findByIdAndUpdate( { _id:id }, { $set: req.body }, { new: true } );
      if (!exsports) return res.status(404).json({ message: `Sports not found` });
      res.status(200).json({ message: "Sports updated success" });
    } else {
      res.status(400).json({ message: "cannot update Sports code" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllSports = async (req, res) => {
  try {
    let {isActive,isBlock}=req.query
    let filter={}
    if(isActive) filter.isActive=isActive
    if(isBlock) filter.isBlock=isBlock
    const sports = await Sports.find(filter).populate('genderId');
    if (!sports)
      return res.status(404).json({ mesage: "Sorry no Sports data's" });
    res.status(200).json({ data: sports });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getSportsById = async (req, res) => {
  try {
    const sportssingle = await Sports.findById({ _id: req.params.id });
    if (!sportssingle)
      return res.status(404).json({ message: "Sports not found" });
    res.status(200).json({ data: sportssingle });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
