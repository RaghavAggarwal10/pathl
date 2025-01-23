// import express from "express";
// import User from "../models/User.js";

// const router = express.Router();

// // Create User
// router.post("/", async (req, res) => {
//   try {
//     const { name, email } = req.body;
//     if (!name || !email) return res.status(400).json({ message: "Missing fields" });

//     const newUser = new User({ name, email });
//     await newUser.save();
//     res.status(201).json(newUser);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get all Users (optional filter by status)
// router.get("/", async (req, res) => {
//   try {
//     const { status } = req.query;
//     const users = await User.find(status ? { status } : {});
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Get a User by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Update User
// router.put("/:id", async (req, res) => {
//   console.log(req.body)
//   try {
//     const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updatedUser) return res.status(404).json({ message: "User not found" });
//     res.json(updatedUser);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Soft Delete User
// router.delete("/:id", async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(req.params.id, { status: "Inactive" }, { new: true });
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json({ message: "User deactivated" });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// export default router;

import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const newUser = new User({ name, email });
    await newUser.save();

    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    let filter = {};

    
    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const users = await User.find(filter)
      .skip((page - 1) * limit) 
      .limit(parseInt(limit)); 

    const totalUsers = await User.countDocuments(filter); 

    return res.status(200).json({
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      users,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: "Invalid user ID." });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { name, email, status } = req.body;

    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (existingUser) {
        return res.status(409).json({ message: "Email is already in use by another user." });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, { name, email, status }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(400).json({ message: "Invalid request or user ID." });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: "Inactive" }, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ message: "User deactivated successfully." });
  } catch (error) {
    return res.status(400).json({ message: "Invalid request or user ID." });
  }
});

export default router;
