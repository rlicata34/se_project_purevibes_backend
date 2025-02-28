const router = require("express").Router();
const { auth } = require("../middlewares/auth");
// const { validateCardBody, validateId } = require("../middlewares/validation");
const {
  createEvent,
  deleteEvent,
  addBookmark,
  removeBookmark,
  getEvents,
} = require("../controllers/events");

router.get("/", auth, getEvents);
router.post("/", auth, createEvent);
router.delete("/:eventId", auth, deleteEvent);
router.put("/:eventId/bookmarks", auth, addBookmark);
router.delete("/:eventId/bookmarks", auth, removeBookmark);

module.exports = router;
