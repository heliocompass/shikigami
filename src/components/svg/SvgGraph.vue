<script lang="ts">
import type { observerType } from '../Observer.vue'
import type { svgType } from '../Svg.vue'
import { AstroClass } from '../Astro.vue'
import { SuntimeClass } from '../Suntime.vue'
import type { timeBase } from '../Suntime.vue'
import { planets } from '../Planet.vue'
const { Sun } = planets()

// 定数
const SVG_LINE_WIDTH = 0.25;
const SVG_AUR = 424.0488; // 1AU = 424.0488px
const BLACK_COLOR = '#000000';
const RED_COLOR = '#FF0000';
const GREEN_COLOR = '#33CC33';

const SVG_OUT_R = 431.13545; // 地球遠点軌道の半径(px)

type DaysData = {
  start: Date
  end: Date
  data: Array<{ date: number, value: number }>
}

const createSunbyDt = (date: Date, timezone: number) => {
  const mjd = AstroClass.mjd(date, timezone);
  const T = AstroClass.t(mjd);
  return new Sun(T);
}

/**
 * １年間の日数
 * @param startDate 開始日
 * @return 1年間の日数
 */
const rotateDaysFromStartDate = (startDate: Date): number => {
  const startDt = new Date(startDate);
  const endDt = new Date(startDate);
  endDt.setFullYear(endDt.getFullYear() + 1);
  return (endDt.getTime() - startDt.getTime()) / (1000 * 60 * 60 * 24);
}

type EarthPositions = {
  datetime: Date,
  sunR: number,
  sunY: number,
}[];

/**
 * グラフを地球に重ねて描画
 * @param svg 
 * @param observer 
 * @param drawTime 
 * @param eachDaysData 
 */
export const drawGraph = (
  svg: svgType,
  observer: observerType,
  drawTime: timeBase,
  eachDaysData: DaysData
) => {
  let noonPositions: EarthPositions = [];

  // 1周の日数
  const rotateDays = rotateDaysFromStartDate(observer.initDt);
  let drawDt = new Date(observer.initDt);
  for (let dateIndex = 0; dateIndex < rotateDays; dateIndex++) {
    const suntime = new SuntimeClass(drawDt, observer.longitude, observer.latitude, observer.timezone);

    // 真昼
    const noonSun = createSunbyDt(suntime.middleDt(drawTime), observer.timezone);
    noonPositions[dateIndex] = { datetime: suntime.middleDt(drawTime), sunR: noonSun.r, sunY: noonSun.y };

    drawDt.setDate(drawDt.getDate() + 1); // 次の日付
  }

  drawSvgInputDataGraph(svg, eachDaysData, noonPositions, SVG_OUT_R);
}

/**
 * 任意の円環棒グラフを地球の日中のラインにSVG描画する
 * @param svg 
 * @param eachDaysData 
 * @param noonPositions 
 * @param baseR 
 */
const drawSvgInputDataGraph = (
  svg: svgType,
  eachDaysData: DaysData,
  noonPositions: { datetime: Date; sunR: number; sunY: number; }[],
  baseR: number,
) => {
  svg.groupId(`円環棒グラフ`);
  for (let dateIndex = 0; dateIndex < noonPositions.length; dateIndex++) {
    const daysValue = eachDaysData.data[dateIndex] ? eachDaysData.data[dateIndex].value : 0

    svg.groupId(`円環棒グラフ ${noonPositions[dateIndex].datetime.toLocaleString()}`);
    svg.line(
      baseR,
      noonPositions[dateIndex].sunY,
      baseR + daysValue,
      noonPositions[dateIndex].sunY,
      6,
      'blue'
    );
    svg.groupFooter();
  }
  svg.groupFooter();
}


let defaultObject = {};
export default defaultObject;
</script>

