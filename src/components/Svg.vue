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
  constructor(initDt: Date, width: number, height: number, left: number, top: number) {
    this.nameDt = new Date(initDt);
    this.width = width;
    this.height = height;
    this.left = left;
    this.top = top;
    this.string = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${this.width}" height="${this.height}">\n`;
  }

  groupId(id: string) {
    this.string += `<g id="${id}">\n`;
  }

  groupFooter() {
    this.string += `</g>\n`;
  }

  line(r1: number, theta1: number, r2: number, theta2: number, lineWidth: number, sColor: string) {
    let axis = [];
    let x1, y1, x2, y2;

    axis = CoordClass.canvasAxis(r1, theta1);
    x1 = axis[0], y1 = axis[1];
    axis = CoordClass.canvasAxis(r2, theta2);
    x2 = axis[0], y2 = axis[1];
    this.string += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${sColor}" stroke-width="${lineWidth}" transform="translate(${this.left},${this.top})"/>\n`;
  }

  arc(r1: number, theta1: number, r2: number, theta2: number, R: number, lineWidth: number, sColor: string, fColor: string) {
    let axis = [];
    let x1, y1, x2, y2;

    axis = CoordClass.canvasAxis(r1, theta1);
    x1 = axis[0], y1 = axis[1];
    axis = CoordClass.canvasAxis(r2, theta2);
    x2 = axis[0], y2 = axis[1];
    this.string += `<path stroke="${sColor}" stroke-width="${lineWidth}" fill="${fColor}" transform="translate(${this.left},${this.top})"\n`;
    this.string += `d="M ${x1} ${y1} `;
    this.string += `A ${R} ${R} 0 0 0 ${x2} ${y2}`;
    this.string += `"/>\n`;
  }

  circle(r: number, theta: number, size: number, lineWidth: number, sColor: string, fColor: string) {
    let axis = [];
    let x, y;

    axis = CoordClass.canvasAxis(r, theta);
    x = axis[0], y = axis[1];
    this.string += `<circle cx="${x}" cy="${y}" r="${size}" stroke="${sColor}" stroke-width="${lineWidth}" fill="${fColor}" transform="translate(${this.left},${this.top})"/>\n`;
  }

  area(r1: number, theta1: number, r2: number, theta2: number, R: number, lineWidth: number, sColor: string, fColor: string) {
    let axis = [];
    let x1, y1, x1R, y1R;
    let x2, y2, x2R, y2R;

    axis = CoordClass.canvasAxis(r1, theta1);
    x1 = axis[0], y1 = axis[1];
    axis = CoordClass.canvasAxis(R, theta1);
    x1R = axis[0], y1R = axis[1];
    axis = CoordClass.canvasAxis(r2, theta2);
    x2 = axis[0], y2 = axis[1];
    axis = CoordClass.canvasAxis(R, theta2);
    x2R = axis[0], y2R = axis[1];
    this.string += `<path stroke="${sColor}" stroke-width="${lineWidth}" fill="${fColor}" transform="translate(${this.left},${this.top})"\n`;
    this.string += `d="M ${x1} ${y1} `;
    this.string += `L ${x1R} ${y1R} `;
    this.string += `A ${R} ${R} 0 0 0 ${x2R} ${y2R} `;
    this.string += `L ${x2} ${y2} `;
    this.string += `Z"/>\n`;
  }

  text(style: string, r: number, theta: number, rotate: number, text: string) {
    let axis = [];
    let x, y;

    axis = CoordClass.canvasAxis(r, theta);
    x = axis[0], y = axis[1];
    this.string += `<text class="${style}" transform="translate(${this.left + x},${this.top + y}) rotate(${rotate})">${text}</text>\n`;
  }

  tag(string: string) {
    this.string += `${string}\n`;
  }

  end() {
    this.string += `</svg>\n`;
  }

  download() {
    let blob, link;
    let stamp;

    stamp = new Date();
    blob = new Blob([this.string], { type: 'text/plan' });
    link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `shikigami-${this.nameDt.toLocaleDateString()}.svg`;
    link.click();
  }
}

const defaultText = '';
export default defaultText;
</script>
