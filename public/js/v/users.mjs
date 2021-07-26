import {createChoiceWidget, getKeyByValue} from "../../lib/util.mjs";
import {usertype} from "../m/User.mjs";

const formEl = document.forms["User"];
const usertypeEl = formEl.querySelector("fieldset[data-bind='userType']");
const signupButEl = formEl.signup;

let types = [];

for(const i in usertype){
  types.push(usertype[i]);
}

createChoiceWidget( usertypeEl, "userType", [],
    "radio", types, false);

signupButEl.addEventListener("click", function(){
  const name = formEl.userName.value;
  const email = formEl.email.value;
  const pw = formEl.password.value;
  const bio = formEl.description.value;
  const uType = getKeyByValue(usertype, types[formEl.userType.value - 1]);
  console.log(name);
  console.log(email);
  console.log(pw);
  console.log(bio);
  console.log(uType);
});
