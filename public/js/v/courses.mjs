/***************************************************************
 Import classes, datatypes and utility procedures
 ***************************************************************/
import Course from "../m/Course.mjs";

/***************************************************************
 Load data
 ***************************************************************/
await Course.retrieveAll();

/***************************************************************
 Set up general, use-case-independent UI elements
 ***************************************************************/
// set up back-to-menu buttons for all CRUD UIs
for (const btn of document.querySelectorAll("button.back-to-menu")) {
    btn.addEventListener("click", await refreshManageDataUI);
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
 Use case Retrieve/List All Movies
 **********************************************/
document.getElementById("retrieveAndListAll")
    .addEventListener("click", async function () {

    document.getElementById("Movie-M").style.display = "none";
    document.getElementById("Movie-R").style.display = "block";
    const tableBodyEl = document.querySelector("section#Movie-R>table>tbody");
    tableBodyEl.innerHTML = "";  // drop old content
    for (const key of Object.keys( Course.instances)) {
        const course = Course.instances[key];
        const row = tableBodyEl.insertRow();
        row.insertCell().textContent = course.courseId;
        row.insertCell().textContent = course.courseName;
        row.insertCell().textContent = course.categories;
        row.insertCell().textContent = course.price;
    }
});

/**********************************************
 Use case Create Movie
 **********************************************/
const createFormEl = document.querySelector("section#Movie-C > form");
document.getElementById("create").addEventListener("click",function () {
    document.getElementById("Movie-M").style.display = "none";
    document.getElementById("Movie-C").style.display = "block";
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
    await Course.add( slots);
});

/**********************************************
 * Refresh the Manage Movies Data UI
 **********************************************/
async function refreshManageDataUI() {
    // show the manage movie UI and hide the other UIs
    document.getElementById("Movie-M").style.display = "block";
    document.getElementById("Movie-R").style.display = "none";
    document.getElementById("Movie-C").style.display = "none";
    document.getElementById("Movie-U").style.display = "none";
    document.getElementById("Movie-D").style.display = "none";
}

// Set up Manage Movie UI
await refreshManageDataUI();