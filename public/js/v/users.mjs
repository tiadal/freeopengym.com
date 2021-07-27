import {createChoiceWidget, getKeyByValue} from "../../lib/util.mjs";
import {User, usertype} from "../m/User.mjs";

const formEl = document.forms["User"];
const usertypeEl = formEl.querySelector("fieldset[data-bind='userType']");
const signupButEl = formEl.signup;

let types = [];

for(const i in usertype){
  types.push(usertype[i]);
}

createChoiceWidget( usertypeEl, "userType", [],
    "radio", types, false);

formEl.userName.addEventListener("input", function(){
  formEl.userName.setCustomValidity(
    User.checkUserName(formEl.userName.value).message
  );
})

formEl.password.addEventListener("input", function(){
  formEl.password.setCustomValidity(
    User.checkPassword(formEl.password.value).message
  );
})

signupButEl.addEventListener("click", async function(){
  const name = formEl.userName.value;
  const email = formEl.email.value;
  const pw = formEl.password.value;
  const birthday = formEl.birthday.value;
  const bio = formEl.description.value;
  const uType = getKeyByValue(usertype, types[formEl.userType.value - 1]);

  console.log(name);
  console.log(email);
  console.log(pw);
  console.log(birthday);
  console.log(bio);
  console.log(uType);

  try{
    const slots = {
      userId: 1,
      username: name,
      password: pw,
      bio: bio,
      user_type: uType,
      myCourses: [],
      joinedClasses: [],
      iFollow: [],
      followers: []
    };
    if(bio){
      slots.bio = bio;
    }
    if(birthday){
      slots.dateOfBirth = new Date(birthday);
    }

    const user = new User(slots);
    User.add(user);
    console.log(user);

    // get 'anonymous' user data from IndexedDB
    const userRef = await auth.currentUser;
    // create credential providing email and password
    const credential = firebase.auth.EmailAuthProvider.credential( email, pw);
    // create a 'registered' user merging credential with 'anonymous' user data
    await userRef.linkWithCredential( credential);
    // send verification email
    await userRef.sendEmailVerification();
    console.log (`User ${email} became 'Registered'`);
    alert (`Account created ${email}.\n\nCheck your email for instructions to verify this account.`);
    window.location.pathname = "/index.html";
  } catch(e){
    console.log(e.message);
  }
});
