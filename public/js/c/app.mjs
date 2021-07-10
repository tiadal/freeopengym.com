import Course from "../m/Course.mjs";
import Class from "../m/Class.mjs";

/**
 * Generate test data for testing
 */
//TODO generate data
async function generateTestData() {
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

    try{
        let classInstances = [
            {
                classId: 1,
                courseId: 1,
                classTime: ["2021-10-11", "22:00", "23:00"],
                classLocation: "Some dark alley."
            },
            {
                classId: 2,
                courseId: 2,
                classTime: ["2021-12-12", "10:00", "13:00"],
                classLocation: "Middle of the woods."
            },
            {
                classId: 3,
                courseId: 3,
                classTime: ["2021-05-29", "17:00", "17:30"],
                classLocation: "Neverland: Captain's Hook ship."
            },
            {
                classId: 4,
                courseId: 4,
                classTime: ["2021-08-08", "12:00", "13:00"],
                classLocation: "In front of saloon."
            },
        ];
        await Promise.all(classInstances.map(
            classRec => db.collection("classes").doc(classRec.classId.toString()).set(classRec)
        ));
    } catch(e){
        console.log("Error: " + e);
    }
    console.log(`Testdata have been generated.`);
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

        //retrieve all class documents from Firestore
        const classRecords = await Class.retrieveAll();
        //delete all documents
        await Promise.all( classRecords.map(
            classRec => db.collection("classes").doc( classRec.classId.toString()).delete()));
        //show confirmation
        console.log(`${Object.values( classRecords).length} classes deleted`);
    }
}

export {generateTestData, clearData};
