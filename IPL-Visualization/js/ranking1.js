const RANKING_SVGWIDTH = 1300 
const RANKING_SVGHEIGHT = 600

class Ranking{
	constructor(ranking_data){
		this.ranking_data = ranking_data;
		this.svg = d3.select(".content").append("svg").attr("width", RANKING_SVGWIDTH).attr("height", RANKING_SVGHEIGHT).attr("id","ranking");
        this.ranking_group = this.svg.append("g").attr("transform","translate(110,40)").attr("id","ranking-group");
		this.x_axisg = d3.select("#ranking-group").append("g").attr("class","x-axis-group").attr("transform", "translate(0,400)");
		this.y_axisg = d3.select("#ranking-group").append("g").attr("class","y-axis-group").attr("transform", "translate(0,0)");
		d3.select("#ranking").append("text").attr("id","ranking-header");
        d3.select("#ranking-group").append("g").attr("class","lines-group");
        d3.select("#ranking-group").append("g").attr("class","circle-group");
		d3.select("#ranking-group").append("g").attr("class", "labels");
        d3.select("#ranking").append("g").attr("id","ranking-axis-labels");
	}
	drawRankingGraph(team1,team2){
		let ranking_history = [];
			this.ranking_data.forEach((data) => {
                console.log(data);
			if(data.team === team1 || data.team ===team2){
				let obj = {team: data.team, ranks: []};
			  for (let year in data) {
				if (year != "team") {
				  if (data[year] != 0) {
					  obj.ranks.push({year: Number(year), rank: Number(data[year]), team_obj: obj});
				  }
				}
			  }
			  ranking_history.push(obj);
			}	
			});
			//x-scale
            let xscale = d3.scaleLinear()
                            .domain(d3.extent(ranking_history[0].ranks, d => d.year))
                            .range([0, RANKING_SVGWIDTH-300]);
            //y-scale
    	    let yscale = d3.scaleLinear()
                            .domain([1, 10])
    	                    .range([0, RANKING_SVGHEIGHT-200]);
			
			let line = d3.line()
			            .x(data => xscale(data.year))
			            .y(data => yscale(data.rank))
			
			let xaxis = d3.axisBottom()
                            .scale(xscale)
			                .tickFormat(d3.format("d"))
			
			let yaxis = d3.axisLeft()
                            .scale(yscale)
			
			this.x_axisg.call(xaxis);
			this.y_axisg.call(yaxis);  
            d3.select("#ranking-header").attr("x",RANKING_SVGWIDTH/2-50).attr('y',15).text("Ranking Graph").style("font-weight","bold");
			
            //xaxis label 
            d3.select("#ranking-axis-labels")
                .append("text")
                .attr("text-anchor","end")
                .attr('x',RANKING_SVGWIDTH/2)
                .attr('y',RANKING_SVGHEIGHT-120)
                .text("Overs");   
        
            //yaxis label
            d3.select("#ranking-axis-labels")
                .append("text")
                .attr("text-anchor","end")
                .attr('x',-RANKING_SVGHEIGHT/3)
                .attr('y',70)
                .attr("transform","rotate(-90)")
                .text("Runs");
            
            //ranking lines
            d3.select(".lines-group")
				.selectAll("path")
				.data(ranking_history)
				.join("path")
				.attr("class", "rank-line")
				.attr("d", function(d) { d.line = this; return line(d.ranks)})
				.attr("clip-path", "url(#clip)")
				.style("stroke", (d)=>COLOR_PALLETE[d.team])
                .style("stroke-width",2)
			let circles_data ;
            circles_data = ranking_history[0].ranks.flat().concat(ranking_history[1].ranks.flat());
            
            // circle on lines
			d3.select(".circle-group")
                .selectAll("circle")
                .data(circles_data)
                .join("circle")
                .attr('cx',d=>xscale(d.year))
                .attr('cy',d=>yscale(d.rank))
                .attr('r',4)
                .attr("fill",(d)=>COLOR_PALLETE[d.team_obj.team])

			//line labels
            d3.select(".labels")
				.selectAll("text")
				.data(ranking_history)
				.join("text")
				.attr("x", d => xscale(d.ranks[d.ranks.length - 1].year)+3)
				.attr("y", d => yscale(d.ranks[d.ranks.length - 1].rank)+3)
				.text(d => d.team)
                .style("font-weight","bold")
                .style("font-size",14);
	}
}
