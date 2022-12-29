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
export const drawSaturn = (svg: svgType, observer: observerType, flagDrawTime: boolean) => {
  const svgR = 766.667;
  const svgSmallSize = 1.0023;
  const svgBigSize = 17.0088;
  const strokeColor = '#333333';
  const rotateMonths = 12;
  const rotateYears = 30;
  let drawDt;
  let suntime;
  let mjd, t;
  let saturn;
  let saturnSmallBall: PlanetPositions = [], saturnBigBall: PlanetPositions = [];
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
  saturn = new Saturn(t);

  // 土星玉・大
  compassY = saturn.y + 180;
  if (compassY >= 360) {
    compassY -= 360;
  }
  // 動径は平均軌道半径で固定
  // 正午にするか南中にするか選ぶ
  if (flagDrawTime) {
    saturnBigBall[1] = { datetimeString: suntime.noonDt.toLocaleString(), r: svgR, y: compassY };
  } else {
    saturnBigBall[1] = { datetimeString: suntime.southDt.toLocaleString(), r: svgR, y: compassY };
  }

  // 1年後までの要素ループ
  // 翌月1日から毎月1日を描画
  drawDt.setDate(1);

  for (d = 1; d <= rotateMonths; d++) {
    drawDt.setMonth(drawDt.getMonth() + 1);
    suntime = new SuntimeClass(drawDt, observer.longitude, observer.latitude, observer.timezone);
    // 正午にするか南中にするか選ぶ
    if (flagDrawTime) {
      mjd = AstroClass.mjd(suntime.noonDt, observer.timezone);
    } else {
      mjd = AstroClass.mjd(suntime.southDt, observer.timezone);
    }
    t = AstroClass.t(mjd);
    saturn = new Saturn(t);

    // 土星玉・小
    compassY = saturn.y + 180;
    if (compassY >= 360) {
      compassY -= 360;
    }
    // 動径は平均軌道半径で固定
    // 正午にするか南中にするか選ぶ
    if (flagDrawTime) {
      saturnSmallBall[d] = { datetimeString: suntime.noonDt.toLocaleString(), r: svgR, y: compassY };
    } else {
      saturnSmallBall[d] = { datetimeString: suntime.southDt.toLocaleString(), r: svgR, y: compassY };
    }
  }

  // 1年後から最終までの要素ループ
  drawDt = new Date(observer.initDt);
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
    saturn = new Saturn(t);

    // 土星玉・大
    compassY = saturn.y + 180;
    if (compassY >= 360) {
      compassY -= 360;
    }
    // 動径は平均軌道半径で固定
    // 正午にするか南中にするか選ぶ
    if (flagDrawTime) {
      saturnBigBall[d] = { datetimeString: suntime.noonDt.toLocaleString(), r: svgR, y: compassY };
    } else {
      saturnBigBall[d] = { datetimeString: suntime.southDt.toLocaleString(), r: svgR, y: compassY };
    }
  }

  // ここから土星SVG作成
  svg.groupId(`土星`);

  svg.groupId(`土星玉`);
  // 最初だけ描画色を変えるのでループ分け
  svg.groupId(`土星玉・大 ${saturnBigBall[1].datetimeString}`);
  svg.circle(saturnBigBall[1].r, saturnBigBall[1].y, svgBigSize, SVG_LINE_WIDTH, GREEN_COLOR, `none`);
  svg.groupFooter();

  for (d = 1; d <= rotateMonths; d++) {
    svg.groupId(`土星玉・小 ${saturnSmallBall[d].datetimeString}`);
    svg.circle(saturnSmallBall[d].r, saturnSmallBall[d].y, svgSmallSize, SVG_LINE_WIDTH, strokeColor, `none`);
    svg.groupFooter();
  }

  for (d = 2; d <= rotateYears; d++) {
    svg.groupId(`土星玉・大 ${saturnBigBall[d].datetimeString}`);
    svg.circle(saturnBigBall[d].r, saturnBigBall[d].y, svgBigSize, SVG_LINE_WIDTH, strokeColor, `none`);
    svg.groupFooter();
  }
  svg.groupFooter();

  svg.groupId(`土星軌道線`);
  svg.groupId(`土星移動線 ${saturnSmallBall[1].datetimeString}`);
  svg.arc(saturnBigBall[1].r, saturnBigBall[1].y, saturnSmallBall[1].r, saturnSmallBall[1].y, svgR, SVG_LINE_WIDTH, RED_COLOR, 'none');
  svg.groupFooter();

  for (d = 2; d <= rotateMonths; d++) {
    svg.groupId(`土星移動線 ${saturnSmallBall[d].datetimeString}`);
    svg.arc(saturnSmallBall[d - 1].r, saturnSmallBall[d - 1].y, saturnSmallBall[d].r, saturnSmallBall[d].y, svgR, SVG_LINE_WIDTH, RED_COLOR, 'none');
    svg.groupFooter();
  }

  svg.groupId(`土星移動線 ${saturnBigBall[2].datetimeString}`);
  svg.arc(saturnSmallBall[rotateMonths].r, saturnSmallBall[rotateMonths].y, saturnBigBall[2].r, saturnBigBall[2].y, svgR, SVG_LINE_WIDTH, RED_COLOR, 'none');
  svg.groupFooter();

  for (d = 3; d <= rotateYears; d++) {
    svg.groupId(`土星移動線 ${saturnBigBall[d].datetimeString}`);
    svg.arc(saturnBigBall[d - 1].r, saturnBigBall[d - 1].y, saturnBigBall[d].r, saturnBigBall[d].y, svgR, SVG_LINE_WIDTH, RED_COLOR, 'none');
    svg.groupFooter();
  }

  svg.groupId(`土星移動線 閉じる`);
  svg.arc(saturnBigBall[rotateYears].r, saturnBigBall[rotateYears].y, saturnBigBall[1].r, saturnBigBall[1].y, svgR, SVG_LINE_WIDTH, RED_COLOR, 'none');
  svg.groupFooter();
  svg.groupFooter();

  svg.groupFooter();
}


let defaultObject = {};
export default defaultObject;
</script>

