const showLoader = () => {
    document.getElementById("loader").classList.remove("hidden");
    document.getElementById("video-container").classList.add("hidden");
};

const hideLoader = () => {
    document.getElementById("loader").classList.add("hidden");
    document.getElementById("video-container").classList.remove("hidden");
};

function removeActiveClass(){
    const activeButtons = document.getElementsByClassName("active");
    for(let btn of activeButtons){
        btn.classList.remove("active");
    }
}

function loadCategories(){

    fetch("https://openapi.programming-hero.com/api/phero-tube/categories")

    .then((res) => res.json())
    .then((data) => displayCategories(data.categories
    ))
};

function loadVideos(searchText = ""){
     showLoader();
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)

    .then((response) => response.json())
    .then((data) =>{
        removeActiveClass();
        document.getElementById("btn-all").classList.add("active");
        displayVideos(data.videos)
    })
};

const loadCategoriesVideos = (id) => {
     
    showLoader();
    const url = `https://openapi.programming-hero.com/api/phero-tube/category/${id}`;

    fetch(url).then((res => res.json()))
    .then((data) => {
        removeActiveClass();
        const clickedButton = document.getElementById(`btn-${id}`);
        clickedButton.classList.add("active");
        console.log(clickedButton);
        displayVideos(data.category);
    })
    
}

const loadVideoDetails = (videoId) => {
    const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
    fetch(url).then((res) => res.json()).then((data) => displayVideoDetails(data.video))
}

const displayVideoDetails = (video) => {
   document.getElementById("video_details").showModal();
   const detailsContainer = document.getElementById("details_container");
   detailsContainer.innerHTML = `
<div class="card bg-base-100 image-full">
  <figure>
    <img
      src="${video.thumbnail}"
      alt="Shoes" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">${video.title} </h2>
    <p>${video.description} </p>
  </div>
</div>
   `;
}

function displayCategories(categories){

    const categoryContainer = document.getElementById("category-container");

    for(let cat of categories){
       const categoryDiv = document.createElement("div");
       categoryDiv.innerHTML = `
       <button id="btn-${cat.category_id}" onclick="loadCategoriesVideos(${cat.category_id} )" class="btn btn-sm hover:bg-[#FF1F3D] hover:text-white">${cat.category}</button>
       `;
       categoryContainer.appendChild(categoryDiv);
    }
};

const displayVideos = (videos) => {
    const videoContainer = document.getElementById("video-container");
    videoContainer.innerHTML = "";

    if(videos.length == 0){
        videoContainer.innerHTML = `
        <div class="py-20 col-span-full flex flex-col justify-center items-center text-center">
            <img src="assets/Icon.png" class="w-[120px] pb-4" alt="">
            <h2 class="text-3xl font-bold">Oops!! Sorry, There is no <br> content here</h2>
        </div>
        `;
        hideLoader();
        return;
    }

    videos.forEach(video => {
        const videoCard = document.createElement("div");
        videoCard.innerHTML = `
        <div class="card bg-base-100 ">
            <figure class="relative">
              <img class="w-full h-[180px] object-cover"
                src="${video.thumbnail} "
                alt="Shoes" />
                <span class="absolute bottom-2 right-2 text-sm rounded text-white bg-black px-2">3hrs 56 min ago</span>
            </figure>
            
            <div class="flex gap-3 px-0 py-5">
                <div class="profile">
                    <div class="avatar">
                        <div class="ring-primary ring-offset-base-100 w-6 rounded-full ring ring-offset-2">
                          <img src="${video.authors[0].profile_picture}" />
                        </div>
                    </div>
                </div>
                <div class="intro">
                    <h2 class="text-sm    font-semibold">${video.title} </h2>
                    <p class="text-sm text-gray-400 flex gap-1">${video.authors[0].profile_name}
                    ${video.authors[0].verified == true ? `<img src="https://img.icons8.com/?size=20&id=SRJUuaAShjVD&format=png" alt="">` : ""} </p>
                    <p class="text-sm text-gray-400">${video.others.views}</p>
                </div>
            </div>
            <button onclick="loadVideoDetails('${video.video_id}') " class="btn btn-block">Show Details</button>
        </div>
        `;
        videoContainer.appendChild(videoCard);
    })
    hideLoader();
};

document.getElementById("search-input").addEventListener("keyup", (e) => {
    const input = e.target.value;
    loadVideos(input);
})

loadCategories();
