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
        dofun.data_sheet1[id][4] += "\n -"+ getFormattedDateTime() + " \n " + textValue;
    });

    function getFormattedDateTime() {
        var now = new Date();
        
        var month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
        var day = now.getDate().toString().padStart(2, '0');
        var year = now.getFullYear().toString().slice(-2); // Get last two digits of the year
        
        var hours = now.getHours().toString().padStart(2, '0');
        var minutes = now.getMinutes().toString().padStart(2, '0');
        
        return `${day}/${month}/${year} : ${hours}:${minutes}`;
      }
    //save 
    hideForm();
    document.querySelector("a.menu-link.saveSelect").click()
  });

  hideForm();
  console.log('form teamplate is inject');
}


function hideForm() {
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

    }
}
document.addEventListener('navbar', function(e) {
    if('pending' === e.detail.message){
        showForm()
    }
});

