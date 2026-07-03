const firebaseConfig = {
  apiKey: "AIzaSyBRvwYcTzU5ZtGSCPBfIAkfODXqeYmDNac",
  authDomain: "hashkaya.firebaseapp.com",
  databaseURL: "https://hashkaya-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hashkaya",
  storageBucket: "hashkaya.firebasestorage.app",
  messagingSenderId: "266345424191",
  appId: "1:266345424191:web:fea95328a50e7ae788df8a",
  measurementId: "G-0ZJF1XS4WE"
};

const app = firebase.initializeApp(firebaseConfig);
console.log(app);

var user;

const monitorNav = document.getElementById('monitor-nav');
const controlNav = document.getElementById('control-nav');
const loginNav = document.getElementById('login-nav');
const profileNav = document.getElementById('profile-nav');
    
async function showUserById(userId) {
    const dbRef = firebase.database().ref();
    try {
        const snapshot = await dbRef.child("users").child(userId).get();
        if (snapshot.exists()) {
            console.log(snapshot.val());
        } else {
            console.log("No data available");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}


firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log(user);

        monitorNav.style.display = "block"
        controlNav.style.display = "block"
        loginNav.style.display = "none"
        profileNav.style.display = "block"


        const currentPage = window.location.pathname;
        if (currentPage === "/login.html") 
            window.location.href = "index.html"    
        
        if (window.location.pathname === "/profile.html") {
            displayUserProfile(); 
        }
        

    } else {
        console.log("no user is logged in");

        monitorNav.style.display = "none"
        controlNav.style.display = "none"
        loginNav.style.display = "block"
        profileNav.style.display = "none"

        const currentPage = window.location.pathname;
        if (currentPage === "/monitor.html" || currentPage === "/control.html" || currentPage === "/profile.html") 
            window.location.href = "index.html"  
    }
});



