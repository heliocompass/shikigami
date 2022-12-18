<script lang="ts" >

export type observerType = {
  nowDt: Date,
  name: string,
  longitude: number,
  latitude: number,
  timezone: number,
  initDt: Date;
}

export const Observer = () => {
  class ObserverClass implements observerType {
    nowDt: Date;
    name: string;
    longitude: number;
    latitude: number;
    timezone: number;
    initDt: Date;
    constructor(dt: Date, name: string, longitude: number, latitude: number, timezone: number) {
      this.nowDt = new Date(dt);
      this.name = name;
      this.longitude = longitude;
      this.latitude = latitude;
      this.timezone = timezone;
      this.initDt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 0, 0);
    }
  }
  return {
    ObserverClass,
  }
}

const defaultText = '';
export default defaultText;
</script>
