//MAINAPP
CNCSNIPET = {
    SW: null,
    DB: null, //TODO:
    myDB: {titlle:[]}, //data
    dbsnipet:{},
    start() {
      //called after DOMContentLoaded
      //register our service worker
     CNCSNIPET.registerSW();
      
      //TODO:
      CNCSNIPET.db_update()
          .then((response) => {
              console.log("All DATABASE IS DONE1 " , CNCSNIPET.dbsnipet)
              TABLE1.leftMenu()
              TABLE1.main_table(CNCSNIPET.dbsnipet.sheet1)
              TABLE1.searching()
              
          })
    },
    registerSW() {
        if ('serviceWorker' in navigator) {
      
            navigator.serviceWorker.register('/SW.js').then(function(registration) {
                console.log('ServiceWorker registration successful! 1'); //, registration.scope
  
                    // Listen for messages from the service worker
                      navigator.serviceWorker.addEventListener('message', (event) => {
                          CNCSNIPET.onMessage(event)
                      });
                  //updateSW- it's seem to be doesn't work
                  document.getElementById("updateSW")
                      .addEventListener("click",()=>{
                          registration.update()
                          console.log("ok update service worker")
                  })
            })
            .catch(function(error) {
                console.log('Service Worker registration failed:', error);
            });
        }
    },
    sendMessage(msg) {
       //send some structured-cloneable data from the webpage to the sw
       let message = {
          type: msg,
          text: 'Hello from the main page!'
      }
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage(message);
        }
    },
    onMessage(event) {
        //got a message from the service worker
        // console.log(event.data);
        if(event.data.type == 'CACHE_REMOVE'){
            console.log("CACHE already remove !","\nrefesh to get a New Cache","\nmake sure you're not in Ofline mode")
           setTimeout(()=> location.reload(), 500)
           //location.reload();
        }
    },
    db_open(callback){
  
          const request = indexedDB.open("CNCsnipet1", 1);  // Open DB, version 1
          request.onupgradeneeded = async function(event) {
              
                  let db = event.target.result;
                  
                  // Check if the object stores already exist, and create them if not
                  if (!db.objectStoreNames.contains('productID')) {
                      db.createObjectStore('productID', { keyPath: 'id' }); 
                      CNCSNIPET.db_New = CNCSNIPET.db_New || [] 
                      CNCSNIPET.db_New.push('productID')
                  }
              
                  if (!db.objectStoreNames.contains('sheet1')) {
                      db.createObjectStore('sheet1', { keyPath: 'id' });
                      CNCSNIPET.db_New = CNCSNIPET.db_New || [] 
                      CNCSNIPET.db_New.push('sheet1')
                      
                  }
  
  
                  //for test remove
                  if (!db.objectStoreNames.contains('sheet2')) {
                      db.createObjectStore('sheet2', { keyPath: 'id' });
                  }
  
  
  
  
  
  
  
  
                  console.log("Database CREATE successfully.");
          }
      
          request.onsuccess = function(event) {
              CNCSNIPET.DB = event.target.result
              callback()
          };
  
          request.onerror = function(event) {
              console.error("Database error:", event.target.errorCode);
          };
  
      
          
    },
    async fetchData(url) {

        if (!navigator.onLine) {
            console.error('You are currently offline. Please check your internet connection.');
            return null;  // Handle offline state here
        }

      try {
          const response = await fetch(url);
          if (!response.ok) {
              //throw new Error(`HTTP error! Status: ${response.status}`);
              console.warn(`HTTP error! Status: ${response.status}`);
          }
  
          const data = await response.json();
  
          return data;
      } catch (error) {



        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            console.warn('Network error: No internet connection or server is unreachable');
        } else {
            console.warn('There was an error fetching the data:', error);
            console.warn("it seems like - you don't have internet connecttion",url)
        }
        return null;  // Handle the error accordingly
      }
    },
    async db_saveValue(storeName, dataArray) {

     //db_saveValue("sheet1",[{id:"sheet1", value:dbsheet1}])  <== how to use
      return new Promise((resolve, reject) => {
    
          let db = CNCSNIPET.DB
          let transaction = db.transaction([storeName], 'readwrite');
          let objectStore = transaction.objectStore(storeName);
          let itemsProcessed = 0; // Counter for processed items
  

          console.log(dataArray)

          // Function to handle adding data
          dataArray.forEach(data => {
              let request = objectStore.put(data);
  
              request.onerror = function() {
                  //reject(event.target.error);
              }; 
  
              request.onsuccess = function() {
                  console.log(`Data added/updated:`, data);
                  itemsProcessed++; // Increment the counter
      
                  // Check if all items have been processed
                  if (itemsProcessed === dataArray.length) {
                      //callback(); // Call the callback function when all done
                      resolve();
                  }
              };
  
          });
  
          // Optionally, handle transaction completion
          transaction.oncomplete = function() {
              //console.log('Transaction completed successfully.');
  
          };
          transaction.onerror = function(event) {
              //console.error('Transaction error:', event.target.errorCode);
          };
  
      });
    },
    async db_offlinelDATA(){
  
              return new Promise((resolve, reject) => {
                  let db = CNCSNIPET.DB
                  let objectStoreNames = db.objectStoreNames;
                  //get all data in INDEDDB
                  // Create an array of promises to fetch all object store values
                  let fetchPromises = Array.from(objectStoreNames).map(storeName => {
                      return new Promise((resolve, reject) => {
                          let transaction = db.transaction(storeName, 'readonly');
                          let objectStore = transaction.objectStore(storeName);
                          let getAllRequest = objectStore.getAll();
                          
                          getAllRequest.onsuccess = function(event) {
                              //console.log(event.target.result)
                              if(event.target.result) {
                                  event.target.result.forEach(records =>{
                                      CNCSNIPET.dbsnipet[records.id] = records.value.map(x => x);
                                      //loop through all  objectStoreNames => get all records  
                                  })
                              }
                              resolve()
                          };
  
                          getAllRequest.onerror = function(event) {
                              console.error((`Error fetching values from ${storeName}: ${event.target.errorCode}`))
                              //reject(`Error fetching values from ${storeName}: ${event.target.errorCode}`);
                          };
                      });
                  });
  
                  // Use Promise.all() to wait for all the object store fetches to complete
                  Promise.all(fetchPromises)
                      .then(() => {  
                          //console.log(CNCSNIPET.dbsnipet)
                          resolve()
                      })
                      .catch(error => {
                          console.error('Error fetching values from object stores:', error);
                  });
              })
    },
    async db_update() {
     
          return new Promise((resolve, reject) => {
              CNCSNIPET.db_open(async () => {
  
                  async function update(array) {
                      if(!array) {
                          console.log("Offline Database")
                          await CNCSNIPET.db_offlinelDATA()
                          return 
                      }
                      await Promise.all(array.map(async (store) => {
                          await CNCSNIPET.db_upDateStore(store);
                          console.log('Processed:', store);
                      }));
                      console.log('All items processed');
                  }
                  await update(CNCSNIPET.db_New);
                  resolve()
              });
      });
  
    },
    async db_upDateStore(storeName) {
      let param
          param = (storeName === "productID") ?
          param = "productcode" : param = "sheet1"
  
          console.log(param+" is loading ...")
          // Function to convert the object to an array of objects
          const removeHeaders = (obj) => {
              const resultArray = [];
  
              for (const key in obj) {
                  if (Array.isArray(obj[key])) {
                      // Remove the header and create an object with id and value
                      const values = obj[key].slice(1); // Exclude the first element (header)
                      resultArray.push({ id: key, value: values }); // Create an object with id and values
  
                      CNCSNIPET.dbsnipet[key] = values
                  }
              }
  
              return resultArray;
          };
  
      //fetch URL
      await CNCSNIPET.fetchData('https://script.google.com/macros/s/AKfycbxDzyJQ3mT8tG07IsFky5UgRnniwLdGMZseR3P3rvDwybf8dRoOiOXlyfIFX36nshvc/exec?name='+param)
          .then(response => {
              //console.log(response)
              data = removeHeaders(response)
              
      });     
  
      await CNCSNIPET.db_saveValue(storeName, data)
  
    },
    db_getNewest(){
        //force get all newest data from server
        let load_producid = async function() {
            console.log("getting...");
            try {
                await CNCSNIPET.db_upDateStore("productID");
                console.log("Product ID updated");
                await CNCSNIPET.db_upDateStore("sheet1");
                console.log("sheet1 updated");

                setTimeout(() => location.reload() , 200)

            } catch (error) {
                console.error("Error updating product ID:", error);
            }
        };
        load_producid()
    },
    debugtools(){
        document.getElementById('btn_devtools').addEventListener("click", event_debugtools)
        document.getElementById('btn_devtools').classList.remove("hide")

        function event_debugtools(e){
            switch (e.target.id) {
                case 'clear-cache':
                    CNCSNIPET.sendMessage('CACHE_REMOVE')
                break;
                case 'cache-again':
                    CNCSNIPET.sendMessage('CACHE_RESOURCES')
                break;
                case 'load-producid':
                    let load_producid = async function() {
                        console.log("getting...");
                        
                        try {
                            await CNCSNIPET.db_upDateStore("productID");
                            console.log("Product ID updated");
                        } catch (error) {
                            console.error("Error updating product ID:", error);
                        }
                    };
                    load_producid()

                break;
                case 'load-sheet1':
                    let load_sheet1 = async function() {
                        console.log("getting...");
                        
                        try {
                            await CNCSNIPET.db_upDateStore("sheet1");
                            console.log("Product ID updated");
                        } catch (error) {
                            console.error("Error updating product ID:", error);
                        }
                    };
                    load_sheet1()
                break;
                case 'write-sheet1-into-db':
                    CNCSNIPET.testwrite()
                break;
                case 'setup-table':
                    TABLE1.newLoad(CNCSNIPET.dbsnipet.sheet1);
                break;
                default:

                    break;
            }
        }
    },
    testwrite(){
            const dataArray = CNCSNIPET.dbsnipet.sheet1
            let db = CNCSNIPET.DB
        
            const transaction = db.transaction("sheet2", "readwrite");
            const objectStore = transaction.objectStore("sheet2");
        
            // Loop through the data array and add each element
            dataArray.forEach(item => {
                const key = item[1]; // This is the array of IDs
                const label = item[0]; // This is the label (e.g., "a" or "b")
        
                key.forEach(id => {
                    const data = { id: id, label: label }; // Create an object with id and label
                    const request = objectStore.add(data);
        
                    request.onsuccess = function() {
                        console.log(`Added data: { id: ${id}, label: ${label} }`);
                    };
        
                    request.onerror = function(event) {
                        console.error("Error adding data:", event.target.error);
                    };
                });
            });
        
            transaction.oncomplete = function() {
                console.log("All data added successfully.");
            };
        
            transaction.onerror = function(event) {
                console.error("Transaction error:", event.target.error);
            };
    },
}

