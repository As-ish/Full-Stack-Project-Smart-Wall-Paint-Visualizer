const mongoose = require("mongoose");

const ColorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    hex: { type: String, required: true, match: /^#([0-9A-Fa-f]{6})$/ },
    rgb: {
      r: Number,
      g: Number,
      b: Number
    },
    brand: { type: String, default: "Repaint Studio" },
    finishOptions: [{ type: String, enum: ["matte", "eggshell", "satin", "semi-gloss", "gloss"] }],
    categoryTags: [{ type: String }], // e.g. "Living Room", "Accent"
    swatchImage: { type: String } // URL to swatch image
  },
  { timestamps: true }
);

module.exports = mongoose.model("Color", ColorSchema);
