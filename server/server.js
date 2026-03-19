import app from "./src/app.js";
import connectDB from "./src/config/db.js";

connectDB();

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port", process.env.PORT || 3000);
});