//document.getElementById('write-sheet1-into-db').addEventListener

//MODULE
const TABLE1 = {
    leftMenu(){

        icon_menu()
        document.querySelector(".sidenav").addEventListener("click", click_menu);

        function close_show(){
            document.getElementById("sideNavigation").classList.toggle("show")
        }
        function icon_menu(){
            document.querySelector("a.ham-icon").addEventListener("click", () => close_show())
            document.querySelector("a.close-btn").addEventListener("click", () => close_show())
        }
        function click_menu(e){
                
                // Check if the clicked element is the target (or contains specific classes)
               const element = e.target;
           
               // Array of class names to check
               const className = element.textContent
               console.log(className)
               switch (className) {
                       case "Get Server":
                                document.querySelector("table tbody").innerHTML = "<tr><td colspan=9>Loading ....</td></tr>"
                                CNCSNIPET.db_getNewest()
                                close_show()
                           break;
                        case 'Post Server':
                            //Click on mode Select
                            TABLE1.main_table_sendServer()
                            close_show()
                        break;
                       case 'Code ID':
                               //Show CODE ID
                            //    modules.main_table_showIDCODE() 
                           break;
                       case 'Select':
                               //Click on mode Select
                            //    modules.clickMenu_selectMode(element)
                           break;
                       case 'Machine1':
                       case 'Machine2':
                       case 'Machine3':
                       case 'Machine4':
                       case 'Machine5':
                               //Machines..
                            //    modules.main_table_showMACHINES(parseInt(className.slice(-1) ))
                           break;
                       case 'Show All':
                       case 'Show Active':
                       case 'Show Pending':
                               //doing..
                            //    main_showStatusTb(className.replace('Show ','').toString().toLowerCase())
                       break;
                       case 'Home':
                               //doing.. ×
                            //    location.reload();
                       break;
                       case '×':
                               //close - ×
                       break;
                       default:
                           console.log('No matching action found');
               }
               //Hide menu
               element.classList.toggle("show")
           
        }


    },
    searching(){

        const search = document.querySelector("div.input_group input[type=search]")
        const table_rows = document.querySelectorAll("tbody tr");
       
        const cleanNewRows = e => {
                document.querySelectorAll("tbody tr.newRow").forEach(row => row.remove())
        }
        search.addEventListener('click',cleanNewRows);
    
        search.addEventListener('input',searchTable);
        function searchTable(){
            table_rows.forEach( (row, i) => {
    
                //console.log({row});
                // console.log(row.cells[6].textContent); //search Status
    
                let table_data = row.textContent.toString().toLowerCase();  //Search ALL rows table
                //let table_data = row.cells[6].textContent.toString().toLowerCase();       //search Only Cells[6] status
    
                    search_data = search.value.toString().toLowerCase();
                    // console.log(table_data.indexOf(search_data))
                    row.classList.toggle('hide', table_data.indexOf(search_data) < 0);
                    row.style.setProperty('--delay', i/25 + 's')
            } )
        }
        
    },
    main_table(database_sheet1){
          let db_sheet1 = database_sheet1; //database_sheet1.slice(0, 20); //cat lay 20 element
  
          if(!db_sheet1) return;
  
          const dFrag = document.createDocumentFragment(); 
          db_sheet1.forEach((col , key) =>{
  
              let text = `<p class="col1 ${col[5]}">${col[0]}</p>`;
              let text2 = `${col[2]}<p class="col3">${col[11]}</p><p class="col3">${col[12]}</p>`;
  
              //sort number of part we did
              const new_sort = (text) => {
                  if(!text) return;
                  let string = text.toString().split(",")
                  const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
                  return string.sort(collator.compare).join(",")
              }
              let partdo = new_sort(col[3])
              let text7 = machine_Worklist(col[4])
              let time14 = main_getbacktime(col[14]) //show the time
  
              let tr = document.createElement('tr');
                  tr.dataset.key = key;
                  tr.innerHTML =`
                  <td>${text}</td> 
                  <td>${col[1]}</td>
                  <td>${text2}</td>
                  <td>${col[12]}</td>
                  <td>${col[11]}</td>
                  <td>${col[13]}</td>
                  <td>${col[5]}</td>
                  <td><p class="col3">${partdo}</p><p>${text7}</p></td>
                  <td>${time14}</td> `;
              dFrag.appendChild(tr);
                 
          });
          document.querySelector("table tbody").innerHTML = "";
          document.querySelector("table tbody").appendChild(dFrag);

          //add event listenning table
          document.querySelector("table tbody").addEventListener("click", TABLE1.main_tableExtened_show)
          document.querySelector("table tbody").addEventListener("click", TABLE1.main_tableExtened_listenner)

    },
    main_tableExtened_show(e){
        let dbsheet1 = CNCSNIPET.dbsnipet.sheet1
        //Show extened Row when Click on Table get more infomation
        let tr = e.target.closest("tr"); // let row_id = tr.rowIndex;
        let next_element = tr.nextElementSibling;

        //If this row is open extened row this action will close it
        if(next_element.classList.contains("newRow")){
            next_element.classList.toggle("new_Hide");
            return TABLE1.main_tableExtened_clean()
        }
        //if user clicl this rows is a Extened row - nothing Happen 
        if(tr.classList.contains("newRow")) return 


        let key = parseInt(e.target.closest("tr").dataset.key)

        let s = {
            set:    dbsheet1[key][12],
            cont:   dbsheet1[key][11],
            id:     dbsheet1[key][1],
            date:   main_getbacktime(dbsheet1[key][14]),
            parts:  dbsheet1[key][3],
            comments:   dbsheet1[key][4],
            m1: dbsheet1[key][6],
            m2: dbsheet1[key][7],
            m3: dbsheet1[key][8],
            m4: dbsheet1[key][9],
            m5: dbsheet1[key][10],
        }

    //     return;
    //     let parent = tr;
    //    let id = parseInt(parent.dataset.key)

    //     let s_set = dofun.data_sheet1[id][12]
    //     let s_cont = dofun.data_sheet1[id][11]
    //     let s_id = dofun.data_sheet1[id][1]

    //     let s_date = main_getbacktime(dofun.data_sheet1[id][14])
    //     let s_parts = dofun.data_sheet1[id][3]

    //     let s_comments = dofun.data_sheet1[id][4]
    //     let s_m1 = dofun.data_sheet1[id][6]
    //     let s_m2 = dofun.data_sheet1[id][7]
    //     let s_m3 = dofun.data_sheet1[id][8]
    //     let s_m4 = dofun.data_sheet1[id][9]
    //     let s_m5 = dofun.data_sheet1[id][10]

        //Machines Expaned -Show what part you're have done
        const split_commentvalue = (text) => {
                if(!text) return "";
                if(!typeof value === 'object') return "";
                let text_output = [];
                let news_comment = JSON.parse(text)

        //UNlock this to see what have done when Extention tr open        
                let ss_m1 = [],
                    ss_m2 = [],
                    ss_m3 = [],
                    ss_m4 = [],
                    ss_m5 = []

                    news_comment.data.forEach(e => {
                            //console.log(e)
                            let part = e[0],
                                qty = e[1],
                                machines = e[3];

                            text_output.push(part)
                           // part = (qty =="") ? part : part +"/"+ qty

                            let maachine = machines.split(",")
                                maachine.forEach(m => {

                                    if (m == "M1")  ss_m1.push(part) 
                                    if (m == "M2")  ss_m2.push(part) 
                                    if (m == "M3")  ss_m3.push(part) 
                                    if (m == "M4")  ss_m4.push(part) 
                                    if (m == "M5")  ss_m5.push(part) 
                                })
                    })

                    //Remove duplicate values
                    let uniqueArray = text_output.filter(function(item, pos) {
                        return text_output.indexOf(item) == pos;
                    })

                    //SORT String by NUMBER
                    const new_sort = (text) => {
                            let string = text //.toString().split(",")
                            const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
                            return string.sort(collator.compare).join(",")
                    }
                return new_sort(uniqueArray)
        }
        s.comments = split_commentvalue(s.comments);
        
        //add new one
        let newRow = document.createElement("tr")
            newRow.setAttribute("Class","newRow new_Hide");
            newRow.dataset.key = key;

        //get teamplates 
        let text = document.getElementById("template-extenedTR").textContent; //document.getElementsByTagName("noscript")[1].textContent;
        let newtxt = text.replace(/{s_cont}/, s.cont)
                        .replace(/{s_set}/, s.set)
                        .replace(/{s_id}/g, s.id)
                        .replace(/{s_date}/, s.date)
                        .replace(/{s_parts}/, s.parts)
                        .replace(/{s_comments}/, s.comments)
                        .replace(/{s_m1}/, s.m1)
                        .replace(/{s_m2}/, s.m2)
                        .replace(/{s_m3}/, s.m3)
                        .replace(/{s_m4}/, s.m4)
                        .replace(/{s_m5}/, s.m5)

                      // .replace(/{data-script}/, divDataScript)

            newRow.innerHTML = newtxt;

        document.querySelector("table tbody").insertBefore(newRow,tr.nextElementSibling);
        setTimeout(() => newRow.classList.remove("new_Hide"),100)
    },
    extened_row: function(id) {
            //table tbody tr - mo rong -extention

            if(!dofun.data_sheet1[id][4]) return null
            //add data-script 
            let divDataScript = dofun.data_sheet1[id][4].slice(0)

            let datatime = JSON.parse(divDataScript)

            const sort_string = (text) => {
                let string = text.toString().split(",")
                const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
                return string.sort(collator.compare).join(",")
            }
            //let sort = sort_string(datatime.data)


            let tmp_array = [];
            let new_array = datatime.data.forEach( (e, k)=> {
                            tmp_array.push([ e[0] , k ]) 
            })

            let output = "Part Min Machines \r\n \r\n";
            let allArray = [];

            let output2 = "";

            //make new time and machine
            let times = datatime.data.sort((a, b) => a[0] - b[0]);  //sort by col1

                times.forEach(e => {
                        let part = e[0].length < 2 ? "0"+ e[0] : e[0],
                            qty = !e[1] ? "00" : e[1],
                            time = !e[2] ? "00" : e[2],
                            machine = e[3],
                            date = e[4];

                        // let array = [];
                        //     array.push([part, time, machine])

                            allArray.push([part, time, machine])
                            output += [part, time, machine].join(" ") + "\r\n"

                            output2 +=`<span>${part} ${qty} ${time} ${machine} ${date}</span><br>`;

                })
            return output2

    },
    main_tableExtened_clean(){
        setTimeout(() => document.querySelectorAll("table tbody tr.newRow").forEach((row,i) => row.remove()) ,500);
    },
    ex_machineUpdate(e) {
        let dbsheet1 = CNCSNIPET.dbsnipet.sheet1
        let id = parseInt(e.closest("tr").dataset.key)
        let p_content = e.closest("td").querySelectorAll("P")

        // Convert NodeList to an array and map over it to get innerText of each <p>       
        let array = Array.from(p_content).map(p => p.textContent)

        dbsheet1[id][11] = array[0] //cont
        dbsheet1[id][12] = array[1] //set
        dbsheet1[id][1] = array[2] //id
        dbsheet1[id][14] =  Date.now() //array[3] -- times update

        //display newtime
        p_content[3].textContent = main_getbacktime(dbsheet1[id][14])

        dbsheet1[id][3] = array[4] //CNC Plan WILL DO
        dbsheet1[id][6] = array[6] //m6
        dbsheet1[id][7] = array[7] //m7
        dbsheet1[id][8] = array[8] //m8
        dbsheet1[id][9] = array[9] //m9
        dbsheet1[id][10] = array[10] //m10


        CNCSNIPET.db_saveValue("sheet1",[{id:"sheet1", value:dbsheet1}])
        console.log("db update!")

    },
    ex_machineAdd(e){

        dbsheet1 = CNCSNIPET.dbsnipet.sheet1

        let parent = e.closest("tr").previousElementSibling;
        let id = parseInt(parent.dataset.key)

        //BUILD TEAMPLE HTML
        //Get template
        let template = document.getElementById("template-form-add-machine").textContent,
            template_rep = template.replace(/{s_title}/g, e.textContent)

        //Put teample into the DIV
        document.querySelector("DIV.Extended_Machine").innerHTML = template_rep;

        //SELECT DOM -ELEMENTS
        const div = document.querySelector("DIV.Extended_Machine")
        const cancelbtn = div.querySelector("BUTTON.cancelbtn")
        const submitbtn = div.querySelector("BUTTON.signupbtn")
        
        //Show DIV HTML
        div.classList.toggle("visible")


        //SUBMIT BTN FUNCTION
        const submitbtn_fn = (e) => {
            
                let input = div.querySelectorAll("input");
                let machine = input[3].value

                
                if(input[0].value ===""){
                    //alert("Empty")
                    document.querySelector("label").style.color = "red";
                    return
                } 

                //IF empty create New Oject to store
                if(!dbsheet1[id][4]) { 

                    let makeojb2 = { 
                        data: []
                     }
                    makeojb2.data.push([input[0].value, input[1].value, input[2].value , machine , Date.now()]) //Part, qty,time,machine
                    dbsheet1[id][4] = makeojb2
                }
                else{
                    //If Object is ready Add
                    if(typeof(dbsheet1[id][4]) == "string")
                    dbsheet1[id][4] = JSON.parse(dbsheet1[id][4])
                    dbsheet1[id][4].data.push([input[0].value, input[1].value, input[2].value , machine , Date.now()])
                }
                dbsheet1[id][4] = JSON.stringify(dbsheet1[id][4])

                document.querySelector("DIV.blockClick").classList.toggle("show")

                //SAVE DB
                CNCSNIPET.db_saveValue("sheet1",[{id:"sheet1", value:dbsheet1}])
                cancelbtn.click();
                console.log("sheet1 has been update!"); 
                document.querySelector("DIV.blockClick").classList.toggle("show")
        }
    
        //DOM ADD EVENT
        cancelbtn.addEventListener("click", e => {
            submitbtn.removeEventListener("click", submitbtn_fn)
            div.classList.toggle("visible")
            div.innerHTML = "";
        }, {once : true})

        submitbtn.addEventListener("click", submitbtn_fn) 
    },
    ex_machineView(e) {

        let dbsheet1 = CNCSNIPET.dbsnipet.sheet1
        let parrent = e.closest("td");
        let tr = parseInt(e.closest("tr").previousElementSibling.dataset.key) //id
        
        //disbale edit mode From M1 -- M4
        const editmode = (e, mode) => {

            //disable button Update
            mode? e.parentNode
                    .lastElementChild
                    .textContent = "Update"
                : e.parentNode
                    .lastElementChild
                    .textContent = "Modify"
        }

        if(e.textContent == "Modify") {

            function insert_remove_btn(enable = true){
                let array_return = []
                let Machine_workList = parrent.querySelector(".Machine-workList")
                if(!Machine_workList) return
                    const children = Machine_workList.querySelectorAll('li');

                    //Convert the NodeList to an array
                    const childrenArray = Array.from(children);
                    childrenArray.shift()
                    if(childrenArray){
                        childrenArray
                            .forEach((el, index) => {
                                    let insert = el.lastElementChild.lastElementChild

                                    if(enable) {
                                        insert.dataset.key = index
                                        insert.className ="Machine-workList-remove"
                                        insert.innerHTML = "&#10008;"
                                    }else{
                                        insert.className =""
                                        insert.innerHTML = ""
                                        array_return.push(parseInt(insert.dataset.key))
                                    } 
                                    
                        })
                    }
                //these are id that we save back to dbsheet1
                return array_return 
            }

            //remove button - the job is done
            if(e.className =="modify-done" ){
                
                // get id from li Element to save
                let arrayId = insert_remove_btn(false)
                e.className = ""
                console.log(arrayId)


                let rowId = parseInt(e.closest("tr").dataset.key)
                let dbsheet1 = CNCSNIPET.dbsnipet.sheet1

                //convert string to OBJ
                let dbsheet1_row = JSON.parse(dbsheet1[rowId][4])

                //sort in order - like html showup
                function sort_array(data){
                        // Custom sorting function
                        return data.sort((a, b) => {
                            const numA = parseInt(a[0], 10); // Parse the numeric part of the first element
                            const numB = parseInt(b[0], 10);
                        
                            // Compare the numeric values first
                            if (numA !== numB) {
                                return numA - numB; // Sort by numeric value if not equal
                            }
                        
                            // If numeric values are equal, sort lexicographically
                            return a[0].localeCompare(b[0]);
                        });

                }
                dbsheet1_row.data = sort_array(dbsheet1_row.data)


                //remove all Index that we remove before
                dbsheet1_row.data = dbsheet1_row.data.filter((_, index) => arrayId.includes(index));

                //conver OJB to string
                dbsheet1_row  = JSON.stringify(dbsheet1_row)

                //push it back to data.sheet1
                dbsheet1[rowId][4] = dbsheet1_row

                CNCSNIPET.db_saveValue("sheet1",[{id:"sheet1", value: dbsheet1}])
                console.log("Done !")
           
            return;
            }

            //insert button to remove
            insert_remove_btn()
            //change staste to do another action - save when the job done
            e.className ="modify-done"

        return;
        }
        if(e.textContent == "Close") {
            TABLE1.ex_machineClose(e)
            return;
        }
        if(e.textContent == "Back") {

            let workingList = parrent.querySelector(".Machine-workList")
                if(workingList) workingList.remove()

            let mmachine = e => parrent.children[1].children[e].children[1] // document.querry TD > UL 1 > P 
                mmachine(1).textContent = dbsheet1[tr][6]
                mmachine(2).textContent = dbsheet1[tr][7]
                mmachine(3).textContent = dbsheet1[tr][8]
                mmachine(4).textContent = dbsheet1[tr][9]
                mmachine(5).textContent = dbsheet1[tr][10]

                e.textContent = "View"
                // e.parentNode.lastElementChild.textContent = "Update";
                editmode(e, true) 

        return;
        }


        //textContent = view  
        //Avoid Save Update Button
        
        editmode(e, false)      

        if(!dbsheet1[tr][4]) return console.log("No data") // empty
        let ojb = JSON.parse(dbsheet1[tr][4].slice()) //copy data from array
            
            //create new UL 
            const new_ul = document.createElement('ul');
                new_ul.className = "Machine-workList"
            parrent.insertBefore(new_ul, parrent.children[2]);

            //create new li HEADER
            const newListItem1 = document.createElement('li');
            newListItem1.innerHTML = `<div class=li-content><div>Part</div> <div>QTY</div> <div>Date</div>   <div></div> <div></div> </div>\r\n`
            new_ul.appendChild(newListItem1);


            // Custom sorting function
            ojb.data.sort((a, b) => {
                const numA = parseInt(a[0], 10); // Parse the numeric part of the first element
                const numB = parseInt(b[0], 10);
            
                // Compare the numeric values first
                if (numA !== numB) {
                    return numA - numB; // Sort by numeric value if not equal
                }
            
                // If numeric values are equal, sort lexicographically
                return a[0].localeCompare(b[0]);
            });

            //Push into LI element list
            ojb.data.forEach(el => {
                let part = el[0],
                    //content = el[1],
                    qty = (el[1].length == 0) ? `` : `  ${el[1]} `, 
                    time = (el[2].length == 0) ? `` : `  ${el[2]} min`,
                    machine = el[3],
                    date = main_getbacktime(el[4]),
                    combines = `<div class=li-content><div>${part}</div> <div>${qty}</div> <div>${main_getbacktime(date)} </div>  <div>${machine}</div> <div>${time}</div> </div>\r\n`

                        const newListItem1 = document.createElement('li');
                        newListItem1.innerHTML = combines;
                        new_ul.appendChild(newListItem1);
                
            });
            
            e.textContent = "Back"
    },
    main_tableExtened_listenner(e){
        //only for extened event
        if(e.target.closest('tr').className !== 'newRow') return

        let node = e.target
        let machine = ["M1","M2","M3","M4","M5"]
        if(node.nodeName == "H1"){
            if(node.textContent === "View" || 
                node.textContent === "Back" || 
                node.textContent === "Close" ||
                node.textContent === "Modify"){

                console.log(node.textContent)
                TABLE1.ex_machineView(e.target)
            }
            if(node.textContent === "Update"){
                console.log(node.textContent)
                TABLE1.ex_machineUpdate(e.target)
            }
            if(machine.includes(node.textContent)){
                console.log(node.textContent)
                TABLE1.ex_machineAdd(e.target)
            }
        }
        //remove list part that extend machine did
        if(node.className =="Machine-workList-remove"){
            e.target.closest("li").remove()
        }
        
    },
    ex_machineClose(e){


        //-------------work 

        //remove previous
        if(TABLE1.tmpLastclick){
            TABLE1.tmpLastclick.classList.toggle("row-select-last")
        } 
        e.closest("tr").previousElementSibling.click()

        TABLE1.tmpLastclick = e.closest("tr").previousElementSibling
        TABLE1.tmpLastclick.classList.toggle("row-select-last")


        let id = e.closest("tr").previousElementSibling.rowIndex
        var rows = document.querySelectorAll('table tbody tr');

        // line is the row number that you want to see into view after scroll    
        rows[id-1].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
       // e.closest("tr").previousElementSibling.click()
    },
    main_table_sendServer(){
        //only sheet1
        let dbsheet1 = CNCSNIPET.dbsnipet.sheet1
        let URL_SHEETS = "https://script.google.com/macros/s/AKfycbyKZHUQlDqoAEHMw8IqU81Ys-mjE4ihGSJXlfYZheSl-6ZqIgRoN6giXQvxWNHbhr3M/exec?name=post";
        
        
        let db_array = JSON.stringify({sheet1: dbsheet1})
        console.log("Post Data to server...");

        const showMessage = (message, type = 'success') => console.log(type, message)
        const subscribe = async () => {
                try {
                        //post to server
                        let response = await fetch(URL_SHEETS, {
                            redirect: "follow",
                            mode: "cors",
                            method: "POST",
                            body: db_array,
                            headers: {
                                "Content-Type": "text/plain;charset=utf-8",
                            }
                    });
                    const result = await response.text();
                    showMessage(result) //post ok

                } catch (error) {
                    showMessage(error.message, 'error1');
                }
            };
        subscribe();
    },
}


 
//MAINSCRIPT
document.addEventListener('DOMContentLoaded', CNCSNIPET.start);


