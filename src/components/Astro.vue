<script lang="ts" >

const RAD = Math.PI / 180;

export type AstroType = {
  nowDt: Date,
  name: string,
  longitude: number,
  latitude: number,
  timezone: number,
  initDt: Date;
}

export class AstroClass {

  /**
   * グレゴリオ暦から修正ユリウス日を求める
   * @param dt - グレゴリオ暦の日時
   * @param timezone - タイムゾーンのオフセット
   * @returns 修正ユリウス暦
   */
  static mjd(dt: Date, timezone: number): number {
    const year = dt.getFullYear();
    const month = dt.getMonth() + 1;
    const day = dt.getDate();
    const hour = dt.getHours();
    const minute = dt.getMinutes();
    const a = Math.trunc((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    const jd = day + Math.trunc((153 * m + 2) / 5) + 365 * y + Math.trunc(y / 4) - Math.trunc(y / 100) + Math.trunc(y / 400) - 32045;
    const mjd = jd - 2400000.5;
    return mjd - (timezone / 24);
  }

  /**
   * 修正ユリウス日からグレゴリオ暦を求める
   * @param mjd - 修正ユリウス暦
   * @param timezone - タイムゾーンのオフセット
   * @returns グレゴリオ暦の日時
   */
  static dt(mjd: number, timezone: number): Date {
    const jd = mjd + 2400000.5;
    const f = jd + 0.5;
    const z = Math.trunc(f);
    const a = z;
    const alpha = Math.trunc((a - 1867216.25) / 36524.25);
    const b = a + 1 + alpha - Math.trunc(alpha / 4);
    const c = b + 1524;
    const d = Math.trunc((c - 122.1) / 365.25);
    const e = Math.trunc(365.25 * d);
    const g = Math.trunc((c - e) / 30.6001);
    const day = c - e + f - z;
    const month = (g < 13.5) ? (g - 1) : (g - 13);
    const year = (month > 2.5) ? (d - 4716) : (d - 4715);
    const hour = Math.trunc((day - Math.trunc(day)) * 24);
    const minute = Math.trunc(((day - Math.trunc(day)) * 24 - hour) * 60);
    return new Date(Date.UTC(year, month - 1, Math.trunc(day), hour, minute, 0) - timezone * 60 * 1000);
  }



  /**
   * J2000.0からの経過ユリウス世紀を求める
   * @param mjd 修正ユリウス日
   * @returns 経過ユリウス世紀
   */
  static t(mjd: number): number {
    return (mjd - 51544.5) / 36525.0;
  }

  /**
   * 平均黄道傾斜角を求める
   * @param t 経過ユリウス世紀
   * @returns 平均黄道傾斜角
   */
  static eclipticObliquity(t: number): number {
    const A = 84381.406;
    const B = -46.836769 * t;
    const C = -0.0001831 * t ** 2;
    const D = -0.0020034 * t ** 3;
    const E = -0.000000576 * t ** 4;
    const F = -0.0000000434 * t ** 5;
    return (A + B + C + D + E + F) / 3600;
  }

  /**
   * 地方恒星時を求める
   * @param mjd 修正ユリウス日
   * @param longitude 経度
   * @returns 地方恒星時
   */
  static siderealTime(mjd: number, longitude: number): number {
    const T0 = 0.671262;
    const T1 = 1.002737909;
    const T2 = (mjd - 40000) * T1;
    return ((T0 + T2 + longitude / 360) % 1) * 24;
  }

  /**
   * 時角を求める
   * @param siderealTime 地方恒星時（時間）
   * @param ra 赤経（時間）
   */
  static hourAngle(siderealTime: number, ra: number): number {
    return siderealTime * 15 - ra;
  }
}
let defaultObject = {};
export default defaultObject;
</script>
