<script  lang="ts">
// 定数
const RAD = Math.PI / 180;
const DEG = 1 / RAD;

export class CoordClass {

  /**
   * 日心黄道座標から地心黄道座標（視位置）に変換する
   * @param helioLong 日心黄経
   * @param helioLat 日心黄緯
   * @param helioDist 日地間距離
   * @param geoLong 地心の視黄経
   * @param geoLat 地心の視黄緯
   * @returns [地心黄経, 地心黄緯]
   */
  static HelioEC2GeoEC(helioLong: number, helioLat: number, helioDist: number, geoLong: number, geoLat: number): [number, number] {
    const radHelioLong = helioLong * RAD;
    const radHelioLat = helioLat * RAD;
    const radGeoLong = (geoLong + 0.0057) * RAD;

    const ac = helioDist * Math.cos(radHelioLat) * Math.cos(radHelioLong) + geoLat * Math.cos(radGeoLong);
    const bc = helioDist * Math.cos(radHelioLat) * Math.sin(radHelioLong) + geoLat * Math.sin(radGeoLong);
    const cc = helioDist * Math.sin(radHelioLat);
    const rc = Math.sqrt(ac * ac + bc * bc + cc * cc);

    const geoLatRad = Math.asin(cc / rc);
    let geoLongRad = Math.atan2(bc, ac);

    geoLongRad = geoLongRad < 0 ? geoLongRad + 2 * Math.PI : geoLongRad;

    return [geoLongRad * DEG, geoLatRad * DEG];
  }

  /**
   * 地心黄道座標から赤道座標に変換する
   * @param lon 地心黄経
   * @param lat 地心黄緯
   * @param eps 平均黄道傾斜角
   * @returns [赤経, 赤緯]
   */
  static EC2EQ(lon: number, lat: number, eps: number): [number, number] {
    const radLon = lon * RAD;
    const radLat = lat * RAD;
    const radEps = eps * RAD;

    const decl = Math.asin(Math.sin(radLat) * Math.cos(radEps) + Math.cos(radLat) * Math.sin(radEps) * Math.sin(radLon));
    const c = Math.cos(radLat) * Math.cos(radLon);
    const s = Math.cos(radLat) * Math.sin(radLon) * Math.cos(radEps) - Math.sin(radLat) * Math.sin(radEps);
    let ra = Math.atan2(s, c);

    ra = ra < 0 ? ra + 2 * Math.PI : ra;

    return [ra * DEG, decl * DEG];
  }

  /**
   * 赤道座標から地平座標に変換する
   * @param decl 赤緯（degree）
   * @param latitude 緯度（degree）
   * @param hourAngle 時角（degree）
   * @returns [方位角, 高度]
   */
  static EQ2Horizon(decl: number, latitude: number, hourAngle: number): [number, number] {
    const declRad = decl * RAD;
    const latitudeRad = latitude * RAD;
    const hourAngleRad = hourAngle * RAD;

    const z0 = Math.cos(declRad) * Math.sin(latitudeRad) * Math.cos(hourAngleRad) - Math.sin(declRad) * Math.cos(latitudeRad);
    const z1 = Math.cos(declRad) * Math.sin(hourAngleRad);
    const z2 = Math.sin(latitudeRad) * Math.sin(declRad) + Math.cos(declRad) * Math.cos(latitudeRad) * Math.cos(hourAngleRad);

    let azimuth = Math.atan2(z1, z0) * DEG;
    azimuth = azimuth < 0 ? azimuth + 360 : azimuth;
    azimuth = z0 < 0 ? azimuth + 180 : azimuth;

    let altitude = Math.asin(z2) * DEG;
    altitude += 0.0167 / Math.tan((altitude + 8.6 / (altitude + 4.4)) * RAD);

    return [azimuth, altitude];
  }
  /**
   * 地平座標から投影位置を求める（ドームマスター距離射影）
   * @param azimuth 方位角（度数法）
   * @param altitude 高度（度数法）
   * @param r 投影半径
   * @returns 投影位置 [x, y]
   */
  static Horizon2Dome(azimuth: number, altitude: number, r: number): [number, number] {
    const radAzimuth = azimuth * RAD;
    const radAltitude = altitude * RAD;

    const x = r / 90 * (90 - altitude) * Math.sin(radAzimuth);
    const y = r / 90 * (90 - altitude) * Math.cos(radAzimuth);

    return [x, y];
  }

  /**
   * 地平座標から投影位置を求める（ステレオ半球射影）
   * @param azimuth 方位角
   * @param altitude 高度
   * @param r 半径
   * @returns 投影位置 [x, y]
   */
  static Horizon2Stereo(azimuth: number, altitude: number, r: number): [number, number] {
    const radAlt = altitude * RAD;
    const radAz = azimuth * RAD;

    const cosQ = Math.cos(radAlt) * Math.cos(radAz);
    const q = Math.acos(cosQ);
    const sinV = Math.sin(radAz) * Math.cos(radAlt) / Math.sin(q);
    const v = Math.asin(sinV);
    const l = r * q * 0.64;

    const x = r + l * Math.sin(v);
    const y = r - l * Math.cos(v);

    return [x, y];
  }


  /**
   * 平面極座標から直交座標に変換する（Canvas/SVG座標系）
   * @param r 半径
   * @param theta 角度
   * @returns [x座標, y座標]
   */
  static canvasAxis(r: number, theta: number): [number, number] {
    const x = r * Math.cos(theta * RAD);
    const y = -r * Math.sin(theta * RAD);

    return [x, y];
  }


  /**
   * 球面極座標から直交座標に変換する（Three.js座標系）
   * @param r 半径
   * @param theta 水平角
   * @param phi 仰角
   * @returns 直交座標 [x, y, z]
   */
  static threeAxis(r: number, theta: number, phi: number): [number, number, number] {
    const radTheta = theta * RAD;
    const radPhi = phi * RAD;
    const x = r * Math.sin(radPhi) * Math.cos(radTheta);
    const y = r * Math.cos(radPhi);
    const z = -r * Math.sin(radPhi) * Math.sin(radTheta);
    return [x, y, z];
  }


}
let defaultObject = {};
export default defaultObject;
</script>