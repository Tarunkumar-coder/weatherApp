const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace(
    "{%tempval%}",
    (orgVal.main.temp - 273.15).toFixed(2)
  );
  temperature = temperature.replace(
    "{%tempmin%}",
    (orgVal.main.temp_min - 273.15).toFixed(2)
  );
  temperature = temperature.replace(
    "{%tempmax%}",
    (orgVal.main.temp_max - 273.15).toFixed(2)
  );
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
  return temperature;
};
const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=Bhubaneshwar&appid=977694ae726742d6db91ce98704e1c48"
    )
      .on("data", function (chunk) {
        const objData = JSON.parse(chunk);
        const arrData = [objData];
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realTimeData);
      })
      .on("end", function (err) {
        if (err) return console.log("connection closed due to errors", err);

        console.log("end");
      });
  }
});

server.listen(8000, "127.0.0.1");
