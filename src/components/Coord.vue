<script  lang="ts">
// 定数
const RAD = Math.PI / 180;
const DEG = 1 / RAD;

export class CoordClass {

  /** 日心黄道座標から地心黄道座標（視位置）に変換する */
  static HelioEC2GeoEC(y: number, b: number, r: number, ys: number, rs: number) {
    let ac: number, bc: number, cc: number, rc: number;
    let geoY: number, geoB: number, ecliptiCoordinates: [number, number] = [0, 0];

    y *= RAD;
    b *= RAD;
    // ysは光行差を考慮した地心の視黄経なので幾何学的黄経にする
    ys = (ys + 0.0057) * RAD;

    ac = r * Math.cos(b) * Math.cos(y) + rs * Math.cos(ys);
    bc = r * Math.cos(b) * Math.sin(y) + rs * Math.sin(ys);
    cc = r * Math.sin(b);
    rc = Math.sqrt(ac * ac + bc * bc + cc * cc);
    geoB = Math.asin(cc / rc);
    geoY = Math.atan(bc / ac);

    if (ac < 0) {
      geoY += Math.PI;
    }

    if (geoY < 0) {
      geoY += Math.PI * 2;
    }

    ecliptiCoordinates = [geoY * DEG, geoB * DEG];
    return ecliptiCoordinates;
  }

  /** 地心黄道座標から赤道座標に変換する */
  static EC2EQ(y: number, b: number, e: number) {
    let decl: number, ra: number;
    let c: number, s: number;
    let eq: [number, number] = [0, 0];

    y *= RAD;
    b *= RAD;
    e *= RAD;
    decl = Math.cos(b) * Math.sin(y) * Math.sin(e) + Math.sin(b) * Math.cos(e);
    decl = Math.asin(decl);
    c = Math.cos(b) * Math.cos(y);
    s = Math.cos(b) * Math.sin(y) * Math.cos(e) - Math.sin(b) * Math.sin(e);
    ra = Math.atan(s / c);

    if (c < 0) {
      ra += Math.PI;
    }

    if (ra < 0) {
      ra += Math.PI * 2;
    }

    eq = [ra * DEG, decl * DEG];
    return eq;
  }

  /** 赤道座標から地平座標に変換する */
  static EQ2Horizon(decl: number, latitude: number, hourAngle: number) {
    let azimuth: number, altitude: number; // 方位角、高度
    let z0: number, z1: number, z2: number;
    let horizon: [number, number] = [0, 0];

    decl *= RAD;
    latitude *= RAD;
    hourAngle *= RAD;

    z0 = Math.cos(decl) * Math.sin(latitude) * Math.cos(hourAngle) - Math.sin(decl) * Math.cos(latitude);
    z1 = Math.cos(decl) * Math.sin(hourAngle);
    z2 = Math.sin(latitude) * Math.sin(decl) + Math.cos(decl) * Math.cos(latitude) * Math.cos(hourAngle);
    azimuth = Math.atan(z1 / z0) * DEG;

    if (z0 > 0 && azimuth < 0) {
      azimuth += 360;
    }

    if (z0 < 0) {
      azimuth += 180;
    }

    altitude = Math.asin(z2) * DEG;
    // 大気差補正
    altitude += 0.0167 / Math.tan((altitude + 8.6 / (altitude + 4.4)) * RAD);

    horizon = [azimuth, altitude];
    return horizon;
  }

  /** 地平座標から投影位置を求める（ドームマスター距離射影） */
  static Horizon2Dome(azimuth: number, altitude: number, r: number) {
    let x: number, y: number;
    let display: [number, number] = [0, 0];

    azimuth *= RAD;
    x = r / 90 * (90 - altitude) * Math.sin(azimuth);
    y = r / 90 * (90 - altitude) * Math.cos(azimuth);

    display = [x, y];
    return display;
  }

  /** 地平座標から投影位置を求める（ステレオ半球射影） */
  static Horizon2Stereo(azimuth: number, altitude: number, r: number) {
    let cosQ: number, q: number, sinV: number, v: number, l: number;
    let x: number, y: number;
    let display: [number, number] = [0, 0];

    cosQ = Math.cos(altitude * RAD) * Math.cos(azimuth * RAD);
    q = Math.acos(cosQ);
    sinV = Math.sin(azimuth * RAD) * Math.cos(altitude * RAD) / Math.sin(q);
    v = Math.asin(sinV);
    l = r * q * 0.64;
    x = r + l * Math.sin(v);
    y = r - l * Math.cos(v);

    display = [x, y];
    return display;
  }

  /** 平面極座標から直交座標に変換する（Canvas/SVG座標系） */
  static canvasAxis(r: number, theta: number) {
    let x: number, y: number;
    let canvasAxis: [number, number] = [0, 0];

    x = r * Math.cos(theta * RAD);
    y = -r * Math.sin(theta * RAD);

    canvasAxis = [x, y];
    return canvasAxis;
  }

  /** 球面極座標から直交座標に変換する（Three.js座標系） */
  static threeAxis(r: number, theta: number, phi: number) {
    let x: number, y: number, z: number;
    let threeAxis: [number, number, number] = [0, 0, 0];

    x = r * Math.cos(phi * RAD) * Math.sin(theta * RAD);
    y = r * Math.sin(phi * RAD);
    z = -r * Math.cos(phi * RAD) * Math.cos(theta * RAD);

    threeAxis = [x, y, z];
    return threeAxis;
  }

}
const defaultText = '';
export default defaultText;
</script>