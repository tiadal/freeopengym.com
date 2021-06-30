/***************************************************************
 Import classes, datatypes and utility procedures
 ***************************************************************/
import Course from "../m/Course.mjs";
import {fillSelectWithOptions} from "../../lib/util.mjs";

/***************************************************************
 Load data
 ***************************************************************/
//await Course.retrieveAll();

/***************************************************************
 Set up general, use-case-independent UI elements
 ***************************************************************/
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

    document.getElementById("Course-M").style.display = "none";
    document.getElementById("Course-R").style.display = "block";
    const tableBodyEl = document.querySelector("section#Course-R>table>tbody");
    tableBodyEl.innerHTML = "";  // drop old content
    const courseInstances = await Course.retrieveAll();
    console.log(courseInstances);
    for (const key of Object.keys( courseInstances)) {
        const course = courseInstances[key];
        const row = tableBodyEl.insertRow();
        row.insertCell().textContent = course.courseId;
        row.insertCell().textContent = course.courseName;
        row.insertCell().textContent = course.categories;
        row.insertCell().textContent = course.price;

        document.querySelectorAll('#courseTable td')
            .forEach(e => e.addEventListener("click", function() {
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

            }));
    }
});

/**********************************************
 Show Details of a chosen Course
 **********************************************/
document.getElementById("retrieveOne")
    .addEventListener("click", async function () {
    let courseId = 1;

    document.getElementById("Course-M").style.display = "none";
    document.getElementById("Course-R").style.display = "none";
    document.getElementById("Course-RO").style.display = "block";
    const retrieveOneFormEl = document.querySelector("section#Course-RO > form");
    //retrieveOneFormEl.innerHTML = "";  // drop old content

    const courseInstances = await Course.retrieveAll();
    console.log(courseInstances);
    console.log(courseId);
    const course = courseInstances[courseId];
    console.log(course);

    retrieveOneFormEl.courseId.value = course.courseId;
    retrieveOneFormEl.courseName.value = course.courseName;
    retrieveOneFormEl.categories.value = course.categories;
    retrieveOneFormEl.price.value = course.price;
    retrieveOneFormEl.description.value = course.description;

    const backToCourses =
        document.getElementById("back-to-courses").addEventListener("click", refreshCourses);

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
        courseId: createFormEl.courseId.value,
        courseName: createFormEl.courseName.value,
        categories: createFormEl.categories.value,
        price: createFormEl.price.value,
        description: createFormEl.description.value
    };
    //await Course.add( slots);
});

/**********************************************
 Use case Update Course
 **********************************************/
const updateFormEl = document.querySelector("section#Course-U > form");
console.log(document);
document.getElementById("update").addEventListener("click",async function () {
    document.getElementById("Course-M").style.display = "none";
    document.getElementById("Course-U").style.display = "block";
    updateFormEl.reset();
});

// handle Save button click events
updateFormEl["commit"].addEventListener("click", async function () {
    const slots = {
        courseId: updateFormEl.courseId.value,
        courseName: updateFormEl.courseName.value,
        categories: updateFormEl.courseCategory.value,
        price: updateFormEl.coursePrice.value,
        description: updateFormEl.courseDescription.value
    };
    await Course.add( slots);
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
//    document.getElementById("Course-D").style.display = "none";
}

// Set up Manage Course UI
refreshManageDataUI();
