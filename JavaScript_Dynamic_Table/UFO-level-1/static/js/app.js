// from data.js

let tableData = data;

//Create reference to the table body 

let tbody = d3.select("tbody");

//Create nested "forEach" to both append a row for each element,
//and append a value for each column

tableData.forEach(element => {
    let row = tbody.append("tr");
    Object.values(element).forEach(value => {
        row.append("td").text(value);
    });
});

//Create reference to input



let enter = d3.select("#filter-btn");

enter.on("click", function() {
    
    let table = document.getElementById("ufo-table");

    for (let i=table.rows.length - 1; i>0; i--) {
        table.deleteRow(i);
    }
    
    var inputElement = document.getElementById("datetime").value;
    console.log(inputElement);
 
    tableData.forEach(element => {
        if (inputElement == element.datetime) {
            let row = tbody.append("tr");
            Object.values(element).forEach(value => {
                row.append("td").text(value);
            })
        
        }
    });
});

let reset = d3.select("#filter-btn2");

reset.on("click", function () { 

    let table = document.getElementById("ufo-table");

    for (let i=table.rows.length - 1; i>0; i--) {
        table.deleteRow(i);
    }
    
    tableData.forEach(element => {
    
        let row = tbody.append("tr");
        Object.values(element).forEach(value => {
            
            row.append("td").text(value);
        });
    });

});
