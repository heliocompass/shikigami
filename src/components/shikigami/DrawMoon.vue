<script lang="ts">
import type { ObserverType } from '../Observer.vue'
import type { svgType } from '../Svg.vue'
import { AstroClass } from '../Astro.vue'
import { SuntimeClass } from '../Suntime.vue'
import type { timeBase } from '../Suntime.vue'
import { planets } from '../Planet.vue'
const { Sun, Moon } = planets()

// 定数
const RAD = Math.PI / 180;
const SVG_LINE_WIDTH = 0.25;
const SVG_AUR = 424.0488; // 1AU = 424.0488px 
const GREEN_COLOR = '#33CC33';

type MoonPositions = {
  datetime: Date,
  sunR: number,
  sunY: number,
  angleCos: number,
}[];

/**
 * １年間の6時間数
 * @param startDate 開始日
 * @return 1年間の6時間数 ※365*6 or 366*6
 */
const rotate6HoursFromStartDate = (startDate: Date): number => {
  const startDt = new Date(startDate);
  const endDt = new Date(startDate);
  endDt.setFullYear(endDt.getFullYear() + 1);
  return (endDt.getTime() - startDt.getTime()) / (1000 * 60 * 60 * 6);
}

/**
 * 月を描画
 * @param svg 
 * @param observer 
 * @param drawTime 
 */
export const drawMoon = (
  svg: svgType,
  observer: ObserverType,
  drawTime: timeBase
) => {
  const svgSmallSize = 0.4;
  const svgBigSize = 2.601;
  const strokeColor = '#231815';
  const fullmoonColor = '#FCC800', newmoonColor = '#3e3a39';
  let drawDt: Date;
  let moonBall: MoonPositions = [];
  let fullmoonBall: MoonPositions = [];
  let newmoonBall: MoonPositions = [];
  let angleCos: number;
  let pre1Dt: Date, pre1Cos: number, pre2Cos: number;
  let index: number;

  // 1周の描画数を決める（日数×6時間毎）
  const rotateHours = rotate6HoursFromStartDate(observer.initDt);

  // 最初の夜起点要素
  const startSuntime = new SuntimeClass(observer.initDt, observer.longitude, observer.latitude, observer.timezone);
  drawDt = new Date(startSuntime.startDt(drawTime));

  // 月波
  moonBall[0] = getMoonBallPosition(drawDt, observer.timezone);
  angleCos = moonBall[0].angleCos;

  // 1点前の位置を取得
  pre1Dt = getPreDate(drawDt, 1);
  let pre1MoonBall = getMoonBallPosition(pre1Dt, observer.timezone);

  // 1点前と2点前の位置を更新
  pre2Cos = pre1MoonBall.angleCos;
  pre1Cos = moonBall[0].angleCos;

  // 最終までの夜起点要素ループ
  // 開始点から6時間毎なのでdrawDtでインクリメントする。suntimeは不要
  for (index = 1; index < rotateHours; index++) {
    drawDt.setHours(drawDt.getHours() + 6);

    // 月玉
    moonBall[index] = getMoonBallPosition(drawDt, observer.timezone);
    angleCos = moonBall[index].angleCos;

    // 2点前の離角余弦＜1点前の離角余弦＞現在の離角余弦（山）なら1点前を満月とする
    if (pre2Cos < pre1Cos && pre1Cos > angleCos) {
      fullmoonBall.push(moonBall[index - 1]);
    }

    // 2点前の離角余弦＞1点前の離角余弦＜現在の離角余弦（谷）なら1点前を新月とする
    if (pre2Cos > pre1Cos && pre1Cos < angleCos) {
      newmoonBall.push(moonBall[index - 1]);
    }

    // 1点前と2点前の位置を更新
    pre2Cos = pre1Cos;
    pre1Cos = angleCos;
  }


  // ここから月SVG生成
  svg.groupId(`月`);
  // 月波
  drawSvgMoonBalls(svg, moonBall, rotateHours, svgSmallSize, strokeColor);
  // 満月玉
  drawSvgFullMoonBalls(svg, fullmoonBall, svgBigSize, strokeColor, fullmoonColor);
  // 新月玉
  drawSvgNewMoonBalls(svg, newmoonBall, svgBigSize, strokeColor, newmoonColor);

  svg.groupFooter();
}

