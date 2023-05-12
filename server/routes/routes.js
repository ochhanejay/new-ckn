
const router = require("express").Router();
const cknController = require("../controller/cknController");
const authController = require("../controller/authController");
const verifyJWT = require("../controller/middlewares/verifyJWT")
const verifyRoles = require("../controller/middlewares/verifyRoles")

router.get("/getCounterNumber", cknController.getCounterNumber);
router.get("/getTotalByDate", verifyJWT, verifyRoles("admin"), cknController.getTotalByDate);
router.get("/getCknItems", verifyJWT, verifyRoles("admin", "worker", "manager"), cknController.getCknItems);
router.get("/getCknItemsById", verifyJWT, verifyRoles("admin", "worker", "manager"), cknController.getCknItemsById);
router.get("/getCknItemsByDate", verifyJWT, verifyRoles("admin", "worker", "manager"), cknController.getCknItemsByDate);
router.get("/getCknItemsByDateAndStatus", verifyJWT, verifyRoles("admin", "worker", "manager"), cknController.getCknItemsByDateAndStatus);
router.post("/setCknItems", verifyJWT, verifyRoles("admin", "worker", "manager"), cknController.setCknItems);
router.put("/updateCknItems", verifyJWT, verifyRoles("admin", "worker", "manager"), cknController.updateCknItems);
router.put("/deleteCounterNumber", cknController.deleteCounterNumber);
router.delete("/removeCknItemsById", verifyJWT, verifyRoles("admin", "worker", "manager"), cknController.removeCknItemsById);
// router.post("/signIn", cknController.signIn);
router.post("/logIn", authController.handleLogin);
router.post("/signUp", cknController.signUp);



module.exports = router;
