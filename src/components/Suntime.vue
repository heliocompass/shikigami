<script lang="ts" >
import { AstroClass } from './Astro.vue'
import { CoordClass } from './Coord.vue'
import { planets } from './Planet.vue'
import type { Star } from './Planet.vue'
const { Sun } = planets()

const RAD = Math.PI / 180;
const DEG = 1 / RAD;

export type SuntimeType = {
  initDt: Date;
  noonDt: Date;
  sunriseDt: Date;
  sunsetDt: Date;
  southDt: Date;
  northDt: Date;

  initMjd: number;
  noonMjd: number;
  sunriseMjd: number;
  sunsetMjd: number;
  southMjd: number;
  northMjd: number;

  startDt: (timeBase: timeBase) => Date;
  middleDt: (timeBase: timeBase) => Date;
}
export type timeBase = 'clock' | 'sun';

export class SuntimeClass {
  initDt: Date; // 正子 00:00:00
  noonDt: Date; // 正午 12:00:00
  northDt: Date; // 北中時刻
  southDt: Date; // 南中時刻
  sunriseDt: Date; // 日の出時刻
  sunsetDt: Date; // 日の入時刻

  initMjd: number;
  noonMjd: number;
  sunriseMjd: number;
  sunsetMjd: number;
  northMjd: number;
  southMjd: number;


  /**
   * Observerインスタンスを生成する
   * @param dt 日時
   * @param longitude 経度
   * @param latitude 緯度
   * @param timezone タイムゾーン
   */
  constructor(dt: Date, longitude: number, latitude: number, timezone: number) {
    this.initDt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 0, 0, 0);
    this.noonDt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 12, 0, 0);
    this.initMjd = AstroClass.mjd(this.initDt, timezone);
    this.noonMjd = AstroClass.mjd(this.noonDt, timezone);

    // 日の出時刻の逐次近似計算（フラグ0）
    this.sunriseMjd = this.approximate(longitude, latitude, 0);

    // 日の入り時刻の逐次近似計算（フラグ1）
    this.sunsetMjd = this.approximate(longitude, latitude, 1);

    // 南中時刻は緯度0で計算する（南中時刻は緯度によらないので、これで全緯度に適応できる）
    // 緯度0の日の出時刻の逐次近似計算（フラグ0）
    const sunrise0Mjd = this.approximate(longitude, 0, 0);
    // 緯度0の日の入り時刻の逐次近似計算（フラグ1）
    const sunset0Mjd = this.approximate(longitude, 0, 1);
    this.southMjd = (sunrise0Mjd + sunset0Mjd) / 2;

    // 北中時刻は南中時刻-12時間で計算する
    this.northMjd = this.southMjd - 0.5;

    // MJDから日付を計算する
    this.sunriseDt = AstroClass.dt(this.sunriseMjd, timezone);
    this.sunsetDt = AstroClass.dt(this.sunsetMjd, timezone);
    this.southDt = AstroClass.dt(this.southMjd, timezone);
    this.northDt = AstroClass.dt(this.northMjd, timezone);
  }

  /**
   * 太陽の出没時刻の逐次近似計算
   * @param longitude - 観測地点の経度 [deg]
   * @param latitude - 観測地点の緯度 [deg]
   * @param flag - 0: 日出時刻計算, 1: 日没時刻計算
   * @returns 太陽が出る（または没する）時刻の修正ユリウス日
   */
  approximate(longitude: number, latitude: number, flag: 0 | 1): number {
    let d: number, delta_d: number;
    let t: number, eclipticObliquity: number, siderealTime: number, hourAngle: number;
    let sun: Star;
    let eq: [number, number] = [0, 0];
    let ra: number, decl: number;
    let parallax: number, h0: number, h1: number;
    let k_ha: number, delta_ha: number;

    d = 0;
    delta_ha = 1;

    // delta_haが閾値を下回るまで近似計算を繰り返す
    while (Math.abs(delta_ha) > 0.00005) {
      t = AstroClass.t(this.noonMjd + d);
      eclipticObliquity = AstroClass.eclipticObliquity(t);
      siderealTime = AstroClass.siderealTime(this.noonMjd + d, longitude);
      sun = new Sun(t);
      eq = CoordClass.EC2EQ(sun.y, sun.b, eclipticObliquity);
      ra = eq[0], decl = eq[1];
      hourAngle = AstroClass.hourAngle(siderealTime, ra);

      // 水平座標系の計算
      parallax = Math.sin((0.00244277 / sun.r - 0.26656801 / sun.r - 0.575783) * RAD);
      h0 = Math.sin(decl * RAD) * Math.sin(latitude * RAD);
      h1 = Math.cos(decl * RAD) * Math.cos(latitude * RAD);
      k_ha = Math.acos((parallax - h0) / h1) * DEG;

      // 日の出・日の入りの場合、hourAngleが負の値になるため、k_haも負の値に修正する
      if (flag == 0 && k_ha > 0) k_ha = -k_ha;
      if (flag == 1 && k_ha < 0) k_ha = -k_ha;

      // 計算された時角と修正ユリウス日の差
      delta_ha = k_ha - hourAngle;
      if (delta_ha < -180) {
        delta_ha += 360;
      } else if (delta_ha > 180) {
        delta_ha -= 360;
      }

      // 修正ユリウス日の補正量
      delta_d = delta_ha / 360.0;
      d += delta_d;
    }
    return this.noonMjd + d;
  }


  /**
   * 開始時刻
   * @param timeBase 時刻基準
   * @return 正子 or 北中時刻
   */
  startDt = (timeBase: timeBase): Date => {
    return timeBase === 'clock' ? this.initDt : this.northDt;
  }
  /**
   * 昼時刻
   * @param timeBase 時刻基準
   * @return 正午 or 南中時刻
   */
  middleDt = (timeBase: timeBase): Date => {
    return timeBase === 'clock' ? this.noonDt : this.southDt;
  }

}
let defaultObject = {};
export default defaultObject;
</script>