/**
 * 月の位置を取得
 * @param drawDt 日時
 * @param timezone タイムゾーン
 */
const getMoonBallPosition = (drawDt: Date, timezone: number) => {
  const mjd = AstroClass.mjd(drawDt, timezone);
  const t = AstroClass.t(mjd);
  const sun = new Sun(t);
  const moon = new Moon(t);
  const angleCos = -Math.cos((moon.y - sun.y) * RAD);
  return { datetime: drawDt, sunR: sun.r, sunY: sun.y, angleCos: angleCos };
}

/**
 * 前の日時を取得する
 * @param baseDate 
 * @param subCount 
 */
const getPreDate = (baseDate: Date, subCount: number) => {
  const preDate = new Date(baseDate);
  preDate.setHours(preDate.getHours() - subCount * 6); // 6時間ずつ
  return preDate;
}

/**
 * 月波を描画
 * @param svg 
 * @param moonBall 
 * @param rotateHours 
 * @param svgSmallSize 
 * @param strokeColor 
 */
const drawSvgMoonBalls = (
  svg: svgType,
  moonBall: MoonPositions,
  rotateHours: number,
  svgSmallSize: number,
  strokeColor: string
) => {
  svg.groupId(`月波`);
  for (let index = 0; index < rotateHours; index++) {
    svg.groupId(`月波 ${moonBall[index].datetime.toLocaleString()}`);
    svg.circle(
      moonBall[index].sunR * SVG_AUR * (1 + moonBall[index].angleCos / 20),
      moonBall[index].sunY,
      svgSmallSize,
      SVG_LINE_WIDTH,
      (index === 0) ? GREEN_COLOR : strokeColor, // 1日目だけ描画色を変える
      `none`
    );
    svg.groupFooter();
  }
  svg.groupFooter();
}

/**
 * 満月玉を描画
 * @param svg 
 * @param fullmoonBall 
 * @param svgBigSize 
 * @param strokeColor 
 * @param fullmoonColor 
 */
const drawSvgFullMoonBalls = (
  svg: svgType,
  fullmoonBall: MoonPositions,
  svgBigSize: number,
  strokeColor: string,
  fullmoonColor: string,
) => {
  svg.groupId(`満月玉`);
  // 要素数がわからないので0始まりの要素数でループ
  for (let index = 0; index <= fullmoonBall.length - 1; index++) {
    svg.groupId(`満月玉 ${fullmoonBall[index].datetime.toLocaleString()}`);
    svg.circle(
      fullmoonBall[index].sunR * SVG_AUR * (1 + fullmoonBall[index].angleCos / 20),
      fullmoonBall[index].sunY,
      svgBigSize,
      SVG_LINE_WIDTH,
      strokeColor,
      fullmoonColor
    );
    svg.groupFooter();
  }
  svg.groupFooter();
}

/**
 * 新月玉を描画
 * @param svg 
 * @param newmoonBall 
 * @param svgBigSize 
 * @param strokeColor 
 * @param newmoonColor 
 */
const drawSvgNewMoonBalls = (
  svg: svgType,
  newmoonBall: MoonPositions,
  svgBigSize: number,
  strokeColor: string,
  newmoonColor: string,
) => {
  svg.groupId(`新月玉`);
  // 要素数がわからないので0始まりの要素数でループ
  for (let index = 0; index <= newmoonBall.length - 1; index++) {
    svg.groupId(`新月玉 ${newmoonBall[index].datetime.toLocaleString()}`);
    svg.circle(
      newmoonBall[index].sunR * SVG_AUR * (1 + newmoonBall[index].angleCos / 20),
      newmoonBall[index].sunY,
      svgBigSize,
      SVG_LINE_WIDTH,
      strokeColor,
      newmoonColor);
    svg.groupFooter();
  }
  svg.groupFooter();
}


let defaultObject = {};
export default defaultObject;
</script>

