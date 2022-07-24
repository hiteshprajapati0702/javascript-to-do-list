
// Parent element to store  new card
const taskContainer = document.querySelector('.task_container');

// Global store

let globalStore = []; // declaring an empty array to store data

// new card template
const newCard = ({id,ImageUrl,TaskTitle,TaskType,TasKDescription,TaskLink}) =>`<div class="col col-md-6 col-lg-4 id=${id} ">
<div class="card m-2 ">
  <div class="card-header  d-flex justify-content-end gap-2 " >
    <button type="button" class="btn btn-outline-success edit_button" id=${id} onclick="editCard.apply(this, arguments)"><i class="far fa-edit" id=${id} onclick="editCard.apply(this, arguments)"></i></button>
    <button type="button" class="btn btn-outline-danger delete_button" id=${id} onclick="deleteCard.apply(this, arguments)" data-bs-target="#deletetask" data-bs-toggle="modal" ><i class="far fa-trash-alt" id=${id} onclick="deleteCard.apply(this, arguments)" ></i></button>
  </div>
  <img src="${ImageUrl}" class="card-img-top "  alt="...">
  <div class="card-body">
    <h5 class="card-title" id="title">${TaskTitle}</h5>
    <p class="card-text" id="description">${TasKDescription}</p>
    <span class="mybadge bg-success"  id="type">${TaskType}</span>
  </div>
  <div class="card-footer  text-muted ">
    <a href="${TaskLink}"type="button" id=${id} class="btn btn-outline-success float-end opentask">Open task</a>
  </div>
</div>
</div>`;



// For Update localStorage
const updatelocalStorage = () => { 
  localStorage.setItem("TaskY", JSON.stringify({cards:globalStore}));
};


// get card data on load/refreah from local storage
const loadInitialData = () =>{
  //Access the localStorage
  const getlocalStorageData = localStorage.getItem("TaskY");

  // For parsing string-object to normal object

  const {cards} = JSON.parse(getlocalStorageData);

  // Map around the array to generate HTML card
  cards.map((cardsObject) => {
    const creatNewCard = newCard(cardsObject);
    taskContainer.insertAdjacentHTML("beforeend",creatNewCard);
    globalStore.push(cardsObject);
  
  })

};


// save changees of new task card
const Savechanges = () =>{
    const taskData = {
        id:`${Date.now()}`,
        ImageUrl:document.getElementById('imageurl').value,
        TaskTitle:document.getElementById('tasktitle').value,
        TaskType:document.getElementById('tasktype').value,
        TasKDescription:document.getElementById('taskdescription').value,
        TaskLink:document.getElementById('projectlink').value
    };
    // console.log(taskData);
    // HTML DOM
    const creatNewCard = newCard(taskData);
    //For Insert new card.Here "beforend" is the position parent is container
    taskContainer.insertAdjacentHTML("beforeend",creatNewCard);

    // For storing the data in local storage I'll use array
    globalStore.push(taskData);
    updatelocalStorage();

};

//delete card
const deleteCard = (event) => {
  event = window.event;
  // id
  const targetID = event.target.id;
  const tagname = event.target.tagName; // BUTTON

  // match the id of the element with the id inside the globalStore
  // if match found remove

  globalStore = globalStore.filter((cardsObject) => cardsObject.id !== targetID); 
  // contact parent
  // Method-1 To target direct node for delete
  if(tagname === "BUTTON"){
    event.target.parentNode.parentNode.parentNode.remove();
  }else{
    event.target.parentNode.parentNode.parentNode.parentNode.remove();
  }

  // Method-2 Target parentnode and tell remove it's child element
  // if(tagname === "BUTTON"){
  //   return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode);
  // }else{
  //   return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode.parentNode);
  // }

  //After Deleting update localstorage
  updatelocalStorage(); // an object
  
};

//edit card
const editCard = (event) => {
  event = window.event;
  // id
  const targetID = event.target.id;
  const tagname = event.target.tagName;

  let ParentElement;

  if(tagname === "BUTTON"){
    ParentElement = event.target.parentNode.parentNode;
  }else{
    ParentElement = event.target.parentNode.parentNode.parentNode;
  }

  let taskTitle = ParentElement.childNodes[5].childNodes[1];
  let taskDescription = ParentElement.childNodes[5].childNodes[3];
  let taskType = ParentElement.childNodes[5].childNodes[5];
  let SubmitButton = ParentElement.childNodes[7].childNodes[1];
  
  
  //For edit the content

  taskTitle.setAttribute("contenteditable","true");
  taskDescription.setAttribute("contenteditable","true");
  taskType.setAttribute("contenteditable", "true");
  SubmitButton.setAttribute("onclick","saveEditChanges.apply(this, arguments)");
  SubmitButton.innerHTML = "Save";


};

const saveEditChanges = (event) => {

  event = window.event;
  // id
  const targetID = event.target.id;
  const tagname = event.target.tagName;

  let ParentElement;

  if(tagname === "BUTTON"){
    ParentElement = event.target.parentNode.parentNode;
  }else{
    ParentElement = event.target.parentNode.parentNode.parentNode;
  }

  let taskTitle = ParentElement.childNodes[5].childNodes[1];
  let taskDescription = ParentElement.childNodes[5].childNodes[3];
  let taskType = ParentElement.childNodes[5].childNodes[5];
  let SubmitButton = ParentElement.childNodes[7].childNodes[1];

  const updateData = {
    TaskTitle:taskTitle.innerHTML,
    TasKDescription:taskDescription.innerHTML,
    TaskType:taskType.innerHTML
  };

  globalStore = globalStore.map((task) => {
     if (task.id === targetID) {
       return{
        id: task.id,
        ImageUrl: task.ImageUrl,
        TaskTitle: updateData.TaskTitle,
        TaskType: updateData.TaskType,
        TasKDescription: updateData.TasKDescription
       };
      }else{
        return task;
      }
  });

  updatelocalStorage();

  taskTitle.setAttribute("contenteditable","false");
  taskDescription.setAttribute("contenteditable","false");
  taskType.setAttribute("contenteditable", "false");
  SubmitButton.removeAttribute("onclick");
  SubmitButton.innerHTML = "Open Task";

};



