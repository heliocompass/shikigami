<script lang="ts">
import type { observerType } from '../Observer.vue'
import type { svgType } from '../Svg.vue'
import { AstroClass } from '../Astro.vue'
import { SuntimeClass } from '../Suntime.vue'
import type { timeBase } from '../Suntime.vue'
import { planets } from '../Planet.vue'
const { Venus } = planets()

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
export const drawVenus = (
  svg: svgType,
  observer: observerType,
  drawTime: timeBase
) => {
  const svgInR = 304.611; // 金星の近点軌道の半径(px)
  const svgOutR = 308.7921; // 水星遠点軌道の半径(px)
  const svgSize = 1.72; // 金星玉の大きさ
  const strokeColor = '#231815';
  const rotateDays = 225; // 金星の公転周期 225日
  let drawDt;
  let suntime;
  let mjd, t;
  let venus;
  let venusBall: PlanetPositions = [];
  let compassY
  let d;

  // 最初の要素
  drawDt = new Date(observer.initDt);
  suntime = new SuntimeClass(drawDt, observer.longitude, observer.latitude, observer.timezone);
  mjd = AstroClass.mjd(suntime.middleDt(drawTime), observer.timezone);
  t = AstroClass.t(mjd);
  venus = new Venus(t);

  // 金星玉
  compassY = venus.y + 180;
  if (compassY >= 360) {
    compassY -= 360;
  }
  venusBall[1] = { datetimeString: suntime.middleDt(drawTime).toLocaleString(), r: venus.r, y: compassY };


  // 最終までの要素ループ
  for (d = 2; d <= rotateDays; d++) {
    drawDt.setDate(drawDt.getDate() + 1);
    suntime = new SuntimeClass(drawDt, observer.longitude, observer.latitude, observer.timezone);
    // 正午にするか南中にするか選ぶ
    mjd = AstroClass.mjd(suntime.middleDt(drawTime), observer.timezone);

    t = AstroClass.t(mjd);
    venus = new Venus(t);

    // 金星玉
    compassY = venus.y + 180;
    if (compassY >= 360) {
      compassY -= 360;
    }
    venusBall[d] = { datetimeString: suntime.middleDt(drawTime).toLocaleString(), r: venus.r, y: compassY };

  }

  // ここから金星SVG作成
  svg.groupId(`金星`);

  svg.groupId(`金星玉`);
  // 最初だけ描画色を変えるのでループ分け
  svg.groupId(`金星玉 ${venusBall[1].datetimeString}`);
  svg.circle(SVG_AUR * venusBall[1].r, venusBall[1].y, svgSize, SVG_LINE_WIDTH, GREEN_COLOR, `none`);
  svg.groupFooter();

  for (d = 2; d <= rotateDays; d++) {
    svg.groupId(`金星玉 ${venusBall[d].datetimeString}`);
    svg.circle(SVG_AUR * venusBall[d].r, venusBall[d].y, svgSize, SVG_LINE_WIDTH, strokeColor, `none`);
    svg.groupFooter();
  }
  svg.groupFooter();

  svg.groupId(`金星移動線`);
  for (d = 2; d <= rotateDays; d++) {
    svg.groupId(`金星移動線 ${venusBall[d].datetimeString}`);
    svg.line(SVG_AUR * venusBall[d - 1].r, venusBall[d - 1].y, SVG_AUR * venusBall[d].r, venusBall[d].y, SVG_LINE_WIDTH, BLACK_COLOR);
    svg.groupFooter();
  }
  svg.groupId(`金星移動線 閉じる`);
  svg.line(SVG_AUR * venusBall[rotateDays].r, venusBall[rotateDays].y, SVG_AUR * venusBall[1].r, venusBall[1].y, SVG_LINE_WIDTH, BLACK_COLOR);
  svg.groupFooter();

  svg.groupFooter();

  svg.groupId(`金星近点軌道`);
  svg.circle(0, 0, svgInR, SVG_LINE_WIDTH, RED_COLOR, `none`);
  svg.groupFooter();
  svg.groupId(`金星遠点軌道`);
  svg.circle(0, 0, svgOutR, SVG_LINE_WIDTH, RED_COLOR, `none`);
  svg.groupFooter();

  svg.groupFooter();
}


let defaultObject = {};
export default defaultObject;
</script>

