/**
 * Constructor function for the class Movie
 * @constructor
 * @param {{courseId: number, courseName: string, categories: enum, description: string, price: string}}
 * slots - Object creation slots.
 */

class Course {
    constructor({courseId, courseName, categories, price, description}) {
        this.courseId = courseId;
        this.courseName = courseName;
        this.categories = categories;
        this.price = price;
        if (description){
            this.description = description;
        }
    }
    get courseId(){
        return this._courseId;
    }
    //TODO next time: check
    set courseId(courseId){
        this._courseId = courseId;
    }
    get courseName(){
        return this._courseName;
    }
    //TODO next time: check
    set courseName(courseName){
        this._courseName = courseName;
    }
    get categories(){
        return this._categories;
    }
    //TODO next time: check
    set categories(categories){
        this._categories = categories;
    }
    get price(){
        return this._price;
    }
    //TODO next time: check
    set price(price){
        this._price = price;
    }
    get description(){
        if (this._description) {
            return this._description;
        }
    }
    //TODO next time: check
    set description(description){
        this._description = description;
    }
    // Serialize course object
    toString() {
        let courseStr = `Course{ ID: ${this._courseId}, Name: ${this._courseName}, Categories: ${this._categories},
    price: ${this._price}`;
        return `${courseStr}`;
    }
}

/***********************************************
 *** Class-level ("static") properties **********
 ************************************************/
// initially an empty collection (in the form of a map)
Course.instances = {};

/********************************************************
 *** Class-level ("static") storage management methods ***
 *********************************************************/
/**
 *  Create a new course
 */
Course.add = async function (slots){
    const courseCollRef = db.collection("courses"),
          courseDocRef = courseCollRef.doc( slots.courseId);
    try {
        await courseDocRef.set (slots);
    } catch (e) {
        console.error(`Error when adding course record: ${e}`);
        return;
    }
    console.log(`Course record ${slots.courseId} created`);
}
/**
 *  Delete a course
 */

/**
 *  Update a course
 */

/**
 *  Retrieve a concrete course
 */
Course.retrieve = async function (courseId){
    const courseCollRef = db.collection("courses"),
          courseDocRef = courseCollRef.doc( courseId);
    let courseDocSnapshot = null;
    try {
        courseDocSnapshot = await courseDocRef.get();
    } catch (e) {
        console.error(`Error when retrieving a course record with id ${courseId}: ${e}`)
        return null;
    }
    const courseRecord = courseDocSnapshot.data();
    return courseRecord;
}

/**
 *  Retrieve and list all courses
 */
Course.retrieveAll = async function(){
    const coursesCollRef = db.collection("courses");
    let coursesQuerySnapshot = null;
    try {
        coursesQuerySnapshot = await coursesCollRef.get();
    } catch (e) {
        console.error(`Error when retrieving course record ${e}`)
        return null;
    }
    const courseDocs = coursesQuerySnapshot,
          courseRecords = courseDocs.map( d => d.data());
    console.log(`${courseRecords.length} course records retrieved.`);
    return courseRecords;
}

export default Course;