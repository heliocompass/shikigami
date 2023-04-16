//
// Observer.js
// Observer Class Library 
// Copyright(C)2021 T.Takao@Will System Design All Rights Reserved.
// https://will-system.net/
//

class Observer {
  constructor(dt, name, longitude, latitude, timezone) {
    this.nowDt = new Date(dt);
    this.name = name;
    this.longitude = longitude;
    this.latitude = latitude;
    this.timezone = timezone;

    this.initDt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 0, 0);
    //this.noonDt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 12, 0);
  }
}
