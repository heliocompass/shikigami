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

  // グレゴリオ歴から修正ユリウス日を求める
  /** 修正ユリウス暦 */
  static mjd(dt: Date, timezone: number) {
    let year: number, month: number, day: number, hour: number, minute: number;
    let mjd: number;

    year = dt.getFullYear();
    month = dt.getMonth() + 1;
    day = dt.getDate();
    hour = dt.getHours();
    minute = dt.getMinutes();

    if (month <= 2) {
      month += 12;
      year -= 1;
    }

    mjd = Math.trunc(365.25 * year) + Math.trunc(year / 400) - Math.trunc(year / 100) + Math.trunc(30.59 * (month - 2));
    mjd += day - 678912;
    mjd += (hour / 24) + (minute / 24 / 60);
    mjd -= timezone / 24;
    return mjd;
  }

  /** 修正ユリウス日からグレゴリオ暦を求める */
  static dt(mjd: number, timezone: number): Date {
    let calcMjd: number;
    let n: number, a: number, b: number;
    let date: number, time: number;
    let year: number, month: number, day: number, hour: number, minute: number;

    calcMjd = mjd + timezone / 24;
    date = Math.trunc(calcMjd);
    time = calcMjd - date;
    n = date + 678881;
    a = 4 * n + 3 + 4 * Math.trunc(0.75 * Math.trunc(4 * (n + 1) / 146097 + 1));
    b = 5 * Math.trunc((a % 1461) / 4) + 2;
    year = Math.trunc(a / 1461);
    month = Math.trunc(b / 153) + 3;
    if (month > 12) {
      year++;
      month -= 12;
    }
    day = Math.trunc((b % 153) / 5) + 1;
    hour = Math.trunc(time * 24);
    minute = Math.round((time * 24 - hour) * 60);

    return new Date(year, month - 1, day, hour, minute, 0);
  }

  /** J2000.0からの経過ユリウス世紀 */
  static t(mjd: number): number {
    return (mjd - 51544.5) / 36525.0;
  }

  /** 平均黄道傾斜角を求める */
  static eclipticObliquity(t: number): number {
    let eclipticObliquity: number;

    eclipticObliquity = 84381.406 - 46.836769 * t - 0.0001831 * Math.pow(t, 2) - 0.0020034 * Math.pow(t, 3) - 0.000000576 * Math.pow(t, 4) - 0.0000000434 * Math.pow(t, 5);
    eclipticObliquity /= 3600;
    return eclipticObliquity;
  }

  /** 地方恒星時を求める */
  static siderealTime(mjd: number, longitude: number): number {
    let siderealTime: number;

    siderealTime = (0.671262 + 1.002737909 * (mjd - 40000) + longitude / 360.0);
    siderealTime = (siderealTime - Math.floor(siderealTime)) * 24;
    return siderealTime;
  }

  /** 時角を求める */
  static hourAngle(siderealTime: number, ra: number): number {
    return siderealTime * 15 - ra;
  }

}
const defaultText = '';
export default defaultText;
</script>
