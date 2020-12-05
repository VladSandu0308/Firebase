const auth = firebase.auth();

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');
const login = document.getElementById("loginBut");
const email = document.getElementById("email");
const password = document.getElementById("password");

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');
const userDetails = document.getElementById('userDetails');


const provider = new firebase.auth.GoogleAuthProvider();

/// Sign in event handlers
signInBtn.onclick = () => auth.signInWithPopup(provider);
login.onclick = () => {
    auth.signInWithEmailAndPassword(email.value, password.value)
    .then((user) => {
        user = email.value;
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;

        window.alert("Error: " + errorMessage);
    });
}
 

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