function debugtools(){
    CNCSNIPET.debugtools()
}


//add-event
function main_getbacktime(dateNow){
    //let date_now = Date.now(); //1712923948000

    let ts = new Date(dateNow); //date_now

        ts.toLocaleDateString(); // 4/12/2024
        ts.toLocaleTimeString(); // 5:12:29 AM
        ts.toLocaleString(); //   4/12/2024, 5:12:29 AM
        ts.toString(); // Fri Apr 12 2024 05:12:29 GMT-0700 (Pacific Daylight Time)
        ts.toTimeString(); //05:12:29 GMT-0700 (Pacific Daylight Time)
        ts.toUTCString(); // Fri, 12 Apr 2024 12:12:29 GMT

        return ts.toLocaleDateString(); //  4/12/2024
}


function templates_up(id, text){

    const template = document.getElementById(id).innerHTML;
    // Define data to replace placeholders
    const data = {
        title: 'My Dynamic Title',
        content: 'This is some dynamic content!'
    };
    // Replace placeholders with actual data
    let filledTemplate = template
    .replace('{{title}}', data.title)
    .replace('{{content}}', data.content);
    // Create a new div element and set its innerHTML to the filled template
    const newModule = document.createElement('div');
    newModule.innerHTML = filledTemplate;

    // Append the new module to the container
    return newModule
    //document.getElementById('container').appendChild(newModule);
}
  









