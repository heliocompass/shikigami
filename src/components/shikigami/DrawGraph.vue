<script lang="ts">
import type { ObserverType } from '../Observer.vue'
import type { svgType } from '../Svg.vue'
import { AstroClass } from '../Astro.vue'
import { SuntimeClass } from '../Suntime.vue'
import type { timeBase } from '../Suntime.vue'
import { planets } from '../Planet.vue'
const { Sun } = planets()

const SVG_OUT_R = 431.13545; // 地球遠点軌道の半径(px)

type DaysData = {
  start: Date
  end: Date
  data: Array<{ date: number, value: number }>
}

/**
 * 指定した日時の太陽の位置を計算する。
 * @param date 計算する日時
 * @param timezone タイムゾーン
 * @returns 計算結果の太陽の位置
 */
const createSunByDt = (date: Date, timezone: number) => {
  const mjd = AstroClass.mjd(date, timezone);
  const T = AstroClass.t(mjd);
  return new Sun(T);
}
/**
 * 開始日から1年間の日数を計算する
 * @param startDate 開始日
 * @returns 1年間の日数
 */
const rotateDaysFromStartDate = (startDate: Date): number => {
  const startDt = new Date(startDate);
  const endDt = new Date(startDate);
  endDt.setFullYear(endDt.getFullYear() + 1);
  return (endDt.getTime() - startDt.getTime()) / (1000 * 60 * 60 * 24);
};

/**
 * 地球の太陽位置情報を格納するオブジェクトの型
 */
type EarthPositions = {
  datetime: Date;
  sunR: number;
  sunY: number;
}[];

/**
 * 地球に重ねたグラフを描画します。
 * @param svg SVGオブジェクト
 * @param observer 観測者の情報
 * @param drawTime 描画基準時刻
 * @param eachDaysData 描画するデータ
 * @param min 描画するデータの最小値
 * @param max 描画するデータの最大値
 */
export const drawGraph = (
  svg: svgType,
  observer: ObserverType,
  drawTime: timeBase,
  eachDaysData: DaysData,
  min = 0,
  max = 400,
): void => {
  const noonPositions: EarthPositions = [];

  // 1周の日数
  const rotateDays = rotateDaysFromStartDate(observer.initDt);
  const drawDt = new Date(observer.initDt);

  for (let dateIndex = 0; dateIndex < rotateDays; dateIndex++) {
    const suntime = new SuntimeClass(drawDt, observer.longitude, observer.latitude, observer.timezone);

    // 真昼
    const noonSun = createSunByDt(suntime.middleDt(drawTime), observer.timezone);
    noonPositions[dateIndex] = { datetime: suntime.middleDt(drawTime), sunR: noonSun.r, sunY: noonSun.y };

    drawDt.setDate(drawDt.getDate() + 1); // 次の日付
  }

  drawSvgInputDataGraph(svg, eachDaysData, noonPositions, SVG_OUT_R, min, max);
};


/**
 * 地球の日中のラインに任意の円環棒グラフをSVG描画する
 * @param svg SVG描画用オブジェクト
 * @param eachDaysData 日毎のデータ
 * @param noonPositions 真昼の日時、太陽の距離、方位のデータ
 * @param baseR 基準となる半径
 * @param min 最小値
 * @param max 最大値
 */
const drawSvgInputDataGraph = (
  svg: svgType,
  eachDaysData: DaysData,
  noonPositions: { datetime: Date; sunR: number; sunY: number; }[],
  baseR: number,
  min: number,
  max: number,
): void => {
  svg.groupId(`円環棒グラフ`);
  noonPositions.forEach(({ datetime, sunR, sunY }, dateIndex) => {
    const daysValue = eachDaysData.data[dateIndex]?.value ? formatValue(min, max, 400, eachDaysData.data[dateIndex].value) : 0;
    svg.groupId(`円環棒グラフ ${datetime.toLocaleString()}`);
    svg.line(baseR, sunY, baseR + daysValue, sunY, 6, 'blue');
    svg.groupFooter();
  });
  svg.groupFooter();
};

/**
 * 値を指定範囲から指定フォーマットの数値に変換する
 * @param min 最小値
 * @param max 最大値
 * @param formatNumber フォーマットしたい数値の最大値
 * @param value 変換対象の値
 * @returns 指定フォーマットの数値に変換された値
 */
const formatValue = (min: number, max: number, formatNumber: number, value: number | null): number => {
  if (value == null) {
    return 0;
  }
  return formatNumber * (value - min) / (max - min);
};



let defaultObject = {};
export default defaultObject;
</script>

