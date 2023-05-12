
const router = require("express").Router();
const categoryController = require("../controller/categoryController");
const verifyJWT= require("../controller/middlewares/verifyJWT");
const verifyRoles= require("../controller/middlewares/verifyRoles");

router.post("/addCategory",verifyJWT,verifyRoles("admin","manager"),categoryController.addCategory);
router.get("/getCategory",verifyJWT,verifyRoles("admin","worker","manager"),categoryController.getCategory);
router.put("/updateCategory",verifyJWT,verifyRoles("admin","manager"),categoryController.updateCategory);
router.post("/addDailyExpenses",verifyJWT,verifyRoles("admin","worker","manager"),categoryController.addDailyExpenses);
router.get("/getDailyExpensesByDate",verifyJWT,verifyRoles("admin","worker","manager"),categoryController.getDailyExpensesByDate);
router.put("/updateDailyExpenses",verifyJWT,verifyRoles("admin","worker","manager"),categoryController.updateDailyExpenses);
router.post("/addMonthlyExpenses",verifyJWT,verifyRoles("admin","manager"),categoryController.addMonthlyExpenses);
router.get("/getMonthlyExpensesByDate",verifyJWT,verifyRoles("admin","manager"),categoryController.getMonthlyExpensesByDate);
router.put("/updateMonthlyExpenses",verifyJWT,verifyRoles("admin","manager"),categoryController.updateMonthlyExpenses);
router.put("/updateAllDailyExpenses",verifyJWT,verifyRoles("admin","manager"),categoryController.updateAllDailyExpenses);
router.put("/updateAllMonthlyExpenses",verifyJWT,verifyRoles("admin","manager"),categoryController.updateAllMonthlyExpenses);


module.exports = router;
