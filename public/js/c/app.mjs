import {Course} from "../m/Course.mjs";
import Class from "../m/Class.mjs";
import {User} from "../m/User.mjs";

/**
 * Generate test data for testing
 */
//TODO generate data
async function generateTestData() {
    try{
        console.log('Generating course data...');
        const response = await fetch("../../test-data/courses.json");
        const courseRecords = await response.json();
        await Promise.all( courseRecords.map( d => Course.add( d)));
        console.log(`${courseRecords.length} courses saved`);
    } catch(e){
        console.log("Error: " + e);
    }

    try{
        console.log('Generating class data...');
        const response = await fetch("../../test-data/classes.json");
        const classRecords = await response.json();
        await Promise.all( classRecords.map( d => Class.add( d)));
        console.log(`${classRecords.length} classes saved`);
    } catch(e){
        console.log("Error: " + e);
    }

    try{
        console.log('Generating class data...');
        const response = await fetch("../../test-data/users.json");
        const userRecords = await response.json();
        await Promise.all( userRecords.map( d => User.add( d)));
        console.log(`${userRecords.length} users saved`);
    } catch(e){
        console.log("Error: " + e);
    }
    console.log(`Test data have been generated.`);
}

/**
 * Clear data
 */
async function clearData() {
    if (confirm( "Do you really want to delete the entire database?")) {
        //retrieve all course documents from Firestore
        const courseRecords = await Course.retrieveAll();
        //delete all documents
        await Promise.all( courseRecords.map(
            courseRec => db.collection("courses").doc( courseRec.courseId.toString()).delete()));
        //show confirmation
        console.log(`${Object.values( courseRecords).length} courses deleted`);

        let classCollRef = db.collection("classes");
        let userCollRef = db.collection("users");
        try {
            const classDocSns = (await classCollRef.withConverter( Class.converter)
                .get()).docs;
            await Promise.all( classDocSns.map( c => Class.destroy( c.id)));
            console.log(`${classDocSns.length} classes deleted.`);

            const userDocSns = (await userCollRef.withConverter( User.converter).get()).docs;
            await Promise.all(userDocSns.map(u => User.destroy(u.id)));
            console.log(`${userDocSns.length} users deleted.`);
        } catch (e) {
            console.error(`${e.constructor.name}: ${e.message}`);
        }
    }
}

export {generateTestData, clearData};
