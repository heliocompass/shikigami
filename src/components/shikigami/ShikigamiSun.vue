<script lang="ts">
import type { observerType } from '../Observer.vue'
import type { svgType } from '../Svg.vue'
import { AstroClass } from '../Astro.vue'
import { SuntimeClass } from '../Suntime.vue'
import type { timeBase } from '../Suntime.vue'
import { planets } from '../Planet.vue'
const { Sun } = planets()

// 定数
const SVG_LINE_WIDTH = 0.25;
const SVG_AUR = 424.0488; // 1AU = 424.0488px
const BLACK_COLOR = '#000000';
const RED_COLOR = '#FF0000';
const GREEN_COLOR = '#33CC33';

type DaysData = {
  start: Date
  end: Date
  data: Array<{ date: number, value: number }>
}

const createSunbyDt = (date: Date, timezone: number) => {
  const mjd = AstroClass.mjd(date, timezone);
  const T = AstroClass.t(mjd);
  return new Sun(T);
}

/**
 * １年間の日数
 * @param startDate 開始日
 * @return 1年間の日数
 */
const rotateDaysFromStartDate = (startDate: Date): number => {
  const startDt = new Date(startDate);
  const endDt = new Date(startDate);
  endDt.setFullYear(endDt.getFullYear() + 1);
  return (endDt.getTime() - startDt.getTime()) / (1000 * 60 * 60 * 24);
}

type EarthPositions = {
  datetime: Date,
  sunR: number,
  sunY: number,
}[];

/**
 * 地球を描画
 * @param svg 
 * @param observer 
 * @param flagSunrise 
 * @param flagSunset 
 * @param flagDay 
 * @param flagNight 
 * @param drawTime 
 */
export const drawEarth = (
  svg: svgType,
  observer: observerType,
  flagSunrise: boolean,
  flagSunset: boolean,
  flagDay: boolean,
  flagNight: boolean,
  drawTime: timeBase,
) => {
  const svgInR = 416.9622; // 地球近点軌道の半径(px)
  const svgOutR = 431.13545; // 地球遠点軌道の半径(px)
  const svgLineR = 583.54395;
  const svgDaysR = svgOutR + 2; // 通日ラベルの描画半径(地球遠点軌道の少し外側)(px)
  const svgSize = 1.723;
  const strokeColor = '#231815';
  const guideSunriseColor = '#FF9900', guideSunsetColor = '#CC6600';

  let midnightPositions: EarthPositions = [];
  let noonPositions: EarthPositions = [];
  let sunrisePositions: EarthPositions = [];
  let sunsetPositions: EarthPositions = [];

  // 1周の日数
  const rotateDays = rotateDaysFromStartDate(observer.initDt);
  let drawDt = new Date(observer.initDt);
  for (let dateIndex = 0; dateIndex < rotateDays; dateIndex++) {
    const suntime = new SuntimeClass(drawDt, observer.longitude, observer.latitude, observer.timezone);

    // 真昼
    const noonSun = createSunbyDt(suntime.middleDt(drawTime), observer.timezone);
    noonPositions[dateIndex] = { datetime: suntime.middleDt(drawTime), sunR: noonSun.r, sunY: noonSun.y };

    // 真夜中
    const midnightSun = createSunbyDt(suntime.startDt(drawTime), observer.timezone);
    midnightPositions[dateIndex] = { datetime: suntime.startDt(drawTime), sunR: midnightSun.r, sunY: midnightSun.y };

    // 日の出線
    const sunrise = createSunbyDt(suntime.sunriseDt, observer.timezone);
    sunrisePositions[dateIndex] = { datetime: suntime.sunriseDt, sunR: sunrise.r, sunY: sunrise.y };

    // 日の入線
    const sunset = createSunbyDt(suntime.sunsetDt, observer.timezone);
    sunsetPositions[dateIndex] = { datetime: suntime.sunsetDt, sunR: sunset.r, sunY: sunset.y };

    drawDt.setDate(drawDt.getDate() + 1); // 次の日付
  }

  // ここから地球SVG生成
  svg.groupId(`地球`);
  // 地球近点軌道を描画
  drawSvgEarthPerigee(svg, svgInR);
  // 地球遠点軌道を描画
  drawSvgEarthApogee(svg, svgOutR);

  // 日付線を描画
  drawSvgDateLines(svg, midnightPositions, svgLineR, strokeColor);

  // 地球玉を描画
  drawSvgEarthBalls(svg, noonPositions, svgSize, strokeColor);
  // 地球移動線を描画
  drawSvgEarthOrbits(svg, noonPositions,);
  // 通日ラベルを描画
  drawSvgDateLabels(svg, noonPositions, svgDaysR);

  // 日の出線を描画
  if (flagSunrise) { drawSvgSunriseLines(svg, sunrisePositions, svgLineR, guideSunriseColor); };
  // 日の入線を描画
  if (flagSunset) { drawSvgSunsetLines(svg, sunsetPositions, svgLineR, guideSunsetColor); };
  // 昼エリアを描画
  if (flagDay) { drawSvgDaytimeAreas(svg, sunrisePositions, sunsetPositions, svgLineR, guideSunriseColor); } Date
  // 夜エリアを描画
  if (flagNight) { drawSvgNighttimeAreas(svg, sunrisePositions, sunsetPositions, svgLineR, guideSunsetColor); }

  svg.groupFooter();
}

