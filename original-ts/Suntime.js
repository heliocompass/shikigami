//
// Suntime.js
// Sunrise/Sunset/SouthCentral/NorthCentral Calculation Class Library 
// Copyright(C)2021 T.Takao@Will System Design All Rights Reserved.
// https://will-system.net/
//

class Suntime {
  constructor(dt, longitude, latitude, timezone) {
    let sunrise0Mjd, sunset0Mjd;
    this.initDt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 0, 0, 0);
    this.noonDt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 12, 0, 0);
    this.initMjd = Astro.mjd(this.initDt, timezone);
    this.noonMjd = Astro.mjd(this.noonDt, timezone);

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
    this.sunriseDt = Astro.dt(this.sunriseMjd, timezone);
    this.sunsetDt = Astro.dt(this.sunsetMjd, timezone);
    this.southDt = Astro.dt(this.southMjd, timezone);
    this.northDt = Astro.dt(this.northMjd, timezone);
  }

  // 太陽の出没時刻の逐次近似計算
  approximate(longitude, latitude, flag) {
    let d, delta_d;
    let t, e, st, ha;
    let sun;
    let eq = [], ra, decl;
    let parallax, h0, h1
    let k_ha, delta_ha;

    d = 0;
    delta_ha = 1;

    while (Math.abs(delta_ha) > 0.00005) {
      t = Astro.t(this.noonMjd + d);
      e = Astro.e(t);
      st = Astro.st(this.noonMjd + d, longitude);
      sun = new Sun(t);
      eq = Coord.EC2EQ(sun.y, sun.b, e);
      ra = eq[0], decl = eq[1];
      ha = Astro.ha(st, ra);

      parallax = Math.sin((0.00244277 / sun.r - 0.26656801 / sun.r - 0.575783) * RAD);
      h0 = Math.sin(decl * RAD) * Math.sin(latitude * RAD);
      h1 = Math.cos(decl * RAD) * Math.cos(latitude * RAD);
      k_ha = Math.acos((parallax - h0) / h1) * DEG;

      if (flag == 0 && k_ha > 0) k_ha = -k_ha;
      if (flag == 1 && k_ha < 0) k_ha = -k_ha;

      delta_ha = k_ha - ha;
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
