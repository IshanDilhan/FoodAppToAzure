import createHandler from "azure-function-express";
import app from "../index.js"; 

export default createHandler(app);
