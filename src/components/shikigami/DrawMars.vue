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
 * 金星描画
 */
export const drawMars = (svg: svgType, observer: observerType, flagDrawTime: boolean) => {
  const svgInR = 585.71316, svgOutR = 706.40593;
  const svgSize = 0.96;
  const strokeColor = '#333333';
  const rotateDays = 687;
  let drawDt;
  let suntime;
  let mjd, t;
  let mars;
  let marsBall: PlanetPositions = [];
  let compassY;
  let d;

  // 最初の要素
  drawDt = new Date(observer.initDt);
  suntime = new SuntimeClass(drawDt, observer.longitude, observer.latitude, observer.timezone);
  // 正午にするか南中にするか選ぶ
  if (flagDrawTime) {
    mjd = AstroClass.mjd(suntime.noonDt, observer.timezone);
  } else {
    mjd = AstroClass.mjd(suntime.southDt, observer.timezone);
  }
  t = AstroClass.t(mjd);
  mars = new Mars(t);

  // 火星玉
  compassY = mars.y + 180;
  if (compassY >= 360) {
    compassY -= 360;
  }

  // 正午にするか南中にするか選ぶ
  if (flagDrawTime) {
    marsBall[1] = { datetimeString: suntime.noonDt.toLocaleString(), r: mars.r, y: compassY };
  } else {
    marsBall[1] = { datetimeString: suntime.southDt.toLocaleString(), r: mars.r, y: compassY };
  }

  // 最終までの要素ループ
  for (d = 2; d <= rotateDays; d++) {
    drawDt.setDate(drawDt.getDate() + 1);
    suntime = new SuntimeClass(drawDt, observer.longitude, observer.latitude, observer.timezone);
    // 正午にするか南中にするか選ぶ
    if (flagDrawTime) {
      mjd = AstroClass.mjd(suntime.noonDt, observer.timezone);
    } else {
      mjd = AstroClass.mjd(suntime.southDt, observer.timezone);
    }
    t = AstroClass.t(mjd);
    mars = new Mars(t);

    // 火星玉
    compassY = mars.y + 180;
    if (compassY >= 360) {
      compassY -= 360;
    }
    // 正午にするか南中にするか選ぶ
    if (flagDrawTime) {
      marsBall[d] = { datetimeString: suntime.noonDt.toLocaleString(), r: mars.r, y: compassY };
    } else {
      marsBall[d] = { datetimeString: suntime.southDt.toLocaleString(), r: mars.r, y: compassY };
    }
  }

  // ここから火星SVG作成
  svg.groupId(`火星`);

  svg.groupId(`火星玉`);
  // 最初だけ描画色を変えるのでループ分け
  svg.groupId(`火星玉 ${marsBall[1].datetimeString}`);
  svg.circle(SVG_AUR * marsBall[1].r, marsBall[1].y, svgSize, SVG_LINE_WIDTH, GREEN_COLOR, `none`);
  svg.groupFooter();

  for (d = 2; d <= rotateDays; d++) {
    svg.groupId(`火星玉 ${marsBall[d].datetimeString}`);
    svg.circle(SVG_AUR * marsBall[d].r, marsBall[d].y, svgSize, SVG_LINE_WIDTH, strokeColor, `none`);
    svg.groupFooter();
  }
  svg.groupFooter();

  svg.groupId(`火星移動線`);
  for (d = 2; d <= rotateDays; d++) {
    svg.groupId(`火星移動線 ${marsBall[d].datetimeString}`);
    svg.line(SVG_AUR * marsBall[d - 1].r, marsBall[d - 1].y, SVG_AUR * marsBall[d].r, marsBall[d].y, SVG_LINE_WIDTH, BLACK_COLOR);
    svg.groupFooter();
  }
  svg.groupId(`火星移動線 閉じる`);
  svg.line(SVG_AUR * marsBall[rotateDays].r, marsBall[rotateDays].y, SVG_AUR * marsBall[1].r, marsBall[1].y, SVG_LINE_WIDTH, BLACK_COLOR);
  svg.groupFooter();

  svg.groupFooter();

  svg.groupId(`火星近点軌道`);
  svg.circle(0, 0, svgInR, SVG_LINE_WIDTH, RED_COLOR, `none`);
  svg.groupFooter();
  svg.groupId(`火星遠点軌道`);
  svg.circle(0, 0, svgOutR, SVG_LINE_WIDTH, RED_COLOR, `none`);
  svg.groupFooter();

  svg.groupFooter();
}

let defaultObject = {};
export default defaultObject;
</script>

