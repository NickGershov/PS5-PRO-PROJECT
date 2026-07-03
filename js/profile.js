async function signOut() {
    try {
        await firebase.auth().signOut();
        console.log("User logged out successfully.");
        alert("You have been logged out.");
        window.location.href = "index.html"; 
    } catch (error) {
        console.error("Error logging out:", error.message);
        alert("An error occurred while logging out. Please try again.");
    }
}


async function displayUserProfile() {
    const user = firebase.auth().currentUser;

    if (user) {
        try {
            const snapshot = await firebase.database().ref('users/' + user.uid).get();

            if (snapshot.exists()) {
                const userData = snapshot.val();

                const usernameElement = document.getElementById('username');
                const emailElement = document.getElementById('email');

                usernameElement.innerText = userData.fullname || 'No Name Available';
                emailElement.innerText = userData.email || 'No Email Available';

                console.log('User data displayed:', userData);
            } else {
                console.error('No user data available in the database');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    } else {
        console.error('No user is currently signed in');
        window.location.href = "login.html";
    }
}

