
/// Auth stuff
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

signInBtn.onclick = () => auth.signInWithPopup(provider);
login.onclick = () => {
    auth.signInWithEmailAndPassword(email.value, password.value)
    .then((user) => {
        user = email.value;
    })
    .catch((error) => {
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
        var displayText = user.displayName;
        if (displayText == null) {
            displayText = user.email.split("@", 1);
        }
        userDetails.innerHTML = `<h3>Hello ${displayText}!</h3> <p>User ID: ${user.uid}</p>`;
    } else {
        // not signed in
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';
    }
});



// DB stuff

function addMoneyOnclick() {
    addOrExtractMoney(1);
}

function extractMoneyOnclick() {
    addOrExtractMoney(-1);
}

function addOrExtractMoney(sign) {
    var num = parseFloat(document.getElementById("add_money_acc_num").value) - 1;
    var amount = parseFloat(document.getElementById("add_money_amount").value);

    usersRef.get().then(function(doc) {
        var newAmount = parseFloat(doc.data().accountsRefs[num].balance) + sign * amount;
        console.log(newAmount);

        var accounts = doc.data().accountsRefs;
        accounts[num].balance = newAmount;
        
        usersRef.update({
            accountsRefs: accounts
        })
    })
}

function checkCourseOnClick() {
    //TODO
}

function changeMoney() {
    // TODO
    document.getElementById("myCheck").checked = true;
}

function sliderValueChange(value) {
    document.getElementById("sliderValue").innerHTML = value;
}

const db = firebase.firestore();
let usersRef;
let unsubscribe;
let currentUid;

auth.onAuthStateChanged(user => {
    
    if (user) {
        usersRef = db.collection('users').doc(user.uid);
        currentUid = user.uid;

        // check if db entry exists, create if not
        usersRef.get().then(function(doc) {
            if (doc.exists) {
                console.log("Account exists with data:", doc.data());
            } else {
                // create user
                console.log("User not registered! Creating user.");
                var username = user.displayName;
                    if (username == null) {
                        username = user.email.split("@", 1);
                    }

                    var docData = {
                        uid: user.uid,
                        name: username,
                        accounts: 2,
                        accountsRefs: [
                            {
                                type: "RON",
                                balance: "1000"
                            },
                            {
                                type: "EUR",
                                balance:"550"
                            }
                        ],
                        botEnabled: true,
                        waitForApproval: false,
                        checkInterval: 15,
                        lastCheck: Date.now()
                    };
                    usersRef.set(docData).then(function() {
                        console.log("User successfully added!");
                    });
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });

        // accouns real time management
        usersRef
            .onSnapshot( {
                includeMetadataChanges: true
            }, function(doc) {

                // print number of open accounts
                var accounts = doc.data().accounts;
                document.getElementById("openAccountsLabel").innerHTML = "Open accounts: " + accounts;
                for (var i = 0; i < accounts; ++i) {
                    var acc = doc.data().accountsRefs[i];
                    document.getElementById("acc" + i).innerHTML = (i + 1) + ". " + acc.type + " " + acc.balance;
                }

                // update settings
                document.getElementById("enabledBtn").checked = doc.data().botEnabled;
                document.getElementById("waitApprovalBtn").checked = doc.data().waitForApproval;
                document.getElementById("botCheckRate").value = doc.data().sliderValueChange;

            });

    } else {
        unsubscribe && unsubscribe()
    }
    
});