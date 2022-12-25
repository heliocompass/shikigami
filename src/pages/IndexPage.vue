<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { getYear, getMonth, getDate } from 'date-fns'
import { Observer } from '../components/Observer.vue'
import { shikigami } from '../components/Shikigami.vue'
import type { timeBase } from '../components/Suntime.vue';


// 外部ファイル
const { ObserverClass } = Observer()

// 各設定値
const year = ref(2000); // 年
const month = ref(0); // 月
const day = ref(1); // 日
const name = ref('静岡市'); // 場所名
const longitude = ref(138.3831); // 経度
const latitude = ref(34.9769); // 緯度
const timezone = ref(9); // タイムゾーン UTC+9(JST)

// 描画対象
// const flagDraw = ref([
//   true, // 0: 地球
//   true, // 1: 月
//   true, // 2: 水星
//   true, // 3: 金星
//   true, // 4: 火星
//   true, // 5: 木星
//   true, // 6: 土星
//   true, // 7: 天王星
//   true, // 8: 海王星
//   true, // 9: 冥王星
//   false, // 10: 日の出線
//   false, // 11: 日の入線
//   false, // 12: 昼エリア
//   false, // 13: 夜エリア
// ])
const flagDraw = ref({
  isDrawEarth: true, // 0: 地球
  isDrawMoon: true, // 1: 月
  isDrawMercury: true, // 2: 水星
  isDrawVenus: true, // 3: 金星
  isDrawMars: true, // 4: 火星
  isDrawJupiter: true, // 5: 木星
  isDrawSaturn: true, // 6: 土星
  isDrawUranus: true, // 7: 天王星
  isDrawNeptune: true, // 8: 海王星
  isDrawPluto: true, // 9: 冥王星
  isDrawSunrise: false, // 10: 日の出線
  isDrawSunset: false, // 11: 日の入線
  isDrawDayArea: false, // 12: 昼エリア
  isDrawNightArea: false, // 13: 夜エリア
})

/** 描画基準時刻 */
const drawTime = ref<timeBase>('clock'); // clock: 正午／正子,  sun: 南中／北中

/** 現在日を設定する */
const setCurrentDate = () => {
  const nowDateTime = new Date();
  year.value = getYear(nowDateTime);
  month.value = getMonth(nowDateTime) + 1;
  day.value = getDate(nowDateTime);
}

/** SHIKIGAMI実行 */
const execShikigami = () => {

  const checkDt = new Date(year.value, month.value - 1, day.value, 0, 0, 0);  // 設定時刻
  const observer = new ObserverClass(checkDt, name.value, longitude.value, latitude.value, timezone.value);
  shikigami(observer, flagDraw.value, daysData.value, drawTime.value);
}

// 初期表示時の動作
onMounted(() => {
  setCurrentDate();
  execShikigami();
})

type DaysData = {
  start: Date
  end: Date
  data: Array<{ date: number, value: number }>
}

const fileReader = new FileReader();
// csv ファイルアップロード
// アップロード検知
const onFileChange = (e: any) => {
  const files = e.target.files || e.dataTransfer.files;
  // console.log(files);
  const file = files[0];
  fileReader.readAsText(file);

  fileReader.onload = () => {
    // console.log(fileReader.result);
    const resultText = fileReader.result;
    var result = []; // 最終的な二次元配列を入れるための配列
    if ('string' == typeof resultText) {
      var tmp = resultText?.split("\n"); // 改行を区切り文字として行を要素とした配列を生成
      console.log(tmp);
      for (var i = 0; i < tmp.length; ++i) {

        const tmpArray = tmp[i].split(',');
        const line = { date: Number(tmpArray[0]), value: Number(tmpArray[1]) };
        result.push(line);
      }
    }
    console.log(result);
    daysData.value.data = result;
    console.log(daysData.value.data);
  }
}

const daysData = ref<DaysData>({
  start: new Date(),
  end: new Date(),
  data: []
});

// 各値の変更を検知した場合は、SHIKIGAMI再実行
watch([year, month, day, name, longitude, latitude, timezone, flagDraw, daysData], () => {
  execShikigami();
  console.log('再描画')
}, { deep: true })


// TODO: バリデーション
// 日時と場所のチェック
// if (checkYear.match(/[^0-9]+/) || checkYear < 1900 || checkYear > 2100) {
//   alert('1900-2100の数値を入力してください');
// }
// if (checkMonth.match(/[^0-9]+/) || checkMonth < 1 || checkMonth > 12) {
//   alert('1～12の数値を入力してください');
//   return;
// }
// if (checkDay.match(/[^0-9]+/) || checkDay < 1 || checkDay > 31) {
//   alert('1～31の数値を入力してください');
//   return;
// }
// if (!checkLongitude.match(/^[+,-]?([1-9]\d*|0)(\.\d+)?$/) || checkLongitude < -180 || checkLongitude > 180) {
//   alert('-180～180の数値を入力してください');
//   return;
// }
// if (!checkLatitude.match(/^[+,-]?([1-9]\d*|0)(\.\d+)?$/) || checkLatitude < -90.0 || checkLatitude > 90.0) {
//   alert('-90～90の数値を入力してください');
//   return;
// }
// if (checkDt.getFullYear() != checkYear || checkDt.getMonth() != checkMonth - 1 || checkDt.getDate() != checkDay) {
//   alert('正しい日付を入力してください');
//   return;
// }

