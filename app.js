require("dotenv").config();
console.log("Loaded API Key:", process.env.TICKETMASTER_API_KEY);
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const { PORT = 3001 } = process.env;

app.use(cors());
app.use(express.json());

app.get("/api/events", (req, res) => {
  let { genre, artist, stateCode, startDate, endDate } = req.query;

  // Prevent undefined values
  genre = genre || "";
  artist = artist || "";
  stateCode = stateCode || "";
  startDate = startDate || "";
  endDate = endDate || "";

  const ticketmasterURL = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.TICKETMASTER_API_KEY}&classificationName=${genre}&keyword=${artist}&stateCode=${stateCode}&startDateTime=${startDate}&endDateTime=${endDate}`;

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
