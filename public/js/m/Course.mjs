/**
 * Constructor function for the class Course
 * @constructor
 * @param {{courseId: number, courseName: string, categories: enum, description: string, price: string}}
 * slots - Object creation slots.
 */

import {isIntegerOrIntegerString, isNonEmptyString} from "../../lib/util.mjs";
import {NoConstraintViolation, MandatoryValueConstraintViolation,
    RangeConstraintViolation, PatternConstraintViolation, UniquenessConstraintViolation,
    IntervalConstraintViolation, ReferentialIntegrityConstraintViolation}
    from "../../lib/errorTypes.mjs";

const categories = {
      FOOTBALL: "Football",
      HOCKEY: "Hockey",
      YOGA: "Yoga",
      OUTDOOR: "Outdoor",
      INDOOR: "Indoor",
      RUNNING: "Running",
      TEAM: "Team",
      ESPORTS: "E-Sports",
      FRISBEE: "Frisbee"
};

class Course {
    constructor({courseId, courseName, categories, price, description, availableClasses}) {
        this.courseId = courseId;
        this.courseName = courseName;
        this.categories = categories;
        this.price = price;
        if (description){
            this.description = description;
        }

        this._availableClasses = {};
    }
    get courseId(){
        return this._courseId;
    }
    //TODO next time: check
    set courseId(courseId){
      console.log(courseId);
        const validationResult = Course.checkCourseId(courseId);
        if(validationResult instanceof NoConstraintViolation){
          this._courseId = courseId;
        } else{
          throw validationResult;
        }
    }

    static checkCourseId(courseId){
      if(!courseId){
        return new MandatoryValueConstraintViolation("A Course ID must be provided as unsigned Integer!");
      } else if(!isIntegerOrIntegerString(courseId)){
        return new RangeConstraintViolation("The course ID must be an unsigned integer");
      } else if(parseInt(courseId) < 1){ // already clear is number or string
        return new RangeConstraintViolation("The course ID must be an unsigned integer");
      } else{
        return new NoConstraintViolation();
      }
    }

    static async checkCourseIdAsId(courseId){
      let validationResult = Course.checkCourseId(courseId);
      if(validationResult instanceof NoConstraintViolation){
        let courseDoc = await db.collection("courses").doc(courseId.toString()).get();
        if(courseDoc.exists){
          validationResult = new UniquenessConstraintViolation(
            "There is already a course record with this id"
          );
        } else{
          validationResult = new NoConstraintViolation();
        }
      }
      return validationResult;
    }

    get courseName(){
        return this._courseName;
    }
    //TODO next time: check
    set courseName(courseName){
      const validationResult = Course.checkCourseName(courseName);
      if(validationResult instanceof NoConstraintViolation){
        this._courseName = courseName;
      } else{
        throw validationResult;
      }
    }

    static checkCourseName(courseName){
      if(!courseName || !isNonEmptyString(courseName)){
        return new MandatoryValueConstraintViolation("A Course name must be provided!");
      } else {
        return new NoConstraintViolation();
      }
    }

    get categories(){
        return this._categories;
    }
    //TODO next time: check
    set categories(categories){
        this._categories = [];
        if(Array.isArray(categories)){
          for(const i of categories){
            this.addCategory(i);
          }
        }
    }

    static checkCategory(category){
      if(categories[category]){
        return new NoConstraintViolation();
      } else{
        return new ReferentialIntegrityConstraintViolation("This category is not available");
      }
    }

    addCategory(category){
        const validationResult = Course.checkCategory(category);
        if(validationResult instanceof NoConstraintViolation){
            this._categories.push(category);
        } else{
          throw validationResult;
        }
    }

    removeCategory(remCategory){
      console.log(remCategory);
    }

    get price(){
        return this._price;
    }
    //TODO next time: check
    set price(price){
        const validationResult = Course.checkPrice(price);
        if(validationResult instanceof NoConstraintViolation){
          this._price = price;
      } else {
          throw validationResult;
      }
    }

