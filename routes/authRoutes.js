const express = require("express");
const { registerController, loginController ,currentUserController } = require("../controllers/authController");
const authMiddelware = require ("../middlewares/authMiddelware")
const router = express.Router();

//register || post req
router.post("/register" ,registerController)

//login || post req
router.post("/login" , loginController)

//get cuurent user || get req
router.get("/current-user" ,authMiddelware ,currentUserController);

module.exports = router; 