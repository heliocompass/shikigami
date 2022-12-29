<script lang="ts">
import type { observerType } from '../Observer.vue'
import type { svgType } from '../Svg.vue'
import { AstroClass } from '../Astro.vue'
import { SuntimeClass } from '../Suntime.vue'
import type { timeBase } from '../Suntime.vue'
import { planets } from '../Planet.vue'
const { Neptune } = planets()

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
 * 木星描画
 */
export const drawNeptune = (svg: svgType, observer: observerType, flagDrawTime: boolean) => {
  const svgR = 806.001;
  const svgSize = 7.0859;
  const strokeColor = '#333333';
  const rotateYears = 164;
  let drawDt;
  let suntime;
  let mjd, t;
  let neptune;
  let neptuneBall: PlanetPositions = [];
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
  neptune = new Neptune(t);

  // 海王星玉
  compassY = neptune.y + 180;
  if (compassY >= 360) {
    compassY -= 360;
  }
  // 動径は平均軌道半径で固定
  // 正午にするか南中にするか選ぶ
  if (flagDrawTime) {
    neptuneBall[1] = { datetimeString: suntime.noonDt.toLocaleString(), r: svgR, y: compassY };
  } else {
    neptuneBall[1] = { datetimeString: suntime.southDt.toLocaleString(), r: svgR, y: compassY };
  }

  // 最終までの要素ループ	
  // 翌年の1日前から毎年1日前を描画
  drawDt.setDate(drawDt.getDate() - 1);

  for (d = 2; d <= rotateYears; d++) {
    drawDt.setFullYear(drawDt.getFullYear() + 1);
    suntime = new SuntimeClass(drawDt, observer.longitude, observer.latitude, observer.timezone);
    // 正午にするか南中にするか選ぶ
    if (flagDrawTime) {
      mjd = AstroClass.mjd(suntime.noonDt, observer.timezone);
    } else {
      mjd = AstroClass.mjd(suntime.southDt, observer.timezone);
    }
    t = AstroClass.t(mjd);
    neptune = new Neptune(t);

    // 海王星玉
    compassY = neptune.y + 180;
    if (compassY >= 360) {
      compassY -= 360;
    }
    // 動径は平均軌道半径で固定
    // 正午にするか南中にするか選ぶ
    if (flagDrawTime) {
      neptuneBall[d] = { datetimeString: suntime.noonDt.toLocaleString(), r: svgR, y: compassY };
    } else {
      neptuneBall[d] = { datetimeString: suntime.southDt.toLocaleString(), r: svgR, y: compassY };
    }
  }

  // ここから海王星SVG作成
  svg.groupId(`海王星`);

  svg.groupId(`海王星玉`);
  // 最初だけ描画色を変えるのでループ分け
  svg.groupId(`海王星玉 ${neptuneBall[1].datetimeString}`);
  svg.circle(neptuneBall[1].r, neptuneBall[1].y, svgSize, SVG_LINE_WIDTH, GREEN_COLOR, `none`);
  svg.groupFooter();

  for (d = 2; d <= rotateYears; d++) {
    svg.groupId(`海王星玉 ${neptuneBall[d].datetimeString}`);
    svg.circle(neptuneBall[d].r, neptuneBall[d].y, svgSize, SVG_LINE_WIDTH, strokeColor, `none`);
    svg.groupFooter();
  }
  svg.groupFooter();

  svg.groupId(`海王星移動線`);
  for (d = 2; d <= rotateYears; d++) {
    svg.groupId(`海王星移動線 ${neptuneBall[d].datetimeString}`);
    svg.arc(neptuneBall[d - 1].r, neptuneBall[d - 1].y, neptuneBall[d].r, neptuneBall[d].y, svgR, SVG_LINE_WIDTH, RED_COLOR, 'none');
    svg.groupFooter();
  }
  svg.groupId(`海王星移動線 閉じる`);
  svg.arc(neptuneBall[rotateYears].r, neptuneBall[rotateYears].y, neptuneBall[1].r, neptuneBall[1].y, svgR, SVG_LINE_WIDTH, RED_COLOR, 'none');
  svg.groupFooter();
  svg.groupFooter();

  svg.groupFooter();
}

let defaultObject = {};
export default defaultObject;
</script>
