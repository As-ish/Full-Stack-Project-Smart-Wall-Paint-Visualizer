const mongoose = require("mongoose");

const WallSelectionSchema = new mongoose.Schema(
  {
    label: { type: String, default: "Wall" },
    // polygon points in image-pixel coordinates, e.g. [[x,y], [x,y], ...]
    polygon: [[Number]],
    color: { type: mongoose.Schema.Types.ObjectId, ref: "Color" },
    pattern: { type: mongoose.Schema.Types.ObjectId, ref: "Pattern" },
    finish: { type: String, default: "matte" },
    brightnessLevel: { type: Number, default: 100 }, // 0-200, 100 = unchanged
    opacity: { type: Number, default: 85 } // 0-100
  },
  { _id: false }
);

const ProjectSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "Untitled project" },
    originalPhotoUrl: { type: String, required: true },
    finalPhotoUrl: { type: String }, // rendered/exported preview
    wallSelections: [WallSelectionSchema]
  },
  { timestamps: true } // createdAt / modifiedAt
);

module.exports = mongoose.model("Project", ProjectSchema);
