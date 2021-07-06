setupUiByUserStatus = function () {
  // TODO Variablen
  const webPage = window.location.pathname;
  const loginManageEls = document.querySelectorAll("header > #login-management >span");
  const allowedPages =
  [
    "/",
    "/index.html",
    "/authenticateUser.html"
  ]
  console.log(webPage);
  console.log(loginManageEls);
  console.log(allowedPages);

  console.log("do smth");
  //evaluate user authentication status
  auth.onAuthStateChanged( async function (user) {
    // if status is 'anonymous' or 'registered'
    console.log("maybe");
    if (user) {
      console.log(user);
      if (user.isAnonymous) { // if user is 'anonymous'
        console.log("logged in anonymously");
        // TODO anonymous user handling
        if(webPage === "/index.html" || webPage === "/"){
          loginManageEls[0].hidden = loginManageEls[1].hidden = false;
        }
      } else { // if user is 'registered'
        console.log("registered");
        // TODO registered user handling
        if(webPage === "/index.html" || webPage === "/"){
          loginManageEls[0].hidden = true;
          loginManageEls[1].hidden = false;

          // set and event handler for 'sign out' button
          const signOutButton = loginManageEls[1].querySelector("button");
          signOutButton.addEventListener("click", handleLogOut);
          console.log(`Authenticated as 'registered with ${user.emailVerified ? '' : 'NO '}verified account' (${user.email})`);
        }


      }
    } else { // if user is not 'registered' nor 'anonymous' (null)
      // sign in user as 'anonymous'
      console.log("hier");
      auth.signInAnonymously();
    }
  });
}

setupSignInAndSignUp = function(){
  console.log("Just work");
  if(window.location.pathname === "/authenticateUser.html") {
    const formEl = document.forms["User"],
        btnSignIn = formEl.signin,
        btnSignUp = formEl.signup;
    // manage sign up event
    btnSignUp.addEventListener("click", handleSignUpButton);
    // manage sign in event
    btnSignIn.addEventListener("click", handleSignInButton);
    // neutralize the submit event
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
    });
  }
}

handleSignUpButton = async function (){
  const formEl = document.forms["User"],
      email = formEl.email.value,
      password = formEl.password.value;
  if (email && password) {
    try {
      // get 'anonymous' user data from IndexedDB
      const userRef = await auth.currentUser;
      // create credential providing email and password
      const credential = firebase.auth.EmailAuthProvider.credential( email, password);
      // create a 'registered' user merging credential with 'anonymous' user data
      await userRef.linkWithCredential( credential);
      // send verification email
      await userRef.sendEmailVerification();
      console.log (`User ${email} became 'Registered'`);
      alert (`Account created ${email}.\n\nCheck your email for instructions to verify this account.`);
      window.location.pathname = "/index.html";
      console.log("Yay, you signed up!");
    } catch (e) {
      const divEl = document.getElementById("error"),
          smallEl = divEl.querySelector("small");
      smallEl.textContent = e.message;
      divEl.hidden = false;
      console.log("Well, you are NOT signed up :(");
    }
  } else {
    console.log("There is no username or/and password.");
  }
}

handleSignInButton = async function (){
  const formEl = document.forms["User"],
      email = formEl.email.value,
      password = formEl.password.value;
  if (email && password) {
    try {
      const signIn = await auth.signInWithEmailAndPassword( email, password);
      if (signIn.user.emailVerified) {
        console.log(`Granted access to user ${email}`);
      }
      window.location.pathname = "/index.html";
      console.log(window.location.pathname);
      console.log("Hurra, you are logged in!");
    } catch (e) {
      const divEl = document.getElementById("error"),
          smallEl = divEl.querySelector("small");
      smallEl.textContent = e.message;
      divEl.hidden = false;
    }
  } else {
    console.log("There is no username or/and password.");
  }
}

handleVerifyEmail = function(){
  // TODO
  console.log("NYI");
  return true;
}

handleLogOut = function(){
  try {
    auth.signOut();
    window.location.pathname = "/index.html";
    console.log("You have signed out");
  } catch (e) {
    console.error( e.message);
  }
}

window.addEventListener("load", setupUiByUserStatus);
window.addEventListener("load", setupSignInAndSignUp);
