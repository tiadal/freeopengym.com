/***************************************************************
 Import classes, datatypes and utility procedures
 ***************************************************************/
import Class from "../m/Class.mjs";
import Time from "../m/Time.mjs";
import {fillSelectWithOptions, showProgressBar} from "../../lib/util.mjs";

/***************************************************************
 Set up general, use-case-independent UI elements
 ***************************************************************/

//TODO: user should not be able to input id -- at best let it be automatic

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
        const selectOrderEl = document.querySelector("section#Class-R>div>div>label>select");

        await renderList("classId");
        selectOrderEl.addEventListener("change", async function (e) {
            // invoke list with order selected
            await renderList( e.target.value);
        });
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

createFormEl.classId.addEventListener("input", function(){
    createFormEl.classId.setCustomValidity( Class.checkClassId( createFormEl.classId.value).message);
});
createFormEl.endTime.addEventListener("input",function(){
    createFormEl.endTime.setCustomValidity( Time.checkTimes( createFormEl.startTime.value, createFormEl.endTime.value).message);
});
createFormEl.classLocation.addEventListener("input", function(){
    createFormEl.classLocation.setCustomValidity( Class.checkLocation( createFormEl.classLocation.value).message);
});
// handle Save button click events
createFormEl["commit"].addEventListener("click", async function () {
    let time = new Time({
        classDate: createFormEl.classDate.value,
        startTime: createFormEl.startTime.value,
        endTime: createFormEl.endTime.value
    });
    const timeValues = Object.values(time);
    const slots = {
        classId: parseInt(createFormEl.classId.value),
        classTime: timeValues,
        classLocation: createFormEl.classLocation.value
    };
    showProgressBar( "show");
    createFormEl.classId.setCustomValidity(( await Class.checkClassIdAsId( slots.classId)).message);
    createFormEl.classDate.setCustomValidity( Time.checkClassDate( slots.classTime[0]).message);
    createFormEl.startTime.setCustomValidity( Time.checkStartTime( slots.classTime[1]).message);
    createFormEl.endTime.setCustomValidity( Time.checkEndTime( slots.classTime[2]).message);
    createFormEl.classLocation.setCustomValidity( Class.checkLocation( slots.classLocation).message);
    createFormEl.classLocation.setCustomValidity( Class.checkLocation( createFormEl.classLocation.value).message);

    if (createFormEl.checkValidity()) {
        await Class.add( slots);
        createFormEl.reset();
    }
    showProgressBar( "hide");
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
    let time = new Time({
        classDate: document.getElementById("updateDate").value,
        startTime: document.getElementById("updateSTime").value,
        endTime: document.getElementById("updateETime").value
    });
    const timeValues = Object.values(time);
    console.log(timeValues);
    const slots = {
        classId: updateFormEl.classId.value,
        classTime: timeValues,
        classLocation: updateFormEl.classLocation.value
    };
    updateFormEl.classDate.setCustomValidity( Time.checkClassDate( slots.classDate).message);
    updateFormEl.startTime.setCustomValidity( Time.checkStartTime( slots.startTime).message);
    updateFormEl.endTime.setCustomValidity( Time.checkEndTime( slots.endTime).message);
    updateFormEl.classLocation.setCustomValidity( Class.checkLocation( slots.classLocation).message);
    if (updateFormEl.checkValidity()) {
        await Class.update(slots);
        // update the selection list option
        updSelClassEl.options[updSelClassEl.selectedIndex].text = slots.classTime;
        await updateFormEl.reset();
    }
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
    if(key) {
        const cClass = classInstances[key];
        let timeArray = cClass.classTime;
        updateFormEl.classId.value = cClass.classId;
        document.getElementById("updateDate").value = timeArray[0];
        document.getElementById("updateSTime").value = timeArray[1];
        document.getElementById("updateETime").value = timeArray[2];
        updateFormEl.classLocation.value = cClass.classLocation;

        saveButton.disabled = false;
    } else {
        updateFormEl.reset();
        saveButton.disabled = true;
    }
}

async function renderList( order) {
    const tableBodyEl = document.querySelector("section#Class-R>div>table>tbody");
    tableBodyEl.innerHTML = "";  // drop old content

    showProgressBar( "show");
    // load all book records using order param
    const classRecords = await Class.retrieveAll( order);
    // for each book, create a table row with a cell for each attribute
    for (let c of classRecords) {
        let timeArray = c.classTime;
        let timesStr = `${timeArray[0]}: ${timeArray[1]}-${timeArray[2]}`;

        let row = tableBodyEl.insertRow();
        row.insertCell(-1).textContent = c.classId;
        row.insertCell(-1).textContent = timesStr;
        row.insertCell(-1).textContent = c.classLocation;
    }
    showProgressBar( "hide");
}