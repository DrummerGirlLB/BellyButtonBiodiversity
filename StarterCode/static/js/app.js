function init() {

    //get reference to dropdown element in html
    var selectName = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        //console.log(data);
        //use the name list for selecting sample?
        var selectedNames = data.names;

        selectedNames.forEach((sample) => {
            selectName.append("option").text(sample).property("value", sample);
        });

        var defaultName = selectedNames[0];
        
        buildChart(defaultName);
        buildMeta(defaultName);
    });
}

init();

//optionChanged function name from index.html onchange line 28 - include both bar and metatablestuff
function optionChanged(newName) {
    buildChart(newName);
    buildMeta(newName);
}

function buildMeta(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var arrayResult = metadata.filter(sampleObj => sampleObj.id == sample);
        var Result = arrayResult[0];
        //from index.html id sample-metadata
        var demographicsPanel = d3.select("#sample-metadata");
        demographicsPanel.html("");
    
        //object entries 
        Object.entries(Result).forEach(([key, value]) => {
        demographicsPanel.append("h6").text(`${key.toUpperCase()} : ${value}`);
        });    
    });
}

//function for barchart
function buildChart(sample) {
    d3.json("samples.json").then((data) => {

    //variable to hold samples array
    var samples = data.samples;
    //need to filter for selectedName
    var arrayResults = samples.filter(sampleObj => sampleObj.id == sample);
    //sample array first result index 0
    var Result = arrayResults[0];
        console.log(Result);
    //grab otu_ids and otu_labels and sample_values to build h bar, get wfreq for gauge
    var otuId = Result.otu_ids;
    var otuLabels = Result.otu_labels;
    var wFreq = Result.wfreq;
    //var wFreq = Result.wfreq.map((value) => parseInt(value));
    var samplesValues = Result.sample_values.map((value) => parseInt(value));
     //   console.log(otuId);
     //   console.log(otuLabels);
     //   console.log(samplesValues);
     //   console.log(wFreq);
    console.log(data.samples);
    //ticks for bar - need to sort out the top 10 (slice) (.map) remember to .reverse!
    var yticks = otuId.slice(0,10).map((id) => "OTU" + id).reverse();

    //need data for bar chart
    var barData = {
        x: samplesValues.slice(0,10).reverse(),
        y: yticks,
        hoverinfo: otuLabels,
        type: "bar",
        orientation: "h"
    };

    //need layout for bar
    var barLayout = {
        title: {text: "Top 10 Bacteria Found"}
    };
       
    Plotly.newPlot("bar", [barData], barLayout);

    //trace and layout for bubble chart
    var bubbleChart = {
        x: otuId,
        y: samplesValues,
        text: otuLabels,
        hoverinfo: "x+y+text",
        mode: "markers",
        marker: {size: samplesValues, color: otuId, colorscale: 'Picnic'} //(https://plotly.com/javascript/colorscales/#)
    };

    var bubbleLayout = {
        title: {text: "Bacteria per Sample"},
        xaxis: {title: "ID"},
    };

    Plotly.newPlot("bubble", [bubbleChart], bubbleLayout);

    //attempting to add gauge chart ( https://plotly.com/javascript/gauge-charts/#custom-gauge-chart )
    var gaugeData = [
        {
            type: "indicator",
            mode: "gauge",
            domain: {x: [0, 1], y: [0, 1]},
            value: wFreq,
            //value: Result.wfreq,
            //value: 2,
            title: {text: "Washes per Week"},
            delta: {reference:0, increasing: { color: "Red"}},
            gauge: {axis: {visible: true, range: [0, 9]},
                bar: { color: "#008000"},
                marker: {size: 100, color: "#008000"},
                steps: [
                    {range: [0, 1], color: "#edf2f3"},
                    {range: [1, 2], color: "#dce6e7"},
                    {range: [2, 3], color: "#cbdadc"},
                    {range: [3, 4], color: "#baced0"},
                    {range: [4, 5], color: "#97b6b9"},
                    {range: [5, 6], color: "#86aaad"},
                    {range: [6, 7], color: "#759ea2"},
                    {range: [7, 8], color: "#649296"},
                    {range: [8, 9], color: "#53868b"},
                ]
            }
        }
    ];

    var gaugeLayout = {
        width: 600,
        height: 500,
        margin: {t: 100, r: 100, l: 25, b: 100}
    };

    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

})};