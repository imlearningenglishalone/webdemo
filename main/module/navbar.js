export function main_navbar(){

    return

    // dofun.navbar_click = navbar_Click
    // dofun.navbar_addEvent = navbar_addEvent
    return (() => {
        document.querySelector(".sidenav").addEventListener("click",navbar_Click);
        document.querySelector("a.ham-icon").addEventListener("click", () => document.getElementById("sideNavigation").classList.toggle("show"));
        document.querySelector("a.close-btn").addEventListener("click", () => document.getElementById("sideNavigation").classList.toggle("show"))
        console.log("main:nabar")
    })();

    function tableSelect(e){ //Click on table row
        e.target.closest("tr").classList.toggle("row-select");
    }
    function tableSelectCleanUp(){
        document.querySelectorAll("table tbody tr.row-select").forEach((row,i) => row.classList.remove("row-select"));
    }
    function tableRemove(){ //find row by select and remove from id

        const data_sheet1 = dofun.data_sheet1;
        let valuesToRemove = []; //list of value to remove base on table and row id

            document.querySelectorAll("table tbody tr.row-select").forEach(row =>{
                console.log(row.rowIndex)
                let rowId = row.rowIndex; //get ID of table
                let id = parseInt(row.dataset.key);

                    let value = data_sheet1[id]; //find item by id
                    valuesToRemove.push(value); //push in to a list
                    
            });
        if(valuesToRemove.length < 1) return console.log("nothing to remove") 

        let new_sheet1 = data_sheet1.filter(item =>  !valuesToRemove.includes(item))
        db_add ("sheet1", new_sheet1, () => {
                console.log("sheet1 has been update!");
                setTimeout(() => location.reload(),200)
            })
    }
    function update_status(status){
            let valuesToChange = []; //list of value to remove base on table and row id
            document.querySelectorAll("table tbody tr.row-select").forEach(row =>{
                let id = row.rowIndex; //get ID of table
                let data_id = id - 1;
                    valuesToChange.push(data_id); //push in to a list
            });


            if(valuesToChange.length < 1) return console.log("nothing select") 

            let dataSelect = [];
            valuesToChange.filter(item =>{
                dataSelect.push(document.data_sheet1[item]) 

                document.data_sheet1[item][5]= status

            })



            // console.log [valuesToChange,dataSelect];

            //save to local Srtore
            let new_sheet1 = document.data_sheet1;
            new_sheet1.unshift(document.data_sheet1_header);
            console.log(new_sheet1);

            localStorage.removeItem("data_sheet1");
            document.querySelector(".blockClick").classList.toggle("show");
            localStorage.setItem('data_sheet1', JSON.stringify(new_sheet1));
            setTimeout(() => location.reload(),2000) //delay 
            //setTimeout(() => document.querySelector(".blockClick").classList.toggle("show"),2000) //delay

        
    }
    function navbar_Click(e){ //Swich Click
            //let cls = e.target.classList;
            let elementClick = e.target.classList;
            let nav = e.currentTarget.classList

            console.log("Navbar::",elementClick[1])
            switch(elementClick[1]) {
            case "close-btn":

            break;
            case "link-remove":
                    console.log("edit remove table")
                    tableRemove();
            break;
            case "link-select":

                    //push function to Temp
                    dofun.tableSelectCleanUp = tableSelectCleanUp; //clean row choice color
                    //dofun.update_status = update_status; 
                    if(elementClick.toggle("select")){
                            dofun.tableSelect = tableSelect
                            document.querySelector("table tbody").addEventListener("click",dofun.tableSelect)
                            
                            document.querySelectorAll(".menu-link.lk-Select").forEach(e => e.classList.toggle("visible"))
                    } 
                    else{
                            document.querySelector("table tbody").removeEventListener("click",dofun.tableSelect)
                           
                            document.querySelectorAll(".menu-link.lk-Select").forEach(e => e.classList.toggle("visible"))

                            //document.querySelector(".menu-link.link-edit").classList.toggle("visible")
                            //document.querySelector(".menu-link.link-remove").classList.toggle("visible")
                            
                            dofun.tableSelectCleanUp();

                            //remove temp function
                            delete dofun.tableSelectCleanUp
                            delete dofun.tableSelect
                            delete dofun.update_status 
                    }
                    nav.toggle("show");
            break;
            case "reload":
                        db_remove(() => { location.reload(); });
                        return;
                break;
            case "saveSelect":
                        console.log("db_dataLocalUpdate - After Select")
                        //update_dataServer();
                        db_dataLocalUpdate(e => {
                            //location.reload();
                        })
 
                        return;
                break;
            case "pushDataServer":
                    main_table_sendServer();

                break;
            case "status-active":  //set tr, rows active or , peding
            case "status-pending":
            case "status-done":
            case "status-null":
                        main_table_statusRow(elementClick[1].replace('status-',''), tableSelectCleanUp)
                        nav.toggle("show")
                break;
            case "show-all": //Show only active , on ly pennding, or all
            case "show-active":
            case "show-pending":
                        main_showStatusTb(elementClick[1].replace('show-',''))
                        nav.toggle("show")
                break;
            case "newproduct":
                    window.open("https://forms.gle/2ywFY8V5kUKPiKqn9", '_blank');
                    nav.toggle("show")
            break;
            case "sheetView":
                window.open("https://docs.google.com/spreadsheets/d/1W_UFhw1CHzIvITqErDy4LGA4ZZExaqlEry2vCMXUAjM/edit?gid=210637880#gid=210637880", '_blank');
                nav.toggle("show")
            break; 
            default:
                console.log("nothing happen")
            }//end-Swich
    }//end-func
}




