// if (!window.indexedDB) {
//     console.log("Sorry! Your browser does not support IndexedDB");
// }
// //****** CONFIGS ****//
// window.dofun = [];
// window.URL_SHEETS = "https://script.google.com/macros/s/AKfycbzkpMUMJ__-gStK6habVXVveyAaxmKz0N-AfBxWTZg-tM7OG3jDGMYOQEg2-15UktsboA/exec?"



// main_navbar();
// db_getDataLocal()

// //when data function is ok will tringger event to call a table function
// document.addEventListener('data-db', function(e) {
//     let evt = e.detail.message
//     if(evt === "ready"){
//         main_table();
//     }
// });






// main.js
// document.addEventListener('DOMContentLoaded', () => {
//     if (typeof window.newApp === 'object') {
//         newApp.main_navbar()
//         newApp.theform()
//         db_getDataLocal()

//         document.addEventListener('data-db', function(e) {
//             let evt = e.detail.message
//             if(evt === "ready"){
//                 newApp.main_table();
//             }
//         });

//     } else {
//         console.error("myModuleFunction is not available");
//     }
// });





document.querySelector('div#sideNavigation').addEventListener("click", function leftMenuClick(e) {
    let name = e.target.classList
     if(name.contains('newproduct')) {
        console.log("doing sonething new product")
     }
});
