/***************************************************************
 Import classes, datatypes and utility procedures
 ***************************************************************/
import Class from "../m/Class.mjs";
import {fillSelectWithOptions} from "../../lib/util.mjs";

/***************************************************************
 Set up general, use-case-independent UI elements
 ***************************************************************/

// Set up Manage Class UI
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


/**********************************************
 Use case Retrieve/List All Classes
 **********************************************/
document.getElementById("retrieveAndListAll")
    .addEventListener("click", async function () {
        document.getElementById("Class-M").style.display = "none";
        document.getElementById("Class-R").style.display = "block";
        const tableBodyEl = document.querySelector("section#Class-R>table>tbody");
        tableBodyEl.innerHTML = "";  // drop old content
        const classInstances = await Class.retrieveAll();
        for (const key of Object.keys( classInstances)) {
            const cClass = classInstances[key];
            const row = tableBodyEl.insertRow();
            row.insertCell().textContent = cClass.classId;
            row.insertCell().textContent = cClass.classTime;
            row.insertCell().textContent = cClass.classLocation;
        }
    });

/**********************************************
 Use case Create Class
 **********************************************/
const createFormEl = document.querySelector("section#Class-C > form");
document.getElementById("create").addEventListener("click",async function () {
    document.getElementById("Class-M").style.display = "none";
    document.getElementById("Class-C").style.display = "block";
    createFormEl.reset();
});

// handle Save button click events
createFormEl["commit"].addEventListener("click", async function () {
    const slots = {
        classId: parseInt(createFormEl.classId.value),
        classTime: createFormEl.classTime.value,
        classLocation: createFormEl.classLocation.value
    };
    await Class.add( slots);
});

/**********************************************
 Use case Update Class
 **********************************************/
const updateFormEl = document.querySelector("section#Class-U > form");
const updSelClassEl = updateFormEl.selectClass;
document.getElementById("update").addEventListener("click",async function () {
    const classInstances = await Class.retrieveAll();
    updSelClassEl.innerHTML = "";
    fillSelectWithOptions( updSelClassEl, classInstances,
        "classId", {displayProp:"classTime"});
    document.getElementById("Class-M").style.display = "none";
    document.getElementById("Class-U").style.display = "block";
    updateFormEl.reset();
});

// handle change events on class select element
updSelClassEl.addEventListener("change", await handleClassSelectChangeEvent);

// handle Save button click events
updateFormEl["commit"].addEventListener("click", async function () {
    const slots = {
        classId: updateFormEl.classId.value,
        classTime: updateFormEl.classTime.value,
        classLocation: updateFormEl.classLocation.value
    };
    await Class.update( slots);
});


/**********************************************
 * Use case Delete Class
 **********************************************/
const deleteFormEl = document.querySelector("section#Class-D > form");
//----- set up event handler for Update button -------------------------
document.getElementById("delete").addEventListener("click", async function () {
    const delSelClassEl = deleteFormEl.selectClass;
    const classInstances = await Class.retrieveAll();
    console.log(classInstances);
    // reset selection list (drop its previous contents)
    delSelClassEl.innerHTML = "";
    // populate the selection list
    fillSelectWithOptions( delSelClassEl, classInstances,
        "classId", {displayProp:"classTime"});
    document.getElementById("Class-M").style.display = "none";
    document.getElementById("Class-D").style.display = "block";
    deleteFormEl.reset();
});
// handle Delete button click events
deleteFormEl["commit"].addEventListener("click", async function () {
    const delSelClassEl = deleteFormEl.selectClass;
    const classId = delSelClassEl.value;
    let index = delSelClassEl.selectedIndex;
    if (!classId) return;
    if (confirm("Do you really want to delete this class?")) {
        await Class.destroy(classId);
        delSelClassEl.remove(index);
    }
});


/**********************************************
 * Refresh the class site
 **********************************************/
function refreshClasses() {
    document.getElementById("Class-M").style.display = "none";
    document.getElementById("Class-R").style.display = "block";
    document.getElementById("Class-RO").style.display = "none";
    document.getElementById("Class-C").style.display = "none";
}

/**********************************************
 * Refresh the Manage Class Data UI
 **********************************************/
function refreshManageDataUI() {
    // show the manage class UI and hide the other UIs
    document.getElementById("Class-M").style.display = "block";
    document.getElementById("Class-R").style.display = "none";
    document.getElementById("Class-C").style.display = "none";
    document.getElementById("Class-U").style.display = "none";
    document.getElementById("Class-D").style.display = "none";
}


/**
 * handle class selection events
 * when a class is selected, populate the form with the data of the selected class
 */
async function handleClassSelectChangeEvent() {
    const updateFormEl = document.querySelector("section#Class-U > form"),
        saveButton = updateFormEl.commit,
        selectUpdateAgentEl = updateFormEl.selectAgent;
    const classInstances = await Class.retrieveAll();
    const key = (parseInt(updSelClassEl.value) - 1).toString();
    console.log(classInstances);
    if(key) {
        const cClass = classInstances[key];
        console.log(typeof(key));
        console.log(key);
        console.log(cClass);
        console.log(updateFormEl);
        console.log(cClass.categories);
        updateFormEl.classId.value = cClass.classId;
        updateFormEl.classTime.value = cClass.classTime;
        updateFormEl.classLocation.value = cClass.classLocation;

        saveButton.disabled = false;
    } else {
        updateFormEl.reset();
        saveButton.disabled = true;
    }
}