/**  日付線をSVG描画 */
const drawSvgDateLines = (
  svg: svgType,
  midnightPositions: EarthPositions,
  svgLineR: number,
  defaultStrokeColor: string = '#231815',
  firstStrokeColor: string = "#33CC33", // green color
) => {
  svg.groupId(`日付線`);
  for (let dateIndex = 0; dateIndex < midnightPositions.length; dateIndex++) {
    const color = (dateIndex === 0) ? firstStrokeColor : defaultStrokeColor;
    svg.groupId(`日付線 ${midnightPositions[dateIndex].datetime.toLocaleString()}`);
    svg.line(
      SVG_AUR * midnightPositions[dateIndex].sunR,
      midnightPositions[dateIndex].sunY,
      svgLineR,
      midnightPositions[dateIndex].sunY,
      SVG_LINE_WIDTH,
      color);
    svg.groupFooter();
  }
  svg.groupFooter();
}

/**
 * 日の出線をSVG描画
 * @param svg 
 * @param sun 
 * @param rotateDays 
 * @param svgLineR 
 * @param guideSunriseColor 
 */
const drawSvgSunriseLines = (
  svg: svgType,
  sunrisePositions: EarthPositions,
  svgLineR: number,
  guideSunriseColor: string = '#FF9900'
) => {
  svg.groupId(`日の出線`);
  for (let dateIndex = 0; dateIndex < sunrisePositions.length; dateIndex++) {
    svg.groupId(`日の出線 ${sunrisePositions[dateIndex].datetime.toLocaleString()}`);
    svg.line(
      SVG_AUR * sunrisePositions[dateIndex].sunR,
      sunrisePositions[dateIndex].sunY,
      svgLineR,
      sunrisePositions[dateIndex].sunY,
      SVG_LINE_WIDTH,
      guideSunriseColor
    );
    svg.groupFooter();
  }
  svg.groupFooter();
}

/**
 * 日の入線をSVG描画
 * @param svg 
 * @param sunsetLine 
 * @param rotateDays 
 * @param svgLineR 
 * @param guideSunsetColor 
 */
const drawSvgSunsetLines = (
  svg: svgType,
  sunsetPositions: EarthPositions,
  svgLineR: number,
  guideSunsetColor: string = '#CC6600'
) => {
  svg.groupId(`日の入り線`);
  for (let dateIndex = 0; dateIndex < sunsetPositions.length; dateIndex++) {
    svg.groupId(`日の入り線 ${sunsetPositions[dateIndex].datetime.toLocaleString()}`);
    svg.line(
      SVG_AUR * sunsetPositions[dateIndex].sunR,
      sunsetPositions[dateIndex].sunY,
      svgLineR,
      sunsetPositions[dateIndex].sunY,
      SVG_LINE_WIDTH,
      guideSunsetColor);
    svg.groupFooter();
  }
  svg.groupFooter();
}

/** 昼エリアをSVG描画 */
const drawSvgDaytimeAreas = (
  svg: svgType,
  sunrisePositions: EarthPositions,
  sunsetPositions: EarthPositions,
  svgLineR: number,
  guideSunriseColor: string = '#FF9900',
) => {
  svg.groupId(`昼エリア`);
  for (let dateIndex = 0; dateIndex < sunrisePositions.length; dateIndex++) {
    svg.groupId(`'昼エリア' + ${sunrisePositions[dateIndex].datetime.toLocaleString()} ${sunsetPositions[dateIndex].datetime.toLocaleString()}`);
    svg.area(
      SVG_AUR * sunrisePositions[dateIndex].sunR,
      sunrisePositions[dateIndex].sunY,
      SVG_AUR * sunsetPositions[dateIndex].sunR,
      sunsetPositions[dateIndex].sunY,
      svgLineR,
      SVG_LINE_WIDTH,
      guideSunriseColor,
      `none`);
    svg.groupFooter();
  }
  svg.groupFooter();
}

