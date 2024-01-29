var fs = require("fs");

fs.readFile("./ZigzagIndicator/test.json", "utf-8", (err, data) => {
  data = JSON.parse(data);
  console.log(data);
});

const findFirstCandleIsMaxOrMin = (data, minPercentage) => {
  for (let index = 0; index < data.length; index++) {
    const candle = data[index];
  }
};
