<script lang="ts">
/**
 * オブザーバーの情報を保持するインターフェース
 */
export interface ObserverType {
  /** 現在時刻 */
  nowDt: Date;
  /** 名前 */
  name: string;
  /** 経度 */
  longitude: number;
  /** 緯度 */
  latitude: number;
  /** タイムゾーン */
  timezone: number;
  /** 日付の0時0分の時刻 */
  initDt: Date;
}

/**
 * オブザーバーの情報を保持するクラス
 */
export class Observer implements ObserverType {
  /**
   * 現在時刻
   */
  nowDt: Date;
  /**
   * 名前
   */
  name: string;
  /**
   * 経度
   */
  longitude: number;
  /**
   * 緯度
   */
  latitude: number;
  /**
   * タイムゾーン
   */
  timezone: number;
  /**
   * 日付の0時0分の時刻
   */
  initDt: Date;

  /**
   * Observerクラスのコンストラクタ
   * @param dt 現在時刻
   * @param name 名前
   * @param longitude 経度
   * @param latitude 緯度
   * @param timezone タイムゾーン
   */
  constructor(dt: Date, name: string, longitude: number, latitude: number, timezone: number) {
    this.nowDt = new Date(dt);
    this.name = name;
    this.longitude = longitude;
    this.latitude = latitude;
    this.timezone = timezone;
    this.initDt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 0, 0);
  }
}

export default {};

</script>
