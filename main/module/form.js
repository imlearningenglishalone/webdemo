//form.js
async function loadTemplate(url) {
    const response = await fetch(url);
    return await response.text();
} 
async function renderUser() {
    const template = await loadTemplate('module/form.html');
    const userHtml = template.replace('{{name}}', 'Note').replace('{{email}}', 'alice@example.com');
   
    // Create a new element
    const newElement = document.createElement('div');

    // Set some content for the new element
    newElement.innerHTML = userHtml;

    // Append the new element to the body
    document.querySelector('body').appendChild(newElement);
    

}

//setup form
export async function theform() {
  await renderUser()

  


  document.getElementById('feedbackForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent actual form submission

    let formq = event.target
    let textValue = formq[0].value

    document.querySelectorAll("table tbody tr.row-select").forEach(row => {
        let id = row.dataset.key

        if(textValue.length !== 0){}
        dofun.data_sheet1[id][4] += "\n -"+ getFormattedDateTime() + " \n " + textValue;
        row.classList.toggle('row-select')
    });
    
    //render lai table
    dofun.reloadTable()
    
    //save 
    hideForm();
    db_dataLocalUpdate(e => {
        console.log("save it")
    })

  });

  hideForm();
  navbar_setup();
  longPress_setup();
  console.log('form teamplate is inject');
}


function hideForm() {

    //remove select
    document.querySelectorAll("table tbody tr.row-select").forEach(row => {
        row.classList.toggle('row-select')
    });

    const formContainer = document.getElementById('formContainer');
    formContainer.classList.add('hidden');
    setTimeout(() => {
        formContainer.style.display = 'none';
    }, 500); // Wait for the transition to complete
}
function showForm(){

    //check selected
    if(document.querySelectorAll("table tbody tr.row-select").length === 0) {
        console.log("no thing select")
        return 
    }

    if (formContainer.classList.contains('hidden')) {
        formContainer.classList.remove('hidden');
        formContainer.style.display = 'block';

        let formm = document.getElementById("feedbackForm")
        formm[0].value = "";
        formm[1].addEventListener("click", hideForm)

    }
}
// document.addEventListener('navbar', function(e) {
//     if('pending' === e.detail.message){
//         showForm()
//     }
// });
function navbar_setup(){
    const navbar = document.getElementById("sideNavigation");
    const anchor = document.createElement('a');
    //anchor.href = "#"; // Prevent default link behavior
    anchor.textContent = "Ghi chú";
    anchor.dataset.event = "ghichu"; // Store the event name in a data attribute, to call event
    navbar.appendChild(anchor);

    function nabar_function(e){

        if(document.querySelectorAll("table tbody tr.row-select").length === 0) {
            console.log("no thing select")
            return 
        }

        document.getElementById("sideNavigation").classList.toggle("show")
        showForm()

    }
    //add GOBAL function
    dofun.navbar.ghichu = nabar_function
}
function longPress_setup(){

    function addNote(e){
        let rowId = e.target.closest('[data-key]');
        rowId.classList.toggle('row-select')
        //rowId = Number(rowId.dataset.key)
        
        //console.log(rowId); 
        //showForm(rowId)
    }
    // push into array and long press will call it
    dofun.longPress.push(addNote)
}


