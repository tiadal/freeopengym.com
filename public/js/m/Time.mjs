import Class from "./Class.mjs";

/**
 * Constructor function for the class Movie
 * @constructor
 * @param {{startTime: Date, endTime: Date}}
 * slots - Object creation slots.
 */

class Time {
    constructor({classDate,startTime,endTime}) {
        this.classDate = classDate;
        this.startTime = startTime;
        this.endTime = endTime;
    }
    get classDate(){
        return this._date;
    }
    //TODO: check
    set classDate(date){
        this._date = date;
    }
    get startTime(){
        return this._startTime;
    }
    //TODO: check
    set startTime( sT){
        this._startTime = sT;
    }
    get endTime(){
        return this._endTime;
    }
    //TODO: check
    set endTime( eT){
        this._endTime = eT;
    }

    // Serialize course object
    toString() {
        let timeStr = `{Start Time: ${this._startTime}, End Time: ${this._endTime}`;
        return `${timeStr}`;
    }
}

export default Time;