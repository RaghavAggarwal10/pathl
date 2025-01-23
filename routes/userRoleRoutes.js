// import express from "express";
// import UserRole from "../models/UserRole.js";

// const router = express.Router();

// // Assign Role to User
// router.post("/", async (req, res) => {
//   try {
//     const { userId, roleId } = req.body;
//     if (!userId || !roleId) return res.status(400).json({ message: "User ID and Role ID required" });

//     const newUserRole = new UserRole({ userId, roleId });
//     await newUserRole.save();
//     res.status(201).json(newUserRole);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// router.get("/", async (req, res) => {
//   const { userId, roleId } = req.query;
//   const filter = {};
//   if (userId) filter.userId = userId;
//   if (roleId) filter.roleId = roleId;

//   const userRoles = await UserRole.find(filter).populate("userId roleId");
//   res.json(userRoles);
// });

// // Remove Role from User
// router.delete("/:id", async (req, res) => {
//   await UserRole.findByIdAndDelete(req.params.id);
//   res.json({ message: "User-Role assignment removed" });
// });

// export default router;
import express from "express";
import UserRole from "../models/UserRole.js";
import User from "../models/User.js";
import Role from "../models/Role.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    if (!userId || !roleId) {
      return res.status(400).json({ message: "User ID and Role ID are required." });
    }

    const user = await User.findById(userId);
    const role = await Role.findById(roleId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (!role) {
      return res.status(404).json({ message: "Role not found." });
    }

    const existingAssignment = await UserRole.findOne({ userId, roleId });
    if (existingAssignment) {
      return res.status(409).json({ message: "User already assigned this role." });
    }

    const newUserRole = new UserRole({ userId, roleId });
    await newUserRole.save();

    return res.status(201).json(newUserRole);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const { userId, roleId } = req.query;
    const filter = {};
    
    if (userId) filter.userId = userId;
    if (roleId) filter.roleId = roleId;

    const userRoles = await UserRole.find(filter)
      .populate("userId", "name email status")  
      .populate("roleId", "name description"); 
    return res.status(200).json(userRoles);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const userRole = await UserRole.findById(req.params.id);

   
    if (!userRole) {
      return res.status(404).json({ message: "User-Role assignment not found." });
    }

    await UserRole.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "User-Role assignment removed successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
