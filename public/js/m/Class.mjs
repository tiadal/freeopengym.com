/**
* Constructor function for the class Class
* @constructor
* @param {{classId: number, classTime: Time, classLocation: string}}
* slots - Object creation slots.
*/
import {isIntegerOrIntegerString, isNonEmptyString} from "../../lib/util.mjs";
import {Course} from "./Course.mjs";
import {NoConstraintViolation, MandatoryValueConstraintViolation,
    RangeConstraintViolation, PatternConstraintViolation, UniquenessConstraintViolation,
    IntervalConstraintViolation, ReferentialIntegrityConstraintViolation}
    from "../../lib/errorTypes.mjs";
import Time from "./Time.mjs";

class Class {
    constructor({classId, classTime, classLocation, courseId}) {
        this.classId = classId;
        this.courseId = courseId;
        this.classTime = classTime;
        this.classLocation = classLocation;
    }
    get classId(){
        return this._classId;
    }
    // all basic constraints of the id attribute
    static checkClassId( classId) {
        if(!classId){
          return new MandatoryValueConstraintViolation("A class ID must be given");
        } else if(!isIntegerOrIntegerString(classId)){
            return new RangeConstraintViolation("The class ID must be an unsigned integer!");
        } else if (parseInt(classId) < 1){
            return new RangeConstraintViolation("The class ID must be bigger than 0!");
        } else{
            return new NoConstraintViolation();
        }
    };
    // mandatory value and uniqueness constraints
    static async checkClassIdAsId( classId) {
        let validationResult = Class.checkClassId( classId);
        if ((validationResult instanceof NoConstraintViolation)) {
            if (!classId) {
                validationResult = new MandatoryValueConstraintViolation(
                    "A value for the class id must be provided!");
            } else {
                let classDocSn = await db.collection("classes").doc( classId.toString()).get();
                if (classDocSn.exists) {
                    validationResult = new UniquenessConstraintViolation(
                        "There is already a class record with this id!");
                } else {
                    validationResult = new NoConstraintViolation();
                }
            }
        }
        return validationResult;
    };
    set classId(classId){
        const validationResult = Class.checkClassId( classId);
        if (validationResult instanceof NoConstraintViolation) {
            this._classId = classId;
        } else {
            throw validationResult;
        }
    }
    get classTime(){
        return this._classTime;
    }
    static checkClassTime( time) {
        if (!time) {
            return new MandatoryValueConstraintViolation(
                "A class time must be provided!");
        } else if (Array.isArray(time) && time.length === 3) {
            if (!Time.checkClassDate(time[0]) || !Time.checkStartTime(time[1]) || !Time.checkEndTime(time[2])){
                return new RangeConstraintViolation("The class time must be a correct time slot!");
            } else {
                return new NoConstraintViolation();
            }
        } else {
            return new NoConstraintViolation();
        }
    };
    set classTime(classTime){
        const validationResult = Class.checkClassTime( classTime);
        if (validationResult instanceof NoConstraintViolation) {
            this._classTime = classTime;
        } else {
            throw validationResult;
        }
    }
    get classLocation(){
        return this._classLocation;
    }
    static checkLocation( location) {
        if (!location) {
            return new MandatoryValueConstraintViolation("A location must be provided!");
        } else if (!isNonEmptyString( location)) {
            return new RangeConstraintViolation("The location must be a non-empty string!");
        } else {
            return new NoConstraintViolation();
        }
    };
    set classLocation(location) {
        const validationResult = Class.checkLocation( location);
        if (validationResult instanceof NoConstraintViolation) {
            this._classLocation = location;
        } else {
            throw validationResult;
        }
    }
    get courseId(){
        return this._courseId;
    }

    static async checkCourseId(courseId){
       let validationResult = null;
        if (!courseId) {
            validationResult = new NoConstraintViolation();  // optional
        } else {
            // invoke foreign key constraint check
            validationResult = await Course.checkCourseIdAsIdRef(courseId);
        }
        return validationResult;
    }
    set courseId(courseId){
        this._courseId = courseId;
    }

