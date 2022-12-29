<script lang="ts">
import type { observerType } from '../Observer.vue'
import type { svgType } from '../Svg.vue'
import { AstroClass } from '../Astro.vue'
import { SuntimeClass } from '../Suntime.vue'
import type { timeBase } from '../Suntime.vue'
import { planets } from '../Planet.vue'
const { Sun, Mercury } = planets()

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
 */
export const drawMercury = (
  svg: svgType,
  observer: observerType,
  flagDrawTime: boolean
) => {
  const svgInR = 130.3795, svgOutR = 197.8724;
  const svgSize = 0.69;
  const strokeColor = '#231815';
  const rotateDays = 88;
  let drawDt;
  let suntime;
  let mjd, t;
  let mercury;
  let mercuryBall: PlanetPositions = [];
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
  mercury = new Mercury(t);

  // 水星玉
  compassY = mercury.y + 180;
  if (compassY >= 360) {
    compassY -= 360;
  }
  // 正午にするか南中にするか選ぶ
  if (flagDrawTime) {
    mercuryBall[1] = { datetimeString: suntime.noonDt.toLocaleString(), r: mercury.r, y: compassY };
  } else {
    mercuryBall[1] = { datetimeString: suntime.southDt.toLocaleString(), r: mercury.r, y: compassY };
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
    mercury = new Mercury(t);

    // 水星玉
    compassY = mercury.y + 180;
    if (compassY >= 360) {
      compassY -= 360;
    }
    // 正午にするか南中にするか選ぶ
    if (flagDrawTime) {
      mercuryBall[d] = { datetimeString: suntime.noonDt.toLocaleString(), r: mercury.r, y: compassY };
    } else {
      mercuryBall[d] = { datetimeString: suntime.southDt.toLocaleString(), r: mercury.r, y: compassY };
    }
  }

  // ここから水星SVG作成
  svg.groupId(`水星`);

  svg.groupId(`水星玉`);
  // 最初だけ描画色を変えるのでループ分け
  svg.groupId(`水星玉 ${mercuryBall[1].datetimeString}`);
  svg.circle(SVG_AUR * mercuryBall[1].r, mercuryBall[1].y, svgSize, SVG_LINE_WIDTH, GREEN_COLOR, `none`);
  svg.groupFooter();

  for (d = 2; d <= rotateDays; d++) {
    svg.groupId(`水星玉 ${mercuryBall[d].datetimeString}`);
    svg.circle(SVG_AUR * mercuryBall[d].r, mercuryBall[d].y, svgSize, SVG_LINE_WIDTH, strokeColor, `none`);
    svg.groupFooter();
  }
  svg.groupFooter();

  svg.groupId(`水星移動線`);
  for (d = 2; d <= rotateDays; d++) {
    svg.groupId(`水星移動線 ${mercuryBall[d].datetimeString}`);
    svg.line(SVG_AUR * mercuryBall[d - 1].r, mercuryBall[d - 1].y, SVG_AUR * mercuryBall[d].r, mercuryBall[d].y, SVG_LINE_WIDTH, BLACK_COLOR);
    svg.groupFooter();
  }
  svg.groupId(`水星移動線 閉じる`);
  svg.line(SVG_AUR * mercuryBall[rotateDays].r, mercuryBall[rotateDays].y, SVG_AUR * mercuryBall[1].r, mercuryBall[1].y, SVG_LINE_WIDTH, BLACK_COLOR);
  svg.groupFooter();

  svg.groupFooter();

  svg.groupId(`水星近点軌道`);
  svg.circle(0, 0, svgInR, SVG_LINE_WIDTH, RED_COLOR, `none`);
  svg.groupFooter();
  svg.groupId(`水星遠点軌道`);
  svg.circle(0, 0, svgOutR, SVG_LINE_WIDTH, RED_COLOR, `none`);
  svg.groupFooter();

  svg.groupFooter();
}

let defaultObject = {};
export default defaultObject;
</script>

