<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { getYear, getMonth, getDate } from 'date-fns'
import { Observer } from '../components/Observer.vue'
import { shikigami, downloadSVG } from '../components/Shikigami.vue'
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

const graphMax = ref(400);

// 描画対象
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
  shikigami(observer, flagDraw.value, daysData.value, drawTime.value, 0, graphMax.value);
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


// 描画用
const displayMenu = ref(false);
const timezones = [
  { value: 12, label: "UTC+12" },
  { value: 11, label: "UTC+11" },
  { value: 10, label: "UTC+10" },
  { value: 9, label: "UTC+9" },
  { value: 8, label: "UTC+8" },
  { value: 7, label: "UTC+7" },
  { value: 6, label: "UTC+6" },
  { value: 5, label: "UTC+5" },
  { value: 4, label: "UTC+4" },
  { value: 3, label: "UTC+3" },
  { value: 2, label: "UTC+2" },
  { value: 1, label: "UTC+1" },
  { value: 0, label: "UTC+0" },
  { value: -1, label: "UTC-1" },
  { value: -2, label: "UTC-2" },
  { value: -3, label: "UTC-3" },
  { value: -4, label: "UTC-4" },
  { value: -5, label: "UTC-5" },
  { value: -6, label: "UTC-6" },
  { value: -7, label: "UTC-7" },
  { value: -8, label: "UTC-8" },
  { value: -9, label: "UTC-9" },
  { value: 10, label: "UTC-10" },
  { value: 11, label: "UTC-11" },
  { value: 12, label: "UTC-12" },
];

// メニュー表示でSHIKIGAMI再実行
watch([displayMenu, graphMax], () => {
  setTimeout(execShikigami, 500); // メニューを開くために時間がかかるので、少し遅らせる
  console.log('再描画')
}, { deep: true })

</script>

<template>
  <v-layout>
    <v-main>
      <v-app-bar>
        <v-app-bar-title>地球歴 Demo</v-app-bar-title>
        <v-spacer></v-spacer>
        <v-btn @click="downloadSVG()">ダウンロード</v-btn>
        <v-btn @click="displayMenu = !displayMenu">設定</v-btn>
      </v-app-bar>
      <v-navigation-drawer permanent name="drawer" v-model="displayMenu" location="right">

        <div class="ma-2">
          <v-divider></v-divider>
          <v-subtitle>観測日</v-subtitle>
          <v-row>
            <v-col>
              <v-text-field hide-details density="compact" variant="outlined" type="number" min="1900" max="2100"
                step="1" v-model="year" label="年"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6"> <v-text-field hide-details density="compact" variant="outlined" v-model="month"
                type="number" min="1" max="12" step="1" label="月"></v-text-field></v-col>
            <v-col cols="6"> <v-text-field hide-details density="compact" variant="outlined" v-model="day" type="number"
                min="1" max="31" step="1" label="日"></v-text-field></v-col>
          </v-row>

        </div>
        <div class="ma-2">
          <v-divider></v-divider>
          <v-subtitle>観測地点</v-subtitle>
          <v-row>
            <v-col>
              <v-text-field hide-details density="compact" variant="outlined" v-model="name" label="場所"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6"> <v-text-field hide-details density="compact" variant="outlined" v-model="latitude"
                type="number" min="-90.0000" max="90.0000" step="0.0001" label="緯度"></v-text-field></v-col>
            <v-col cols="6"> <v-text-field hide-details density="compact" variant="outlined" v-model="longitude"
                type="number" min="-90.0000" max="90.0000" step="0.0001" label="経度"></v-text-field></v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-select hide-details density="compact" variant="outlined" v-model="timezone" label="タイムゾーン"
                :items="timezones" item-value="value" item-title="label"></v-select>
            </v-col>
          </v-row>
        </div>
        <div class="ma-2">
          <v-divider></v-divider>
          <v-subtitle>惑星描画</v-subtitle>
          <v-switch v-model="flagDraw.isDrawEarth" label="地球（太陽）" hide-details density="compact"
            color="primary"></v-switch>
          <v-switch v-model="flagDraw.isDrawMoon" label="月" hide-details density="compact" color="primary"></v-switch>
          <v-switch v-model="flagDraw.isDrawMercury" label="水星" hide-details density="compact"
            color="primary"></v-switch>
          <v-switch v-model="flagDraw.isDrawVenus" label="金星" hide-details density="compact" color="primary"></v-switch>
          <v-switch v-model="flagDraw.isDrawMars" label="火星" hide-details density="compact" color="primary"></v-switch>
          <v-switch v-model="flagDraw.isDrawJupiter" label="木星" hide-details density="compact"
            color="primary"></v-switch>
          <v-switch v-model="flagDraw.isDrawSaturn" label="土星" hide-details density="compact"
            color="primary"></v-switch>
          <v-switch v-model="flagDraw.isDrawUranus" label="天王星" hide-details density="compact"
            color="primary"></v-switch>
          <v-switch v-model="flagDraw.isDrawNeptune" label="海王星" hide-details density="compact"
            color="primary"></v-switch>
          <v-switch v-model="flagDraw.isDrawPluto" label="冥王星" hide-details density="compact"
            color="primary"></v-switch>
        </div>

        <div class="ma-2">
          <v-divider></v-divider>
          <v-label>地球詳細描画</v-label>
          <v-switch v-model="flagDraw.isDrawSunrise" label="日の出線" hide-details density="compact"
            color="primary"></v-switch>
          <v-switch v-model="flagDraw.isDrawSunset" label="日の入り線" hide-details density="compact"
            color="primary"></v-switch>
          <v-switch v-model="flagDraw.isDrawDayArea" label="昼エリア" hide-details density="compact"
            color="primary"></v-switch>
          <v-switch v-model="flagDraw.isDrawNightArea" label="夜エリア" hide-details density="compact"
            color="primary"></v-switch>
        </div>
        <div class="ma-2">
          <v-divider></v-divider>
          <v-subtitle>描画基準時刻</v-subtitle>
          <v-btn-toggle v-model="drawTime" mandatory>
            <v-btn label="正午／正子" value="clock" hide-details density="compact" color="primary">正午／正子</v-btn>
            <v-btn label="南中／北中" value="sun" hide-details density="compact" color="primary">南中／北中</v-btn>
          </v-btn-toggle>
        </div>
        <div class="ma-2">
          <v-divider></v-divider>
          <v-subtitle>グラフ基準値</v-subtitle>
          <v-text-field v-model="graphMax" hide-details :min="1"></v-text-field>
        </div>
      </v-navigation-drawer>
      <v-row class="ma-4">
        <v-col cols="8"><v-file-input id="upload-file" type="file" @change="onFileChange" label="CSVアップロード"
            accept="text/csv" density="compact" hide-details variant="filled"></v-file-input></v-col>
        <v-col cols="4"><a href="./csv/assets/data.csv">サンプルcsv</a></v-col>
      </v-row>

      <!-- shikigami -->
      <v-row>
        <v-col cols="12">
          <div id="svgImage"></div>
        </v-col>
      </v-row>
      <v-footer>SHIKIGAMI 2.1.3 -地球暦制作支援ツール-</v-footer>
    </v-main>
  </v-layout>
</template>

<style scoped>

</style>
