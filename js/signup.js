

async function signUp(firstName, lastName, username, email, password) {
    var isCreated = false;
    if (!checkUsername(username)) {
        console.log("not allowed");
    }
    else {
        try {


            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            console.log(user);
            firstName = firstName.trim();
            lastName = lastName.trim();
            const fullname = `${firstName} ${lastName}`;

            isCreated = await addNewUserToFirebase(user.uid, username, email, fullname);
        } catch (error) {
            console.error(error.message);
        } finally {
            if (isCreated) {
                window.location.href = "./index.html";
            }
        }
    }
}

async function addNewUserToFirebase(userId, username, email, fullname) {
    try {
        await firebase.database().ref('users/' + userId).set({
            email,
            username,
            fullname
        });
        console.log("User added successfully");
        return true;
    } catch (error) {
        console.error("Error adding user to database:", error.message);
        return false;
    }
}

function checkUsername(usernameCheck) {
    let userName = usernameCheck
    let check = true;

    console.log(userName);


    if (!isNaN(userName.charAt(0)))
        check = false

    if (userName.length < 4)
        check = false

    return check;
}

