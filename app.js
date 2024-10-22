function test_checkOnlineAndUpDateApp(){
    if (navigator.onLine) {
        console.log("Internet avaliable...");
          // Usage: Call the function with the URL of the JavaScript file you want to load
        loadUpdateScript('https://script.google.com/macros/s/AKfycbyKZHUQlDqoAEHMw8IqU81Ys-mjE4ihGSJXlfYZheSl-6ZqIgRoN6giXQvxWNHbhr3M/exec?name=update');
    } else {
        console.log("Oop! No internet connection. Retrieving data from cache...");
    }
}

function loadUpdateScript(url) {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();  // Get the response as text
      })
      .then(scriptText => {
        const scriptElement = document.createElement('script');
        scriptElement.text = scriptText;  // Set the script content
        document.body.appendChild(scriptElement);  // Append to the document
        console.log(`Loaded script: ${url}`);
      })
      .catch(error => {
        console.error('Error loading script:', error);
      });
  }
  

  test_checkOnlineAndUpDateApp()