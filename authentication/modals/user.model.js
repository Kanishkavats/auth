// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   email: String,
//   password: String,
//   isVerified: { type: Boolean, default: false }
// });

// export default mongoose.model("User", userSchema);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  isVerified: { type: Boolean, default: false }
});

export default mongoose.models.User || mongoose.model("User", userSchema);