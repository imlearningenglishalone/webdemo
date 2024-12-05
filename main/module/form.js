//form.js
async function loadTemplate(url) {
    const response = await fetch(url);
    return await response.text();
} 
async function renderUser() {
    const template = await loadTemplate('module/form.html');
    const userHtml = template.replace('{{name}}', 'Alice').replace('{{email}}', 'alice@example.com');
   
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


        // Your custom logic here
        console.log("Form submitted!");
        
        // You can also access form data like this
        var formData = new FormData(event.target);
        for (var pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);

        }

        // document.querySelectorAll("table tbody tr.row-select").forEach(row => {

        //     row.cells[2].firstElementChild.className = "title" + " "+ state;
        //     let id = row.dataset.key
        //     dofun.data_sheet1[id][3] = state;
        // });



    //hideForm();
    //document.querySelector("a.menu-link.saveSelect").click()
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

