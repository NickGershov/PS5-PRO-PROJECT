const firebaseConfig = {
    apiKey: "AIzaSyCERRF_GCaj6A-Y0WkmNQNunezzxzQ4ww4",
    authDomain: "esp32-firebase-bedd3.firebaseapp.com",
    databaseURL: "https://esp32-firebase-bedd3-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "esp32-firebase-bedd3",
    storageBucket: "esp32-firebase-bedd3.firebasestorage.app",
    messagingSenderId: "378963646414",
    appId: "1:378963646414:web:6078395ca3609b8145fd9f"
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



