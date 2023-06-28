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
            if (post.title != null) {
                postTitle = post.title;
            }

            // ! show or hide edit button
            let user = getCurrentUser();
            let isMyPost = user != null && post.author.id == user.id;
            let editBtnContent = ``
            if (isMyPost) {
                editBtnContent = `<button class='btn btn-secondary' style='float: right' onclick="editPostClicked('${encodeURIComponent(JSON.stringify(post))}')">edit</button>`;
            }
            let content = `
            <div class="card shadow">
                <div class="card-header">
                    <img src="${post.author.profile_image}" class="rounded-circle border border-2" style="height: 40px; height: 40px;">
                    <bold>${post.author.username}</bold>
                    ${editBtnContent}
                </div>
                <div class="card-body" onclick="postClicked(${post.id})" style="cursor: pointer">
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


// ! new post or edit a post
function createNewPost() {
    let postId = document.getElementById("post-id-input").value
    let isCreate = postId == null || postId == "";


    const title = document.getElementById("title-input").value
    const body = document.getElementById("body-input").value
    const image = document.getElementById("image-input").files[0]
    const token = localStorage.getItem("token")

    let formData = new FormData()
    formData.append("body", body)
    formData.append("title", title)
    formData.append("image", image)
    // let params = {
    //     "body": body,
    //     "title": title,
    // };

    let url = ``;  
    const headers = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
    }

    if(isCreate) { // . when creating
        url = `${baseUrl}/posts`            
    }else { // when updating
        formData.append("_method", "put")
        url = `${baseUrl}/posts/${postId}`
    }
    
    axios.post(url, formData, {
        headers: headers
    })
    .then((response) => {
        const modal = document.getElementById("create-post-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide();
        getPosts()
        showAlert("New Post Has Been Created")
    })
    .catch((error) => {
        const message = error.response.data.message
        showAlert(message, "danger")
    })
}

function postClicked(postId) {
    window.location = `postDetail.html?postId=${postId}`
}


function editPostClicked(postObj) {
    let post = JSON.parse(decodeURIComponent(postObj))
    document.getElementById("postModalTitle").innerHTML = "edit post";
    document.getElementById("change").innerHTML = "Update"
    document.getElementById("title-input").value = post.title;
    document.getElementById("body-input").value = post.body;
    document.getElementById("post-id-input").value = post.id;

    let modal = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
    modal.toggle();

}

function add() {
    document.getElementById("postModalTitle").innerHTML = "create post";
    document.getElementById("change").innerHTML = "create"
    document.getElementById("title-input").value = "";
    document.getElementById("body-input").value = "";
    document.getElementById("post-id-input").value = "";

    let modal = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
    modal.toggle();

}