/** 夜エリアをSVG描画 */
const drawSvgNighttimeAreas = (
  svg: svgType,
  sunrisePositions: EarthPositions,
  sunsetPositions: EarthPositions,
  svgLineR: number,
  guideSunsetColor: string = '#CC6600'
) => {
  svg.groupId(`夜エリア`);
  for (let dateIndex = 0; dateIndex < sunrisePositions.length; dateIndex++) {
    const nextDay = (dateIndex === sunrisePositions.length - 1) ? 0 : dateIndex + 1;// 最終の夜エリアは開始日の日の出時間につなぐ
    svg.groupId(`夜エリア ${sunsetPositions[dateIndex].datetime.toLocaleString()} ${sunrisePositions[nextDay].datetime.toLocaleString()}`);
    svg.area(
      SVG_AUR * sunrisePositions[nextDay].sunR,
      sunrisePositions[nextDay].sunY,
      SVG_AUR * sunsetPositions[dateIndex].sunR,
      sunsetPositions[dateIndex].sunY,
      svgLineR,
      SVG_LINE_WIDTH,
      guideSunsetColor,
      `none`);
    svg.groupFooter();
  }
  svg.groupFooter();
}

/** 地球玉をSVG描画 */
const drawSvgEarthBalls = (
  svg: svgType,
  noonPositions: EarthPositions,
  svgSize: number,
  strokeColor: string = "#231815"
) => {
  svg.groupId(`地球玉`);
  for (let dateIndex = 0; dateIndex < noonPositions.length; dateIndex++) {
    svg.groupId(`地球玉 ${noonPositions[dateIndex].datetime}`);
    svg.circle(
      SVG_AUR * noonPositions[dateIndex].sunR,
      noonPositions[dateIndex].sunY,
      svgSize,
      SVG_LINE_WIDTH,
      (dateIndex === 0) ? GREEN_COLOR : strokeColor,// 最初の地球玉だけ色を変える
      `none`,
    );
    svg.groupFooter();
  }
  svg.groupFooter();
};

/** 通日ラベルをSVG描画 */
const drawSvgDateLabels = (
  svg: svgType,
  noonPositions: EarthPositions,
  svgDaysR: number,
) => {

  svg.groupId(`通日ラベル`);
  for (let dateIndex = 0; dateIndex < noonPositions.length; dateIndex++) {
    let daysAngle: number;
    let offsetR: number;
    // 通日ラベルの表示方向
    if (noonPositions[dateIndex].sunY >= 180) { // 春分～夏～秋分の間
      daysAngle = 270 - noonPositions[dateIndex].sunY;
      offsetR = 2.25;
    } else { // 春分～夏～秋分の間
      daysAngle = 90 - noonPositions[dateIndex].sunY;
      offsetR = 0;
    }
    svg.groupId(`通日ラベル${('000' + (dateIndex + 1)).slice(-3)} ${noonPositions[dateIndex].datetime.toLocaleString()}`);
    svg.text('days', svgDaysR + offsetR, noonPositions[dateIndex].sunY, daysAngle, ('000' + (dateIndex + 1)).slice(-3));
    svg.groupFooter();
  }
  svg.groupFooter();
}

/** 地球移動線をSVG描画 */
const drawSvgEarthOrbits = (
  svg: svgType,
  noonPositions: EarthPositions,
) => {
  svg.groupId(`地球移動線`);
  for (let dateIndex = 0; dateIndex < noonPositions.length; dateIndex++) {
    const nextDay = (dateIndex === noonPositions.length - 1) ? 0 : dateIndex + 1;
    svg.groupId(`地球移動線 ${noonPositions[dateIndex].datetime.toLocaleString()}`);
    svg.line(
      SVG_AUR * noonPositions[dateIndex].sunR,
      noonPositions[dateIndex].sunY,
      SVG_AUR * noonPositions[nextDay].sunR,
      noonPositions[nextDay].sunY,
      SVG_LINE_WIDTH,
      BLACK_COLOR
    );
    svg.groupFooter();
  }
  svg.groupFooter();
}

/** 地球近点軌道をSVG描画 */
const drawSvgEarthPerigee = (
  svg: svgType,
  svgInR: number,
) => {
  svg.groupId(`地球近点軌道`);
  svg.circle(0, 0, svgInR, SVG_LINE_WIDTH, RED_COLOR, `none`);
  svg.groupFooter();
}

/** 地球遠点軌道をSVG描画 */
const drawSvgEarthApogee = (
  svg: svgType,
  svgOutR: number,
) => {
  svg.groupId(`地球遠点軌道`);
  svg.circle(0, 0, svgOutR, SVG_LINE_WIDTH, RED_COLOR, `none`);
  svg.groupFooter();
}

let defaultObject = {};
export default defaultObject;
</script>