    static checkPrice(price){
      if(!isIntegerOrIntegerString(price)){
        return new RangeConstraintViolation("The price must be an Integer");
      } else if(parseInt(price) < 0){
        return new RangeConstraintViolation("The price cannot be negative");
      } else {
        return new NoConstraintViolation();
      }
    }

    get description(){
        if (this._description) {
            return this._description;
        }
    }
    //TODO next time: check
    set description(description){
        // Save memory if there is an empty string as description
        if(isNonEmptyString(description)){
          this._description = description;
        }
    }
    get availableClasses(){
        return this._availableClasses;
    }
    // Serialize course object
    toString() {
        let courseStr = `Course{ ID: ${this._courseId}, Name: ${this._courseName}, Categories: ${this._categories},
    price: ${this._price}`;
        return `${courseStr}`;
    }
}

/********************************************************
 *** Class-level ("static") storage management methods ***
 *********************************************************/
 /**
  *  Conversion between a Book object and a corresponding Firestore document
  */
Course.converter = {
  toFirestore: function (cCourse) {
    const data = {
      courseId: cCourse.classId,
      courseName: cCourse.courseName,
      categories: cCourse.categories,
      description: cCourse.description
    };
    return data;
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data( options);
    return new Course( data);
  },
};

Course.convert = function(course){
  let slots = {
    courseId: course.courseId,
    courseName: course.courseName,
    categories: course.categories,
    price: course.price
  }
  if(course.description){
    slots.description = course.description;
  }

  return slots
}

/**
 *  Create a new course
 */
Course.add = async function (slots){
    const courseCollRef = db.collection("courses"),
          courseDocRef = courseCollRef.doc( slots.courseId.toString());
    try {
      console.log(slots);
        let c = new Course(slots);
        let validationResult = await Course.checkCourseIdAsId(c.courseId);
        if(validationResult instanceof NoConstraintViolation){
          await courseDocRef.set(Course.convert(c));
        } else {
          throw validationResult;
        }
    } catch (e) {
        console.error(`Error when adding course record: ${e.message}`);
        return;
    }
    console.log(`Course record ${slots.courseId} created`);
}
/**
 *  Delete a course
 */
Course.destroy = async function (courseId){
  try{
    await db.collection("courses").doc(courseId).delete();
  } catch(e){
    console.log("Error deleting course with id " + courseId + ": " + e);
  }
}

/**
 *  Update a course
 */

 Course.update = async function({courseId, courseName, addedCategories, removedCategories, price, description}){
   const courseCollRef = db.collection("courses"),
         courseDocRef = courseCollRef.doc( courseId);
   try {
     // Merge existing data with updated data
     const courseDocSn = await courseDocRef.withConverter(Course.converter).get();
     const courseData = courseDocSn.data();

     let categoryList = courseData.categories;
     for(const i of addedCategories){
       if(!categoryList.includes(i)){
         categoryList.push(i);
       }
     }

     for(const i of removedCategories){
       const index = categoryList.findIndex(element => i === element);
       console.log("index: " + index);

       if(index > -1){
         categoryList.splice(index, 1);
       }
     }
     let course = new Course({courseId, courseName, categoryList, price, description});
     console.log("hier");
     console.log(categoryList);
     console.log(courseData);

      //await courseDocRef.set({courseId, courseName, categories, price, description}, {merge: true});
      await courseDocRef.set({courseId: course.courseId, courseName: course.courseName, categories:categoryList, price: course.price, description: course.description}, {merge: true});
  } catch (e) {
    console.error(`Error when updating course record: ${e.message}`);
    return;
  }
  console.log(`Course record ${courseId} updated`);
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
    const courseDocs = coursesQuerySnapshot.docs,
          courseRecords = courseDocs.map( d => d.data());
    console.log(`${courseRecords.length} course records retrieved.`);
    return courseRecords;
}

//export default Course;
export {Course, categories};
