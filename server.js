require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/autho-routes");
const homeRoutes = require("./routes/home-routtes");
const adminRoutes = require("./routes/admin-routes");
const imageRoutes = require("./routes/image-routes");
const app = express();


// * database
const connect = require("./db/db");
connect();

//middleware

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/api", homeRoutes);
app.use("/api/auth",authRoutes);
app.use("/api", adminRoutes);
app.use("/api",imageRoutes);

app.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`);
})