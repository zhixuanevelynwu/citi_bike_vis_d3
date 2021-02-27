let margin = { left: 300, right: 0, up: 300, down: 0 };
let gap_between_views = 150;

let displayMonth = "Jul"

// create a scatter plot and a bar chart
d3.csv('citi_bike_2020.csv').then(function (data) {
    // process data
    // station,latitude,longitude,start,tripdurationS,end,tripdurationE,month
    data.forEach(d => {
        d.latitude = +d.latitude;
        d.longitude = +d.longitude;
        d.start = +d.start;
        d.tripdurationS = +d.tripdurationS;
        d.end = +d.end;
        d.tripdurationE = +d.tripdurationE;
    });

    //console.log(data);

    // plot chart 
    let svg = d3.select('svg')
    let margin = { top: 600, bottom: 500, left: 200, right: 120 };
    let width = svg.attr("width") - margin.left - 100;
    let height = svg.attr("height") - margin.top - 50;

    let xScale = d3.scaleLinear()
        .range([0, width])
        .domain([0, d3.max(data, (d) => d.tripdurationS)])
        .nice();

    let yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data, (d) => d.tripdurationE)])
        .nice();

    let g = svg.append("g")
        .attr("transform", "translate(" + 50 + "," + 50 + ")")
        .style("height", "30px");

    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale).ticks(5);

    // tooltips
    let tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("overflow", "hidden");

    g.append('g')
        .attr("transform", "translate(0," + (height) + ")")
        .attr('class', 'x-axis')
        .call(xAxis);
    g.append('g')
        .attr('class', 'y-axis')
        .call(yAxis);

    g.selectAll('point').data(data)
        .enter().append('circle')
        .attr('class', "point")
        .attr("cx", d => xScale(d.tripdurationS))
        .attr('cy', d => yScale(d.tripdurationE))
        .attr('r', '5')
        .style('fill', 'steelblue')
        /* display different months */
        .style('display', function (d) {
            if (d.month != displayMonth) return 'none';
        })
        .style('stroke', 'black')
        .style('stroke-width', '2')
        .on('mouseover', function (event, d) {
            console.log(this.id)
            const [x, y] = d3.pointer(event);
            d3.select(this).style('fill', 'red')
                .style('r', '10')
                .style('transition', '0.3s');
            tooltip
                .html(d.station)
                .style("opacity", 1)
                .style("left", (x + 50) + "px")
                .style("top", (y + 80) + "px");
        })
        .on('mouseout', function (event, d) {
            d3.select(this).style('fill', 'steelblue')
                .style('r', '5');
            tooltip.style("opacity", 0);
        })
        .each(function(d, i) {
            let str = d.station;
            this.id = str.replace(" & ", "")
                .replace(" and 6th", "")
                .replace("5", "");
        });




    //adding axis-lables
    g.append('g')
        .attr("class", 'axis-lable')
        .attr('transform', 'translate(10,' + (0) + ')')
        .append("text")
        .style("transform", "rotate(90deg)")
        .text("Trip duration start from")

    g.append('g')
        .attr("class", 'axis-lable')
        .attr('transform', 'translate(' + (width - 60) + ',' + (height - 10) + ')')
        .append("text")
        .style("text-anchor", 'middle')
        .text("Trip duration end in")
    // end of plot chart

    // bar chart
    let xScale1 = d3.scaleBand()
        .range([0, width])
        .domain(data.map(function(d) { 
            return d.station; 
        }));

    let yScale1 = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data, (d) => d.start)])
        .nice();

    let g1 = svg.append("g")
        .attr("transform", "translate(" + 50 + "," + (50+height+70) + ")");

    let xAxis1 = d3.axisBottom(xScale1).ticks(5);
    let yAxis1 = d3.axisLeft(yScale1).ticks(5);

    g1.append('g')
        .attr("transform", "translate(0," + (height) + ")")
        .attr('class', 'x-axis')
        .call(xAxis1)
        .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
    g1.append('g')
        .attr('class', 'y-axis')
        .call(yAxis1);

    g1.selectAll('.bar')
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale1(d.station))
        .attr("y", d => yScale1(d.start))
        .attr("width", xScale1.bandwidth())
        .attr("height", function(d) {return height - yScale1(d.start)})
        .style('fill', 'steelblue')
        /* display different months */
        .style('display', function (d) {
            if (d.month != displayMonth) return 'none';
        })
        .style('stroke', 'black')
        .style('stroke-width', '2')
        .on('mouseover', function (event, d) {
            console.log(this.id)
            g.select(this.id).style('fill', 'red')
            const [x, y] = d3.pointer(event);
            d3.select(this).style('fill', 'red')
                .style('transition', '0.3s');
        })
        .on('mouseout', function (event, d) {
            d3.select(this).style('fill', 'steelblue')
        })
        .each(function(d, i) {
            let str = d.station;
            this.id = str.replace(" & ", "")
                .replace(" and 6th", "")
                .replace("5", "");
        });
    
    g1.select("#Liberty Light Rail").style('fill', 'yellow')
    
    g1.append('g')
        .attr("class", 'axis-lable')
        .attr('transform', 'translate(10,' + (0) + ')')
        .append("text")
        .text("Bikers start from")
});