//haven't use this
function sortNumberAndtext(test){
            let text_output = test
            //Remove duplicate values
            let uniqueArray = text_output.filter(function(item, pos) {
                return text_output.indexOf(item) == pos;
            })

            //SORT String by NUMBER
            const new_sort = (text) => {
                    let string = text //.toString().split(",")
                    const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
                    return string.sort(collator.compare).join(",")
            }
        return new_sort(uniqueArray)
}









function machine_Worklist(json){

        //get CNC WORKING LIST SHhow up and sort      
        let dbsheet1 = json //CNCSNIPET.dbsnipet.sheet1[0][4]

        if(!dbsheet1) return // empty string


        //convert string to OBJ
        let dbsheet1_row = JSON.parse(dbsheet1)

        //sort in order - like html showup
        function sort_array(data){
                // Custom sorting function
                return data.sort((a, b) => {
                    const numA = parseInt(a[0], 10); // Parse the numeric part of the first element
                    const numB = parseInt(b[0], 10);
                
                    // Compare the numeric values first
                    if (numA !== numB) {
                        return numA - numB; // Sort by numeric value if not equal
                    }
                
                    // If numeric values are equal, sort lexicographically
                    return a[0].localeCompare(b[0]);
                });

        }
        dbsheet1_row.data = sort_array(dbsheet1_row.data)

        let data = dbsheet1_row.data
        let data_out = []
        data.forEach(e => data_out.push(e[0]))
        data_out = data_out.join(",")
    return data_out
}











