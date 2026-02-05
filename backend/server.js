const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
    origin: "*"
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;
const API_KEY = process.env.WEATHER_API_KEY;

console.log("API KEY:", API_KEY);



// TEST ROUTE
app.get("/", (req, res) => {
    res.send("Weather API is running...");
});


// WEATHER ROUTE
app.get("/weather", async (req, res) => {

    const city = req.query.city;

    if (!city) {
        return res.status(400).json({
            error: "City is required"
        });
    }

    try {

        const weatherUrl =
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

        const response = await axios.get(weatherUrl);

        res.json(response.data);

    } catch (error) {

        res.status(500).json({
            error: "Failed to fetch weather data"
        });
    }
});

app.get("/weatherByCoords", async (req, res) => {

    const { lat, lon } = req.query;

    try {

        const url =
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

        const response = await axios.get(url);

        res.json(response.data);

    } catch (error) {

        res.status(500).json({
            error: "Failed to fetch location weather"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
