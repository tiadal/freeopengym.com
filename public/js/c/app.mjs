import Course from "../m/Course.mjs";

/**
 * Generate test data for testing
 */
//TODO generate data
async function generateTestData() {
    console.log(`Generating Testdata...`);
    try{
      let courseInstances = [
        {
          courseId: 1,
          courseName: "Yoga in black",
          categories: "Yoga",
          price: 42,
          description: "Nighttime yoga course"
        },
        {
          courseId: 2,
          courseName: "Red Socks football",
          categories: "Football",
          price: 0,
          description: "Amateur football"
        },
        {
          courseId: 3,
          courseName: "Frisbee fun",
          categories: "Frisbee",
          price: 42,
          description: ""
        },
        {
          courseId: 4,
          courseName: "Mythic gamers",
          categories: "E-Sports",
          price: 0,
          description: "Searching for a partner for League of Legends duo queue. At least silver 5."
        },
      ];

      await Promise.all(courseInstances.map(
        courseRec => db.collection("courses").doc(courseRec.courseId.toString()).set(courseRec)
      ));
    } catch(e){
      console.log("Error: " + e);
    }

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
    }
}

export {generateTestData, clearData};
