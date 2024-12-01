export function main_navbar(){
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
                        db_remove(() => {
                                location.reload();
                        });
                        return;
                break;
            case "saveSelect":
                        console.log("db_dataLocalUpdate - After Select")
                        //update_dataServer();
                        db_dataLocalUpdate(e => {
                            location.reload();
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
    });



    
    if(state =="pending"){
        eventTringger("pending")
    }
    else{
        //auto save and reload
        document.querySelector("a.menu-link.saveSelect").click()
    }
    

}
function eventTringger(message){
    const event = new CustomEvent('navbar', { detail: { message: message }});
    document.dispatchEvent(event);
}
