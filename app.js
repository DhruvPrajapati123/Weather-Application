const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const city = req.body.cityName;
  const appid = "75deabc7bfb2aa8301f65a321c029fc6";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    appid +
    "&units=metric";
  https.get(url, (response) => {
    if (response.statusCode !== 200) {
      res.sendFile(__dirname + "/error.html");
    } else {
      response.on("data", (data) => {
        const weatherData = JSON.parse(data); // Here we use JSON.parse() method to convert hexadecimal string to json object
        const temperature = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description;
        const weatherIcon = weatherData.weather[0].icon;
        const windSpeed = weatherData.wind.speed;
        const humidity = weatherData.main.humidity;
        const pressure = weatherData.main.pressure;
        const country = weatherData.sys.country;
        const lon = weatherData.coord.lon;
        const lat = weatherData.coord.lat;
        const weatherImgUrl =
          "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
        // res.write(
        //     "<h1>The temperature of the "+ city+" is :  " + temperature + "</h1>"
        // );
        // res.write(
        //     "<h1> The weather is currently:  " + weatherDescription + "</h1>"
        // );
        // res.write("<img src= " + weatherImgUrl + ">");
        // res.send();
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes();
        res.render("result", {
          cityName: city,
          currentTime: time,
          temp: temperature,
          discription: weatherDescription,
          speed: windSpeed,
          hum: humidity,
          imgSrc: weatherImgUrl,
          pressure: pressure,
          country: country,
          lon: lon, 
          lat: lat
        });
      });
    }
  });
});
app.listen(process.env.PORT || 3000, () => {
  "Server is started on port 3000";
});
