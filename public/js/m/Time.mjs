import {
    MandatoryValueConstraintViolation,
    NoConstraintViolation, RangeConstraintViolation,
} from "../../lib/errorTypes.mjs";
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
        console.log(date);
        if (!date){
            return new MandatoryValueConstraintViolation("There must be a date given.");
        } else if (date < new Date().toISOString().slice(0, 10)){
            return new RangeConstraintViolation("Class cannot take place in the past");
        } else {
            return new NoConstraintViolation();
        }
        /*if (date < new Date().toISOString().slice(0, 10)){

            return new RangeConstraintViolation("The date must be bigger than today!");
        }
        console.log(new Date().toISOString().slice(0, 10));
        console.log(typeof date);
        console.log(date);
        console.log(typeof new Date().toISOString().slice(0, 10));
        console.log("smaller " + new Date().toISOString().slice(0, 10) > date);
        console.log("bigger " + new Date().toISOString().slice(0, 10) < date);*/
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
        if (!sT){
            return new MandatoryValueConstraintViolation("There start time of the class must be given.");
        } else {
            return new NoConstraintViolation();
        }
    }
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
    static checkEndTime( eT) {
        if (!eT) {
            return new MandatoryValueConstraintViolation("The end time of the class must be given.");
        } else {
            return new NoConstraintViolation();
        }
    }
    set endTime( eT){
        const validationResult = Time.checkEndTime( eT);
        if (validationResult instanceof  NoConstraintViolation){
            this._endTime = eT;
        } else {
            throw validationResult;
        }
    }
    static checkTimes( sT, eT){
        if (sT >= eT) {
            return new RangeConstraintViolation("A class cannot end before it begins.");
        } else {
            return new NoConstraintViolation();
        }
    }
    // Serialize course object
    toString() {
        let timeStr = `{Date: ${this._date}, Start Time: ${this._startTime}, End Time: ${this._endTime}`;
        return `${timeStr}`;
    }
}

export default Time;