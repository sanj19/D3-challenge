// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth)
;

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`)
;

// Load data from csv
d3.csv("assets/data/data.csv").then(function(censusData) {
    console.log(censusData);
    // Cast the smokers value to a number for each piece of censusData
    censusData.forEach(function(d) {
        d.age = +d.age;
        d.obesity = +d.obesity;

        console.log("x-axis", "age:", d.age);
        console.log("y-axis", "obesity", d.obesity);
    })

    // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
    var xLinearScale = d3.scaleLinear()
      .domain([0, d3.max(censusData, d => d.age)])
      .range([0, chartWidth])
    ;    

    // Create a linear scale for the vertical axis.
    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(censusData, d => d.obesity)])
      .range([chartHeight, 0])
    ;

    // Create two new functions passing our scales in as arguments
     // These will be used to create the chart's axes
     var bottomAxis = d3.axisBottom(xLinearScale);
     var leftAxis = d3.axisLeft(yLinearScale);

    // Append two SVG group elements to the chartGroup area,
      // and create the bottom and left axes inside of them
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);
    
    chartGroup.append("g")
        .call(leftAxis);

    // Create circles at each data point using data binding.
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.age))
        .attr("cy", d => yLinearScale(d.obesity))
        .attr("r", "8")
        .attr("fill", "blue")
        .attr("opacity", ".5");        

    // Initialize the tool tip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Age: ${d.age}<br>Obesity: ${d.obesity}`);
      });    

    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });

    //Create Axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left + 40)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Number of Billboard 100 Hits");    

        chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 30})`)
        .attr("class", "axisText")
        .text("Hair Metal Band Hair Length (inches)");
    }).catch(function(error) {
        console.log(error);

        //console.log(censusData.map(data => data.state));

});