function main_table_statusRow(status, callback){
        
    let state = status || "";
    document.querySelectorAll("table tbody tr.row-select").forEach(row => {

        row.cells[2].firstElementChild.className = "title" + " "+ state;
        let id = row.dataset.key
        dofun.data_sheet1[id][3] = state;

        if(status === "done") dofun.data_sheet1[id][4] += "\n -"+ getFormattedDateTime() + " \n Hoàn thành "
        dofun.data_sheet1[id][7] = getFormattedDateTime(); //Update last edit
    });



    
    if(state =="pending"){
        eventTringger("pending")
    }
    else{
        //auto save and reload
        //document.querySelector("a.menu-link.saveSelect").click()
        tableSelectCleanUp();
        dofun.reloadTable()
    }
    

}

//tringger module form
function eventTringger(message){
    const event = new CustomEvent('navbar', { detail: { message: message }});
    document.dispatchEvent(event);
}


// document.querySelector('div#sideNavigation').addEventListener("click", function leftMenuClick(e) {
//     let name = e.target.classList
//      if(name.contains('newproduct')) {
//         console.log("doing sonething new product")
//      }
// });






// function putDataArray(e) {
//     var lock = LockService.getScriptLock();
//     try {
//       if (lock.tryLock(30000)) { // Try to get the lock, timeout after 30 seconds
//         // Critical section
//         let anew = e.postData.contents;
//         let data = JSON.parse(e.postData.contents);
//         let sheet1 = data.sheet1;
//         sheet1.shift();
//         sheet1.reverse();
//         var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
//         sheet.getRange(2, 1, sheet1.length, sheet1[0].length).setValues(sheet1);
//         let response = JSON.stringify({ 'result': 'success1', 'row': anew });
//         return ContentService.createTextOutput(response).setMimeType(ContentService.MimeType.JSON);
//       } else {
//         // Return busy status if lock couldn't be obtained
//         return ContentService.createTextOutput(JSON.stringify({ 'result': 'busy' })).setMimeType(ContentService.MimeType.JSON);
//       }
//     } catch (error) {
//       return ContentService.createTextOutput("Error: " + error.message).setMimeType(ContentService.MimeType.TEXT);
//     } finally {
//       lock.releaseLock(); // Always release the lock
//     }
//   }
  


  
async function sendData() {
    const url = URL_SHEETS; // Replace with your web app URL

    //dofun.data_sheet1.shift(); //remove Header
    let data = {sheet1: dofun.data_sheet1, sheet2: "dofun.data_sheet2"}

    const options = {
      method: 'POST',
      headers: {
        // 'Content-Type': 'application/json' - google error 
        'Content-Type': 'text/plain;charset=utf-8'      
    },
      body: JSON.stringify(data),
      redirect: "follow",
      mode: 'cors' // Enable CORS
    };
  
    try {

      hideshowtable()

      let response = await fetch(url, options);
      let result = await response.json();
  
      if (result.result === 'busy') {
        console.log('Server is busy. Retrying...');
        setTimeout(() => sendData(data), 5000); // Retry after 5 seconds
      } else if (result.result === 'error') {
        console.error('Error from server:', result.message);
      } else {
        console.log('Data submitted successfully:', result);
        
        //hideshowtable()
        //reload page
        document.querySelector('a[data-event="update"]').click()

      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }

    //funtion hide show table
    function hideshowtable(){
      document.querySelector("table tbody").classList.toggle("hidden")
    }

  }
  




/***********************************
  1.Create element and insert into  "sideNavigation"
    
    const navbar = document.getElementById("sideNavigation");
    const anchor = document.createElement('a');
    navbar.appendChild(anchor);

  2.Make a function and affter that connect function dofun

    EXample:
    function abc (){}
    dofun.navabr.abc
  
************************************/ 
function tableSelectCleanUp(){
    document.querySelectorAll("table tbody tr.row-select").forEach((row,i) => row.classList.remove("row-select"));
}
export function new_navbar(){

      // Custom event handlers object
      const navbarFuntion = {
        eshow: function (e){
            e.currentTarget.classList.toggle("show")
        },
        update: function(e){ this.eshow(e), db_remove(() => { location.reload(); }) },
        xong: function(e){ this.eshow(e),  main_table_statusRow("done", tableSelectCleanUp) },
        danglam: function(e){ this.eshow(e),  main_table_statusRow("pending", tableSelectCleanUp) },
        chualam: function(e){ this.eshow(e),  main_table_statusRow("active", tableSelectCleanUp) },
        
        tailen: function(e) { sendData() },  //main_table_sendServer()
        //tailen: function(e) { this.eshow(e), main_table_sendServer() },  //main_table_sendServer()
        addnew: function (e){ this.eshow(e), window.open("https://forms.gle/2ywFY8V5kUKPiKqn9", '_blank')},
        sheet: function (e){ this.eshow(e), window.open("https://docs.google.com/spreadsheets/d/1W_UFhw1CHzIvITqErDy4LGA4ZZExaqlEry2vCMXUAjM/edit?gid=210637880#gid=210637880", '_blank')}
      };
      //publich
      dofun.navbar = navbarFuntion

    const navbarConfig = [
        { "name": "Cập nhật", "event": "update" },

        { "name": "- Đã Xong", "event": "xong" },
        { "name": "- Đang làm", "event": "danglam" },
        { "name": "- Chưa làm", "event": "chualam" },

        { "name": "Tải lên", "event": "tailen" },
        { "name": "Add New", "event": "addnew" },
        { "name": "Sheet", "event": "sheet" }
      ];
    
    //Event listenner     
    const navbar = document.getElementById("sideNavigation");
    document.querySelector("a.ham-icon").addEventListener("click", () => navbar.classList.toggle("show"));
    document.querySelector("a.close-btn").addEventListener("click", () => navbar.classList.toggle("show"))

    //add A html link
      navbarConfig.forEach(item => {
        const anchor = document.createElement('a');
        //anchor.href = "#"; // Prevent default link behavior
        anchor.textContent = item.name;
        anchor.dataset.event = item.event; // Store the event name in a data attribute

        if("tailen" == item.event) anchor.style.display = "none" //hide this button
        navbar.appendChild(anchor);
      });

      // Single event listener to handle all click events within the navbar
      navbar.addEventListener('click', (event) => {
        if (event.target.tagName === 'A') {
          const eventName = event.target.dataset.event;
          if (navbarFuntion[eventName]) {
            navbarFuntion[eventName](event);
          }
        }
      });

}

