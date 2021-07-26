import {createChoiceWidget} from "../../lib/util.mjs";

const formEl = document.forms["User"];
const usertypeEl = formEl.querySelector("fieldset[data-bind='type']");

createChoiceWidget( usertypeEl, "type", [],
    "radio", ["Teacher", "User"], false);
