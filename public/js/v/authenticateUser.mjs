setupUiByUserStatus = function () {
  const webPage = window.location.pathname;
  const loginManageEls = document.querySelectorAll("header > #login-management >span");
  const allowedPages =
  [
    "/",
    "/index.html",
    "/authenticateUser.html"
  ]

  //evaluate user authentication status
  auth.onAuthStateChanged( async function (user) {
    // if status is 'anonymous' or 'registered'
    if (user) {
      if (user.isAnonymous) { // if user is 'anonymous'
        if(webPage === "/index.html" || webPage === "/"){
          loginManageEls[0].hidden = false;
          loginManageEls[1].hidden = true;
        } else if (!allowedPages.includes( webPage)) {
            // redirect to authentication page
            window.location.pathname = "/authenticateUser.html";
          }
      } else { // if user is 'registered'
        if(webPage === "/index.html" || webPage === "/"){
          loginManageEls[0].hidden = true;
          loginManageEls[1].hidden = false;
          if(!user.emailVerified){
            loginManageEls[2].hidden = false;
          } else {
            loginManageEls[2].hidden = true;
          }
          // set and event handler for 'sign out' button
          const signOutButton = loginManageEls[1].querySelector("button");
          signOutButton.addEventListener("click", handleLogOut);

          // enable buttons
          const manageCourseEl = document.getElementById("manageCourses");
          const manageClassEl = document.getElementById("manageClasses");
          const genTestDataEl = document.getElementById("testData");
          const clearDataEl = document.getElementById("clearData");
          manageCourseEl.disabled = false;
          manageClassEl.disabled = false;
          genTestDataEl.disabled = false;
          clearDataEl.disabled = false;
          console.log(`Authenticated as 'registered with ${user.emailVerified ? '' : 'NO '}verified account' (${user.email})`);
        } else if(webPage === "/courses.html"){
          const formEl = document.getElementById("Course-M");
          const buttonEls = formEl.querySelectorAll("button");
          const unverified_buttons =
          [
            "retrieveAndListAll",
            "btm"
          ];

          if(!user.emailVerified){
            for(const i in Object.keys(buttonEls)){
              if(!unverified_buttons.includes(buttonEls[i].id)){
                buttonEls[i].disabled = true;
              }
            }
          }
        }


      }
    } else { // if user is not 'registered' nor 'anonymous' (null)
      // sign in user as 'anonymous'
      auth.signInAnonymously();
    }
  });
}

setupSignInAndSignUp = function(){
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

handleVerifyEmail = async function(){
  const urlParams = new URLSearchParams( location.search);
  const verificationCode = urlParams.get( "oobCode"); // get verification code from URL
    try {
      await auth.applyActionCode( verificationCode);
    } catch (e) {
      console.error( e.message);
    }
}

handleLogOut = function(){
  const signoutEl = document.querySelectorAll("header > #login-management >span")[2];
  try {
    auth.signOut();
    window.location.pathname = "/index.html";
  } catch (e) {
    console.error( e.message);
  }
}

window.addEventListener("load", setupUiByUserStatus);
window.addEventListener("load", setupSignInAndSignUp);
