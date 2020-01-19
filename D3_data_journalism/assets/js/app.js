// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 600;

// Define the chart's margins as an object
var chartMargin = {
    top: 30,
    right: 30,
    bottom: 60,
    left: 50
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
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;

        console.log("x-axis", "poverty:", d.poverty);
        console.log("y-axis", "healthcare", d.healthcare);
    })

    // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
    var xLinearScale = d3.scaleLinear()
      .domain([0, d3.max(censusData, d => d.poverty)])
      .range([0, chartWidth])
    ;    

    // Create a linear scale for the vertical axis.
    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(censusData, d => d.healthcare)])
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
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "14")
        .attr("fill", "blue")
		.attr("opacity", ".5")    

    // Add text inside the circles
	var circlesText = chartGroup.selectAll()
        .data(censusData)
        .enter()
		.append("text")
    	.attr("x", d => xLinearScale(d.poverty))
    	.attr("y", d => yLinearScale(d.healthcare))
    	.style("font-size", "9px")
    	.style("text-anchor", "middle")
    	.style("fill","white")
		.text(d => (d.abbr))
		.attr("dy", 3);  // shift text down a bit

    // Initialize the tool tip
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br> poverty: ${d.poverty} <br> healthcare: ${d.healthcare}`);
      });    

    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });

    //Create Axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .attr("font-weight", "bold")
        .text("Lacks Healthcare (%)");    

    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 15})`)
        .attr("class", "axisText")
        .text("In Poverty (%)")
        .attr("font-weight", "bold");
    }).catch(function(error) {
        console.log(error);

        //console.log(censusData.map(data => data.state));

});