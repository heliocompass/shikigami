<script lang="ts" >
const RAD = Math.PI / 180;

/**
 * 恒星（太陽）
 */
export type Star = {
  y: number
  b: number
  r: number
}
/**
 * 惑星
 */
export type Planet = {
  y: number
  b: number
  r: number
}

/**
 * 衛星
 */
export type Satellite = {
  y: number
  b: number
  r: number
  p: number
  age: number
}

export const planets = () => {

  /** 太陽 */
  class Sun implements Star { // extends Planet
    y: number;
    b: number;
    r: number;

    /**
     * 太陽
     * @param T ユリウス世紀
     */
    constructor(T: number) {
      this.y = 280.4659 + 36000.7695 * T;
      this.y += 1.9147 * Math.cos((35999.050 * T + 267.520) * RAD);
      this.y -= 0.0048 * T * Math.cos((35999.050 * T + 267.520) * RAD);
      this.y += 0.0200 * Math.cos((71998.1 * T + 265.1) * RAD);
      this.y += 0.0020 * Math.cos((32964 * T + 158) * RAD);
      this.y += 0.0018 * Math.cos((19 * T + 159) * RAD);
      this.y += 0.0018 * Math.cos((445267 * T + 208) * RAD);
      this.y += 0.0015 * Math.cos((45038 * T + 254) * RAD);
      this.y += 0.0013 * Math.cos((22519 * T + 352) * RAD);
      this.y += 0.0007 * Math.cos((65929 * T + 45) * RAD);
      this.y += 0.0007 * Math.cos((3035 * T + 110) * RAD);
      this.y += 0.0007 * Math.cos((9038 * T + 64) * RAD);
      this.y += 0.0006 * Math.cos((33718 * T + 316) * RAD);
      this.y += 0.0005 * Math.cos((155 * T + 118) * RAD);
      this.y += 0.0005 * Math.cos((2281 * T + 221) * RAD);
      this.y += 0.0004 * Math.cos((29930 * T + 48) * RAD);
      this.y += 0.0004 * Math.cos((31557 * T + 161) * RAD);
      this.y %= 360.0;

      if (this.y < 0) {
        this.y += 360.0;
      }

      this.b = 0.0;

      this.r = 1.000140 * Math.cos((0 * T + 0) * RAD);
      this.r += 0.016706 * Math.cos((35999.05 * T + 177.53) * RAD);
      this.r -= 0.000042 * T * Math.cos((35999.05 * T + 177.53) * RAD);
      this.r += 0.000139 * Math.cos((71998 * T + 175) * RAD);
      this.r += 0.000031 * Math.cos((445267 * T + 298) * RAD);
      this.r += 0.000016 * Math.cos((32964 * T + 68) * RAD);
      this.r += 0.000016 * Math.cos((45038 * T + 164) * RAD);
      this.r += 0.000005 * Math.cos((22519 * T + 233) * RAD);
      this.r += 0.000005 * Math.cos((33718 * T + 226) * RAD);
    }
  }

  class Earth extends Sun implements Planet { // extends Planet and Sun

    /**
     * 地球
     * @param T ユリウス世紀
     */
    constructor(T: number) {
      super(T);
      this.y += 180;
      if (this.y >= 360.0) this.y -= 360.0;
    }
  }

  class Moon implements Satellite { // extends Planet
    y: number;
    b: number;
    r: number;
    p: number;
    age: number;
    /**
     * 月
     * @param T ユリウス世紀
     */
    constructor(T: number) {
      this.y = 218.3162 + 481267.8809 * T;
      this.y += 6.2888 * Math.cos((477198.868 * T + 44.963) * RAD);
      this.y += 1.2740 * Math.cos((413335.35 * T + 10.74) * RAD);
      this.y += 0.6583 * Math.cos((890534.22 * T + 145.70) * RAD);
      this.y += 0.2136 * Math.cos((954397.74 * T + 179.93) * RAD);
      this.y += 0.1851 * Math.cos((35999.05 * T + 87.53) * RAD);
      this.y += 0.1144 * Math.cos((966404.0 * T + 276.5) * RAD);
      this.y += 0.0588 * Math.cos((63863.5 * T + 124.2) * RAD);
      this.y += 0.0571 * Math.cos((377336.3 * T + 13.2) * RAD);
      this.y += 0.0533 * Math.cos((1367733.1 * T + 280.7) * RAD);
      this.y += 0.0458 * Math.cos((854535.2 * T + 148.2) * RAD);
      this.y += 0.0409 * Math.cos((441199.8 * T + 47.4) * RAD);
      this.y += 0.0347 * Math.cos((445267.1 * T + 27.9) * RAD);
      this.y += 0.0304 * Math.cos((513197.9 * T + 222.5) * RAD);
      this.y += 0.0154 * Math.cos((75870 * T + 41) * RAD);
      this.y += 0.0125 * Math.cos((1443603 * T + 52) * RAD);
      this.y += 0.0110 * Math.cos((489205 * T + 142) * RAD);
      this.y += 0.0107 * Math.cos((1303870 * T + 246) * RAD);
      this.y += 0.0100 * Math.cos((1431597 * T + 315) * RAD);
      this.y += 0.0085 * Math.cos((826671 * T + 111) * RAD);
      this.y += 0.0079 * Math.cos((449334 * T + 188) * RAD);
      this.y += 0.0068 * Math.cos((926533 * T + 323) * RAD);
      this.y += 0.0052 * Math.cos((31932 * T + 107) * RAD);
      this.y += 0.0050 * Math.cos((481266 * T + 205) * RAD);
      this.y += 0.0040 * Math.cos((1331734 * T + 283) * RAD);
      this.y += 0.0040 * Math.cos((1844932 * T + 56) * RAD);
      this.y += 0.0040 * Math.cos((133 * T + 29) * RAD);
      this.y += 0.0038 * Math.cos((1781068 * T + 21) * RAD);
      this.y += 0.0037 * Math.cos((541062 * T + 259) * RAD);
      this.y += 0.0028 * Math.cos((1934 * T + 145) * RAD);
      this.y += 0.0027 * Math.cos((918399 * T + 182) * RAD);
      this.y += 0.0026 * Math.cos((1379739 * T + 17) * RAD);
      this.y += 0.0024 * Math.cos((99863 * T + 122) * RAD);
      this.y += 0.0023 * Math.cos((922466 * T + 163) * RAD);
      this.y += 0.0022 * Math.cos((818536 * T + 151) * RAD);
      this.y += 0.0021 * Math.cos((990397 * T + 357) * RAD);
      this.y += 0.0021 * Math.cos((71998 * T + 85) * RAD);
      this.y += 0.0021 * Math.cos((341337 * T + 16) * RAD);
      this.y += 0.0018 * Math.cos((401329 * T + 274) * RAD);
      this.y += 0.0016 * Math.cos((1856938 * T + 152) * RAD);
      this.y += 0.0012 * Math.cos((1267871 * T + 249) * RAD);
      this.y += 0.0011 * Math.cos((1920802 * T + 186) * RAD);
      this.y += 0.0009 * Math.cos((858602 * T + 129) * RAD);
      this.y += 0.0008 * Math.cos((1403732 * T + 98) * RAD);
      this.y += 0.0007 * Math.cos((790672 * T + 114) * RAD);
      this.y += 0.0007 * Math.cos((405201 * T + 50) * RAD);
      this.y += 0.0007 * Math.cos((485333 * T + 186) * RAD);
      this.y += 0.0007 * Math.cos((27864 * T + 127) * RAD);
      this.y += 0.0006 * Math.cos((111869 * T + 38) * RAD);
      this.y += 0.0006 * Math.cos((2258267 * T + 156) * RAD);
      this.y += 0.0005 * Math.cos((1908795 * T + 90) * RAD);
      this.y += 0.0005 * Math.cos((1745069 * T + 24) * RAD);
      this.y += 0.0005 * Math.cos((509131 * T + 242) * RAD);
      this.y += 0.0004 * Math.cos((39871 * T + 223) * RAD);
      this.y += 0.0004 * Math.cos((12006 * T + 187) * RAD);
      this.y += 0.0003 * Math.cos((958465 * T + 340) * RAD);
      this.y += 0.0003 * Math.cos((381404 * T + 354) * RAD);
      this.y += 0.0003 * Math.cos((349472 * T + 337) * RAD);
      this.y += 0.0003 * Math.cos((1808933 * T + 58) * RAD);
      this.y += 0.0003 * Math.cos((549197 * T + 220) * RAD);
      this.y += 0.0003 * Math.cos((4067 * T + 70) * RAD);
      this.y += 0.0003 * Math.cos((2322131 * T + 191) * RAD);
      this.y %= 360.0;

      if (this.y < 0) {
        this.y += 360.0;
      }

      this.b = 5.1281 * Math.cos((483202.019 * T + 3.273) * RAD);
      this.b += 0.2806 * Math.cos((960400.89 * T + 138.24) * RAD);
      this.b += 0.2777 * Math.cos((6003.15 * T + 48.31) * RAD);
      this.b += 0.1733 * Math.cos((407332.20 * T + 52.43) * RAD);
      this.b += 0.0554 * Math.cos((896537.4 * T + 104.0) * RAD);
      this.b += 0.0463 * Math.cos((69866.7 * T + 82.5) * RAD);
      this.b += 0.0326 * Math.cos((1373736.2 * T + 239.0) * RAD);
      this.b += 0.0172 * Math.cos((1437599.8 * T + 273.2) * RAD);
      this.b += 0.0093 * Math.cos((884531 * T + 187) * RAD);
      this.b += 0.0088 * Math.cos((471196 * T + 87) * RAD);
      this.b += 0.0082 * Math.cos((371333 * T + 55) * RAD);
      this.b += 0.0043 * Math.cos((547066 * T + 217) * RAD);
      this.b += 0.0042 * Math.cos((1850935 * T + 14) * RAD);
      this.b += 0.0034 * Math.cos((443331 * T + 230) * RAD);
      this.b += 0.0025 * Math.cos((860538 * T + 106) * RAD);
      this.b += 0.0022 * Math.cos((481268 * T + 308) * RAD);
      this.b += 0.0022 * Math.cos((1337737 * T + 241) * RAD);
      this.b += 0.0021 * Math.cos((105866 * T + 80) * RAD);
      this.b += 0.0019 * Math.cos((924402 * T + 141) * RAD);
      this.b += 0.0018 * Math.cos((820668 * T + 153) * RAD);
      this.b += 0.0018 * Math.cos((519201 * T + 181) * RAD);
      this.b += 0.0018 * Math.cos((1449606 * T + 10) * RAD);
      this.b += 0.0015 * Math.cos((42002 * T + 46) * RAD);
      this.b += 0.0015 * Math.cos((928469 * T + 121) * RAD);
      this.b += 0.0015 * Math.cos((996400 * T + 316) * RAD);
      this.b += 0.0014 * Math.cos((29996 * T + 129) * RAD);
      this.b += 0.0013 * Math.cos((447203 * T + 6) * RAD);
      this.b += 0.0013 * Math.cos((37935 * T + 65) * RAD);
      this.b += 0.0011 * Math.cos((1914799 * T + 48) * RAD);
      this.b += 0.0010 * Math.cos((1297866 * T + 288) * RAD);
      this.b += 0.0009 * Math.cos((1787072 * T + 340) * RAD);
      this.b += 0.0008 * Math.cos((972407 * T + 235) * RAD);
      this.b += 0.0007 * Math.cos((1309873 * T + 205) * RAD);
      this.b += 0.0006 * Math.cos((559072 * T + 134) * RAD);
      this.b += 0.0006 * Math.cos((1361730 * T + 322) * RAD);
      this.b += 0.0005 * Math.cos((848532 * T + 190) * RAD);
      this.b += 0.0005 * Math.cos((419339 * T + 149) * RAD);
      this.b += 0.0005 * Math.cos((948395 * T + 222) * RAD);
      this.b += 0.0004 * Math.cos((2328134 * T + 149) * RAD);
      this.b += 0.0004 * Math.cos((1024264 * T + 352) * RAD);
      this.b += 0.0003 * Math.cos((932536 * T + 282) * RAD);
      this.b += 0.0003 * Math.cos((1409735 * T + 57) * RAD);
      this.b += 0.0003 * Math.cos((2264270 * T + 115) * RAD);
      this.b += 0.0003 * Math.cos((1814936 * T + 16) * RAD);
      this.b += 0.0003 * Math.cos((335334 * T + 57) * RAD);

      this.p = 0.950725 * Math.cos((0 * T + 0) * RAD);
      this.p += 0.051820 * Math.cos((477198.868 * T + 134.963) * RAD);
      this.p += 0.009530 * Math.cos((413335.35 * T + 100.74) * RAD);
      this.p += 0.007842 * Math.cos((890534.22 * T + 235.70) * RAD);
      this.p += 0.002824 * Math.cos((954397.74 * T + 269.93) * RAD);
      this.p += 0.000858 * Math.cos((1367733.1 * T + 10.7) * RAD);
      this.p += 0.000531 * Math.cos((854535.2 * T + 238.2) * RAD);
      this.p += 0.000400 * Math.cos((377336.3 * T + 103.2) * RAD);
      this.p += 0.000319 * Math.cos((441199.8 * T + 137.4) * RAD);
      this.p += 0.000271 * Math.cos((445267 * T + 118) * RAD);
      this.p += 0.000263 * Math.cos((513198 * T + 312) * RAD);
      this.p += 0.000197 * Math.cos((489205 * T + 232) * RAD);
      this.p += 0.000173 * Math.cos((1431597 * T + 45) * RAD);
      this.p += 0.000167 * Math.cos((1303870 * T + 336) * RAD);
      this.p += 0.000111 * Math.cos((35999 * T + 178) * RAD);
      this.p += 0.000103 * Math.cos((826671 * T + 201) * RAD);
      this.p += 0.000084 * Math.cos((63864 * T + 214) * RAD);
      this.p += 0.000083 * Math.cos((926533 * T + 53) * RAD);
      this.p += 0.000078 * Math.cos((1844932 * T + 146) * RAD);
      this.p += 0.000073 * Math.cos((1781068 * T + 111) * RAD);
      this.p += 0.000064 * Math.cos((1331734 * T + 13) * RAD);
      this.p += 0.000063 * Math.cos((449334 * T + 278) * RAD);
      this.p += 0.000041 * Math.cos((481266 * T + 295) * RAD);
      this.p += 0.000034 * Math.cos((918399 * T + 272) * RAD);
      this.p += 0.000033 * Math.cos((541062 * T + 349) * RAD);
      this.p += 0.000031 * Math.cos((922466 * T + 253) * RAD);
      this.p += 0.000030 * Math.cos((75870 * T + 131) * RAD);
      this.p += 0.000029 * Math.cos((990397 * T + 87) * RAD);
      this.p += 0.000026 * Math.cos((818536 * T + 241) * RAD);
      this.p += 0.000023 * Math.cos((553069 * T + 266) * RAD);
      this.p += 0.000019 * Math.cos((1267871 * T + 339) * RAD);
      this.p += 0.000013 * Math.cos((1403732 * T + 188) * RAD);
      this.p += 0.000013 * Math.cos((341337 * T + 106) * RAD);
      this.p += 0.000013 * Math.cos((401329 * T + 4) * RAD);
      this.p += 0.000012 * Math.cos((2258267 * T + 246) * RAD);
      this.p += 0.000011 * Math.cos((1908795 * T + 180) * RAD);
      this.p += 0.000011 * Math.cos((858602 * T + 219) * RAD);
      this.p += 0.000010 * Math.cos((1745069 * T + 114) * RAD);
      this.p += 0.000009 * Math.cos((790672 * T + 204) * RAD);
      this.p += 0.000007 * Math.cos((2322131 * T + 281) * RAD);
      this.p += 0.000007 * Math.cos((1808933 * T + 148) * RAD);
      this.p += 0.000006 * Math.cos((485333 * T + 276) * RAD);
      this.p += 0.000006 * Math.cos((99863 * T + 212) * RAD);
      this.p += 0.000005 * Math.cos((405201 * T + 140) * RAD);

      this.r = 6378.137 / Math.sin(this.p * RAD);
      //this.r /= 149597870.7;

      let sun = new Sun(T);
      this.age = this.y - sun.y;
      if (this.age < 0) this.age += 360;
      this.age /= 12.1908;
    }
  }

  class Mercury implements Planet { // extends Planet
    y: number;
    b: number;
    r: number;
    constructor(T: number) {
      this.y = 252.2502 + 149474.0714 * T;
      this.y += 23.4405 * Math.cos((149472.5153 * T + 84.7947) * RAD);
      this.y += 0.0023 * T * Math.cos((149472.5153 * T + 84.7947) * RAD);
      this.y += 2.9818 * Math.cos((298945.031 * T + 259.589) * RAD);
      this.y += 0.0006 * T * Math.cos((298945.031 * T + 259.589) * RAD);
      this.y += 0.5258 * Math.cos((448417.55 * T + 74.38) * RAD);
      this.y += 0.1796 * Math.cos((298945.77 * T + 137.84) * RAD);
      this.y += 0.1061 * Math.cos((597890.1 * T + 249.2) * RAD);
      this.y += 0.0850 * Math.cos((149473.3 * T + 143.0) * RAD);
      this.y += 0.0760 * Math.cos((448418.3 * T + 312.6) * RAD);
      this.y += 0.0256 * Math.cos((597890.8 * T + 127.4) * RAD);
      this.y += 0.0230 * Math.cos((747362.6 * T + 64.0) * RAD);
      this.y += 0.0081 * Math.cos((747363 * T + 302) * RAD);
      this.y += 0.0069 * Math.cos((1 * T + 148) * RAD);
      this.y += 0.0052 * Math.cos((896835 * T + 239) * RAD);
      this.y += 0.0023 * Math.cos((896836 * T + 117) * RAD);
      this.y += 0.0019 * Math.cos((6356 * T + 85) * RAD);
      this.y += 0.0011 * Math.cos((1046308 * T + 54) * RAD);
      this.y += 0.0010 * Math.cos((32437 * T + 234) * RAD);
      this.y += 0.0009 * Math.cos((143403 * T + 171) * RAD);
      this.y += 0.0006 * Math.cos((155828 * T + 268) * RAD);
      this.y += 0.0005 * Math.cos((1046308 * T + 292) * RAD);
      this.y += 0.0004 * Math.cos((143117 * T + 84) * RAD);
      this.y += 0.0003 * Math.cos((181909 * T + 63) * RAD);
      this.y += 0.0003 * Math.cos((123392 * T + 288) * RAD);
      this.y += 0.0003 * Math.cos((448419 * T + 11) * RAD);
      this.y %= 360.0;

      if (this.y < 0) {
        this.y += 360.0;
      }

      this.b = 6.7057 * Math.cos((149472.886 * T + 113.919) * RAD);
      this.b += 0.0017 * T * Math.cos((149472.886 * T + 113.919) * RAD);
      this.b += 1.4396 * Math.cos((0.37 * T + 119.12) * RAD);
      this.b += 0.0005 * T * Math.cos((0.37 * T + 119.12) * RAD);
      this.b += 1.3643 * Math.cos((298945.40 * T + 288.71) * RAD);
      this.b += 0.0005 * T * Math.cos((298945.40 * T + 288.71) * RAD);
      this.b += 0.3123 * Math.cos((448417.92 * T + 103.51) * RAD);
      this.b += 0.0753 * Math.cos((597890.4 * T + 278.3) * RAD);
      this.b += 0.0367 * Math.cos((149472.1 * T + 55.7) * RAD);
      this.b += 0.0187 * Math.cos((747362.9 * T + 93.1) * RAD);
      this.b += 0.0050 * Math.cos((298945 * T + 230) * RAD);
      this.b += 0.0047 * Math.cos((896835 * T + 268) * RAD);
      this.b += 0.0028 * Math.cos((448419 * T + 342) * RAD);
      this.b += 0.0023 * Math.cos((298946 * T + 347) * RAD);
      this.b += 0.0020 * Math.cos((597891 * T + 157) * RAD);
      this.b += 0.0012 * Math.cos((1046308 * T + 83) * RAD);
      this.b += 0.0009 * Math.cos((747364 * T + 331) * RAD);
      this.b += 0.0009 * Math.cos((448417 * T + 45) * RAD);
      this.b += 0.0005 * Math.cos((149474 * T + 352) * RAD);
      this.b += 0.0003 * Math.cos((896836 * T + 146) * RAD);

      this.r = 0.395283 * Math.cos((0 * T + 0) * RAD);
      this.r += 0.000002 * T * Math.cos((0 * T + 0) * RAD);
      this.r += 0.078341 * Math.cos((149472.515 * T + 354.795) * RAD);
      this.r += 0.000008 * T * Math.cos((149472.515 * T + 354.795) * RAD);
      this.r += 0.007955 * Math.cos((298945.03 * T + 169.59) * RAD);
      this.r += 0.000002 * T * Math.cos((298945.03 * T + 169.59) * RAD);
      this.r += 0.001214 * Math.cos((448417.55 * T + 344.38) * RAD);
      this.r += 0.000218 * Math.cos((597890.1 * T + 159.2) * RAD);
      this.r += 0.000042 * Math.cos((747363 * T + 334) * RAD);
      this.r += 0.000006 * Math.cos((896835 * T + 149) * RAD);
    }
  }

  class Venus implements Planet { // extends Planet
    y: number;
    b: number;
    r: number;
    /**
     * 金星
     * @param T ユリウス世紀
     */
    constructor(T: number) {
      this.y = 181.9793 + 58519.2125 * T;
      this.y += 0.7761 * Math.cos((58517.81 * T + 320.41) * RAD);
      this.y -= 0.0054 * T * Math.cos((58517.81 * T + 320.41) * RAD);
      this.y += 0.0503 * Math.cos((117036.6 * T + 300.6) * RAD);
      this.y += 0.0033 * Math.cos((117036 * T + 11) * RAD);
      this.y += 0.0032 * Math.cos((45038 * T + 254) * RAD);
      this.y += 0.0020 * Math.cos((67556 * T + 159) * RAD);
      this.y += 0.0014 * Math.cos((22519 * T + 172) * RAD);
      this.y += 0.0010 * Math.cos((9038 * T + 244) * RAD);
      this.y += 0.0008 * Math.cos((55483 * T + 239) * RAD);
      this.y += 0.0008 * Math.cos((155 * T + 303) * RAD);
      this.y += 0.0007 * Math.cos((58519 * T + 70) * RAD);
      this.y += 0.0007 * Math.cos((175554 * T + 351) * RAD);
      this.y += 0.0005 * Math.cos((3035 * T + 110) * RAD);
      this.y += 0.0004 * Math.cos((54076 * T + 34) * RAD);
      this.y %= 360.0;

      if (this.y < 0) {
        this.y += 360.0;
      }

      this.b = 3.3939 * Math.cos((58518.312 * T + 15.299) * RAD);
      this.b += 0.0010 * T * Math.cos((58518.312 * T + 15.299) * RAD);
      this.b += 0.0230 * Math.cos((0.5 * T + 144.9) * RAD);
      this.b += 0.0230 * Math.cos((117036.1 * T + 65.7) * RAD);
      this.b += 0.0005 * Math.cos((175555 * T + 46) * RAD);

      this.r = 0.723348 * Math.cos((0 * T + 0) * RAD);
      this.r += 0.004899 * Math.cos((58517.81 * T + 230.41) * RAD);
      this.r -= 0.000034 * T * Math.cos((58517.81 * T + 230.41) * RAD);
      this.r += 0.000017 * Math.cos((117036 * T + 281) * RAD);
      this.r += 0.000016 * Math.cos((45038 * T + 164) * RAD);
      this.r += 0.000014 * Math.cos((67556 * T + 69) * RAD);
      this.r += 0.000004 * Math.cos((55483 * T + 121) * RAD);
    }
  }

  class Mars implements Planet { // extends Planet
    y: number;
    b: number;
    r: number;
    /**
     * 火星
     * @param T ユリウス世紀
     */
    constructor(T: number) {
      this.y = 355.4472 + 19141.6999 * T;
      this.y += 10.6919 * Math.cos((19139.859 * T + 289.388) * RAD);
      this.y += 0.0105 * T * Math.cos((19139.859 * T + 289.388) * RAD);
      this.y += 0.6227 * Math.cos((38279.71 * T + 308.78) * RAD);
      this.y += 0.0012 * T * Math.cos((38279.71 * T + 308.78) * RAD);
      this.y += 0.0504 * Math.cos((57419.6 * T + 328.2) * RAD);
      this.y += 0.0147 * Math.cos((19 * T + 336) * RAD);
      this.y += 0.0144 * Math.cos((38282 * T + 342) * RAD);
      this.y += 0.0140 * Math.cos((0 * T + 180) * RAD);
      this.y += 0.0037 * T * Math.cos((0 * T + 180) * RAD);
      this.y += 0.0070 * Math.cos((16105 * T + 48) * RAD);
      this.y += 0.0060 * Math.cos((13071 * T + 168) * RAD);
      this.y += 0.0047 * Math.cos((76559 * T + 348) * RAD);
      this.y += 0.0045 * Math.cos((32211 * T + 191) * RAD);
      this.y += 0.0038 * Math.cos((2281 * T + 21) * RAD);
      this.y += 0.0028 * Math.cos((19142 * T + 142) * RAD);
      this.y += 0.0028 * Math.cos((57422 * T + 1) * RAD);
      this.y += 0.0023 * Math.cos((16859 * T + 13) * RAD);
      this.y += 0.0019 * Math.cos((14579 * T + 95) * RAD);
      this.y += 0.0018 * Math.cos((1098 * T + 50) * RAD);
      this.y += 0.0013 * Math.cos((4561 * T + 290) * RAD);
      this.y += 0.0010 * Math.cos((3035 * T + 39) * RAD);
      this.y += 0.0009 * Math.cos((35245 * T + 67) * RAD);
      this.y += 0.0009 * Math.cos((10036 * T + 167) * RAD);
      this.y += 0.0007 * Math.cos((29176 * T + 208) * RAD);
      this.y += 0.0007 * Math.cos((12298 * T + 166) * RAD);
      this.y += 0.0006 * Math.cos((51350 * T + 205) * RAD);
      this.y += 0.0005 * Math.cos((16696 * T + 137) * RAD);
      this.y += 0.0005 * Math.cos((21421 * T + 53) * RAD);
      this.y += 0.0004 * Math.cos((895 * T + 229) * RAD);
      this.y += 0.0004 * Math.cos((6069 * T + 220) * RAD);
      this.y += 0.0004 * Math.cos((17918 * T + 28) * RAD);
      this.y += 0.0003 * Math.cos((10017 * T + 256) * RAD);
      this.y += 0.0003 * Math.cos((76562 * T + 21) * RAD);
      this.y += 0.0003 * Math.cos((48316 * T + 179) * RAD);
      this.y += 0.0003 * Math.cos((6842 * T + 214) * RAD);
      this.y %= 360.0;

      if (this.y < 0) {
        this.y += 360.0;
      }

      this.b = 1.8334 * Math.cos((19140.925 * T + 215.876) * RAD);
      this.b -= 0.0007 * T * Math.cos((19140.925 * T + 215.876) * RAD);
      this.b += 0.1727 * Math.cos((1.07 * T + 16.50) * RAD);
      this.b += 0.1709 * Math.cos((38280.79 * T + 235.28) * RAD);
      this.b += 0.0179 * Math.cos((57420.6 * T + 254.7) * RAD);
      this.b += 0.0021 * Math.cos((19139 * T + 3) * RAD);
      this.b += 0.0020 * Math.cos((76561 * T + 274) * RAD);

      this.r = 1.530339 * Math.cos((0 * T + 0) * RAD);
      this.r += 0.000013 * T * Math.cos((0 * T + 0) * RAD);
      this.r += 0.141850 * Math.cos((19139.859 * T + 199.388) * RAD);
      this.r += 0.000139 * T * Math.cos((19139.859 * T + 199.388) * RAD);
      this.r += 0.006606 * Math.cos((38279.72 * T + 218.78) * RAD);
      this.r += 0.000013 * T * Math.cos((38279.72 * T + 218.78) * RAD);
      this.r += 0.000455 * Math.cos((57419.6 * T + 238.2) * RAD);
      this.r += 0.000080 * Math.cos((16105 * T + 317) * RAD);
      this.r += 0.000072 * Math.cos((32211 * T + 103) * RAD);
      this.r += 0.000055 * Math.cos((13071 * T + 77) * RAD);
      this.r += 0.000035 * Math.cos((76559 * T + 258) * RAD);
      this.r += 0.000024 * Math.cos((16859 * T + 284) * RAD);
      this.r += 0.000023 * Math.cos((14579 * T + 3) * RAD);
      this.r += 0.000013 * Math.cos((29176 * T + 118) * RAD);
      this.r += 0.000010 * Math.cos((35245 * T + 338) * RAD);
      this.r += 0.000009 * Math.cos((48316 * T + 89) * RAD);
      this.r += 0.000008 * Math.cos((2281 * T + 311) * RAD);
    }
  }

  class Jupiter implements Planet { // extends Planet
    y: number;
    b: number;
    r: number;
    /**
     * 木星
     * @param T ユリウス世紀
     */
    constructor(T: number) {
      this.y = 3036.08406 * T * Math.cos((0 * T + 0) * RAD);
      this.y += 34.39356 * Math.cos((0 * T + 0) * RAD);
      this.y += 5.54603 * Math.cos((3034.53346 * T + 289.68429) * RAD);
      this.y += 0.17575 * Math.cos((6083.2578 * T + 309.5012) * RAD);
      this.y += 0.05532 * Math.cos((3624.312 * T + 237.453) * RAD);
      this.y += 0.04370 * T * Math.cos((6071.843 * T + 218.916) * RAD);
      this.y += 0.03557 * Math.cos((596.267 * T + 191.685) * RAD);
      this.y += 0.02274 * Math.cos((2405.806 * T + 135.412) * RAD);
      this.y += 0.02120 * Math.cos((1822.117 * T + 73.665) * RAD);
      this.y += 0.00757 * Math.cos((9107.13 * T + 327.94) * RAD);
      this.y += 0.00699 * Math.cos((2920.69 * T + 198.68) * RAD);
      this.y += 0.00607 * Math.cos((4759.11 * T + 88.37) * RAD);
      this.y += 0.00501 * Math.cos((5449.93 * T + 206.94) * RAD);
      this.y += 0.00482 * Math.cos((4730.71 * T + 273.36) * RAD);
      this.y += 0.00397 * Math.cos((4206.81 * T + 294.77) * RAD);
      this.y += 0.00343 * Math.cos((6666.05 * T + 259.11) * RAD);
      this.y += 0.00335 * Math.cos((1284.47 * T + 244.10) * RAD);
      this.y += 0.00224 * Math.cos((1466.26 * T + 54.64) * RAD);
      this.y += 0.00094 * Math.cos((7251.8 * T + 221.3) * RAD);
      this.y += 0.00039 * Math.cos((12131.7 * T + 345.5) * RAD);
      this.y += 0.00035 * Math.cos((8473.4 * T + 241.5) * RAD);
      this.y += 0.00029 * Math.cos((9704.4 * T + 270.6) * RAD);
      this.y += 0.00028 * T * Math.cos((9087.8 * T + 197.2) * RAD);
      this.y += 0.00012 * Math.cos((7779.9 * T + 258.5) * RAD);
      this.y += 0.00010 * Math.cos((10902.8 * T + 174.0) * RAD);
      this.y += 0.00009 * Math.cos((10324 * T + 251) * RAD);
      this.y += 0.00003 * Math.cos((12691 * T + 195) * RAD);
      this.y %= 360.0;

      if (this.y < 0) {
        this.y += 360.0;
      }

      this.b = 1.30086 * Math.cos((3034.12633 * T + 203.91874) * RAD);
      this.b += 0.06299 * Math.cos((0 * T + 0) * RAD);
      this.b += 0.06295 * Math.cos((6068.687 * T + 223.544) * RAD);
      this.b += 0.02141 * T * Math.cos((3034.269 * T + 309.356) * RAD);
      this.b += 0.00347 * Math.cos((9136.65 * T + 243.22) * RAD);
      this.b += 0.00185 * T * Math.cos((9115.63 * T + 152.84) * RAD);
      this.b += 0.00106 * T * Math.cos((6049.97 * T + 339.44) * RAD);
      this.b += 0.00072 * Math.cos((2424.7 * T + 113.1) * RAD);
      this.b += 0.00063 * Math.cos((6654.4 * T + 171.6) * RAD);
      this.b += 0.00051 * T * Math.cos((0 * T + 180) * RAD);
      this.b += 0.00045 * Math.cos((3627.8 * T + 122.2) * RAD);
      this.b += 0.00038 * Math.cos((1225.1 * T + 214.6) * RAD);
      this.b += 0.00033 * Math.cos((4850.1 * T + 0.8) * RAD);
      this.b += 0.00031 * Math.cos((562.9 * T + 266.8) * RAD);
      this.b += 0.00028 * Math.cos((5432.9 * T + 75.7) * RAD);
      this.b += 0.00020 * Math.cos((12136.2 * T + 262.6) * RAD);
      this.b += 0.00011 * Math.cos((4231.5 * T + 267.9) * RAD);
      this.b += 0.00007 * Math.cos((9699 * T + 191) * RAD);
      this.b += 0.00006 * Math.cos((8494 * T + 132) * RAD);
      this.b += 0.00006 * Math.cos((799 * T + 181) * RAD);

      this.r = 5.209105 * Math.cos((0 * T + 0) * RAD);
      this.r += 0.251681 * Math.cos((3034.534 * T + 199.614) * RAD);
      this.r += 0.006134 * Math.cos((6066.1 * T + 219.0) * RAD);
      this.r += 0.002802 * Math.cos((3624.5 * T + 147.7) * RAD);
      this.r += 0.000880 * Math.cos((2406 * T + 46) * RAD);
      this.r += 0.000635 * Math.cos((1818 * T + 344) * RAD);
      this.r += 0.000612 * T * Math.cos((2968 * T + 19) * RAD);
      this.r += 0.000309 * T * Math.cos((6090 * T + 312) * RAD);
      this.r += 0.000306 * Math.cos((601 * T + 97) * RAD);
      this.r += 0.000299 * Math.cos((5444 * T + 124) * RAD);
      this.r += 0.000224 * Math.cos((4215 * T + 205) * RAD);
      this.r += 0.000212 * Math.cos((9113 * T + 233) * RAD);
      this.r += 0.000129 * Math.cos((6671 * T + 171) * RAD);
      this.r += 0.000069 * Math.cos((7258 * T + 125) * RAD);
      this.r += 0.000061 * Math.cos((1190 * T + 169) * RAD);
      this.r += 0.000061 * Math.cos((4840 * T + 334) * RAD);
      this.r += 0.000057 * T * Math.cos((9479 * T + 276) * RAD);
      this.r += 0.000030 * T * Math.cos((0 * T + 180) * RAD);
      this.r += 0.000017 * Math.cos((1517 * T + 288) * RAD);
      this.r += 0.000016 * Math.cos((8482 * T + 167) * RAD);
      this.r += 0.000012 * Math.cos((7830 * T + 175) * RAD);
      this.r += 0.000009 * Math.cos((12122 * T + 249) * RAD);
      this.r += 0.000009 * Math.cos((10896 * T + 84) * RAD);
      this.r += 0.000005 * Math.cos((10256 * T + 164) * RAD);
      this.r += 0.000005 * Math.cos((9560 * T + 138) * RAD);
    }
  }

  class Saturn implements Planet { // extends Planet
    y: number;
    b: number;
    r: number;
    /**
     * 土星
     * @param T ユリウス世紀
     */
    constructor(T: number) {
      this.y = 1224.04687 * T * Math.cos((0 * T + 0) * RAD);
      this.y += 49.97937 * Math.cos((0 * T + 0) * RAD);
      this.y += 6.19608 * Math.cos((1178.39096 * T + 227.52458) * RAD);
      this.y += 4.81254 * T * Math.cos((1200.76570 * T + 317.43950) * RAD);
      this.y += 0.44141 * T * Math.cos((2380.3750 * T + 279.0711) * RAD);
      this.y += 0.19720 * Math.cos((2310.5997 * T + 187.9907) * RAD);
      this.y += 0.11441 * Math.cos((597.5060 * T + 9.0137) * RAD);
      this.y += 0.03220 * T * Math.cos((3731.729 * T + 8.144) * RAD);
      this.y += 0.01138 * Math.cos((3816.622 * T + 105.909) * RAD);
      this.y += 0.00857 * Math.cos((1884.95 * T + 334.19) * RAD);
      this.y += 0.00215 * Math.cos((3151.76 * T + 22.82) * RAD);
      this.y += 0.00184 * Math.cos((5435.18 * T + 44.09) * RAD);
      this.y += 0.00094 * Math.cos((4198.7 * T + 97.3) * RAD);
      this.y += 0.00056 * Math.cos((4729.7 * T + 316.6) * RAD);
      this.y += 0.00054 * Math.cos((7243.0 * T + 29.7) * RAD);
      this.y += 0.00040 * Math.cos((4516.9 * T + 147.7) * RAD);
      this.y += 0.00029 * Math.cos((6009.6 * T + 94.9) * RAD);
      this.y += 0.00018 * Math.cos((9058.0 * T + 13.7) * RAD);
      this.y += 0.00011 * Math.cos((7825.9 * T + 74.1) * RAD);
      this.y += 0.00010 * Math.cos((6055 * T + 92) * RAD);
      this.y += 0.00009 * Math.cos((6619 * T + 69) * RAD);
      this.y += 0.00007 * Math.cos((10868 * T + 354) * RAD);
      this.y += 0.00005 * Math.cos((9616 * T + 68) * RAD);
      this.y += 0.00004 * Math.cos((8416 * T + 79) * RAD);
      this.y %= 360.0;

      if (this.y < 0) {
        this.y += 360.0;
      }

      this.b = 2.47972 * Math.cos((1224.56984 * T + 206.33867) * RAD);
      this.b += 0.13425 * Math.cos((2445.2118 * T + 163.7721) * RAD);
      this.b += 0.05938 * T * Math.cos((1223.005 * T + 113.635) * RAD);
      this.b += 0.04858 * Math.cos((0 * T + 0) * RAD);
      this.b += 0.00978 * T * Math.cos((514.08 * T + 27.67) * RAD);
      this.b += 0.00812 * Math.cos((3673.28 * T + 121.34) * RAD);
      this.b += 0.00305 * Math.cos((437.68 * T + 296.69) * RAD);
      this.b += 0.00277 * Math.cos((1812.03 * T + 303.12) * RAD);
      this.b += 0.00230 * T * Math.cos((2450.45 * T + 251.99) * RAD);
      this.b += 0.00064 * T * Math.cos((3629.0 * T + 28.8) * RAD);
      this.b += 0.00055 * Math.cos((3035.3 * T + 321.0) * RAD);
      this.b += 0.00039 * Math.cos((4861.3 * T + 64.0) * RAD);
      this.b += 0.00017 * Math.cos((4953.0 * T + 79.5) * RAD);

      this.r = 9.554001 * Math.cos((0 * T + 0) * RAD);
      this.r += 0.515185 * Math.cos((1188.045 * T + 137.576) * RAD)
      this.r += 0.314172 * T * Math.cos((1205.098 * T + 227.317) * RAD);
      this.r += 0.014780 * Math.cos((2442.07 * T + 92.09) * RAD);
      this.r += 0.008245 * Math.cos((1814.6 * T + 341.2) * RAD);
      this.r += 0.005400 * Math.cos((586.3 * T + 277.3) * RAD);
      this.r += 0.001556 * Math.cos((3612.4 * T + 347.2) * RAD);
      this.r += 0.001238 * T * Math.cos((2600 * T + 225.3) * RAD);
      this.r += 0.000555 * T * Math.cos((0 * T + 180) * RAD);
      this.r += 0.000314 * Math.cos((5440 * T + 313) * RAD);
      this.r += 0.000215 * Math.cos((3941 * T + 32) * RAD);
      this.r += 0.000166 * Math.cos((3228 * T + 160) * RAD);
      this.r += 0.000136 * Math.cos((4900 * T + 358) * RAD);
      this.r += 0.000119 * Math.cos((4379 * T + 22) * RAD);
      this.r += 0.000096 * Math.cos((7245 * T + 298) * RAD);
      this.r += 0.000055 * Math.cos((6017 * T + 15) * RAD);
      this.r += 0.000032 * Math.cos((9051 * T + 281) * RAD);
      this.r += 0.000027 * Math.cos((7826 * T + 1) * RAD);
      this.r += 0.000014 * Math.cos((6628 * T + 20) * RAD);
      this.r += 0.000012 * Math.cos((10878 * T + 263) * RAD);
      this.r += 0.000009 * Math.cos((9610 * T + 343) * RAD);
      this.r += 0.000007 * Math.cos((8336 * T + 15) * RAD);
      this.r += 0.000004 * Math.cos((12669 * T + 244) * RAD);
    }
  }

  class Uranus implements Planet { // extends Planet
    y: number;
    b: number;
    r: number;
    /**
     * 天王星
     * @param T ユリウス世紀
     */
    constructor(T: number) {
      this.y = 428.72880 * T * Math.cos((0 * T + 0) * RAD);
      this.y += 313.33676 * Math.cos((0 * T + 0) * RAD);
      this.y += 5.35857 * Math.cos((460.61987 * T + 48.85031) * RAD);
      this.y += 3.20671 * T * Math.cos((705.15539 * T + 114.02740) * RAD);
      this.y += 2.69325 * T * Math.cos((597.77389 * T + 317.76510) * RAD);
      this.y += 0.58964 * Math.cos((919.0429 * T + 188.3245) * RAD);
      this.y += 0.12397 * Math.cos((1065.1192 * T + 354.5935) * RAD);
      this.y += 0.01475 * Math.cos((2608.702 * T + 351.028) * RAD);
      this.y += 0.00090 * Math.cos((1968.3 * T + 247.7) * RAD);
      this.y += 0.00036 * Math.cos((5647.4 * T + 10.4) * RAD);
      this.y += 0.00017 * Math.cos((2356.6 * T + 183.6) * RAD);
      this.y += 0.00017 * Math.cos((2873.2 * T + 321.9) * RAD);
      this.y += 0.00015 * T * Math.cos((3798.6 * T + 313.4) * RAD);
      this.y += 0.00014 * Math.cos((3157.9 * T + 308.1) * RAD);
      this.y %= 360.0;

      if (this.y < 0) {
        this.y += 360.0;
      }

      this.b = 1.78488 * T * Math.cos((507.52281 * T + 188.32394) * RAD);
      this.b += 1.15483 * Math.cos((419.91739 * T + 128.15303) * RAD);
      this.b += 0.67756 * Math.cos((652.9504 * T + 273.6644) * RAD);
      this.b += 0.56518 * T * Math.cos((892.2869 * T + 354.9571) * RAD);
      this.b += 0.13490 * Math.cos((998.0302 * T + 83.3517) * RAD);
      this.b += 0.02997 * Math.cos((0 * T + 180) * RAD);
      this.b += 0.00036 * T * Math.cos((1526.5 * T + 263.0) * RAD);
      this.b += 0.00025 * Math.cos((3030.9 * T + 194.2) * RAD);

      this.r = 19.203034 * Math.cos((0 * T + 0) * RAD);
      this.r += 0.905790 * Math.cos((408.729 * T + 320.313) * RAD);
      this.r += 0.361949 * T * Math.cos((440.702 * T + 19.879) * RAD);
      this.r += 0.166685 * T * Math.cos((702.024 * T + 307.419) * RAD);
      this.r += 0.062710 * Math.cos((799.95 * T + 67.99) * RAD);
      this.r += 0.042617 * T * Math.cos((0 * T + 0) * RAD);
      this.r += 0.004897 * Math.cos((2613.7 * T + 80.4) * RAD);
      this.r += 0.000656 * Math.cos((1527 * T + 202) * RAD);
      this.r += 0.000223 * Math.cos((2120 * T + 321) * RAD);
      this.r += 0.000205 * Math.cos((3104 * T + 37) * RAD);
      this.r += 0.000120 * Math.cos((5652 * T + 100) * RAD);
    }
  }

  class Neptune implements Planet { // extends Planet
    y: number;
    b: number;
    r: number;
    /**
     * 海王星
     * @param T ユリウス世紀
     */
    constructor(T: number) {
      this.y = 219.93503 * T * Math.cos((0 * T + 0) * RAD);
      this.y += 55.13323 * Math.cos((0 * T + 180) * RAD);
      this.y += 0.97450 * Math.cos((221.3904 * T + 167.7269) * RAD);
      this.y += 0.04403 * T * Math.cos((684.128 * T + 332.797) * RAD);
      this.y += 0.02928 * T * Math.cos((904.371 * T + 342.114) * RAD);
      this.y += 0.01344 * Math.cos((986.281 * T + 50.826) * RAD);
      this.y += 0.00945 * Math.cos((2815.89 * T + 0.09) * RAD);
      this.y += 0.00235 * Math.cos((2266.50 * T + 309.35) * RAD);
      this.y += 0.00225 * Math.cos((2279.43 * T + 127.61) * RAD);
      this.y += 0.00023 * Math.cos((5851.6 * T + 19.2) * RAD);
      this.y %= 360.0;

      if (this.y < 0) {
        this.y += 360.0;
      }

      this.b = 1.76958 * Math.cos((218.87906 * T + 83.11018) * RAD);
      this.b += 0.01725 * Math.cos((0 * T + 0) * RAD);
      this.b += 0.01366 * Math.cos((447.128 * T + 338.864) * RAD);
      this.b += 0.00015 * Math.cos((1107.1 * T + 224.7) * RAD);
      this.b += 0.00015 * Math.cos((2596.7 * T + 187.5) * RAD);
      this.b += 0.00012 * Math.cos((3035.0 * T + 243.9) * RAD);

      this.r = 30.073033 * Math.cos((0 * T + 0) * RAD);
      this.r += 0.260457 * Math.cos((222.371 * T + 79.994) * RAD);
      this.r += 0.009784 * T * Math.cos((515.2 * T + 195.7) * RAD);
      this.r += 0.004944 * Math.cos((2815.4 * T + 90.1) * RAD);
      this.r += 0.003364 * Math.cos((524.0 * T + 308.1) * RAD);
      this.r += 0.002579 * Math.cos((1025.1 * T + 104.0) * RAD);
      this.r += 0.000120 * Math.cos((5845 * T + 111) * RAD);
    }
  }

  class Pluto implements Planet { // extends Planet
    y: number;
    b: number;
    r: number;
    /**
     * 冥王星
     * @param T ユリウス世紀
     */
    constructor(T: number) {
      this.y = 241.82574 * Math.cos((0 * T + 0) * RAD);
      this.y += 179.09519 * T * Math.cos((0 * T + 0) * RAD);
      this.y += 15.81087 * Math.cos((246.556453 * T + 298.348019) * RAD);
      this.y += 1.18379 * Math.cos((551.34710 * T + 351.67676) * RAD);
      this.y += 0.07886 * Math.cos((941.622 * T + 41.989) * RAD);
      this.y += 0.00861 * Math.cos((2836.46 * T + 60.35) * RAD);
      this.y += 0.00590 * Math.cos((1306.75 * T + 112.91) * RAD);
      this.y += 0.00145 * Math.cos((2488.14 * T + 19.01) * RAD);
      this.y += 0.00022 * Math.cos((5861.8 * T + 77.9) * RAD);
      this.y += 0.00013 * Math.cos((3288.8 * T + 293.0) * RAD);
      this.y %= 360.0;

      if (this.y < 0) {
        this.y += 360.0;
      }

      this.b = 17.04550 * Math.cos((172.554318 * T + 42.574982) * RAD);
      this.b += 2.45310 * Math.cos((415.60630 * T + 66.15350) * RAD);
      this.b += 2.30285 * Math.cos((0 * T + 180) * RAD);
      this.b += 0.26775 * Math.cos((713.1227 * T + 105.0840) * RAD);
      this.b += 0.01855 * Math.cos((1089.202 * T + 146.660) * RAD);
      this.b += 0.00119 * Math.cos((2658.22 * T + 293.06) * RAD);
      this.b += 0.00098 * Math.cos((3055.6 * T + 18.8) * RAD);
      this.b += 0.00090 * Math.cos((1532.6 * T + 213.7) * RAD);
      this.b += 0.00042 * Math.cos((2342.3 * T + 254.2) * RAD);

      this.r = 38.662489 * Math.cos((0 * T + 0) * RAD);
      this.r += 8.670489 * Math.cos((181.3383 * T + 198.4973) * RAD);
      this.r += 0.333884 * Math.cos((475.963 * T + 228.717) * RAD);
      this.r += 0.008426 * Math.cos((909.8 * T + 252.9) * RAD);
      this.r += 0.007619 * T * Math.cos((1425.9 * T + 31.0) * RAD);
      this.r += 0.004902 * Math.cos((2831.6 * T + 149.4) * RAD);
      this.r += 0.002543 * T * Math.cos((2196.1 * T + 199.5) * RAD);
      this.r += 0.001188 * Math.cos((1748.0 * T + 114.1) * RAD);
      this.r += 0.000390 * Math.cos((3188 * T + 15) * RAD);
      this.r += 0.000116 * Math.cos((5860 * T + 169) * RAD);
    }
  }
  return {
    Sun,
    Earth,
    Moon,
    Mercury,
    Venus,
    Mars,
    Jupiter,
    Saturn,
    Uranus,
    Neptune,
    Pluto,
  }

}

</script>
