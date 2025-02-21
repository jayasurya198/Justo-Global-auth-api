const express = require("express");
const authRoutes = require("./routes/authRoutes");
const linkRoutes = require("./routes/linkRoutes");
const timeRoutes = require("./routes/timeRoutes");
const adminRoutes = require("./routes/adminRoutes");
require("./migration");

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/link", linkRoutes);
app.use("/api/time", timeRoutes);
app.use("/api/admin", adminRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
