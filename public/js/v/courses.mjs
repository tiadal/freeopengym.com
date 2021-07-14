/***************************************************************
 Import classes, datatypes and utility procedures
 ***************************************************************/
import {Course, categories} from "../m/Course.mjs";
import {fillSelectWithOptions, fillSelectWithEnum, createMultipleChoiceWidgetWithEnum} from "../../lib/util.mjs";

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
        let categoryList = [];
        for(const i of course.categories){
          categoryList.push(categories[i]);
        }

        row.insertCell().textContent = course.courseId;
        row.insertCell().textContent = course.courseName;
        row.insertCell().textContent = categoryList;
        row.insertCell().textContent = course.price;

        document.getElementById("courseTable").rows[index].addEventListener("click", function() {
            document.getElementById("Course-M").style.display = "none";
            document.getElementById("Course-R").style.display = "none";
            document.getElementById("Course-RO").style.display = "block";
            const retrieveOneFormEl = document.querySelector("section#Course-RO > form");
            //retrieveOneFormEl.innerHTML = "";  // drop old content

            retrieveOneFormEl.courseId.value = course.courseId;
            retrieveOneFormEl.courseName.value = course.courseName;
            retrieveOneFormEl.categories.value = categoryList;//course.categories;
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
const selectCategoriesEl = createFormEl.selectCategories;
document.getElementById("create").addEventListener("click",async function () {
    document.getElementById("Course-M").style.display = "none";
    document.getElementById("Course-C").style.display = "block";
    fillSelectWithEnum( selectCategoriesEl, categories);
    createFormEl.reset();
});

createFormEl.courseId.addEventListener("input", async function() {
  createFormEl.courseId.setCustomValidity(
      (await Course.checkCourseIdAsId( createFormEl.courseId.value)).message
  );
});

createFormEl.courseName.addEventListener("input", function () {
  createFormEl.courseName.setCustomValidity(
      Course.checkCourseName( createFormEl.courseName.value).message);
});

createFormEl.price.addEventListener("input", function () {
  createFormEl.price.setCustomValidity(
      Course.checkPrice( createFormEl.price.value).message);
});

// handle Save button click events
createFormEl["commit"].addEventListener("click", async function () {
    const selOptionsEl = selectCategoriesEl.selectedOptions;
    let selCategories = [];
    for(const i of selOptionsEl){
      selCategories.push(i.value);
    }

    const slots = {
        courseId: parseInt(createFormEl.courseId.value),
        courseName: createFormEl.courseName.value,
        categories: selCategories,
        price: createFormEl.price.value,
        description: createFormEl.description.value
    };

    createFormEl.courseName.setCustomValidity(Course.checkCourseName( slots.courseName).message);

    createFormEl.price.setCustomValidity(Course.checkPrice( slots.price).message);

    createFormEl.courseId.setCustomValidity((await Course.checkCourseIdAsId( slots.courseId)).message);

    if(createFormEl.checkValidity()){
      await Course.add( slots);
      createFormEl.reset();
    }
});

/**********************************************
 Use case Update Course
 **********************************************/
const updateFormEl = document.querySelector("section#Course-U > form");
const updSelCategoriesEl = updateFormEl.selectCategories;
const updSelCourseEl = updateFormEl.selectCourse;
document.getElementById("update").addEventListener("click",async function () {
  const courseInstances = await Course.retrieveAll();
  updSelCourseEl.innerHTML = "";
  //fillSelectWithEnum( updSelCategoriesEl, categories);
  fillSelectWithOptions( updSelCourseEl, courseInstances,
      "courseId", {displayProp:"courseName"});
    document.getElementById("Course-M").style.display = "none";
    document.getElementById("Course-U").style.display = "block";
    updateFormEl.reset();
});

// handle change events on course select element
updSelCourseEl.addEventListener("change", await handleCourseSelectChangeEvent);

updateFormEl.courseId.addEventListener("input", function () {
  updateFormEl.courseId.setCustomValidity(
      Course.checkCourseId( updateFormEl.courseId.value).message);
});

updateFormEl.courseName.addEventListener("input", function () {
  updateFormEl.courseName.setCustomValidity(
      Course.checkCourseName( updateFormEl.courseName.value).message);
});

updateFormEl.coursePrice.addEventListener("input", function () {
  updateFormEl.coursePrice.setCustomValidity(
      Course.checkPrice( updateFormEl.coursePrice.value).message);
});

// handle Save button click events
updateFormEl["commit"].addEventListener("click", async function () {
  const categoriesToAdd = [], categoriesToRemove = [];
  const updSelCategoriesEl = updateFormEl.querySelector(".MultiChoiceWidget");
  const multiChoiceListEl = updSelCategoriesEl.firstElementChild;

  for (const mcListItemEl of multiChoiceListEl.children) {
    if (mcListItemEl.classList.contains("removed")) {
      categoriesToRemove.push( mcListItemEl.getAttribute("data-value"));
    }
    if (mcListItemEl.classList.contains("added")) {
      categoriesToAdd.push( mcListItemEl.getAttribute("data-value"));
    }
  }

    const slots = {
        courseId: updateFormEl.courseId.value,
        courseName: updateFormEl.courseName.value,
        addedCategories: categoriesToAdd,
        removedCategories: categoriesToRemove,
        price: updateFormEl.coursePrice.value,
        description: updateFormEl.courseDescription.value
    };

    updateFormEl.courseName.setCustomValidity(Course.checkCourseName( updateFormEl.courseName.value).message);
    updateFormEl.coursePrice.setCustomValidity(Course.checkPrice( updateFormEl.coursePrice.value).message);

    if(updateFormEl.checkValidity()){
      await Course.update( slots);
    }
});


/**********************************************
 * Use case Delete Course
 **********************************************/
 const deleteFormEl = document.querySelector("section#Course-D > form");
//----- set up event handler for Update button -------------------------
document.getElementById("delete").addEventListener("click", async function () {
  const delSelCourseEl = deleteFormEl.selectCourse;
  const courseInstances = await Course.retrieveAll();
    // reset selection list (drop its previous contents)
    delSelCourseEl.innerHTML = "";
    // populate the selection list
    fillSelectWithOptions( delSelCourseEl, courseInstances,
        "courseId", {displayProp:"courseName"});

    createMultipleChoiceWidgetWithEnum( selectCategoriesWidget, [],
        []);
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
        selectUpdateAgentEl = updateFormEl.selectAgent,
        selectUpdateCategoriesEl = updateFormEl.selectCategoriesWidget;
    const courseInstances = await Course.retrieveAll();
    const key = (parseInt(updSelCourseEl.value) - 1).toString();
    if(key) {
        const course = courseInstances[key];
        updateFormEl.courseId.value = course.courseId;
        updateFormEl.courseName.value = course.courseName;
        updateFormEl.coursePrice.value = course.price;
        updateFormEl.courseDescription.value = course.description;

        createMultipleChoiceWidgetWithEnum( selectCategoriesWidget, course.categories,
            categories);

        saveButton.disabled = false;
    } else {
        updateFormEl.reset();
        saveButton.disabled = true;
    }
}
