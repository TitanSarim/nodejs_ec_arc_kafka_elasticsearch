const express = require("express");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5200;

app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
