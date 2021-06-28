import Course from "../m/Course.mjs";

/**
 * Generate test data for testing
 */
//TODO generate data
function generateTestData() {
    console.log(`Nice try, but there's no test to be generated.`);
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
            courseRec => db.collection("courses").doc( courseRec.courseId).delete()));
        //show confirmation
        console.log(`${Object.values( courseRecords).length} courses deleted`);
    }
}

export {generateTestData, clearData};