import {
    NoConstraintViolation, RangeConstraintViolation,
} from "../../lib/errorTypes.mjs";
import {isIntegerOrIntegerString} from "../../lib/util.mjs";

/**
 * Constructor function for the class Time
 * @constructor
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
    //TODO
    static checkClassDate( date) {
        /*if (date < new Date().toISOString().slice(0, 10)){

            return new RangeConstraintViolation("The date must be bigger than today!");
        }
        console.log(new Date().toISOString().slice(0, 10));
        console.log(typeof date);
        console.log(date);
        console.log(typeof new Date().toISOString().slice(0, 10));
        console.log("smaller " + new Date().toISOString().slice(0, 10) > date);
        console.log("bigger " + new Date().toISOString().slice(0, 10) < date);*/
        return new NoConstraintViolation();
    };
    set classDate(date){
        const validationResult = Time.checkClassDate( date);
        if (validationResult instanceof NoConstraintViolation) {
            this._date = date;
        } else {
            throw validationResult;
        }
    }
    get startTime(){
        return this._startTime;
    }
    //TODO: check
    static checkStartTime( sT) {
        return new NoConstraintViolation();
    };
    set startTime( sT){
        const validationResult = Time.checkStartTime( sT);
        if (validationResult instanceof  NoConstraintViolation){
            this._startTime = sT;
        } else {
            throw validationResult;
        }
    }
    get endTime(){
        return this._endTime;
    }
    //TODO: check
    static checkEndTime( eT) {
        return new NoConstraintViolation();
    };
    set endTime( eT){
        const validationResult = Time.checkEndTime( eT);
        if (validationResult instanceof  NoConstraintViolation){
            this._endTime = eT;
        } else {
            throw validationResult;
        }
    }

    // Serialize course object
    toString() {
        let timeStr = `{Date: ${this._date}, Start Time: ${this._startTime}, End Time: ${this._endTime}`;
        return `${timeStr}`;
    }
}

export default Time;