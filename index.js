const express = require("express");
const cors = require("cors");
const { connection } = require("./config/db");
const { authentication } = require("./middlewares/authentication");

const app = express();

const userRoutes = require("./routes/users.routes");
const planRoutes = require("./routes/plans.routes");
const videoRoutes = require("./routes/videos.routes");
const purchasePlanRoutes = require("./routes/purchasePlan.routes");

app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(express.static("public"));

app.use("/api/users", userRoutes);

app.use(authentication);
app.use("/api/plans", planRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/purchase-plan", purchasePlanRoutes);

app.listen(8000, async () => {
  try {
    await connection();
    console.log("Server is running on port 8000");
  } catch (error) {
    console.error("Server connection Error", error);
    process.exit(1);
  }
});
