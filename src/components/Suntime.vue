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

}

export class SuntimeClass {
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

  constructor(dt: Date, longitude: number, latitude: number, timezone: number) {
    let sunrise0Mjd: number, sunset0Mjd: number;
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
    sunrise0Mjd = this.approximate(longitude, 0, 0);
    // 緯度0の日の入り時刻の逐次近似計算（フラグ1）
    sunset0Mjd = this.approximate(longitude, 0, 1);
    this.southMjd = (sunrise0Mjd + sunset0Mjd) / 2;

    // 北中時刻は南中時刻-12時間で計算する
    this.northMjd = this.southMjd - 0.5;

    // MJDから日付を計算する
    this.sunriseDt = AstroClass.dt(this.sunriseMjd, timezone);
    this.sunsetDt = AstroClass.dt(this.sunsetMjd, timezone);
    this.southDt = AstroClass.dt(this.southMjd, timezone);
    this.northDt = AstroClass.dt(this.northMjd, timezone);
  }

  /** 太陽の出没時刻の逐次近似計算 */
  approximate(longitude: number, latitude: number, flag: 0 | 1) {
    let d: number, delta_d: number;
    let t: number, eclipticObliquity: number, siderealTime: number, hourAngle: number;
    let sun: Star;
    let eq: [number, number] = [0, 0];
    let ra: number, decl;
    let parallax, h0, h1
    let k_ha, delta_ha;

    d = 0;
    delta_ha = 1;

    while (Math.abs(delta_ha) > 0.00005) {
      t = AstroClass.t(this.noonMjd + d);
      eclipticObliquity = AstroClass.eclipticObliquity(t);
      siderealTime = AstroClass.siderealTime(this.noonMjd + d, longitude);
      sun = new Sun(t);
      eq = CoordClass.EC2EQ(sun.y, sun.b, eclipticObliquity);
      ra = eq[0], decl = eq[1];
      hourAngle = AstroClass.hourAngle(siderealTime, ra);

      parallax = Math.sin((0.00244277 / sun.r - 0.26656801 / sun.r - 0.575783) * RAD);
      h0 = Math.sin(decl * RAD) * Math.sin(latitude * RAD);
      h1 = Math.cos(decl * RAD) * Math.cos(latitude * RAD);
      k_ha = Math.acos((parallax - h0) / h1) * DEG;

      if (flag == 0 && k_ha > 0) k_ha = -k_ha;
      if (flag == 1 && k_ha < 0) k_ha = -k_ha;

      delta_ha = k_ha - hourAngle;
      if (delta_ha < -180) {
        delta_ha += 360;
      } else if (delta_ha > 180) {
        delta_ha -= 360;
      }

      delta_d = delta_ha / 360.0;
      d += delta_d;
    }
    return this.noonMjd + d;
  }
}
let defaultObject = {};
export default defaultObject;
</script>
