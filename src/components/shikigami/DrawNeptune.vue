<script lang="ts">
import type { ObserverType } from '../Observer.vue'
import type { svgType } from '../Svg.vue'
import { AstroClass } from '../Astro.vue'
import { SuntimeClass } from '../Suntime.vue'
import type { timeBase } from '../Suntime.vue'
import { planets } from '../Planet.vue'
const { Neptune } = planets()

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
 * 海王星を描画
 * @param svg 
 * @param observer 
 * @param drawTime 
 */
export const drawNeptune = (
  svg: svgType,
  observer: ObserverType,
  drawTime: timeBase
) => {
  const svgR = 806.001;
  const svgSize = 7.0859;
  const strokeColor = '#333333';
  const rotateYears = 164;
  let neptuneBall: PlanetPositions = [];

  // 最初の要素
  let drawDt = new Date(observer.initDt);
  // 当年の1日前から毎年1日前を描画
  drawDt.setDate(drawDt.getDate() - 1);
  for (let d = 1; d <= rotateYears; d++) {
    const suntime = new SuntimeClass(drawDt, observer.longitude, observer.latitude, observer.timezone);
    const mjd = AstroClass.mjd(suntime.middleDt(drawTime), observer.timezone);
    const t = AstroClass.t(mjd);
    const neptune = new Neptune(t);

    // 海王星玉
    let compassY = neptune.y + 180;
    if (compassY >= 360) {
      compassY -= 360;
    }
    // 動径は平均軌道半径で固定
    neptuneBall[d] = { datetimeString: suntime.middleDt(drawTime).toLocaleString(), r: svgR, y: compassY };
    drawDt.setFullYear(drawDt.getFullYear() + 1);
  }

  // ここから海王星SVG作成
  svg.groupId(`海王星`);
  drawNeptuneBall(svg, neptuneBall, svgSize, strokeColor, rotateYears); // 海王星玉
  drawNeptuneOrbit(svg, neptuneBall, svgR, rotateYears); // 海王星軌道
  svg.groupFooter();
}

/**
 * 海王星玉をSVG描画
 * @param svg 
 * @param neptuneBall 
 * @param svgBigSize 
 * @param strokeColor 
 * @param rotateYears 
 */
const drawNeptuneBall = (
  svg: svgType,
  neptuneBall: PlanetPositions,
  svgSize: number,
  strokeColor: string,
  rotateYears: number,
) => {
  svg.groupId(`海王星玉`);
  // 最初だけ描画色を変えるのでループ分け
  svg.groupId(`海王星玉 ${neptuneBall[1].datetimeString}`);
  svg.circle(neptuneBall[1].r, neptuneBall[1].y, svgSize, SVG_LINE_WIDTH, GREEN_COLOR, `none`);
  svg.groupFooter();

  for (let d = 2; d <= rotateYears; d++) {
    svg.groupId(`海王星玉 ${neptuneBall[d].datetimeString}`);
    svg.circle(neptuneBall[d].r, neptuneBall[d].y, svgSize, SVG_LINE_WIDTH, strokeColor, `none`);
    svg.groupFooter();
  }
  svg.groupFooter();
}

/**
 * 海王星軌道を描画
 * @param svg 
 * @param neptuneBall 
 * @param svgR 
 * @param rotateYears 
 */
const drawNeptuneOrbit = (
  svg: svgType,
  neptuneBall: PlanetPositions,
  svgR: number,
  rotateYears: number,
) => {
  svg.groupId(`海王星移動線`);
  for (let d = 2; d <= rotateYears; d++) {
    svg.groupId(`海王星移動線 ${neptuneBall[d].datetimeString}`);
    svg.arc(neptuneBall[d - 1].r, neptuneBall[d - 1].y, neptuneBall[d].r, neptuneBall[d].y, svgR, SVG_LINE_WIDTH, RED_COLOR, 'none');
    svg.groupFooter();
  }
  svg.groupId(`海王星移動線 閉じる`);
  svg.arc(neptuneBall[rotateYears].r, neptuneBall[rotateYears].y, neptuneBall[1].r, neptuneBall[1].y, svgR, SVG_LINE_WIDTH, RED_COLOR, 'none');
  svg.groupFooter();

  svg.groupFooter();
}

let defaultObject = {};
export default defaultObject;
</script>

