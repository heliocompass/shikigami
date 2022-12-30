<script lang="ts">
import type { observerType } from '../Observer.vue'
import type { svgType } from '../Svg.vue'
import { AstroClass } from '../Astro.vue'
import { SuntimeClass } from '../Suntime.vue'
import type { timeBase } from '../Suntime.vue'
import { planets } from '../Planet.vue'
const { Saturn } = planets()

// 定数
const SVG_LINE_WIDTH = 0.25;
const RED_COLOR = '#FF0000';
const GREEN_COLOR = '#33CC33';


type PlanetPositions = {
  datetimeString: string,
  r: number,
  y: number,
}[];

/**
 * 土星を描画
 * @param svg 
 * @param observer 
 * @param drawTime 
 */
export const drawSaturn = (
  svg: svgType,
  observer: observerType,
  drawTime: timeBase
) => {
  const svgR = 766.667;
  const svgSmallSize = 1.0023;
  const svgBigSize = 17.0088;
  const strokeColor = '#333333';
  const rotateMonths = 12; // 12カ月
  const rotateYears = 30; // 30年
  let drawDt;
  let saturnSmallBall: PlanetPositions = [];
  let saturnBigBall: PlanetPositions = [];

  // 最初の要素
  drawDt = new Date(observer.initDt);

  // 1年後までの要素ループ
  // 翌月1日から毎月1日を描画
  drawDt.setDate(1);

  for (let d = 1; d <= rotateMonths; d++) {
    drawDt.setMonth(drawDt.getMonth() + 1);
    const suntime = new SuntimeClass(drawDt, observer.longitude, observer.latitude, observer.timezone);
    const mjd = AstroClass.mjd(suntime.middleDt(drawTime), observer.timezone);
    const t = AstroClass.t(mjd);
    const saturn = new Saturn(t);

    // 土星玉・小
    let compassY = saturn.y + 180;
    if (compassY >= 360) {
      compassY -= 360;
    }
    // 動径は平均軌道半径で固定
    saturnSmallBall[d] = { datetimeString: suntime.middleDt(drawTime).toLocaleString(), r: svgR, y: compassY };
  }

  // 1年後から最終までの要素ループ
  drawDt = new Date(observer.initDt);
  // 翌年の1日前から毎年1日前を描画
  drawDt.setDate(drawDt.getDate() - 1);
  for (let d = 1; d <= rotateYears; d++) {
    const suntime = new SuntimeClass(drawDt, observer.longitude, observer.latitude, observer.timezone);
    const mjd = AstroClass.mjd(suntime.middleDt(drawTime), observer.timezone);
    const t = AstroClass.t(mjd);
    const saturn = new Saturn(t);

    // 土星玉・大
    let compassY = saturn.y + 180;
    if (compassY >= 360) {
      compassY -= 360;
    }
    // 動径は平均軌道半径で固定
    saturnBigBall[d] = { datetimeString: suntime.middleDt(drawTime).toLocaleString(), r: svgR, y: compassY };
    drawDt.setFullYear(drawDt.getFullYear() + 1);
  }

  // ここから土星SVG作成
  svg.groupId(`土星`);
  drawSaturnSmallBall(svg, saturnBigBall, svgSmallSize, strokeColor, rotateMonths);
  drawSaturnBigBall(svg, saturnBigBall, svgBigSize, strokeColor, rotateYears);
  drawSvgSaturnOrbits(svg, saturnBigBall, saturnSmallBall, svgR, rotateMonths, rotateYears);
  svg.groupFooter();
}


/**
 * 土星玉・小をSVG描画
 * @param svg 
 * @param saturnSmallBall 
 * @param svgSmallSize 
 * @param strokeColor 
 * @param rotateMonths 
 */
const drawSaturnSmallBall = (
  svg: svgType,
  saturnSmallBall: PlanetPositions,
  svgSmallSize: number,
  strokeColor: string,
  rotateMonths: number,
) => {
  for (let d = 1; d <= rotateMonths; d++) {
    svg.groupId(`土星玉・小 ${saturnSmallBall[d].datetimeString}`);
    svg.circle(saturnSmallBall[d].r, saturnSmallBall[d].y, svgSmallSize, SVG_LINE_WIDTH, strokeColor, `none`);
    svg.groupFooter();
  }
}


/**
 * 土星玉・大をSVG描画
 * @param svg 
 * @param saturnBigBall 
 * @param svgBigSize 
 * @param strokeColor 
 * @param rotateYears 
 */
const drawSaturnBigBall = (
  svg: svgType,
  saturnBigBall: PlanetPositions,
  svgBigSize: number,
  strokeColor: string,
  rotateYears: number,
) => {
  for (let d = 1; d <= rotateYears; d++) {
    svg.groupId(`土星玉・大 ${saturnBigBall[d].datetimeString}`);
    svg.circle(
      saturnBigBall[d].r,
      saturnBigBall[d].y,
      svgBigSize,
      SVG_LINE_WIDTH,
      (d === 1) ? GREEN_COLOR : strokeColor, // 最初だけ描画色を変える
      `none`
    );
    svg.groupFooter();
  }
}

/**
 * 土星軌道線をSVG描画
 * @param svg 
 * @param saturnBigBall 
 * @param saturnSmallBall 
 * @param svgR 
 * @param rotateMonths 
 * @param rotateYears 
 */
const drawSvgSaturnOrbits = (
  svg: svgType,
  saturnBigBall: PlanetPositions,
  saturnSmallBall: PlanetPositions,
  svgR: number,
  rotateMonths: number,
  rotateYears: number,
) => {
  svg.groupId(`土星軌道線`);
  svg.groupId(`土星移動線 ${saturnSmallBall[1].datetimeString}`);
  svg.arc(saturnBigBall[1].r, saturnBigBall[1].y, saturnSmallBall[1].r, saturnSmallBall[1].y, svgR, SVG_LINE_WIDTH, RED_COLOR, 'none');
  svg.groupFooter();

  for (let d = 2; d <= rotateMonths; d++) {
    svg.groupId(`土星移動線 ${saturnSmallBall[d].datetimeString}`);
    svg.arc(saturnSmallBall[d - 1].r, saturnSmallBall[d - 1].y, saturnSmallBall[d].r, saturnSmallBall[d].y, svgR, SVG_LINE_WIDTH, RED_COLOR, 'none');
    svg.groupFooter();
  }

  svg.groupId(`土星移動線 ${saturnBigBall[2].datetimeString}`);
  svg.arc(saturnSmallBall[rotateMonths].r, saturnSmallBall[rotateMonths].y, saturnBigBall[2].r, saturnBigBall[2].y, svgR, SVG_LINE_WIDTH, RED_COLOR, 'none');
  svg.groupFooter();

  for (let d = 3; d <= rotateYears; d++) {
    svg.groupId(`土星移動線 ${saturnBigBall[d].datetimeString}`);
    svg.arc(saturnBigBall[d - 1].r, saturnBigBall[d - 1].y, saturnBigBall[d].r, saturnBigBall[d].y, svgR, SVG_LINE_WIDTH, RED_COLOR, 'none');
    svg.groupFooter();
  }

  svg.groupId(`土星移動線 閉じる`);
  svg.arc(saturnBigBall[rotateYears].r, saturnBigBall[rotateYears].y, saturnBigBall[1].r, saturnBigBall[1].y, svgR, SVG_LINE_WIDTH, RED_COLOR, 'none');
  svg.groupFooter();
  svg.groupFooter();
}


let defaultObject = {};
export default defaultObject;
</script>

