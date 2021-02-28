let margin = { left: 300, right: 0, up: 300, down: 0 };
let gap_between_views = 150;

let displayMonth = "Jan";

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

    data = data.sort(function (x, y) {
        return -x.start - -y.start;
    })

    console.log(data)

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

    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale).ticks(5);

    let g = svg.append("g")
        .attr("transform", "translate(" + 50 + "," + 50 + ")")
        .attr('id', 'background')
        .style("height", "30px");

    let g1 = svg.append("g")
        .attr("transform", "translate(" + 50 + "," + (50 + height + 70) + ")");

    g.append('g')
        .attr("transform", "translate(0," + (height) + ")")
        .attr('class', 'x-axis')
        .call(xAxis);
    g.append('g')
        .attr('class', 'y-axis')
        .call(yAxis);

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

    g1.append('g')
        .attr("class", 'axis-lable')
        .attr('transform', 'translate(10,' + (0) + ')')
        .append("text")
        .text("Bikers start from");

    update(1);

    d3.select('#slider').on('input', function () {
        update(this.value);
    });

    function update(month) {
        data1 = data.filter(function (d) {
            return d.month == displayMonth;
        });

        // remove original points and bars
        g1.selectAll('.bar').remove();
        g1.selectAll('.x-axis1').remove();
        g.selectAll('.point').remove();

        let xScale1 = d3.scaleBand()
            .range([0, width])
            .domain(data1.map(function (d) {
                return d.station;
            }));

        let yScale1 = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(data, (d) => d.start)])
            .nice();

        let xAxis1 = d3.axisBottom(xScale1).ticks(5);
        let yAxis1 = d3.axisLeft(yScale1).ticks(5);

        g1.append('g')
            .attr("transform", "translate(0," + (height) + ")")
            .attr('class', 'x-axis1')
            .call(xAxis1)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");
        g1.append('g')
            .attr('class', 'y-axis1')
            .call(yAxis1);

        d3.select('#slider').property('value', month);
        switch (month) {
            case '1':
                displayMonth = 'Jan';
                break;
            case '2':
                displayMonth = 'Feb';
                break;
            case '3':
                displayMonth = 'Mar';
                break;
            case '4':
                displayMonth = 'Apr';
                break;
            case '5':
                displayMonth = 'May';
                break;
            case '6':
                displayMonth = 'Jun';
                break;
            case '7':
                displayMonth = 'Jul';
                break;
            case '8':
                displayMonth = 'Aug';
                break;
            case '9':
                displayMonth = 'Sep';
                break;
            case '10':
                displayMonth = 'Oct';
                break;
            case '11':
                displayMonth = 'Nov';
                break;
            case '12':
                displayMonth = 'Dec';
        }

        d3.select('#slidertext').property('value', displayMonth);

        // tooltips
        let tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("overflow", "hidden");

        g.selectAll('.point').data(data)
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
                d3.select('#background').append('rect')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', width)
                    .attr('height', height)
                    .style('fill', "#fce703")
                    .style('opacity', 0.5)
                    .attr('id', 'cover');
                const [x, y] = d3.pointer(event);
                d3.select(this).raise()
                    .style('fill', 'red')
                    .style('r', '10')
                    .style('transition', '0.4s');
                tooltip
                    .html(d.station)
                    .style("opacity", 1)
                    .style("left", (x + 50) + "px")
                    .style("top", (y + 80) + "px");
                g1.selectAll('#' + this.id).style('fill', 'red');
            })
            .on('mouseout', function (event, d) {
                d3.select('#cover').remove();
                d3.select(this).style('fill', 'steelblue')
                    .style('r', '5');
                tooltip.style("opacity", 0);
                g1.selectAll('#' + this.id).style('fill', 'steelblue');
            })
            .each(function (d, i) {
                let str = d.station;
                this.id = str.replace(" & ", "")
                    .replace(" and 6th", "")
                    .replace("5", "")
                    .replaceAll(" ", "");
            });

        // bar chart
        g1.selectAll('.bar')
            .data(data1)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale1(d.station))
            .attr("y", d => yScale1(d.start))
            .attr("width", xScale1.bandwidth())
            .attr("height", function (d) { return height - yScale1(d.start) })
            .style('fill', 'steelblue')
            .style('stroke', 'black')
            .style('stroke-width', '2')
            .on('mouseover', function (event, d) {
                d3.select('#background').append('rect')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', width)
                    .attr('height', height)
                    .style('fill', "#fce703")
                    .style('opacity', 0.5)
                    .attr('id', 'cover');
                const [x, y] = d3.pointer(event);
                d3.select(this).style('fill', 'red')
                    .style('transition', '0.3s');
                g.selectAll('#' + this.id).raise()
                    .style('fill', 'red')
                    .style('r', '10')
                    .style('transition', '0.4s');

            })
            .on('mouseout', function (event, d) {
                d3.select('#cover').remove();
                d3.select(this).style('fill', 'steelblue');
                g.selectAll('#' + this.id).style('fill', 'steelblue')
                    .style('r', '5');
            })
            .each(function (d, i) {
                let str = d.station;
                this.id = str.replace(" & ", "")
                    .replace(" and 6th", "")
                    .replace("5", "")
                    .replaceAll(" ", "");
            });

    }
});
