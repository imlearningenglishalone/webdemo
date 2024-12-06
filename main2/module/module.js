// main.js
import { theform } from './form.js';
import { main_navbar } from './navbar.js';
import { main_table } from './table.js';

if (!window.indexedDB) {
    console.log("Sorry! Your browser does not support IndexedDB");
}
window.dofun = [];
window.URL_SHEETS = "https://script.google.com/macros/s/AKfycbzkpMUMJ__-gStK6habVXVveyAaxmKz0N-AfBxWTZg-tM7OG3jDGMYOQEg2-15UktsboA/exec?"

// window.newApp = {
//     theform: theform,
//     main_navbar: main_navbar,
//     main_table: main_table,

//     db_getDataLocal: db_getDataLocal,
//     deleteAllIndexedDB: deleteAllIndexedDB,
// }

document.addEventListener('DOMContentLoaded', () => {
    main_navbar()
    theform()
    db_getDataLocal()
});
document.addEventListener('data-db', function(e) {
    let evt = e.detail.message
    if(evt === "ready"){
        main_table();
    }
});