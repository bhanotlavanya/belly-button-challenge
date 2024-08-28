// Function to build the metadata panel
function renderMetadata(sampleId) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log(data);

    // Extract the metadata field from the data
    let metadataArray = data.metadata;
    console.log("Metadata Array:", metadataArray);

    // Filter the metadata to match the selected sample ID
    let selectedMetadata = metadataArray.filter(entry => entry.id == sampleId);
    console.log("Selected Metadata:", selectedMetadata);

    // Select the panel with id `#sample-metadata`
    let infoPanel = d3.select("#sample-metadata");
    console.log("Info Panel:", infoPanel);

    // Clear any existing content in the panel
    infoPanel.html("");

    // Loop through the filtered metadata and append new tags for each key-value pair
    if (selectedMetadata.length > 0) {
      let metadata = selectedMetadata[0];

      for (let [key, value] of Object.entries(metadata)) {
        infoPanel.append("h6").text(`${key.toUpperCase()}: ${value}`);
      }
    }
  });
}

// Function to build the charts
function renderCharts(sampleId) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Extract the samples field from the data
    let samplesArray = data.samples;
    console.log("Samples Array:", samplesArray);

    // Filter the samples to match the selected sample ID
    let selectedSample = samplesArray.filter(entry => entry.id == sampleId);
    console.log("Selected Sample:", selectedSample);

    // Extract otu_ids, otu_labels, and sample_values
    let otuIds = selectedSample[0].otu_ids;
    let otuLabels = selectedSample[0].otu_labels;
    let sampleValues = selectedSample[0].sample_values;
    console.log("OTU IDs:", otuIds);
    console.log("OTU Labels:", otuLabels);
    console.log("Sample Values:", sampleValues);

    // Build the Bubble Chart
    let bubbleTrace = {
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
    };
    let bubbleData = [bubbleTrace];

    let bubbleLayout = {
      title: 'Bacteria Cultures per Sample',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Number of Bacteria' },
      showlegend: false,
      height: 800,
      width: 1200
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Prepare data for the Bar Chart
    let topOtuIds = otuIds.slice(0, 10).reverse();
    let topSampleValues = sampleValues.slice(0, 10).reverse();
    let topOtuLabels = otuLabels.slice(0, 10).reverse();

    // Build the Bar Chart
    let barTrace = {
      y: topOtuIds.map(id => `OTU ${id}`),
      x: topSampleValues,
      text: topOtuLabels,
      type: "bar",
      orientation: 'h'
    };
    let barData = [barTrace];

    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: 'Number of Bacteria' },
      showlegend: false,
      height: 500,
      width: 900
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Function to initialize the dashboard
function initializeDashboard() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Extract the names field from the data
    let sampleNames = data.names;
    console.log("Sample Names:", sampleNames);

    // Select the dropdown element with id `#selDataset`
    let dropdownMenu = d3.select("#selDataset");
    console.log("Dropdown Menu:", dropdownMenu);

    // Populate the dropdown with sample names
    sampleNames.forEach(name => {
      dropdownMenu.append('option').text(name);
    });

    // Select the first sample from the list and render the charts and metadata
    let initialSample = sampleNames[0];
    renderMetadata(initialSample);
    renderCharts(initialSample);
  });
}

// Function to handle change in the dropdown selection
function optionChanged(newSampleId) {
  // Render charts and metadata for the newly selected sample
  renderMetadata(newSampleId);
  renderCharts(newSampleId);
}


// Initialize the dashboard when the page loads
initializeDashboard();
