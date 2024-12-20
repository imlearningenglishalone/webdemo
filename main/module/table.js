

export function main_table(){
    table();
    searching();

    dofun.reloadTable = function(e){
        table(e);
    }
}




//data loop
function table(arrayShow) {

    //array = array || dofun.data_sheet1
    let array = dofun.data_sheet1
    const domFrag = document.createDocumentFragment();

    const domFrag_done = document.createDocumentFragment();

    // Iterate over the array from bottom to top
    for (let i = array.length - 1; i >= 0; i--) {
        let col = array[i];
        if (i == 0) continue; // Skip the Header
        
        let vlcol1 = `<p class="col1 ${col[3]}">${convertSODate(col[0])}</p>`;

        col[2] = String(col[2]).replace(/\n/g,"<br>")
            
        let vlcol4 = String(col[4]).replace(/\n\s*-(\d{2}\/\d{2}\/\d{2} : \d{2}:\d{2})\s*\n\s*(.*)/g, '<li>-$1 <span class=subtitle>$2</span></li>');
        let vlcol3 = shortenText(col[2], 25);
        vlcol3 = `<span class="title ${col[3]}">${col[1]}</span><p class=col3>${vlcol1}</p><p><span class="col3A">${vlcol3}</span>
                      <span class="col3B hidden">
                          ${col[2]} <br>
                          <div class="li-event-list hidden"><ul>${vlcol4}</ul></div>
                </span></p>`;

            // Create a new table row
            let tr = document.createElement('tr');
            tr.dataset.key = i;
            tr.innerHTML = `
                <td>${vlcol1}</td>
                <td>${col[3]}</td>
                <td>${vlcol3}</td>
                <td>${col[12]}</td>
                <td>${col[11]}</td>
                <td>${col[13]}</td>
                <td>${col[5]}</td>
                <td><p class="col3"><div class="li-event-list"><ul>${vlcol4}</ul></div></td>
                <td>${col[14]}</td>`;

        if(col[3] !== "done" )
            domFrag.appendChild(tr);
        else
            domFrag_done.appendChild(tr);
    }

    // Clear existing rows in tbody
    document.querySelectorAll("table tbody tr").forEach(row => {
        row.remove();
    });
    const tablebody = document.querySelector("table tbody");
    tablebody.removeEventListener("click",showMoreDetail)
    tablebody.addEventListener("click",showMoreDetail)
    tablebody.appendChild(domFrag);
    tablebody.appendChild(domFrag_done);

    //hidden done
    //document.querySelectorAll("tr.done").forEach(row => row.classList.toggle("hidden"))


    function shortenText(fullText, maxLength) {
        if (fullText.length > maxLength) {
            return fullText.substring(0, maxLength) + '...';
        }
        return fullText;
    }
}
function showMoreDetail(e){
    const td = e.target.closest('td')
    if(e.target.classList.contains("title")){ 
        td.querySelector(".col3B").classList.toggle("hidden")
        td.querySelector(".li-event-list").classList.toggle("hidden")
        td.querySelector(".col3A").classList.toggle("hidden")
     }
}
function searching() {
    const search = document.querySelector("div.input_group input[type=search]"),
    table_rows = document.querySelectorAll("tbody tr");


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

                let search_data = search.value.toString().toLowerCase();
                // console.log(table_data.indexOf(search_data))

                table_data = removeVietnameseDiacritics(table_data)
                search_data = removeVietnameseDiacritics(search_data)

                row.classList.toggle('hide', table_data.indexOf(search_data) < 0);
                //row.style.setProperty('--delay', i/25 + 's')
        } )
    }
}
function removeVietnameseDiacritics(str) {
    const map = {
        'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
        'ă': 'a', 'ắ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
        'â': 'a', 'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
        'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
        'ê': 'e', 'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
        'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
        'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
        'ô': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
        'ơ': 'o', 'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
        'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
        'ư': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
        'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
        'đ': 'd',
        'Á': 'A', 'À': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
        'Ă': 'A', 'Ắ': 'A', 'Ằ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
        'Â': 'A', 'Ấ': 'A', 'Ầ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
        'É': 'E', 'È': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
        'Ê': 'E', 'Ế': 'E', 'Ề': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
        'Í': 'I', 'Ì': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
        'Ó': 'O', 'Ò': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
        'Ô': 'O', 'Ố': 'O', 'Ồ': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
        'Ơ': 'O', 'Ớ': 'O', 'Ờ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
        'Ú': 'U', 'Ù': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
        'Ư': 'U', 'Ứ': 'U', 'Ừ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
        'Ý': 'Y', 'Ỳ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y',
        'Đ': 'D'
    };

    return str.split('').map(char => map[char] || char).join('');
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
  
  // Example usage
//   const isoDateString = "2024-12-06T23:53:39.000Z";
//   const formattedDate = convertToDesiredFormat(isoDateString);
//   console.log(formattedDate); // Output: 06/12/2024 23:53:39
  






