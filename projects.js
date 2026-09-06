const express = require("express");
const multer = require("multer");
const path = require("path");
const Project = require("../models/Project");
const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// --- image upload config ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  fileFilter: (req, file, cb) => {
    const ok = /image\/(jpeg|png)/.test(file.mimetype);
    cb(ok ? null : new Error("Only JPG/PNG images are allowed"), ok);
  }
});

// POST /api/projects - create a project from an uploaded room photo
router.post("/", requireAuth, upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "A room photo is required" });
    const project = await Project.create({
      owner: req.user.id,
      title: req.body.title || "Untitled project",
      originalPhotoUrl: `/uploads/${req.file.filename}`
    });
    await User.findByIdAndUpdate(req.user.id, { $push: { savedProjects: project._id } });
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: "Could not create project", details: err.message });
  }
});

// GET /api/projects - list the signed-in user's projects
router.get("/", requireAuth, async (req, res) => {
  const projects = await Project.find({ owner: req.user.id }).sort({ updatedAt: -1 });
  res.json(projects);
});

// GET /api/projects/:id
router.get("/:id", requireAuth, async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, owner: req.user.id })
    .populate("wallSelections.color")
    .populate("wallSelections.pattern");
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(project);
});

// PUT /api/projects/:id - update wall selections / colours / finished preview
router.put("/:id", requireAuth, async (req, res) => {
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    {
      title: req.body.title,
      wallSelections: req.body.wallSelections,
      finalPhotoUrl: req.body.finalPhotoUrl
    },
    { new: true }
  );
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(project);
});

// DELETE /api/projects/:id
router.delete("/:id", requireAuth, async (req, res) => {
  const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json({ deleted: true });
});

module.exports = router;
