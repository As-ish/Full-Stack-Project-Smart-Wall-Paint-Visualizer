const express = require("express");
const Color = require("../models/Color");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /api/colors - public, anyone browsing the visualizer can list colours
router.get("/", async (req, res) => {
  const { category } = req.query;
  const filter = category ? { categoryTags: category } : {};
  const colors = await Color.find(filter).sort({ name: 1 });
  res.json(colors);
});

// POST /api/colors - admin only
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const color = await Color.create(req.body);
    res.status(201).json(color);
  } catch (err) {
    res.status(400).json({ error: "Could not create colour", details: err.message });
  }
});

// PUT /api/colors/:id - admin only
router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  const color = await Color.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!color) return res.status(404).json({ error: "Colour not found" });
  res.json(color);
});

// DELETE /api/colors/:id - admin only
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const color = await Color.findByIdAndDelete(req.params.id);
  if (!color) return res.status(404).json({ error: "Colour not found" });
  res.json({ deleted: true });
});

module.exports = router;
