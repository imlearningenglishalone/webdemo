

export function main_table(){
    table();
    searching();
}

function table() {

    const dFrag = document.createDocumentFragment(); 
    dofun.data_sheet1.forEach((col , key) =>{

        if(key < 1) return; //Next loop - Skip this loop - We don't want Header

        let text = `<p class="col1 ${col[5]}">${col[0]}</p>`;
        let text2 = `${col[1]}<p class="col3">${col[0]}</p><p class="col3">${col[2]}</p>`;

        //let text7 = col[4] == "" ? col[3] : `${col[3]}<p class="col3">${col[4]}</p>`;

        const new_sort = (text) => {
            if(!text) return;
            let string = text.toString().split(",")
            const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
            return string.sort(collator.compare).join(",")
        }
        let partdo = new_sort(col[3])
        
        //make text Show on colum7
        let text7 = col[4]




        //convert date to short it
        let value_col1 = (isoDateString) => {
            const date = new Date(isoDateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
            const year = String(date.getFullYear()).slice(-2); // Get the last two digits of the year

            return `${day}/${month}/${year}`;
        }
        let vlcol1 = `<p class="col1 ${col[3]}">${col[0]}</p>`;


        // cut terxt content short
        function shortenText(fullText, maxLength){ 
            if (fullText.length > maxLength) {
                 return fullText.substring(0, maxLength) + '...'; 
                } return fullText; 
        }
        let vlcol3 = shortenText(col[2],25)

            vlcol3 = `<span class="title ${col[3]}">${col[1]}</span><p class=col3></p><p><span class="col3A">${vlcol3}</span> <span class="col3B hidden">${col[2]}</span> </p>`;

        let tr = document.createElement('tr');
            tr.dataset.key = key;
            tr.innerHTML =`
            <td>${vlcol1}</td> 
            <td>${col[3]}</td>
            <td>${vlcol3}</td>
            <td>${col[12]}</td>
            <td>${col[11]}</td>
            <td>${col[13]}</td>
            <td>${col[5]}</td>
            <td><p class="col3">${partdo}</p><p>${text7}</p></td>
            <td>${col[14]}</td> `;
        dFrag.appendChild(tr);
           
    });
    document.querySelector("table tbody tr") 
        && document.querySelector("table tbody tr").remove(); // remove first tr loadding
    document.querySelector("table tbody").appendChild(dFrag);

    document.querySelector("table tbody").addEventListener("click",function(e){
        const td = e.target.closest('td')

        //if(e.target.closest("td") && td.cellIndex === 2){ 
        if(e.target.classList.contains("title")){ 
            td.querySelector(".col3B").classList.toggle("hidden")
            td.querySelector(".col3A").classList.toggle("hidden")
         }
    })
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
