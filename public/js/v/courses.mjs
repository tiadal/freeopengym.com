/***************************************************************
 Import classes, datatypes and utility procedures
 ***************************************************************/
import Course from "../m/Course.mjs";

/***************************************************************
 Load data
 ***************************************************************/
Course.retrieveAll();

/***************************************************************
 Set up general, use-case-independent UI elements
 ***************************************************************/
// set up back-to-menu buttons for all CRUD UIs
for (const btn of document.querySelectorAll("button.back-to-menu")) {
    btn.addEventListener("click", refreshManageDataUI);
}
// neutralize the submit event for all CRUD UIs
for (const frm of document.querySelectorAll("section > form")) {
    frm.addEventListener("submit", function (e) {
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
    .addEventListener("click", function () {

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