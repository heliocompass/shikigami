<script  lang="ts">
import { CoordClass } from './Coord.vue'
export type svgType = {
  nameDt: Date,
  width: number,
  height: number,
  left: number,
  top: number,
  string: string,

  download: () => void
  groupId: (id: string) => void
  groupFooter: () => void
  line: (r1: number, theta1: number, r2: number, theta2: number, lineWidth: number, sColor: string) => void
  arc: (r1: number, theta1: number, r2: number, theta2: number, R: number, lineWidth: number, sColor: string, fColor: string) => void
  circle: (r: number, theta: number, size: number, lineWidth: number, sColor: string, fColor: string) => void
  area: (r1: number, theta1: number, r2: number, theta2: number, R: number, lineWidth: number, sColor: string, fColor: string) => void
  text: (style: string, r: number, theta: number, rotate: number, text: string) => void
  tag: (string: string) => void
  end: () => void,
}

export class SvgClass {
  nameDt: Date;
  width: number;
  height: number;
  left: number;
  top: number;
  string: string;
  /**
   * SVGGeneratorコンストラクター
   * @param initDt SVG画像の名前に使われる日付
   * @param width SVG画像の幅
   * @param height SVG画像の高さ
   * @param left SVG画像の左側余白
   * @param top SVG画像の上側余白
   * @param areaWidth SVG画像が埋め込まれる領域の幅
   */
  constructor(initDt: Date, width: number, height: number, left: number, top: number, areaWidth: number) {
    this.nameDt = new Date(initDt);
    this.width = width;
    this.height = height;
    this.left = left;
    this.top = top;
    this.string = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${areaWidth}" viewBox="0 0 ${this.width} ${this.height}">\n`;
  }
  groupId(id: string) {
    this.string += `<g id="${id}">\n`;
  }

  groupFooter() {
    this.string += `</g>\n`;
  }

  /**
   * 線を描画する
   * @param r1 - 始点の半径座標
   * @param theta1 - 始点の角度座標 [deg]
   * @param r2 - 終点の半径座標
   * @param theta2 - 終点の角度座標 [deg]
   * @param lineWidth - 線の太さ
   * @param sColor - 線の色
   */
  line(r1: number, theta1: number, r2: number, theta2: number, lineWidth: number, sColor: string) {
    const [x1, y1] = CoordClass.canvasAxis(r1, theta1);
    const [x2, y2] = CoordClass.canvasAxis(r2, theta2);
    this.string += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${sColor}" stroke-width="${lineWidth}" transform="translate(${this.left},${this.top})"/>\n`;
  }

  /**
   * 円弧を描画する
   * @param r1 - 内側の半径
   * @param theta1 - 内側の角度 [deg]
   * @param r2 - 外側の半径
   * @param theta2 - 外側の角度 [deg]
   * @param R - 中心からの半径
   * @param lineWidth - 線の幅
   * @param sColor - 線の色
   * @param fColor - 塗りつぶしの色
   */
  arc(r1: number, theta1: number, r2: number, theta2: number, R: number, lineWidth: number, sColor: string, fColor: string) {
    const [x1, y1] = CoordClass.canvasAxis(r1, theta1);
    const [x2, y2] = CoordClass.canvasAxis(r2, theta2);

    this.string += `<path stroke="${sColor}" stroke-width="${lineWidth}" fill="${fColor}" transform="translate(${this.left},${this.top})"\n`;
    this.string += `d="M ${x1} ${y1} `;
    this.string += `A ${R} ${R} 0 0 0 ${x2} ${y2}`;
    this.string += `"/>\n`;
  }

  /**
   * 中心が (r, theta) の円を描画する
   * @param r - 中心の半径
   * @param theta - 中心の極角
   * @param size - 円の半径
   * @param lineWidth - 線の太さ
   * @param sColor - 線の色
   * @param fColor - 塗りつぶしの色
   */
  circle(r: number, theta: number, size: number, lineWidth: number, sColor: string, fColor: string) {
    const axis = CoordClass.canvasAxis(r, theta);
    const x = axis[0];
    const y = axis[1];
    this.string += `<circle cx="${x}" cy="${y}" r="${size}" stroke="${sColor}" stroke-width="${lineWidth}" fill="${fColor}" transform="translate(${this.left},${this.top})"/>\n`;
  }


  /**
   * 楕円形領域の描画
   * @param r1 楕円の縦軸方向半径
   * @param theta1 開始角度
   * @param r2 楕円の横軸方向半径
   * @param theta2 終了角度
   * @param R 楕円の中心からの距離
   * @param lineWidth 線の太さ
   * @param sColor 線の色
   * @param fColor 塗りつぶしの色
   */
  area = (r1: number, theta1: number, r2: number, theta2: number, R: number, lineWidth: number, sColor: string, fColor: string): void => {
    const [x1, y1] = CoordClass.canvasAxis(r1, theta1);
    const [x1R, y1R] = CoordClass.canvasAxis(R, theta1);
    const [x2, y2] = CoordClass.canvasAxis(r2, theta2);
    const [x2R, y2R] = CoordClass.canvasAxis(R, theta2);

    const d = `M ${x1} ${y1} L ${x1R} ${y1R} A ${R} ${R} 0 0 0 ${x2R} ${y2R} L ${x2} ${y2} Z`;

    this.string += `<path stroke="${sColor}" stroke-width="${lineWidth}" fill="${fColor}" transform="translate(${this.left},${this.top})" d="${d}"/>\n`;
  }


  /**
   * テキストを描画する
   * @param style CSSのスタイルクラス名
   * @param r 半径 [px]
   * @param theta 角度 [deg]
   * @param rotate 回転角度 [deg]
   * @param text 描画するテキスト
   */
  text(style: string, r: number, theta: number, rotate: number, text: string) {
    const [x, y] = CoordClass.canvasAxis(r, theta);
    const translateX = this.left + x;
    const translateY = this.top + y;
    this.string += `<text class="${style}" transform="translate(${translateX},${translateY}) rotate(${rotate})">${text}</text>\n`;
  }


  /**
   * SVGタグを追加
   * @param string 追加するSVGタグ文字列
   */
  tag(string: string): void {
    this.string += `${string}\n`;
  }
  end() {
    this.string += `</svg>\n`;
  }

  download() {
    const blob = new Blob([this.string], { type: 'text/plan' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `shikigami-${this.nameDt.toLocaleDateString()}.svg`;
    link.click();
  }

}

let defaultObject = {};
export default defaultObject;
</script>
