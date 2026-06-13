import app from "./app"; 
import dotenv from "dotenv";
dotenv.config();
app.listen(10888, () => {
    console.log("Web Server Started (port 10888)");
})