</script>

<template>
  <div>
    <div id="panel">
      <form name="setting" action="javascript:void(0)">
        <input type="number" id="year" size="3" min="1900" max="2100" step="1"
          v-model="year"><label>年(1900-2100)</label>
        <input type="number" id="month" size="2" min="1" max="12" step="1" v-model="month"><label>月</label>
        <input type="number" id="day" size="2" min="1" max="31" step="1" v-model="day"><label>日</label>
        <label>場所</label><input type="text" id="name" size="6" v-model="name">
        <label>経度</label><input type="number" id="longitude" size="5" min="-180.0000" max="180.0000" step="0.0001"
          v-model="longitude"><label>度</label>
        <label>緯度</label><input type="number" id="latitude" size="5" min="-90.0000" max="90.0000" step="0.0001"
          v-model="latitude"><label>度</label>
        <label>タイムゾーン</label><select id="timezone" v-model="timezone">
          <option value=14>UTC+14</option>
          <option value=13>UTC+13</option>
          <option value=12.75>UTC+12:45</option>
          <option value=12>UTC+12</option>
          <option value=11>UTC+11</option>
          <option value=10.5>UTC+10:30</option>
          <option value=10>UTC+10</option>
          <option value=9.5>UTC+9:30</option>
          <option value=9>UTC+9 (JST)</option>
          <option value=8.75>UTC+8:45</option>
          <option value=8>UTC+8</option>
          <option value=7>UTC+7</option>
          <option value=6.5>UTC+6:30</option>
          <option value=6>UTC+6</option>
          <option value=5.75>UTC+5:45</option>
          <option value=5.5>UTC+5:30</option>
          <option value=5>UTC+5</option>
          <option value=4.5>UTC+4:30</option>
          <option value=4>UTC+4</option>
          <option value=3.5>UTC+3:30</option>
          <option value=3>UTC+3</option>
          <option value=2>UTC+2</option>
          <option value=1>UTC+1</option>
          <option value=0>UTC</option>
          <option value=-1>UTC-1</option>
          <option value=-2>UTC-2</option>
          <option value=-3>UTC-3</option>
          <option value=-3.5>UTC-3:30</option>
          <option value=-4>UTC-4</option>
          <option value=-5>UTC-5</option>
          <option value=-6>UTC-6</option>
          <option value=-7>UTC-7</option>
          <option value=-8>UTC-8</option>
          <option value=-9>UTC-9</option>
        </select>
        <p>
          <input type="checkbox" name="flagDraw" value="0" v-model="flagDraw.isDrawEarth"><label>地球(太陽)</label>
          <input type="checkbox" name="flagDraw" value="1" v-model="flagDraw.isDrawMoon"><label>月</label>
          <input type="checkbox" name="flagDraw" value="2" v-model="flagDraw.isDrawMercury"><label>水星</label>
          <input type="checkbox" name="flagDraw" value="3" v-model="flagDraw.isDrawVenus"><label>金星</label>
          <input type="checkbox" name="flagDraw" value="4" v-model="flagDraw.isDrawMars"><label>火星</label>
          <input type="checkbox" name="flagDraw" value="5" v-model="flagDraw.isDrawJupiter"><label>木星</label>
          <input type="checkbox" name="flagDraw" value="6" v-model="flagDraw.isDrawSaturn"><label>土星</label>
          <input type="checkbox" name="flagDraw" value="7" v-model="flagDraw.isDrawUranus"><label>天王星</label>
          <input type="checkbox" name="flagDraw" value="8" v-model="flagDraw.isDrawNeptune"><label>海王星</label>
          <input type="checkbox" name="flagDraw" value="9" v-model="flagDraw.isDrawPluto"><label>冥王星</label>
        </p>
        <p>
          <input type="checkbox" name="flagDraw" value="10" v-model="flagDraw.isDrawSunrise"><label>日の出線</label>
          <input type="checkbox" name="flagDraw" value="11" v-model="flagDraw.isDrawSunset"><label>日の入り線</label>
          <input type="checkbox" name="flagDraw" value="12" v-model="flagDraw.isDrawDayArea"><label>昼エリア</label>
          <input type="checkbox" name="flagDraw" value="13" v-model="flagDraw.isDrawNightArea"><label>夜エリア</label>
        </p>
        <p>
          <label>描画基準時刻</label>
          <input type="radio" name="drawTime" value="clock" v-model="drawTime"><label>正午／正子</label>
          <input type="radio" name="drawTime" value="sun" v-model="drawTime"><label>南中／北中</label>
        </p>
        <p>
          <input type="button" onclick="downloadSVG();" value="SVGデータをダウンロードする" />
        </p>
      </form>
      <input id="upload-file" type="file" @change="onFileChange" />
      <a href="./csv/assets/data.csv">サンプルcsv</a>
      <div id="svgImage"></div>
      <div id="copyright">
        <p>
          SHIKIGAMI 2.1.3 -地球暦制作支援ツール-<br />
          Copyright(C)2021 Will System Design
        </p>
      </div>
    </div>

  </div>
</template>

<style scoped>

</style>
