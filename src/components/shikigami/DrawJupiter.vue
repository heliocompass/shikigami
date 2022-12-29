<script lang="ts">
import type { observerType } from '../Observer.vue'
import type { svgType } from '../Svg.vue'
import { AstroClass } from '../Astro.vue'
import { SuntimeClass } from '../Suntime.vue'
import type { timeBase } from '../Suntime.vue'
import { Planet, planets } from '../Planet.vue'
import { sv } from 'date-fns/locale'
const { Jupiter } = planets()

// 定数
const SVG_LINE_WIDTH = 0.25;
const SVG_AUR = 424.0488; // 1AU = 424.0488px
const RED_COLOR = '#FF0000';
const GREEN_COLOR = '#33CC33';

type PlanetPositions = {
  datetimeString: string,
  r: number,
  y: number,
}[];

/**
 * 木星描画
 * @param svg 
 * @param observer 
 * @param drawTime 
 */
export const drawJupiter = (
  svg: svgType,
  observer: observerType,
  drawTime: timeBase,
) => {
  const svgR = 730.001;
  const svgSmallSize = 1.0023;
  const svgBigSize = 20.126;
  const strokeColor = '#333333';
  const rotateMonths = 12; // 12ヵ月
  const rotateYears = 12; // 12年間
  let drawDt: Date;
  let jupiterSmallBall: PlanetPositions = [];
  let jupiterBigBall: PlanetPositions = [];
  let compassY: number;
  let d: number;

  // 最初の要素
  drawDt = new Date(observer.initDt);

  // 翌月1日から毎月1日を1年後まで描画
  drawDt.setDate(1);
  for (d = 1; d <= rotateMonths; d++) {
    drawDt.setMonth(drawDt.getMonth() + 1);
    const suntime = new SuntimeClass(drawDt, observer.longitude, observer.latitude, observer.timezone);
    const mjd = AstroClass.mjd(suntime.middleDt(drawTime), observer.timezone);
    const t = AstroClass.t(mjd);
    const jupiter = new Jupiter(t);

    // 木星玉・小
    compassY = jupiter.y + 180;
    if (compassY >= 360) {
      compassY -= 360;
    }

    // 動径は平均軌道半径で固定
    jupiterSmallBall[d] = { datetimeString: suntime.middleDt(drawTime).toLocaleString(), r: svgR, y: compassY };
  }

  // 木星玉・大
  drawDt = new Date(observer.initDt);
  // // 動径は平均軌道半径で固定
  // 翌年の1日前から毎年1日前を描画
  drawDt.setDate(drawDt.getDate() - 1);
  for (d = 1; d <= rotateYears; d++) {
    const suntime = new SuntimeClass(drawDt, observer.longitude, observer.latitude, observer.timezone);
    const mjd = AstroClass.mjd(suntime.middleDt(drawTime), observer.timezone);
    const t = AstroClass.t(mjd);
    const jupiter = new Jupiter(t);

    // 木星玉・大
    compassY = jupiter.y + 180;
    if (compassY >= 360) {
      compassY -= 360;
    }
    // 動径は平均軌道半径で固定
    jupiterBigBall[d] = { datetimeString: suntime.middleDt(drawTime).toLocaleString(), r: svgR, y: compassY };
    drawDt.setFullYear(drawDt.getFullYear() + 1);
  }

  // ここから木星SVG作成
  svg.groupId(`木星`);
  drawJupiterSmallBall(svg, jupiterSmallBall, svgSmallSize, strokeColor, rotateMonths,); // 木星玉・小
  drawJupiterBigBall(svg, jupiterBigBall, svgBigSize, strokeColor, rotateYears); // 木星玉・大
  drawSvgJupiterOrbits(svg, jupiterBigBall, jupiterSmallBall, svgR, rotateMonths, rotateYears); // 木星軌道線
  svg.groupFooter();
}

/**
 * 木星玉・小をSVG描画
 * @param svg 
 * @param jupiterSmallBall 
 * @param svgSmallSize 
 * @param strokeColor 
 * @param rotateMonths 
 */
