
export class Utils {
  static getDateTime(unixTime:number) {
    const date = new Date(unixTime*1000);
    return date. toLocaleString("en-US");
  }

  static getTime(unixTime:number){
    const date = new Date(unixTime*1000);
    return date. toLocaleTimeString("en-US");
  }

  static getDate(unixTime:number){
    const date = new Date(unixTime*1000);
    return date.toLocaleDateString("en-US");
  }
}
