const auth = firebase.auth();

const signInBtn = document.getElementById('signInBtn');
const signInBtnF = document.getElementById("signInBtnF")
const signOutBtn = document.getElementById('signOutBtn');
const login = document.getElementById("loginBut");
const email = document.getElementById("email");
const password = document.getElementById("password");

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');
const userDetails = document.getElementById('userDetails');


const provider = new firebase.auth.GoogleAuthProvider();
const provider2 = new firebase.auth.FacebookAuthProvider();

/// Sign in event handlers

signInBtn.onclick = () => auth.signInWithPopup(provider);
signInBtnF.onclick = () => auth.signInWithPopup(provider2);
login.onclick = auth.signInWithEmailAndPassword(email.value, password.value);
 

signOutBtn.onclick = () => auth.signOut();


auth.onAuthStateChanged(user => {
    if (user) {
        // signed in
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;
    } else {
        // not signed in
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';
    }
});