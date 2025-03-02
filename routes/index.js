const router = require("express").Router();
const userRouter = require("./users");
const eventRouter = require("./events");

const { createUser, login } = require("../controllers/users");
const NotFoundError = require("../utils/errors/NotFoundError");

router.post("/signup", createUser);
router.post("/signin", login);
router.use("/users", userRouter);
router.use("/events", eventRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
