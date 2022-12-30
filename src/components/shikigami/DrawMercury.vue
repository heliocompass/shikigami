<script lang="ts">
import type { observerType } from '../Observer.vue'
import type { svgType } from '../Svg.vue'
import { AstroClass } from '../Astro.vue'
import { SuntimeClass } from '../Suntime.vue'
import type { timeBase } from '../Suntime.vue'
import { planets } from '../Planet.vue'
const { Mercury } = planets()

// 定数
const SVG_LINE_WIDTH = 0.25;
const SVG_AUR = 424.0488; // 1AU = 424.0488px
const BLACK_COLOR = '#000000';
const RED_COLOR = '#FF0000';
const GREEN_COLOR = '#33CC33';


type PlanetPositions = {
  datetimeString: string,
  r: number,
  y: number,
}[];

/**
 * 水星描画
 * @param svg 
 * @param observer 
 * @param drawTime 
 */
export const drawMercury = (
  svg: svgType,
  observer: observerType,
  drawTime: timeBase
) => {
  const svgInR = 130.3795;// 水星近点軌道の半径(px)
  const svgOutR = 197.8724; // 水星遠点軌道の半径(px)
  const svgSize = 0.69; // 水星玉の大きさ
  const strokeColor = '#231815';
  const rotateDays = 88; // 水星の公転周期 88 日
  let mercuryBall: PlanetPositions = [];
  let d;

  // 最初の要素
  let drawDt = new Date(observer.initDt);

  // 最終までの要素ループ
  for (d = 1; d <= rotateDays; d++) {

    const suntime = new SuntimeClass(drawDt, observer.longitude, observer.latitude, observer.timezone);
    const mjd = AstroClass.mjd(suntime.middleDt(drawTime), observer.timezone);
    const t = AstroClass.t(mjd);
    const mercury = new Mercury(t);
    // 水星玉
    let compassY = mercury.y + 180;
    if (compassY >= 360) {
      compassY -= 360;
    }
    mercuryBall[d] = { datetimeString: suntime.middleDt(drawTime).toLocaleString(), r: mercury.r, y: compassY };
    drawDt.setDate(drawDt.getDate() + 1);
  }

  // ここから水星SVG作成
  svg.groupId(`水星`);
  drawSvgMercuryBall(svg, mercuryBall, svgSize, strokeColor); // 水星玉
  drawSvgMercuryOrbits(svg, mercuryBall); // 水星軌道
  drawSvgMercuryPerigee(svg, svgInR); // 水星近点軌道
  drawSvgMercuryApogee(svg, svgOutR); // 水星遠点軌道

  svg.groupFooter();
}

/**
 * 水星玉をSVG描画
 * @param svg 
 * @param mercuryBall 
 * @param svgSize 
 * @param strokeColor 
 */
const drawSvgMercuryBall = (
  svg: svgType,
  mercuryBall: PlanetPositions,
  svgSize: number,
  strokeColor: string,
) => {
  const rotateDays = mercuryBall.length - 1
  for (let d = 1; d <= rotateDays; d++) {
    svg.groupId(`水星玉 ${mercuryBall[d].datetimeString}`);
    svg.circle(
      SVG_AUR * mercuryBall[d].r,
      mercuryBall[d].y,
      svgSize,
      SVG_LINE_WIDTH,
      (d === 1) ? GREEN_COLOR : strokeColor, // 最初だけ描画色を変更
      `none`);
    svg.groupFooter();
  }
}

/**
 * 水星移動線をSVG描画
 * @param svg 
 * @param mercuryBall 
 */
const drawSvgMercuryOrbits = (
  svg: svgType,
  mercuryBall: PlanetPositions,
) => {
  const rotateDays = mercuryBall.length - 1
  svg.groupId(`水星移動線`);
  for (let d = 2; d <= rotateDays; d++) {
    svg.groupId(`水星移動線 ${mercuryBall[d].datetimeString}`);
    svg.line(SVG_AUR * mercuryBall[d - 1].r, mercuryBall[d - 1].y, SVG_AUR * mercuryBall[d].r, mercuryBall[d].y, SVG_LINE_WIDTH, BLACK_COLOR);
    svg.groupFooter();
  }
  svg.groupId(`水星移動線 閉じる`);
  svg.line(SVG_AUR * mercuryBall[rotateDays].r, mercuryBall[rotateDays].y, SVG_AUR * mercuryBall[1].r, mercuryBall[1].y, SVG_LINE_WIDTH, BLACK_COLOR);
  svg.groupFooter();
  svg.groupFooter();
}

/**
 * 水星近点軌道をSVG描画
 * @param svg 
 * @param svgInR 
 */
const drawSvgMercuryPerigee = (svg: svgType,
  svgInR: number,
) => {
  svg.groupId(`水星近点軌道`);
  svg.circle(0, 0, svgInR, SVG_LINE_WIDTH, RED_COLOR, `none`);
  svg.groupFooter();
}

/**
 * 水星遠点軌道をSVG描画
 * @param svg 
 * @param svgOutR 
 */
const drawSvgMercuryApogee = (
  svg: svgType,
  svgOutR: number,
) => {
  svg.groupId(`水星遠点軌道`);
  svg.circle(0, 0, svgOutR, SVG_LINE_WIDTH, RED_COLOR, `none`);
  svg.groupFooter();
}

let defaultObject = {};
export default defaultObject;
</script>

