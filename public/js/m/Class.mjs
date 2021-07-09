/**
* Constructor function for the class Class
* @constructor
* @param {{classId: number, classTime: Time, classLocation: string}}
* slots - Object creation slots.
*/
import {isIntegerOrIntegerString, isNonEmptyString} from "../../lib/util.mjs";
import {NoConstraintViolation, MandatoryValueConstraintViolation,
    RangeConstraintViolation, PatternConstraintViolation, UniquenessConstraintViolation,
    IntervalConstraintViolation, ReferentialIntegrityConstraintViolation}
    from "../../lib/errorTypes.mjs";
import Time from "./Time.mjs";

class Class {
    constructor({classId, courseId, classTime, classLocation}) {
        this.classId = classId;
        this.courseId = courseId;
        this.classTime = classTime;
        this.classLocation = classLocation;
    }
    get classId(){
        return this._classId;
    }
    static checkClassId( classId) {
        // Check if Number
        if(!isIntegerOrIntegerString(classId)){
            return new RangeConstraintViolation("The classID must be an unsigned integer!");
        } else{
            return new NoConstraintViolation();
        }
    }
    static checkClassIdAsId( classId) {
        let validationResult = Class.checkClassId( classId);
        if ((validationResult instanceof NoConstraintViolation)) {
            if (!classId) {
                // Is there input
                validationResult = new MandatoryValueConstraintViolation(
                    "A value for the ClassID must be provided!");
            }
            //TODO: Uniqueness
            /*
            else if (Class.instances[classId]) {
                // id already taken
                validationResult = new UniquenessConstraintViolation(
                    `There is already a class record with ClassID ${classId}`);
            }*/ else if(classId < 1){
                // Non positive integer
                validationResult = new RangeConstraintViolation("The ClassID must be a positive integer!");
            } else {
                // fine
                validationResult = new NoConstraintViolation();
            }
        }
        return validationResult;
    }
    set classId(classId){
        const validationResult = Class.checkClassIdAsId( classId);
        if (validationResult instanceof NoConstraintViolation) {
            this._classId = classId;
        } else {
            throw validationResult;
        }
    }
    get classTime(){
        return this._classTime;
    }
    static checkTime(time){
        if(!time){
            return new MandatoryValueConstraintViolation("A time must be provided!");
        } if(time instanceof Time){
            return new RangeConstraintViolation("The time must be of type Time!");
        }else{
            // Fine
            return new NoConstraintViolation();
        }
    }
    set classTime(classTime){
        this._classTime = classTime;
    }
    get classLocation(){
        return this._classLocation;
    }
    static checkClassLocation( classLocation) {
        if(!classLocation){
            // Is there a classLocation?
            return new MandatoryValueConstraintViolation("A location must be provided!");
        } else if(!isNonEmptyString( classLocation)){
            // Location empty
            return new RangeConstraintViolation("The location must be a non-empty String!");
        } else{
            // Fine
            return new NoConstraintViolation();
        }
    }
    set classLocation(location){
        const validationResult = Class.checkClassLocation( location);
        if (validationResult instanceof NoConstraintViolation) {
            this._classLocation = location;
        } else {
            throw validationResult;
        }

    }

    get courseId(){
        return this._courseId;
    }
    static checkCourseId(courseId){
        if(!courseId){
            // is given
            return new MandatoryValueConstraintViolation("Every class must belong to some course!");
        } else if(typeof(courseId) === "object"){
            /*
            if(){
                // Course does not exist
                return new ReferentialIntegrityConstraintViolation("There is no Course with ID " + courseId);
            } else{
                return new NoConstraintViolation();
            }*/
        } else if(typeof(courseId) === "number"){
            /*if(){
                // Course does not exist
                return new ReferentialIntegrityConstraintViolation("There is no such a course");
            } else{
                return new NoConstraintViolation();
            }*/
        }
    }
    set courseId(courseID){
        this._courseId = courseID;
    }

    // Serialize class object
    toString() {
        let classStr = `Class{ ID: ${this._classId}, Course:${this._courseId.courseName}, Time: ${this._classTime}, 
        Location: ${this._classLocation}}`;
        return `${classStr}`;
    }
}

/********************************************************
 *** Class-level ("static") storage management methods ***
 *********************************************************/

/**
 *  Create a new class
 */
Class.add = async function (slots){
    const classCollRef = db.collection("classes"),
        classDocRef = classCollRef.doc( slots.classId.toString());
    try {
        await classDocRef.set(slots);
    } catch (e) {
        console.error(`Error when adding class record: ${e}`);
        return;
    }
    console.log(`Class record ${slots.classId} created`);
}

/**
 *  Delete a class
 */
Class.destroy = async function (classId){
    try{
        await db.collection("classes").doc(classId);
        /*const classCollRef = db.collection("classes");
        let classQuerySnapshot = await classCollRef.get();
        const classDocs = classQuerySnapshot.docs;
        const classRecords = classDocs.map( d => d.data());

        console.log(classCollRef);
        console.log(classQuerySnapshot);
        console.log(classDocs);
        console.log(classRecords);
        console.log(classRecords[classId-1]);

        for(const classIdx in classRecords){
            let cClass = classRecords[classIdx];
            if(cClass.classId === parseInt(classId)) {
                console.log("And the class is:");
                console.log(cClass);
                let classRef = await db.collection("classes").doc(classId);
                console.log(classRef);

                classRef.get().then((doc) => {
                    if (doc.exists) {
                        console.log("Document data:", doc.data());
                        console.log(doc.data["classId"]);
                        console.log(doc.data["classId"])
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                }).catch((error) => {
                    console.log("Error getting document:", error);
                });
            }
        }

        db.collection("classes").where("classId", "==", parseInt(classId))
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });


        let cClass = classRecords[classId - 1];
        console.log(cClass.courseId);
        let courseId = cClass.courseId.toString();
        console.log(typeof classId);
        console.log(typeof courseId);
        console.log(courseId - 1); */
    } catch(e){
        console.log("Error deleting class with id " + classId + ": " + e);
    }
}

/**
 *  Update a class
 */
Class.update = async function({classId, courseId, classTime, classLocation}){
    const classCollRef = db.collection("classes"),
        classDocRef = classCollRef.doc( classId);
    try {
        // Merge existing data with updated data
        await classDocRef.set({classId, courseId, classTime, classLocation}, {merge: true});
    } catch (e) {
        console.error(`Error when updating class record: ${e}`);
        return;
    }
    console.log(`Class record ${classId} updated`);
}

/**
 *  Retrieve and list all classes
 */
Class.retrieveAll = async function(){
    const classCollRef = db.collection("classes");
    let classQuerySnapshot = null;
    try {
        classQuerySnapshot = await classCollRef.get();
    } catch (e) {
        console.error(`Error when retrieving class record ${e}`)
        return null;
    }
    const classDocs = classQuerySnapshot.docs,
        classRecords = classDocs.map( d => d.data());
    console.log(`${classRecords.length} class records retrieved.`);
    return classRecords;
}

export default Class;