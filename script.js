const postsContainer = document.getElementById("postsContainer");
const postForm = document.getElementById("postForm");


let blogArray = [];


async function fetchPosts() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const posts = await response.json();
    blogArray = posts.slice(0, 10); 
    renderPosts();
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}


function renderPosts() {
  postsContainer.innerHTML = ""; 
  blogArray.forEach((post) => displayPost(post));
}

function displayPost(post) {
  const postElement = document.createElement("div");
  postElement.className = "post";
  postElement.dataset.id = post.id;
  postElement.innerHTML = `
    <h2>${post.title}</h2>
    <p>${post.body}</p>
    <div class="buttons">
      <button class="edit-post">Edit</button>
      <button class="delete-post">Delete</button>
    </div>
  `;
  postsContainer.appendChild(postElement);
}

postForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = document.getElementById("title").value;
  const body = document.getElementById("body").value;

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, body }),
    });

    const newPost = await response.json();
    blogArray.push(newPost); 
    renderPosts(); 
    postForm.reset();
  } catch (error) {
    console.error("Error adding post:", error);
  }
});


postsContainer.addEventListener("click", (event) => {
  const postElement = event.target.closest(".post");
  const postId = parseInt(postElement?.dataset.id, 10);

  if (event.target.classList.contains("edit-post")) {
    // Edit Post
    const postIndex = blogArray.findIndex((post) => post.id === postId);
    if (postIndex === -1) {
      alert("Post not found.");
      return;
    }

    const newTitle = prompt("Edit Title:", blogArray[postIndex].title);
    const newBody = prompt("Edit Content:", blogArray[postIndex].body);

    if (newTitle !== null && newBody !== null) {
      blogArray[postIndex].title = newTitle;
      blogArray[postIndex].body = newBody;

      renderPosts(); 
      alert("Post updated successfully!");
    }
  } else if (event.target.classList.contains("delete-post")) {
    if (confirm("Are you sure you want to delete this post?")) {
      blogArray = blogArray.filter((post) => post.id !== postId);
      renderPosts(); 
      alert("Post deleted successfully!");
    }
  }
});


document.addEventListener("DOMContentLoaded", fetchPosts);
