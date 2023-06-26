// ! shared js between the pages
const baseUrl = "https://tarmeezacademy.com/api/v1";
// ! set up ui
function setUpUi() {
    const token = localStorage.getItem("token")
    const loginDiv = document.getElementById("logged-in-div");
    const logoutDiv = document.getElementById("logged-out-div");
    const addBtn = document.getElementById("add-btn");
    if (token == null) { // user is a guest (not logged in)

        if (addBtn != null) {
            addBtn.style.display = "none";
        }
        loginDiv.style.setProperty("display", "flex", "important");
        logoutDiv.style.setProperty("display", "none", "important");
    } else {
        if (addBtn != null) {
            addBtn.style.display = "block";
        }

        loginDiv.style.setProperty("display", "none", "important");
        logoutDiv.style.setProperty("display", "block");
        const user = getCurrentUser();
        document.getElementById("nav-user").innerHTML = user.username;
        document.getElementById("nav-image").src = user.profile_image;
    }
}



// ! auth functions
// ! log in
function loginBtnClicked() {
    let username = document.getElementById("username-input").value;
    let password = document.getElementById("password-input").value;
    let params = {
        "username": username,
        "password": password
    }

    axios.post(`${baseUrl}/login`, params)
    .then((response) => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        const modal = document.getElementById("login-modal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();

        setUpUi();
        showAlert("Nice, you logged in successfully");
    });
}

function showAlert(customMessage, type="success") {
    const alertPlaceholder = document.getElementById('success-alert')
    const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
    }
    appendAlert(customMessage, type);
    
    // TODO hide alert for logging out
    setTimeout(() => {
        const alert = bootstrap.Alert.getOrCreateInstance('#success-alert');
        alert.close();
    }, 2000);
}


function getCurrentUser() {
    let user = null;
    let storageUser = localStorage.getItem('user')
    if (storageUser != user) {
        user = JSON.parse(storageUser);
    } 
    return user;
}


// ! log out
function logOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUpUi();
    showAlert("Bye, you logged out", "danger");
}


// ! register
function registerBtnClicked() {
    let name = document.getElementById("register-name-input").value;
    let username = document.getElementById("register-username-input").value;
    let password = document.getElementById("register-password-input").value;
    let image = document.getElementById("register-image-input").files[0];

    console.log(name, username, password, image);
    
    let formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("image", image);

    let headers = {
        "Content-Type": "multipart/form-data",
    }

    axios.post(`${baseUrl}/register`, formData, {
        headers: headers
    })

    .then((response) => {
        console.log(response);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        const modal = document.getElementById("register-modal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();

        setUpUi();
        showAlert("new user registered successfully");
    }).catch((error) => {
        showAlert(error.response.data.message, "danger");
    })
}