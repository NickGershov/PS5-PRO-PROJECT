async function signIn(email, password) {
    try {
        if (email.trim() == '' || password.trim() == '') {
            alert("Please enter both email and password.");
            return;
        }

        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        user = userCredential.user;
        window.location.href = "index.html"
    } catch (error) {
        alert("Incorrect email or password.");

    }
}
