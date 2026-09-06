const mongoose = require("mongoose");

const PatternSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    category: { type: String }, // e.g. "Floral", "Geometric"
    imageUrl: { type: String, required: true },
    dimensions: {
      widthCm: Number,
      heightCm: Number,
      scale: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pattern", PatternSchema);
