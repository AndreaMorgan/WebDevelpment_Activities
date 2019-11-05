

function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample
  var dropdown = d3.select("#selDataset"); 

  var sample = dropdown.property("value");

  var url = `/metadata/${sample}`;

  // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(url).then(function(data) {

    var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(function([key, value]) {
      var row = panel.append("p");
      row.text(`${key} : ${value}`);
    });

    //////
    washes = parseInt(data.WFREQ)
    console.log(data.WFREQ);

    var frequency = {
      domain: { x: [0, 1], y: [0, 1] },
      value: washes,
      title: { text: "Belly Button Washing Frequency, per Week" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 9] },
        steps: [
          { range: [0, 1], color: 'rgb(242, 241, 237)'},
          { range: [1, 2], color: 'rgb(255, 249, 230)'},
          { range: [2, 3], color: 'rgb(255, 244, 209)'},
          { range: [3, 4], color: 'rgb(255, 237, 181)'},
          { range: [4, 5], color: 'rgb(255, 229, 148)'},
          { range: [5, 6], color: 'rgb(255, 221, 126)'},
          { range: [6, 7], color: 'rgb(255, 215, 94)'},
          { range: [7, 8], color: 'rgb(255, 200, 36)'},
          { range: [8, 9], color: 'rgb(255, 191, 0)'},
        ],
        bar: {
          color: "gray"
        }
      }
    };
  var dataFrequency = [frequency];

  Plotly.newPlot("gauge", dataFrequency);
  });
}



function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var dropdown = d3.select("#selDataset"); 

  var sample = dropdown.property("value");

  var url = `/samples/${sample}`;

  
    // @TODO: Build a Bubble Chart using the sample data
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  d3.json(url).then(function(data) {

    var otuIDS = data.otu_ids;
    var otuLABELS = data.otu_labels;
    var sampleVALUES = data.sample_values;
    
    var traceBubble = {
      x: otuIDS,
      y: sampleVALUES,
      marker: {
        color: otuIDS,
        size: sampleVALUES
      },
      mode: "markers"
    };

    var dataBubble = [traceBubble];

    Plotly.newPlot("bubble", dataBubble);
    
    var tracePie = {
      values: sampleVALUES.slice(0,10),
      labels: otuIDS.slice(0,10),
      hoverinfo: otuLABELS.slice(0,10), 
      type: 'pie'
    };

    var dataPie = [tracePie];
    Plotly.newPlot("pie", dataPie);


    console.log(sampleVALUES);
    console.log(otuIDS);
    console.log(otuLABELS);
  });
    
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}


function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  
  buildCharts(newSample);
  buildMetadata(newSample);
}


// Initialize the dashboard
init();


