//TODO
setupUiByUserStatus = function () {
  // TODO Variablen
  const webPage = window.location.pathname;
  const loginManageEls = document.querySelectorAll("header > #login-management >span");
  const allowedPages =
  [
    "/",
    "/intex.html",
    "/authentificateUser.html"
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
          loginManageEls[0].hidden = loginManageEls[1].hidden = true;
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
  // TODO
  console.log("NYI");
}

handleVerifyEmail = function(){
  // TODO
  console.log("NYI");
}

handleLogOut = function(){
  // TODO
  console.log("NYI");
}

window.addEventListener("load", setupUiByUserStatus);
