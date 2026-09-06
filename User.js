const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    favoriteColors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Color" }],
    favoritePatterns: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pattern" }],
    savedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }]
  },
  { timestamps: true } // gives createdAt (account creation date) / updatedAt
);

module.exports = mongoose.model("User", UserSchema);
