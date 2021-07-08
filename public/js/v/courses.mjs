/***************************************************************
 Import classes, datatypes and utility procedures
 ***************************************************************/
import Course from "../m/Course.mjs";
import {fillSelectWithOptions} from "../../lib/util.mjs";

/***************************************************************
 Set up general, use-case-independent UI elements
 ***************************************************************/

// Set up Manage Course UI
refreshManageDataUI();

// set up back-to-menu buttons for all CRUD UIs
for (const btn of document.querySelectorAll("button.back-to-menu")) {
    btn.addEventListener("click", refreshManageDataUI);
}
// neutralize the submit event for all CRUD UIs
for (const frm of document.querySelectorAll("section > form")) {
    frm.addEventListener("submit", async function (e) {
        e.preventDefault();
        frm.reset();
    });
}
// save data when leaving the page
//TODO
window.addEventListener("beforeunload", Course.saveAll);

/**********************************************
 Use case Retrieve/List All Courses
 **********************************************/
document.getElementById("retrieveAndListAll")
    .addEventListener("click", async function () {
    let index = 1;
    document.getElementById("Course-M").style.display = "none";
    document.getElementById("Course-R").style.display = "block";
    const tableBodyEl = document.querySelector("section#Course-R>table>tbody");
    tableBodyEl.innerHTML = "";  // drop old content
    const courseInstances = await Course.retrieveAll();
    for (const key of Object.keys( courseInstances)) {
        const course = courseInstances[key];
        const row = tableBodyEl.insertRow();
        row.insertCell().textContent = course.courseId;
        row.insertCell().textContent = course.courseName;
        row.insertCell().textContent = course.categories;
        row.insertCell().textContent = course.price;

        document.getElementById("courseTable").rows[index].addEventListener("click", function() {
            document.getElementById("Course-M").style.display = "none";
            document.getElementById("Course-R").style.display = "none";
            document.getElementById("Course-RO").style.display = "block";
            const retrieveOneFormEl = document.querySelector("section#Course-RO > form");
            //retrieveOneFormEl.innerHTML = "";  // drop old content

            retrieveOneFormEl.courseId.value = course.courseId;
            retrieveOneFormEl.courseName.value = course.courseName;
            retrieveOneFormEl.categories.value = course.categories;
            retrieveOneFormEl.price.value = course.price;
            retrieveOneFormEl.description.value = course.description;

            const backToCourses =
                document.getElementById("back-to-courses").addEventListener("click", refreshCourses);

        });
        index++;
    }
});

/**********************************************
 Use case Create Course
 **********************************************/
const createFormEl = document.querySelector("section#Course-C > form");
document.getElementById("create").addEventListener("click",async function () {
    document.getElementById("Course-M").style.display = "none";
    document.getElementById("Course-C").style.display = "block";
    createFormEl.reset();
});

// handle Save button click events
createFormEl["commit"].addEventListener("click", async function () {
    const slots = {
        courseId: parseInt(createFormEl.courseId.value),
        courseName: createFormEl.courseName.value,
        categories: createFormEl.categories.value,
        price: createFormEl.price.value,
        description: createFormEl.description.value
    };
    await Course.add( slots);
});

/**********************************************
 Use case Update Course
 **********************************************/
const updateFormEl = document.querySelector("section#Course-U > form");
const updSelCourseEl = updateFormEl.selectCourse;
document.getElementById("update").addEventListener("click",async function () {
  const courseInstances = await Course.retrieveAll();
  updSelCourseEl.innerHTML = "";
  fillSelectWithOptions( updSelCourseEl, courseInstances,
      "courseId", {displayProp:"courseName"});
    document.getElementById("Course-M").style.display = "none";
    document.getElementById("Course-U").style.display = "block";
    updateFormEl.reset();
});

// handle change events on course select element
updSelCourseEl.addEventListener("change", await handleCourseSelectChangeEvent);

// handle Save button click events
updateFormEl["commit"].addEventListener("click", async function () {
    const slots = {
        courseId: updateFormEl.courseId.value,
        courseName: updateFormEl.courseName.value,
        categories: updateFormEl.courseCategory.value,
        price: updateFormEl.coursePrice.value,
        description: updateFormEl.courseDescription.value
    };
    await Course.update( slots);
});


/**********************************************
 * Use case Delete Course
 **********************************************/
 const deleteFormEl = document.querySelector("section#Course-D > form");
//----- set up event handler for Update button -------------------------
document.getElementById("delete").addEventListener("click", async function () {
  const delSelCourseEl = deleteFormEl.selectCourse;
  const courseInstances = await Course.retrieveAll();
  console.log(courseInstances);
    // reset selection list (drop its previous contents)
    delSelCourseEl.innerHTML = "";
    // populate the selection list
    fillSelectWithOptions( delSelCourseEl, courseInstances,
        "courseId", {displayProp:"courseName"});
    document.getElementById("Course-M").style.display = "none";
    document.getElementById("Course-D").style.display = "block";
    deleteFormEl.reset();
});
// handle Delete button click events
deleteFormEl["commit"].addEventListener("click", async function () {
    const delSelCourseEl = deleteFormEl.selectCourse;
    const courseId = delSelCourseEl.value;
    let index = delSelCourseEl.selectedIndex;
    if (!courseId) return;
    if (confirm("Do you really want to delete this course?")) {
        await Course.destroy(courseId);
        delSelCourseEl.remove(index);
    }
});

/**********************************************
 * Refresh the courses site
 **********************************************/
function refreshCourses() {
    document.getElementById("Course-M").style.display = "none";
    document.getElementById("Course-R").style.display = "block";
    document.getElementById("Course-RO").style.display = "none";
    document.getElementById("Course-C").style.display = "none";
}

/**********************************************
 * Refresh the Manage Courses Data UI
 **********************************************/
function refreshManageDataUI() {
    // show the manage course UI and hide the other UIs
    document.getElementById("Course-M").style.display = "block";
    document.getElementById("Course-R").style.display = "none";
    document.getElementById("Course-RO").style.display = "none";
    document.getElementById("Course-C").style.display = "none";
    document.getElementById("Course-U").style.display = "none";
    document.getElementById("Course-D").style.display = "none";
}

/**
 * handle course selection events
 * when a course is selected, populate the form with the data of the selected course
 */
async function handleCourseSelectChangeEvent() {
    const updateFormEl = document.querySelector("section#Course-U > form"),
        saveButton = updateFormEl.commit,
        selectUpdateAgentEl = updateFormEl.selectAgent;
    const courseInstances = await Course.retrieveAll();
    const key = (parseInt(updSelCourseEl.value) - 1).toString();
    console.log(courseInstances);
    if(key) {
        const course = courseInstances[key];
        console.log(typeof(key));
        console.log(key);
        console.log(course);
        console.log(updateFormEl);
        console.log(course.categories);
        updateFormEl.courseId.value = course.courseId;
        updateFormEl.courseName.value = course.courseName;
        updateFormEl.courseCategory.value = course.categories;
        updateFormEl.coursePrice.value = course.price;
        updateFormEl.courseDescription.value = course.description;

        saveButton.disabled = false;
    } else {
        updateFormEl.reset();
        saveButton.disabled = true;
    }
}
