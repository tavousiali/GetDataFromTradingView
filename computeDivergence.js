var fs = require("fs");
let technicalShapes = `const showMoreData = (fromDate) => {
  const from = Math.round(fromDate.getTime() / 1000);
  const to = Math.round(new Date().getTime() / 1000);
  tvWidget.activeChart().setVisibleRange({ from, to });
};
showMoreData(new Date(2010, 0, 0));

setTimeout(() => {
  tvWidget.activeChart().removeAllShapes();

`;

const findMacdExtermum = (data, fourPoints) => {
  const firstLine = data.filter(
    (x) => x.time >= fourPoints[0].time && x.time < fourPoints[1].time
  );
  const maxMacdInFirstPoint = Math.max(...firstLine.map((x) => x.macd));
  const point1 = data.find(
    (x) => x.time === firstLine.find((x) => x.macd === maxMacdInFirstPoint).time
  );

  const secondLine = data.filter(
    (x) => x.time >= fourPoints[1].time && x.time < fourPoints[2].time
  );
  const minMacdInSecondPoint = Math.min(...secondLine.map((x) => x.macd));
  const point2 = data.find(
    (x) =>
      x.time === secondLine.find((x) => x.macd === minMacdInSecondPoint).time
  );

  const thirdLine = data.filter(
    (x) => x.time >= fourPoints[2].time && x.time < fourPoints[3].time
  );
  const maxMacdInThirdPoint = Math.max(...thirdLine.map((x) => x.macd));
  const point3 = data.find(
    (x) => x.time === thirdLine.find((x) => x.macd === maxMacdInThirdPoint).time
  );

  const forthLine = data.filter(
    (x) => x.time >= fourPoints[3].time && x.time < fourPoints[4].time
  );
  const minMacdInForthPoint = Math.min(...forthLine.map((x) => x.macd));
  const point4 = data.find(
    (x) => x.time === forthLine.find((x) => x.macd === minMacdInForthPoint).time
  );

  return [point1, point2, point3, point4];
};

const computeDivergence = (fileName) => {
  const symbolName = fileName.split(".")[0];
  let data = fs.readFileSync("./StockData/" + fileName, "utf-8");
  data = JSON.parse(data);
  let zigzagIsNotNull = data.filter(
    (x) => x.zigzag !== null && x.time >= 1367123400 //زمگسا
  );

  for (let index = 0; index < zigzagIsNotNull.length - 4; index++) {
    const points = getPoints(zigzagIsNotNull, index, 5);
    const fourPoints = points.slice(0, 4);

    // if (fourPoints[0].persianDate === "۱۳۹۳/۲/۷") debugger;
    const maxFourPoints = Math.max(...fourPoints.map((x) => x.high));
    const minFourPoints = Math.min(...fourPoints.map((x) => x.low));

    //MACD Divergence
    if (
      fourPoints[0].high === maxFourPoints &&
      fourPoints[3].low === minFourPoints
    ) {
      const macdFourPoints = findMacdExtermum(data, points);
      const maxMacdFourPoints = Math.max(...fourPoints.map((x) => x.macd));
      const minMacdFourPoints = Math.min(...fourPoints.map((x) => x.macd));
      const maxMacd = Math.max(...macdFourPoints.map((x) => x.macd));
      const minMacd = Math.min(...macdFourPoints.map((x) => x.macd));

      //احتمالا باید شرط زیر هم اضافه شود
      //macd[0] < 0
      //شرط بالا را باید در جاهای مختلف بررسی کنیم تا ببینیم که
      //گین بهتری میدهد یا نه
      if (
        // fourPoints[0].macd === maxMacdFourPoints &&
        fourPoints[1].macd === minMacdFourPoints
      ) {
        const macdRatio = (
          (macdFourPoints[2].macd - macdFourPoints[1].macd) /
          (macdFourPoints[0].macd - macdFourPoints[1].macd)
        ).toFixed(1);

        const threeToTwoRatio = Math.abs(
          macdFourPoints[2].macd / macdFourPoints[1].macd
        ).toFixed(1);

        // console.log({
        //   symbolName,
        //   persianDate: fourPoints[0].persianDate,
        //   macdRatio,
        //   threeToTwoRatio,
        // });

        const shapeLog = `tvWidget.activeChart().createMultipointShape([{ time: ${
          points[3].time
        }, price: ${
          points[3].low * 0.9
        } }], { shape: 'arrow_up', text: 'MR: ${macdRatio} | 32R: ${threeToTwoRatio}'});`;

        // console.log(shapeLog);
        technicalShapes += shapeLog;

        // if (macdRatio > 0.6 && macdRatio < 1.2) {
        //   const threeToTwoRatio = Math.abs(
        //     macdFourPoints[2].macd / macdFourPoints[1].macd
        //   );

        //   console.log({
        //     symbolName,
        //     persianDate: fourPoints[0].persianDate,
        //     macdRatio,
        //     threeToTwoRatio,
        //   });
        // }
      }
    }
  }
};

const getPoints = (arr, index, pointCount) => {
  if (arr.length < index + pointCount) throw Error("Wrong index");
  return arr.slice(index, index + pointCount);
};

const files = fs.readdirSync("./StockData/");
for (let index = 0; index < files.length; index++) {
  const fileName = files[index];
  computeDivergence(fileName);
}

// console.log(technicalShapes);

// Copy
technicalShapes += `
}, 2000);
`;

const process = require("child_process");
const clip = process.spawn("clip");
const clipboard = clip.stdin.end(technicalShapes);


