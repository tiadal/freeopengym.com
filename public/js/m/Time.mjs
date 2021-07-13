import {
    MandatoryValueConstraintViolation,
    NoConstraintViolation,
    RangeConstraintViolation
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