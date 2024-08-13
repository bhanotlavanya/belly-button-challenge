// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log(data)

    // get the metadata field
    let metadata = data.metadata
    console.log(`metadata`)
    console.log(metadata)

    // Filter the metadata for the object with the desired sample number
    let sampleNumber = metadata.filter(number => number.id == sample)
    console.log(` Sample number`)
    console.log(sampleNumber)

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select('#sample-metadata')
    console.log(` panel`)
    console.log(panel)

    // Use `.html("") to clear any existing metadata
    panel.html("")

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    if (sampleNumber.length > 0) {
      let looper = sampleNumber[0]

      for (let [key, value] of Object.entries(looper)) {
        panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
      }
    }
  }
  )
};

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples
    console.log(`samples`)
    console.log(samples)

    // Filter the samples for the object with the desired sample number
    let filSamples = samples.filter(number => number.id == sample)
    console.log(`filSamples`)
    console.log(filSamples)
    // Get the otu_ids, otu_labels, and sample_values using a for loop
    // for (let i = 0; i < filSamples.length; i++) {
    let otuIds = filSamples[0].otu_ids;
    let otuLabels = filSamples[0].otu_labels;
    let sampleValues = filSamples[0].sample_values;
    console.log(otuIds)
    console.log(otuLabels)
    console.log(sampleValues)

  


    // Build a Bubble Chart
    var trace = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Earth',
        showscale: true
      }
    }
    var data = [trace];

    var layout = {
      title: 'Bacteria Cultures per Sample',
      xaxis: { title: `OTU ID` },
      yaxis: { title: `Number of Bacteria` },
      showlegend: false,
      height: 800,
      width: 1200
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", data, layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let sampleId = samples.filter(number => number.id == sample)[0]

    const topOtu = sampleId.otu_ids.slice(0, 10).reverse()
    const top_sample = sampleId.sample_values.slice(0, 10).reverse()
    const top_labels = sampleId.otu_labels.slice(0, 10).reverse()

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    const yticks = topOtu.map(Id => `OTU ${Id}`);

    let trace1 = {
      y: yticks,
      x: top_sample,
      text: top_labels,
      type: "bar",
      orientation: 'h'
    }
    let data2 = [trace1]

    // Render the Bar Chart
    var layout = {
      title: "Top Ten Bacteria Cultures Found",
      xaxis: { title: `Number of Bacteria` },
      showlegend: false,
      height: 500,
      width: 900
    };
    Plotly.newPlot("bar", data2, layout);
  })

};

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names
    console.log(`names`)
    console.log(names)

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset")
    console.log(`dropdown`)
    console.log(dropdown)

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < names.length; i++) {
      dropdown.append('option').text(names[i])
      console.log(`dropdown`)
      console.log(dropdown)
    }

    // Get the first sample from the list
    let firstOption = dropdown.select('option')
    console.log(`firstOption`)
    console.log(firstOption)
    // Build charts and metadata panel with the first sample
    buildMetadata('940');
    buildCharts('940')
  });
}


// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Initialize the dashboard
init();
