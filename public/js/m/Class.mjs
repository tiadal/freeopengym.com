/**
* Constructor function for the class Class
* @constructor
* @param {{classId: number, courseId: number, classTime: Time, classLocation: string}}
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
    set classId(classId){
        this._classId = classId;
    }
    get classTime(){
        return this._classTime;
    }
    set classTime(classTime){
        this._classTime = classTime;
    }
    get classLocation(){
        return this._classLocation;
    }
    set classLocation(location) {
        this._classLocation = location;
    }
    get courseId(){
        return this._courseId;
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
    console.log(slots);
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
    console.log(classDocRef);
    console.log(classId);
    console.log(courseId);
    console.log(classTime);
    console.log(classLocation);
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