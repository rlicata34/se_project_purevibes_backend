const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const BadRequestError = require("../utils/errors/BadRequestError");
const NotFoundError = require("../utils/errors/NotFoundError");
const ConflictError = require("../utils/errors/ConflictError");

const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res, next) => {
  const { username, avatar, email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("The email and password fields are required");
  }

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError("A user with this email already exists");
      }
    })
    .then(() => bcrypt.hash(password, 10))
    .then((hash) => User.create({ username, avatar, email, password: hash }))
    .then(() => {
      res.status(201).send({ email, username, avatar });
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(
          new BadRequestError(
            "Invalid request: One or more fields contain invalid data."
          )
        );
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("The email and password fields are required");
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(
          new BadRequestError(
            "Invalid request: One or more fields contain invalid data."
          )
        );
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => {
      const { _id, email, avatar, username } = user;
      res.send({
        _id,
        email,
        avatar,
        username,
      });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Data not found"));
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
  const userId = req?.user?._id;
  const { username, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { username, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail()
    .then((user) => res.send({ username: user.username, avatar: user.avatar }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Data not found"));
      } else if (err.name === "ValidationError" || err.name === "CastError") {
        next(
          new BadRequestError(
            "Invalid request: One or more fields contain invalid data."
          )
        );
      } else {
        next(err);
      }
    });
};

module.exports = { createUser, getCurrentUser, login, updateProfile };
