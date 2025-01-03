//********************************
//  DATABSE FUNCTION
//********************************
function db_open (callback){
       //this function run one time.
        const request = indexedDB.open("maintenance", 1);
        request.onsuccess = e => {
                let db = e.target.result
                let transaction = db.transaction("books", "readwrite");
                let dbStore = transaction.objectStore("books");
                callback(dbStore);
                db.close();
        };

        //First time Install DB - When you dont have DB
        request.onupgradeneeded = e => {      
                let db = e.target.result;
                db.createObjectStore('books', {keyPath: 'id'});
                console.log(e.type,"=> books Create sussesfully!")
        };
}
function db_remove(callback){
        return (() => {
                indexedDB.deleteDatabase("maintenance").onsuccess = (event) => {
                    console.log("Database deleted successfully");
                    //console.log(event.result); // should be undefined
                    callback(event)
                }
        })();
}
function db_get (name, callback){
        //db_get("data_pannel2",e => console.log(e.target.result))
        db_open(db => {
                //const request = db.get(name);
                const request = db.getAll(); //get all
                request.onsuccess = e => callback(e);
        })
}
function db_add (name, array, callback){
        //db_add("data_pannel",[["lrd395","sdaasdasda"],["lrd411","sdaasdasda"]])
        const sheet1 = {id: name, value: array};
        db_open(db => {
                const request = db.put(sheet1);
                request.onsuccess = e => callback(e);
        })
}
function db_addArr (array, callback){
        //db_add("data_pannel",[["lrd395","sdaasdasda"],["lrd411","sdaasdasda"]])
        const sheet1 = {id: "sheet1", value: array.sheet1},
              sheet2 = {id: "sheet2", value: array.sheet2}
            // code = {id: "code", value: array.code},
            // id = {id: "id", value: array.id};
        
        db_open(db => {
   
                function putdata(name){
                    console.log(name ,"Success adding!")
                    if(name == "sheet1") callback();
                }
                db.put(sheet1).onsuccess = () => putdata("sheet1")
                db.put(sheet2).onsuccess = () => putdata("sheet2")
                // db.put(code).onsuccess = () => putdata("code")
                // db.put(id).onsuccess = () => putdata("id")
        })
}
function db_getDataSV(callback) {
        //URL NAY CUA POST THU NGHIEM - KO PHAI CUA SHOWONWEB SHEET
        const baseUrl = URL_SHEETS  // Please set your Web Apps URL.
        const para = {
                spreadsheetId: "",  // Please set your Google Spreadsheet ID.
                sheetName: ""  // Please set the sheet name you want to retrieve the values.
        };

        console.log("Loading...")
        const q = new URLSearchParams(para);
        const url = baseUrl + "?" + q;
        const connectSever = async () => {
            const response = await fetch(url)
            const result = await response.json();
            const data = result; // result.sheet1, result.pannel, result.code, result.id 

            console.log("LoadJSON ALL DONE!");
            callback(data); 
            
        }
        connectSever();
}
function db_getDataSaveLocal(){
            const saveDataLocal = (data) => {
                    db_addArr(data,(e) => {
                        //console.log("all thing are done! -LOCAL DATA has been Create!")
                        dofun.data_sheet1 = data.sheet1.slice(0);//Clone - copy array to Varible
                        console.log("getDataSaveLocal:: dofun check data")
                        eventTringger("ready")
                    })
            }
            db_getDataSV(saveDataLocal);
}
function db_getDataLocal(){
            db_get("sheet1", e => {
                let datalocal = e.target.result;

                if(!datalocal.length) {
                    return (() => eventTringger("connectServer"))();
                }else{
                    dofun.data_sheet1 = datalocal.find(( {id} ) => id == "sheet1").value.slice(0);
                    console.log("getDataLocal:: Local DATA in DB , check dofun.data_sheet1")
                    eventTringger("ready")
                }
            })
}
function db_dataLocalUpdate(callback){
            db_add("sheet1", dofun.data_sheet1, e => {
                console.log("db_dataLocalUpdate:: dofun.data_sheet has been update!")
                callback();
            })
}

//function use for reset , test app - when user wants to delete all DB
function deleteAllIndexedDB() {
    indexedDB.databases().then(databases => {
        databases.forEach(dbInfo => {
            indexedDB.deleteDatabase(dbInfo.name);
        });
        console.log("All IndexedDB databases deleted");
    }).catch(error => {
        console.error("Error deleting IndexedDB databases:", error);
    });
}


//check if connection to get update
function getNewUpdate(){
    if (navigator.onLine) {

        const saveDataLocal = (data) => {
            db_addArr(data,(e) => {
                dofun.data_sheet1 = data.sheet1.slice(0);//Clone - copy array to Varible
                console.log("getDataSaveLocal:: dofun check data")
                eventTringger("ready")
            })
        }
        db_getDataSV(saveDataLocal);
        
     return;
    }
    db_getDataLocal()

        //db_remove(() => eventTringger("connectServer") );
}


// Create a CustomEvent with additional data
function eventTringger(message){
    const event = new CustomEvent('data-db', { detail: { message: message }});
    document.dispatchEvent(event);
}
//when data function is ok will tringger event to call a table function
document.addEventListener('data-db', function(e) {
        if('connectServer' === e.detail.message){
            db_getDataSaveLocal()
        }
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




function isISODateString(dateString) {
    // Regular expression for ISO date format - chekc if  ISO format 2024-12-06T23:53:39.000Z
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
    return isoRegex.test(dateString);
}
  
function convertSODate(dateString) {
    if (isISODateString(dateString)) {
      const date = new Date(dateString);
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
      const year = date.getUTCFullYear();
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    } else {
        return dateString.replace(/-/g, '/');
        console.log("not find")
    }
}