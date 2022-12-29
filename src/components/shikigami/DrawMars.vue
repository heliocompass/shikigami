<script lang="ts">
import type { observerType } from '../Observer.vue'
import type { svgType } from '../Svg.vue'
import { AstroClass } from '../Astro.vue'
import { SuntimeClass } from '../Suntime.vue'
import type { timeBase } from '../Suntime.vue'
import { planets } from '../Planet.vue'
const { Mars } = planets()

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
 * 火星描画
 * @param svg 
 * @param observer 
 * @param drawTime 
 */
export const drawMars = (
  svg: svgType,
  observer: observerType,
  drawTime: timeBase,
) => {
  const svgInR = 585.71316; // 火星の近点軌道
  const svgOutR = 706.40593; // 火星の遠点軌道
  const svgSize = 0.96; // 火星玉の大きさ
  const strokeColor = '#333333';
  const rotateDays = 687; // 火星の公転周期
  let drawDt;
  let marsBall: PlanetPositions = [];
  let d;

  // 最初の要素
  drawDt = new Date(observer.initDt);

  // 最終までの要素ループ
  for (d = 1; d <= rotateDays; d++) {
    const suntime = new SuntimeClass(drawDt, observer.longitude, observer.latitude, observer.timezone);
    const mjd = AstroClass.mjd(suntime.middleDt(drawTime), observer.timezone);
    const t = AstroClass.t(mjd);
    const mars = new Mars(t);

    // 火星玉
    let compassY = mars.y + 180;
    if (compassY >= 360) {
      compassY -= 360;
    }
    marsBall[d] = { datetimeString: suntime.middleDt(drawTime).toLocaleString(), r: mars.r, y: compassY };

    drawDt.setDate(drawDt.getDate() + 1);
  }

  // ここから火星SVG作成
  svg.groupId(`火星`);
  drawMarsBall(svg, marsBall, svgSize, strokeColor); // 火星玉
  drawSvgMarsOrbits(svg, marsBall); // 火星軌道
  drawSvgMarsPerigee(svg, svgInR); // 火星近点軌道 
  drawSvgMarsApogee(svg, svgOutR); // 火星遠点軌道
  svg.groupFooter();
}

/**
 * 火星玉をSVG描画
 * @param svg 
 * @param marsBall 
 * @param svgSize 
 * @param strokeColor 
 */
const drawMarsBall = (
  svg: svgType,
  marsBall: PlanetPositions,
  svgSize: number,
  strokeColor: string,
) => {
  const rotateDays = marsBall.length - 1
  for (let d = 2; d <= rotateDays; d++) {
    svg.groupId(`火星玉 ${marsBall[d].datetimeString}`);
    svg.circle(
      SVG_AUR * marsBall[d].r,
      marsBall[d].y,
      svgSize,
      SVG_LINE_WIDTH,
      (d === 1) ? GREEN_COLOR : strokeColor,// 最初だけ描画色を変える
      `none`
    );
    svg.groupFooter();
  }
}

/**
 * 火星移動線をSVG描画
 * @param svg 
 * @param marsBall 
 */
const drawSvgMarsOrbits = (
  svg: svgType,
  marsBall: PlanetPositions,
) => {
  const rotateDays = marsBall.length - 1
  svg.groupId(`火星移動線`);
  for (let d = 2; d <= rotateDays; d++) {
    svg.groupId(`火星移動線 ${marsBall[d].datetimeString}`);
    svg.line(SVG_AUR * marsBall[d - 1].r, marsBall[d - 1].y, SVG_AUR * marsBall[d].r, marsBall[d].y, SVG_LINE_WIDTH, BLACK_COLOR);
    svg.groupFooter();
  }
  svg.groupId(`火星移動線 閉じる`);
  svg.line(SVG_AUR * marsBall[rotateDays].r, marsBall[rotateDays].y, SVG_AUR * marsBall[1].r, marsBall[1].y, SVG_LINE_WIDTH, BLACK_COLOR);
  svg.groupFooter();
  svg.groupFooter();
}
/**
 * 火星近点軌道をSVG描画
 * @param svg 
 * @param svgInR 
 */
const drawSvgMarsPerigee = (
  svg: svgType,
  svgInR: number,
) => {
  svg.groupId(`火星近点軌道`);
  svg.circle(0, 0, svgInR, SVG_LINE_WIDTH, RED_COLOR, `none`);
  svg.groupFooter();
}

/**
 * 火星遠点軌道をSVG描画
 * @param svg 
 * @param svgOutR 
 */
const drawSvgMarsApogee = (
  svg: svgType,
  svgOutR: number,
) => {
  svg.groupId(`火星遠点軌道`);
  svg.circle(0, 0, svgOutR, SVG_LINE_WIDTH, RED_COLOR, `none`);
  svg.groupFooter();
}

let defaultObject = {};
export default defaultObject;
</script>

