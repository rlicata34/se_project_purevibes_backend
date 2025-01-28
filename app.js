require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const { PORT = 3001 } = process.env;

app.use(cors());
app.use(express.json());

app.get("/api/events", (req, res) => {
  const { genre, artist, city, startDate, endDate } = req.query;

  const ticketmasterURL = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.TICKETMASTER_API_KEY}&classificationName=${genre}&keyword=${artist}&city=${city}&startDateTime=${startDate}&endDateTime=${endDate}`;

  axios
    .get(ticketmasterURL)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
