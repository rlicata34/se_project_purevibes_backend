const Event = require("../models/event");

const ConflictError = require("../utils/errors/ConflictError");
const NotFoundError = require("../utils/errors/NotFoundError");
const ForbiddenError = require("../utils/errors/ForbiddenError");

const getEvents = (req, res, next) => {
  Event.find({ owner: req.user._id })
    .then((events) => res.send(events))
    .catch(next);
};

// const getSingleBookmarkedEvent = (req, res, next) => {
//   const { eventId } = req.params;
//   const userId = req.user._id;

//   Event.findOne({ eventId, owner: userId })
//     .orFail(() => new NotFoundError("Bookmarked event not found"))
//     .then((event) => res.send(event))
//     .catch(next);
// };

const createEvent = (req, res, next) => {
  const { name, startDateTime, venue, image, url, eventId } = req.body;
  const userId = req?.user?._id;

  Event.findOne({ owner: userId, eventId })
    .then((existingEvent) => {
      if (existingEvent) {
        throw new ConflictError("You have already added this event.");
      }
      return Event.create({
        name,
        startDateTime,
        venue,
        image,
        url,
        eventId,
        owner: userId,
      });
    })
    .then((event) =>
      res.status(201).send({
        message: "Event added successfully!",
        event,
      })
    )
    .catch(next);
};

const deleteEvent = (req, res, next) => {
  const { eventId } = req.params;
  const userId = req.user._id;

  Event.findOne({ eventId, owner: userId })
    .orFail(() => new NotFoundError("Event with the specified ID not found"))
    .then((event) => {
      if (String(event.owner) !== String(userId)) {
        throw new ForbiddenError(
          "You do not have permission to delete this event"
        );
      }
      return event
        .deleteOne()
        .then(() => res.send({ message: "Event successfully deleted" }));
    })
    .catch(next);
};

const addBookmark = (req, res, next) => {
  const { eventId } = req.params;
  const userId = req.user._id;

  Event.findOne({ eventId, owner: userId })
    .orFail(() => new NotFoundError("Event not found in your bookmarks"))
    .then(() =>
      Event.findOneAndUpdate(
        { eventId, owner: userId },
        { $addToSet: { bookmarks: userId } },
        { new: true }
      )
    )
    .then((updatedEvent) => res.send(updatedEvent))
    .catch(next);
};

const removeBookmark = (req, res, next) => {
  const { eventId } = req.params;
  const userId = req.user._id;

  Event.findOne({ eventId, owner: userId })
    .orFail(() => new NotFoundError("Event not found in your bookmarks"))
    .then(() =>
      Event.findOneAndUpdate(
        { eventId, owner: userId },
        { $pull: { bookmarks: userId } },
        { new: true }
      )
    )
    .then((updatedEvent) => res.send(updatedEvent))
    .catch(next);
};

module.exports = {
  createEvent,
  deleteEvent,
  addBookmark,
  removeBookmark,
  getEvents,
  getSingleBookmarkedEvent,
};
