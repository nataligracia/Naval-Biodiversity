// Write a function that will build the metadata for a single sample. It should do the following:
function buildMetadata(sample) {
// - loop over the samples.json file with d3.json().then()
    d3.json("samples.json").then((data) => {
// - extract the metadata from the json
        var metadata = data.metadata;
// - filter the metadata for the sample id
        var resultArray = metadata.filter(sampleObject => sampleObject.id == sample);
        var result = resultArray[0];
// - update the metadata html elements
        var panel = d3.select("#sample-metadata");
        // console.log(panel)

// - clear any existing metadata in the metadata html elements
        panel.html("");
// - append hew header tags for each key-value pair in the filtered metadata
        Object.entries(result).forEach(([key, value]) => {
            panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });

        buildGauge(result.wfreq);
    });
}


// Write a function that will build the charts for a single sample. It should do the following:
function buildCharts(sample) {
// - loop over the samples.json file with d3.json().then()
    d3.json("samples.json").then((data) => {
// - extract the samples from the json
        var samples = data.samples;
// - filter the samples for the sample id
        var resultArray = samples.filter(sampleObject => sampleObject.id == sample);
        var result = resultArray[0];
// - extract the ids, labels, and values from the filtered result
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;
// - build a bubble chart and plot with Plotly.newPlot()
        var bubbleLayout = {
            title: "Bacteria Cultures Per Naval Sample",
            margin: {t:0},
            hovermode: "closest",
            xaxis: { title: "OTU ID"},
            margin: { t: 30},
        };

        var bubbleData =[
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
                }
            }            
        ];

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);


// - build a bar chart and plot with Plotly.newPlot()
        var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        var barData = [
            {
                y: yticks,
                x: sample_values.slice(0, 10).reverse(),
                text: otu_labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h",
            }
        ];

        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: { t: 30, 1: 150}
        };

        Plotly.newPlot("bar", barData, barLayout);
    });
}


// Write a function called init() that will populate the charts/metadata and elements on the page. It should do the following:
function init() {
// - select the dropdown element in the page
    var selector = d3.select("#selDataset");
// - loop over the samples.json data to append the .name attribute into the value of an option HTML tag (lookup HTML documentation on dropdown menus)
    d3.json("samples.json").then((data) => {
        var sampleNames =  data.names;
// - extract the first sample from the data
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
            });
// - call your two functions to build the metadata and build the charts on the first sample, so that new visitors see some data/charts before they select something from the dropdown
        var firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}


// Write a function called optionChanged() that takes a new sample as an argument. It should do the following:
function optionChanged(newSample) {
// - call your two functions to build the metadata and build the charts on the new sample
    buildCharts(newSample);
    buildMetadata(newSample);
}


// Look at line 30 of index.html: that is the event listener that will call this function when someone selects something on the dropdown


// Initialize the dashboard by calling your init() function
init();