const drawJupiterSmallBall = (
  svg: svgType,
  jupiterSmallBall: PlanetPositions,
  svgSmallSize: number,
  strokeColor: string,
  rotateMonths: number,
) => {
  svg.groupId(`木星玉`);
  for (let d = 1; d <= rotateMonths; d++) {
    svg.groupId(`木星玉・小 ${jupiterSmallBall[d].datetimeString}`);
    svg.circle(jupiterSmallBall[d].r, jupiterSmallBall[d].y, svgSmallSize, SVG_LINE_WIDTH, strokeColor, `none`);
    svg.groupFooter();
  }

  svg.groupFooter();
}

/**
 * 木星玉・大をSVG描画
 * @param svg 
 * @param jupiterBigBall 
 * @param svgBigSize 
 * @param strokeColor 
 * @param rotateYears 
 */
const drawJupiterBigBall = (
  svg: svgType,
  jupiterBigBall: PlanetPositions,
  svgBigSize: number,
  strokeColor: string,
  rotateYears: number,
) => {
  svg.groupId(`木星玉`);
  for (let d = 1; d <= rotateYears; d++) {
    svg.groupId(`木星玉・大 ${jupiterBigBall[d].datetimeString}`);
    svg.circle(
      jupiterBigBall[d].r,
      jupiterBigBall[d].y,
      svgBigSize,
      SVG_LINE_WIDTH,
      (d === 1) ? GREEN_COLOR : strokeColor, // 最初だけ描画色を変える
      `none`
    );
    svg.groupFooter();
  }
  svg.groupFooter();
}

/**
 * 木星軌道線をSVG描画
 * @param svg 
 * @param jupiterBigBall 
 * @param jupiterSmallBall 
 * @param svgR 
 * @param rotateMonths 
 * @param rotateYears 
 */
const drawSvgJupiterOrbits = (
  svg: svgType,
  jupiterBigBall: PlanetPositions,
  jupiterSmallBall: PlanetPositions,
  svgR: number,
  rotateMonths: number,
  rotateYears: number,
) => {
  svg.groupId(`木星軌道線`);
  svg.groupId(`木星移動線 ${jupiterSmallBall[1].datetimeString}`);
  svg.arc(jupiterBigBall[1].r, jupiterBigBall[1].y, jupiterSmallBall[1].r, jupiterSmallBall[1].y, svgR, SVG_LINE_WIDTH, RED_COLOR, 'none');
  svg.groupFooter();

  for (let d = 2; d <= rotateMonths; d++) {
    svg.groupId(`木星移動線 ${jupiterSmallBall[d].datetimeString}`);
    svg.arc(jupiterSmallBall[d - 1].r, jupiterSmallBall[d - 1].y, jupiterSmallBall[d].r, jupiterSmallBall[d].y, svgR, SVG_LINE_WIDTH, RED_COLOR, 'none');
    svg.groupFooter();
  }

  svg.groupId(`木星移動線 ${jupiterBigBall[2].datetimeString}`);
  svg.arc(jupiterSmallBall[rotateMonths].r, jupiterSmallBall[rotateMonths].y, jupiterBigBall[2].r, jupiterBigBall[2].y, svgR, SVG_LINE_WIDTH, RED_COLOR, 'none');
  svg.groupFooter();

  for (let d = 3; d <= rotateYears; d++) {
    svg.groupId(`木星移動線 ${jupiterBigBall[d].datetimeString}`);
    svg.arc(jupiterBigBall[d - 1].r, jupiterBigBall[d - 1].y, jupiterBigBall[d].r, jupiterBigBall[d].y, svgR, SVG_LINE_WIDTH, RED_COLOR, 'none');
    svg.groupFooter();
  }

  svg.groupId(`木星移動線 閉じる`);
  svg.arc(jupiterBigBall[rotateYears].r, jupiterBigBall[rotateYears].y, jupiterBigBall[1].r, jupiterBigBall[1].y, svgR, SVG_LINE_WIDTH, RED_COLOR, 'none');
  svg.groupFooter();
  svg.groupFooter();
}

let defaultObject = {};
export default defaultObject;
</script>