    // Serialize class object
    toString() {
        let classStr = `Class{ ID: ${this._classId}, Time: ${this._classTime},
        Location: ${this._classLocation}}`;
        return `${classStr}`;
    }
}

/********************************************************
 *** Class-level ("static") storage management methods ***
 *********************************************************/
/**
 *  Conversion between a Book object and a corresponding Firestore document
 */
Class.converter = {
    toFirestore: function (cClass) {
        const data = {
            classId: cClass.classId,
            classTime: cClass.classTime,
            classLocation: cClass.classLocation,
            courseId: cClass.courseId
        };
        return data;
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data( options);
        return new Class( data);
    },
};
/**
 *  Create a new class
 */
Class.add = async function (slots){
    let cClass = null;
    try {
        cClass = new Class(slots);
        // invoke asynchronous ID/uniqueness check
        let validationResult = await Class.checkClassIdAsId( cClass.classId);
        if (!validationResult instanceof NoConstraintViolation) {
            throw validationResult;
        }
    } catch (e) {
        console.error(`${e.constructor.name}: ${e.message}`);
        cClass = null;
    }
    if (cClass) {
        try {
            const classDocRef = db.collection("classes").doc( cClass.classId.toString());
            await classDocRef.withConverter( Class.converter).set( cClass);
            console.log(`Class record "${cClass.classId}" created!`);
        } catch (e) {
            console.error(`Error when adding class record: ${e}`);
        }
    }
}

/**
 *  Delete a class
 */
Class.destroy = async function (classId){
    try{
        await db.collection("classes").doc(classId.toString()).delete();
        console.log(`Class record "${classId}" deleted!`);
    } catch(e){
        console.log("Error deleting class with id " + classId + ": " + e);
    }
}

/**
 *  Update a class
 */
Class.update = async function (slots) {
    const updatedSlots = {};
    let validationResult = null,
        classRec = null,
        classDocRef = null;
    try {
        // retrieve up-to-date class record
        classDocRef = db.collection("classes").doc(slots.classId.toString());
        const classDocSn = await classDocRef.withConverter(Class.converter).get();
        classRec = classDocSn.data();
    } catch (e) {
        console.error(`${e.constructor.name}: ${e.message}`);
    }
    try {
        if (classRec.classTime !== slots.classTime) {
            validationResult = Class.checkClassTime( slots.classTime);
            if (validationResult instanceof NoConstraintViolation) {
                updatedSlots.classTime = slots.classTime;
            } else {
                throw validationResult;
            }
        }
        if (classRec.classLocation !== parseInt( slots.classLocation)) {
            validationResult = Class.checkLocation( slots.classLocation);
            if (validationResult instanceof NoConstraintViolation) {
                updatedSlots.classLocation =  slots.classLocation;
            } else {
                throw validationResult;
            }
        }
    } catch (e) {
        console.error(`${e.constructor.name}: ${e.message}`);
    }
    let updatedProperties = Object.keys( updatedSlots);
    if (updatedProperties.length > 0) {
        // update class record
        await classDocRef.update( updatedSlots);
        console.log(`Property(ies) "${updatedProperties.toString()}" modified for class record "${slots.classId}"`);
    } else {
        console.log(`No property value changed for class record "${slots.classId}"!`);
    }
};

/**
 *  Load all class records
 */
Class.retrieveAll = async function (order) {
    let classCollRef = db.collection("classes");
    try {
        if (order) classCollRef = classCollRef.orderBy( order);
        const classRecords = (await classCollRef.withConverter( Class.converter)
            .get()).docs.map( d => d.data());
        console.log(`${classRecords.length} class records retrieved ${order ? "ordered by " + order : ""}`);
        return classRecords;
    } catch (e) {
        console.error(`Error retrieving class records: ${e}`);
    }
};

export default Class;
