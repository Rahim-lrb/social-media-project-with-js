let currentPage = 1;
let lastPage = 1;

setUpUi();
getPosts();

window.addEventListener("scroll",() => {
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
        currentPage = currentPage + 1;
        getPosts(false, currentPage);
    }
})

function getPosts(reload = true, page = 1) {
    axios.get(`${baseUrl}/posts?limit=10&page=${page}`)
    .then((response) => {
        const posts = response.data.data;
        lastPage = response.data.meta.last_page;
        console.log(posts)
        if (reload) {
            document.getElementById("posts").innerHTML = "";
        } 
        for (post of posts) {
            let postTitle;
            if (post.title != null) {
                postTitle = post.title;
            }
            let content = `
            <div class="card shadow">
                <h5 class="card-header">
                <img src="${post.author.profile_image}" class="rounded-circle border border-2" style="height: 40px; height: 40px;">
                <bold>${post.author.username}</bold>
                </h5>
                <div class="card-body">
                <img src="${post.image}" class="w-100">
                <h6 class="mt-1" style="color: rgb(179, 176, 176);">${post.created_at} mins ago</h6>
                <h5>${postTitle}</h5>
                <p>${post.body}</p>
                <hr>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                    </svg>
                    <span>
                        ${post.comments_count} comments
                        <span id="post-tags-${post.id}">
                        </span>
                    </span>
                </div>
                </div>
            </div>
            `
            document.getElementById("posts").innerHTML += content;
            document.getElementById(`post-tags-${post.id}`).innerHTML += "";
            for (tag of post.tags)  {
                console.log(tag.name);
                let tagsContent = `
                    <button class="btn btn-sm rounded-5" style="background-color: gray; color: white">${tag.name}</button>
                `
                document.getElementById("post-tags").innerHTML += tagsContent;
            }
        }
    })
}





// // ! log in
// function loginBtnClicked() {
//     let username = document.getElementById("username-input").value;
//     let password = document.getElementById("password-input").value;
//     let params = {
//         "username": username,
//         "password": password
//     }

//     axios.post(`${baseUrl}/login`, params)
//     .then((response) => {
//         localStorage.setItem("token", response.data.token);
//         localStorage.setItem("user", JSON.stringify(response.data.user));
//         const modal = document.getElementById("login-modal");
//         const modalInstance = bootstrap.Modal.getInstance(modal);
//         modalInstance.hide();

//         setUpUi();
//         showAlert("Nice, you logged in successfully");
//     });
// }

// function showAlert(customMessage, type="success") {
//     const alertPlaceholder = document.getElementById('success-alert')
//     const appendAlert = (message, type) => {
//     const wrapper = document.createElement('div')
//     wrapper.innerHTML = [
//         `<div class="alert alert-${type} alert-dismissible" role="alert">`,
//         `   <div>${message}</div>`,
//         '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
//         '</div>'
//     ].join('')

//     alertPlaceholder.append(wrapper)
//     }
//     appendAlert(customMessage, type);
    
//     // TODO hide alert for logging out
//     setTimeout(() => {
//         const alert = bootstrap.Alert.getOrCreateInstance('#success-alert');
//         alert.close();
//     }, 2000);
// }



// function getCurrentUser() {
//     let user = null;
//     let storageUser = localStorage.getItem('user')
//     if (storageUser != user) {
//         user = JSON.parse(storageUser);
//     } 
//     return user;
// }

// // ! log out
// function logOut() {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUpUi();
//     showAlert("Bye, you logged out", "danger");
// }


// // ! register
// function registerBtnClicked() {
//     let name = document.getElementById("register-name-input").value;
//     let username = document.getElementById("register-username-input").value;
//     let password = document.getElementById("register-password-input").value;
//     let image = document.getElementById("register-image-input").files[0];

//     console.log(name, username, password, image);
    
//     let formData = new FormData();
//     formData.append("name", name);
//     formData.append("username", username);
//     formData.append("password", password);
//     formData.append("image", image);

//     let headers = {
//         "Content-Type": "multipart/form-data",
//     }

//     axios.post(`${baseUrl}/register`, formData, {
//         headers: headers
//     })

//     .then((response) => {
//         console.log(response);
//         localStorage.setItem("token", response.data.token);
//         localStorage.setItem("user", JSON.stringify(response.data.user));
//         const modal = document.getElementById("register-modal");
//         const modalInstance = bootstrap.Modal.getInstance(modal);
//         modalInstance.hide();

//         setUpUi();
//         showAlert("new user registered successfully");
//     }).catch((error) => {
//         showAlert(error.response.data.message, "danger");
//     })
// }


// ! new post
function createNewPost() {
    let title = document.getElementById("title-input").value;
    let body = document.getElementById("body-input").value;
    let image = document.getElementById("image-input").files[0];

    let formData = new FormData();
    formData.append("body", body)
    formData.append("title", title)
    formData.append("image", image)
    // let params = {
    //     "body": body,
    //     "title": title,
    // };
    let token = localStorage.getItem("token");
    let headers = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
    }
    
    axios.post(`${baseUrl}/posts`, formData, {
        headers: headers
    })
    .then((response) => {
        console.log(response);
        const modal = document.getElementById("create-post-modal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
        showAlert("new post has been created");
        getPosts();
    }).catch((error) => {
        showAlert(error.response.data.message, "danger");
    })
}