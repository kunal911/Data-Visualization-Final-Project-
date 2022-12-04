const MARGIN = {top: 0, right: 200, bottom: 100, left: 125};
const RANKING_SVGWIDTH = 1000 - MARGIN.left - MARGIN.right
const RANKING_SVGHEIGHT = 500 - MARGIN.top - MARGIN.bottom;
const cfg = {strokeWidth: 10};
const axisMARGIN = 20;
class Ranking{
	constructor(ranking_data){
		this.ranking_data = ranking_data;

		this.svg = d3.select(".content").append("svg").attr("width", RANKING_SVGWIDTH + MARGIN.left + MARGIN.right).attr("height", RANKING_SVGHEIGHT + MARGIN.top + MARGIN.bottom).append("g").attr("transform", "translate(" + MARGIN.left + "," + MARGIN.top + ")");
		this.colour = d3.scaleOrdinal(d3.schemeAccent);
		//this.highlight = ["Rajasthan Royals", "Punjab Kings", "Chennai Super Kings", "Delhi Capitals", "Mumbai Indians", "Kolkata Knight Riders", "Royal Challengers Banglore", "Hyderabad Deccan Chargers", "Gujurat Titans", "Lucknow Super Giants"];
		this.highlight = ["Rajasthan Royals","Punjab Kings"];
		this.svg.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("width", RANKING_SVGWIDTH).attr("height", RANKING_SVGHEIGHT + cfg.strokeWidth);
		this.xGroup = this.svg.append("g");
		this.xGroup.append("g").attr("transform", "translate(" + [0, RANKING_SVGHEIGHT + axisMARGIN * 1.2] + ")").attr("class", "x-axis")
		this.xGroup.append("g").attr("class","grid-lines-group");
		this.yGroup = this.svg.append("g");
		this.yGroup.append("g").attr("transform", "translate(" + [-axisMARGIN, 0] + ")").attr("class", "y-axis");
		this.yGroup.append("g").attr("class","grid-lines-group-y");
		this.svg.append("g").attr("class","lines-group");
		this.svg.append("g").attr("class", "end-labels");
		this.svg.append("g").attr("class","end-dots");
		this.voronoiGroup = this.svg.append("g").attr("class", "voronoi");
	}
	drawRankingGraph(team1,team2){
		this.highlight[0] = team1;
		this.highlight[1] = team2;
		console.log(team1);
		console.log(team2);
		let x = d3.scaleLinear()
    	.range([0, RANKING_SVGWIDTH]);
    
    	let y = d3.scaleLinear()
    	.range([0, RANKING_SVGHEIGHT]);

		let voronoi = d3.voronoi()
			.x(d => x(d.year))
			.y(d => y(d.rank))
			.extent([[-MARGIN.left / 2, -MARGIN.top / 2], [RANKING_SVGWIDTH + MARGIN.right / 2, RANKING_SVGHEIGHT + MARGIN.bottom / 2]]);

		let line = d3.line()
			.x(d => x(d.year))
			.y(d => y(d.rank))
		
		let parsedData = [];
			this.ranking_data.forEach((d) => {
			if(d.department === team1 || d.department ===team2){
				var dObj = {department: d.department, ranks: []};
			  for (var year in d) {
				if (year != "department") {
				  if (d[year] != 0) {
					  dObj.ranks.push({year: +year, rank: +d[year], department: dObj});
				  }
				}
			  }
			  parsedData.push(dObj);
			}	
			});
			console.log(parsedData);
			var xTickNo = parsedData[0].ranks.length;
			x.domain(d3.extent(parsedData[0].ranks, d => d.year));
			
			this.colour.domain(this.ranking_data.map(d => d.department));
			
			var ranks = 10;
			y.domain([0.5, ranks]);
			
			
			
			var xAxis = d3.axisBottom(x)
			  .tickFormat(d3.format("d"))
				.ticks(xTickNo)
				.tickSize(0);
			
			   var yAxis = d3.axisLeft(y)
				.ticks(ranks)
				.tickSize(0);
			
			//var xGroup = this.svg.append("g");
			// var xAxisElem = xGroup.append("g")
			// 	.attr("transform", "translate(" + [0, height + axisMARGIN * 1.2] + ")")
			// 	.attr("class", "x-axis")
			// 	.call(xAxis);

			let xAxisElem = d3.select(".x-axis").call(xAxis);
			  
			
			d3.select(".grid-lines-group").selectAll("line")
				.data(x.ticks(xTickNo))
				.enter().append("line")
					.attr("class", "grid-line")
					.attr("y1", 0)
					.attr("y2", RANKING_SVGHEIGHT + 10)
					.attr("x1", d => x(d))
					.attr("x2", d => x(d));
			
			//var yGroup = this.svg.append("g");
			// var yAxisElem = yGroup.append("g")
			// 	.attr("transform", "translate(" + [-axisMARGIN, 0] + ")")
			// 	.attr("class", "y-axis")
			// 	.call(yAxis);
			var yAxisElem = d3.select(".y-axis").call(yAxis);


			// yAxisElem.append("text")
			// 	.attr("class", "y-label")
			// 	.attr("text-anchor", "middle")
			// 	.attr("transform", "rotate(-90) translate(" + [-height / 2, -MARGIN.left / 3] + ")")
			// 	.text("IPL 2008 - 2022 WINNERS");
			
			d3.select(".grid-lines-group-y").selectAll("line")
				.data(y.ticks(ranks))
				.enter().append("line")
					.attr("class", "grid-line")
					.attr("x1", 0)
					.attr("x2", RANKING_SVGWIDTH)
					.attr("y1", d => y(d))
					.attr("y2", d => y(d));
			
			// var lines = d3.select(".lines-group")
			// 	.selectAll("path")
			// 	.data(parsedData)
			// 	.enter().append("path")
			// 		.attr("class", "rank-line")
			// 		.attr("d", function(d) { d.line = this; return line(d.ranks)})
			// 		.attr("clip-path", "url(#clip)")
			// 		.style("stroke", d => this.colour(d.department))
			// 		.style("stroke-width", cfg.strokeWidth)
			// 		.style("opacity", 0.1)
			// 		.transition()
			// 			.duration(500)
			// 			.delay(d => (this.highlight.indexOf(d.department) + 1) * 500)
			// 		.style("opacity", d => this.highlight.includes(d.department) ? 1 : 0.1);

			var lines = d3.select(".lines-group")
				.selectAll("path")
				.data(parsedData)
				.join("path")
					.attr("class", "rank-line")
					.attr("d", function(d) { d.line = this; return line(d.ranks)})
					.attr("clip-path", "url(#clip)")
					.style("stroke", d => this.colour(d.department))
					.style("stroke-width", cfg.strokeWidth)
					.style("opacity", 0.1)
					.transition()
						.duration(500)
						.delay(d => (this.highlight.indexOf(d.department) + 1) * 500)
					.style("opacity", d => this.highlight.includes(d.department) ? 1 : 0.1);
			
			// var endLabels = d3.select(".end-labels")
			// 	.selectAll("text")
			// 	.data(parsedData.filter(d => this.highlight.includes(d.department)))
			// 	.enter().append("text")
			// 		.attr("class", "end-label")
			// 		.attr("x", d => x(d.ranks[d.ranks.length - 1].year))
			// 		.attr("y", d => y(d.ranks[d.ranks.length - 1].rank))
			// 		.attr("dx", 20)
			// 		.attr("dy", cfg.strokeWidth / 2)
			// 		.text(d => d.department)
			// 		.style("opacity", 0)
			// 	.transition()
			// 			.duration(500)
			// 			.delay(d => (this.highlight.indexOf(d.department) + 1) * 500)
			// 		.style("opacity", 1);

			var endLabels = d3.select(".end-labels")
				.selectAll("text")
				.data(parsedData.filter(d => this.highlight.includes(d.department)))
				.join("text")
					.attr("class", "end-label")
					.attr("x", d => x(d.ranks[d.ranks.length - 1].year))
					.attr("y", d => y(d.ranks[d.ranks.length - 1].rank))
					.attr("dx", 20)
					.attr("dy", cfg.strokeWidth / 2)
					.text(d => d.department)
					.style("opacity", 0)
				.transition()
						.duration(500)
						.delay(d => (this.highlight.indexOf(d.department) + 1) * 500)
					.style("opacity", 1);
			
			// var endDots = d3.select(".end-dots")
			// 	.selectAll("circle")
			// 	.data(parsedData.filter(d => this.highlight.includes(d.department)))
			// 	.enter().append("circle")
			// 		.attr("class", "end-circle")
			// 		.attr("cx", d => x(d.ranks[d.ranks.length - 1].year))
			// 		.attr("cy", d => y(d.ranks[d.ranks.length - 1].rank))
			// 		.attr("r", cfg.strokeWidth)
			// 		.style("fill", d => this.colour(d.department))
			// 		.style("opacity", 0)
			// 	.transition()
			// 			.duration(500)
			// 			.delay(d => (this.highlight.indexOf(d.department) + 1) * 500)
			// 		.style("opacity", 1);

			var endDots = d3.select(".end-dots")
				.selectAll("circle")
				.data(parsedData.filter(d => this.highlight.includes(d.department)))
				.join("circle")
					.attr("class", "end-circle")
					.attr("cx", d => x(d.ranks[d.ranks.length - 1].year))
					.attr("cy", d => y(d.ranks[d.ranks.length - 1].rank))
					.attr("r", cfg.strokeWidth)
					.style("fill", d => this.colour(d.department))
					.style("opacity", 0)
				.transition()
						.duration(500)
						.delay(d => (this.highlight.indexOf(d.department) + 1) * 500)
					.style("opacity", 1);
				  
			// var tooltip = this.svg.append("g")
			// 	.attr("transform", "translate(-100, -100)")
			// 	.attr("class", "tooltip");
			// tooltip.append("circle")
			// 	.attr("r", cfg.strokeWidth);
			// tooltip.append("text")
			// 	.attr("class", "name")
			// 	.attr("y", -20);
			
		    
			
		    // this.voronoiGroup.selectAll("path")
		    // 	.data(voronoi.polygons(d3.merge(parsedData.map(d => d.ranks))))
		    // 	.enter().append("path")
		    // 		.attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; })
		    	//	.on("mouseover", mouseover)
		    	//	.on("mouseout", mouseout);
			
				this.voronoiGroup.selectAll("path")
		    	.data(voronoi.polygons(d3.merge(parsedData.map(d => d.ranks))))
		    	.join("path")
		    		.attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; })
			// this.svg.selectAll(".rank-line")
			// 	.each(d => this.highlight.includes(d.department) ? d.line.parentNode.appendChild(d.line) : 0);
			
			this.svg.select("g.end-labels").raise();
			
			function mouseover(d) {
	  
			  this.svg.selectAll(".end-label").style("opacity", 0);
			  this.svg.selectAll(".end-circle").style("opacity", 0);
			  
			  this.svg.selectAll(".rank-line").style("opacity", 0.1);
			  d3.select(d.data.department.line).style("opacity", 1);
			  d.data.department.line.parentNode.appendChild(d.data.department.line);
			  tooltip.attr("transform", "translate(" + x(d.data.year) + "," + y(d.data.rank) + ")")
				  .style("fill", this.colour(d.data.department.department))
			  tooltip.select("text").text(d.data.department.department)
				  .attr("text-anchor", d.data.year == x.domain()[0] ? "start" : "middle")
				  .attr("dx", d.data.year == x.domain()[0] ? -10 : 0)
			}
		  
			function mouseout(d) {
				this.svg.selectAll(".rank-line").style("opacity", d => this.highlight.includes(d.department) ? 1 : 0.1);
			  
			  this.svg.selectAll(".end-label").style("opacity", 1);
			  this.svg.selectAll(".end-circle").style("opacity", 1);
			  tooltip.attr("transform", "translate(-100,-100)");
			}
	}
}
