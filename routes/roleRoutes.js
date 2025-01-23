// import express from "express";
// import Role from "../models/Role.js";

// const router = express.Router();

// // Create Role
// router.post("/", async (req, res) => {
//   try {
//     const { name, description } = req.body;
//     console.log(`${name}`)
//     if (!name) return res.status(400).json({ message: "Role name required" });

//     const newRole = new Role({ name, description });
//     await newRole.save();
//     res.status(201).json(newRole);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get all Roles
// router.get("/", async (req, res) => {
//   const roles = await Role.find();
//   res.json(roles);
// });

// // Get Role by ID
// router.get("/:id", async (req, res) => {
//   const role = await Role.findById(req.params.id);
//   if (!role) return res.status(404).json({ message: "Role not found" });
//   res.json(role);
// });

// // Update Role
// router.put("/:id", async (req, res) => {
//   const updatedRole = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
//   if (!updatedRole) return res.status(404).json({ message: "Role not found" });
//   res.json(updatedRole);
// });

// // Delete Role
// router.delete("/:id", async (req, res) => {
//   await Role.findByIdAndDelete(req.params.id);
//   res.json({ message: "Role deleted" });
// });

// export default router;

import express from "express";
import Role from "../models/Role.js";

const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    
    if (!name) {
      return res.status(400).json({ message: "Role name is required." });
    }

    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(409).json({ message: "Role already exists." });
    }

    
    const newRole = new Role({ name, description });
    await newRole.save();

    return res.status(201).json(newRole);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
});


router.get("/", async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
  
      const roles = await Role.find()
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
  
      const totalRoles = await Role.countDocuments();
  
      return res.status(200).json({
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalRoles / limit),
        totalRoles,
        roles,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
});
  


router.get("/:id", async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "Role not found." });
    }
    return res.status(200).json(role);
  } catch (error) {
    return res.status(400).json({ message: "Invalid role ID." });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { name, description } = req.body;

  
    if (name) {
      const existingRole = await Role.findOne({ name, _id: { $ne: req.params.id } });
      if (existingRole) {
        return res.status(409).json({ message: "Role name already exists." });
      }
    }

    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );

    if (!updatedRole) {
      return res.status(404).json({ message: "Role not found." });
    }

    return res.status(200).json(updatedRole);
  } catch (error) {
    return res.status(400).json({ message: "Invalid request or role ID." });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "Role not found." });
    }
    return res.status(200).json({ message: "Role deleted successfully." });
  } catch (error) {
    return res.status(400).json({ message: "Invalid request or role ID." });
  }
});

export default router;
