<script lang="ts">
import type { observerType } from '../Observer.vue'
import type { svgType } from '../Svg.vue'
import { AstroClass } from '../Astro.vue'
import { SuntimeClass } from '../Suntime.vue'
import type { timeBase } from '../Suntime.vue'
import { planets } from '../Planet.vue'
const { Uranus } = planets()

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
 * 天王星を描画
 * @param svg 
 * @param observer 
 * @param drawTime 
 */
export const drawUranus = (
  svg: svgType,
  observer: observerType,
  drawTime: timeBase
) => {
  const svgR = 792.667;
  const svgSize = 7.3696;
  const strokeColor = '#333333';
  const rotateYears = 86;
  let drawDt;
  let uranusBall: PlanetPositions = [];

  // 最初の要素
  drawDt = new Date(observer.initDt);
  // 最終までの要素ループ	
  // 翌年の1日前から毎年1日前を描画
  drawDt.setDate(drawDt.getDate() - 1);
  for (let d = 1; d <= rotateYears; d++) {
    const suntime = new SuntimeClass(drawDt, observer.longitude, observer.latitude, observer.timezone);
    const mjd = AstroClass.mjd(suntime.middleDt(drawTime), observer.timezone);
    const t = AstroClass.t(mjd);
    const uranus = new Uranus(t);

    // 天王星玉
    let compassY = uranus.y + 180;
    if (compassY >= 360) {
      compassY -= 360;
    }
    // 動径は平均軌道半径で固定
    uranusBall[d] = { datetimeString: suntime.middleDt(drawTime).toLocaleString(), r: svgR, y: compassY };
    drawDt.setFullYear(drawDt.getFullYear() + 1);
  }

  // ここから天王星SVG作成
  svg.groupId(`天王星`);
  drawUranusBall(svg, uranusBall, svgSize, strokeColor, rotateYears); // 天王星玉
  drawUranusOrbit(svg, uranusBall, svgR, rotateYears); // 天王星軌道
  svg.groupFooter();
}

/**
 * 天王星玉をSVG描画
 * @param svg 
 * @param uranusBall 
 * @param svgBigSize 
 * @param strokeColor 
 * @param rotateYears 
 */
const drawUranusBall = (
  svg: svgType,
  uranusBall: PlanetPositions,
  svgSize: number,
  strokeColor: string,
  rotateYears: number,
) => {
  svg.groupId(`天王星玉`);
  // 最初だけ描画色を変えるのでループ分け
  svg.groupId(`天王星玉 ${uranusBall[1].datetimeString}`);
  svg.circle(uranusBall[1].r, uranusBall[1].y, svgSize, SVG_LINE_WIDTH, GREEN_COLOR, `none`);
  svg.groupFooter();

  for (let d = 2; d <= rotateYears; d++) {
    svg.groupId(`天王星玉 ${uranusBall[d].datetimeString}`);
    svg.circle(uranusBall[d].r, uranusBall[d].y, svgSize, SVG_LINE_WIDTH, strokeColor, `none`);
    svg.groupFooter();
  }
  svg.groupFooter();
}

/**
 * 天王星移動線を描画
 * @param svg 
 * @param uranusBall 
 * @param svgR 
 * @param rotateYears 
 */
const drawUranusOrbit = (
  svg: svgType,
  uranusBall: PlanetPositions,
  svgR: number,
  rotateYears: number,
) => {
  svg.groupId(`天王星移動線`);
  for (let d = 2; d <= rotateYears; d++) {
    svg.groupId(`天王星移動線 ${uranusBall[d].datetimeString}`);
    svg.arc(uranusBall[d - 1].r, uranusBall[d - 1].y, uranusBall[d].r, uranusBall[d].y, svgR, SVG_LINE_WIDTH, RED_COLOR, 'none');
    svg.groupFooter();
  }
  svg.groupId(`天王星移動線 閉じる`);
  svg.arc(uranusBall[rotateYears].r, uranusBall[rotateYears].y, uranusBall[1].r, uranusBall[1].y, svgR, SVG_LINE_WIDTH, RED_COLOR, 'none');
  svg.groupFooter();
  svg.groupFooter();
}

let defaultObject = {};
export default defaultObject;
</script>

