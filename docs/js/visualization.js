const LINE_CHART_WIDTH = 800;
const LINE_CHART_HEIGHT = 460;
const PADDING = {
    LEFT: 60,
    RIGHT:30,
    TOP:50,
    BOTTOM:50
};
const TEAM_WIDTH = 270;
const TEAM_HEIGHT = LINE_CHART_HEIGHT;
class viz{
    constructor(matchData,perBallData){
        this.matchData = matchData;
        this.perBallData = perBallData;
        this.header = new header(this.matchData,this.perBallData);
        d3.select(".content").append("svg").attr("class","team1").attr("width",TEAM_WIDTH).attr("height",TEAM_HEIGHT);
        d3.select(".team1").append("g").attr("class","team-name").attr("transform","translate(35,0)");
        d3.select(".team1").append("g").attr("class","player-name").attr("transform","translate(35,0)");
        let linesvg = d3.select(".content").append("svg").attr("width",LINE_CHART_WIDTH).attr("height",LINE_CHART_HEIGHT).attr("id","line-chart")//.attr("transform","translate(50,0)");
        d3.select("#line-chart").append("text").attr("id","header-worm");
        d3.select("#line-chart").append("text").attr("id","brush-text");
        linesvg.append("g").attr("id","x-axis");
        linesvg.append("g").attr("id","y-axis");
        linesvg.append("g").attr("id","lines");
        let overlayg = linesvg.append("g").attr("id","overlay");
        overlayg.append("line");
        linesvg.append("g").attr("id","worm-brush");
        linesvg.append("g").attr("id","wickets-circle");
        linesvg.append("g").attr("id","labels");
        d3.select("#line-chart").append("g").attr("id","over-choosen").append("text");
        d3.select("#line-chart").append("g").attr("id","legend");
        d3.select(".content").append("svg").attr("class","team2").attr("width",TEAM_WIDTH).attr("height",TEAM_HEIGHT);
        d3.select(".team2").append("g").attr("class","team-name").attr("transform","translate(45,0)");;
        d3.select(".team2").append("g").attr("class","player-name").attr("transform","translate(45,0)");;
        
        this.piechart_obj = new piechart();
        this.heatmap_obj = new heatmap();
        this.partnership_obj = new partnership(this.matchData,this.perBallData);
        this.runperover_obj = new runperover();
    
    }
    drawWormGraph(matchID){
        
        let groupbyID = d3.group(this.perBallData,d=>d.ID);
        let matchDetails = groupbyID.get(matchID);
        let innings_group = d3.group(matchDetails,d=>d.innings);
        let first_innings = innings_group.get("1");
        let second_innings = innings_group.get("2");
        let totalruns_1 = 0;
        let totalruns_2 = 0;
        let totalwickets_1 = 0;
        let totalwickets_2=0;
        let ball_number = 0;
        let wicket_deliveries = [];
        let firstinnings_deliveries = [];
        let secondinnings_deliveries = [];
        let COLOR_PALLETE = {"Delhi Capitals": "#6A7AB5",
        "Kolkata Knight Riders":"#552792",
        "Mumbai Indians":"#003B7A",
        "Royal Challengers Bangalore":"#8c0b01",
        "Chennai Super Kings":"#f2a619",
        "Gujarat Titans":"#ADD8E6",
        "Lucknow Super Giants":"#81BC00",
        "Punjab Kings" :"#808080",
        "Rajasthan Royals":"#EA1A85",
        "Sunrisers Hyderabad":"#ED1A37"
        };
        let SHORT_FORM = {"Delhi Capitals": ["DC"],
        "Kolkata Knight Riders":["KKR"],
        "Mumbai Indians":["MI"],
        "Royal Challengers Bangalore":["RCB"],
        "Chennai Super Kings":["CSK"],
        "Gujarat Titans":["GT"],
        "Lucknow Super Giants":["LSG"],
        "Punjab Kings" :["PBKS"],
        "Rajasthan Royals":["RR"],
        "Sunrisers Hyderabad":["SRH"]
        };
        
        let extras = 0;

        // Modifying the data to include 'cumulative score' and 'ball number' features in the data
        first_innings.map(d=>{
            if(d.extra_type === "wides" || d.extra_type === "noballs"){
                totalruns_1 += Number(d.total_run);
                d['cumulativescore'] = totalruns_1;
                d['ball_number'] = ball_number;
                if(firstinnings_deliveries.length === 0){
                    extras = Number(d.total_run);
                }
                else
                    firstinnings_deliveries[firstinnings_deliveries.length-1].cumulativescore += Number(d.total_run)
            }
            else{
                if(extras !== 0){
                    totalruns_1 += Number(d.total_run)+extras;
                    extras = 0;
                }
                totalruns_1 += Number(d.total_run);
                d['cumulativescore'] = totalruns_1;
                ball_number += 1;
                d['ball_number'] = ball_number;
                if(d.isWicketDelivery === "1"){
                    wicket_deliveries.push(d);
                    totalwickets_1 += 1;
                }
                d['total_wickets'] = totalwickets_1;
                firstinnings_deliveries.push(d);
            }
        });
        ball_number = 0;
        let extras_2 = 0;
        second_innings.map(d=>{
            if(d.extra_type === "wides" || d.extra_type === "noballs"){
                totalruns_2 += Number(d.total_run);
                d['cumulativescore'] = totalruns_2;
                //ball_number += 1;
                d['ball_number'] = ball_number;
                if(secondinnings_deliveries.length === 0){
                    extras_2 = Number(d.total_run);
                }
                else
                    secondinnings_deliveries[secondinnings_deliveries.length-1].cumulativescore += Number(d.total_run)
            }
            else{
                if(extras_2 !== 0){
                    totalruns_2 += Number(d.total_run)+extras_2;
                    extras_2 = 0;
                }
                totalruns_2 += Number(d.total_run);
                d['cumulativescore'] = totalruns_2;
                ball_number += 1;
                d['ball_number'] = ball_number;
                if(d.isWicketDelivery === "1"){
                    wicket_deliveries.push(d);
                    totalwickets_2 += 1;
                }
                d['total_wickets'] = totalwickets_2;
                secondinnings_deliveries.push(d);
            }
        });
        
        // creating pie_chart, heatmap, partnership chart with the modified data
        this.piechart_obj.updatePieChart(firstinnings_deliveries,secondinnings_deliveries);
        this.heatmap_obj.updateHeatMap(firstinnings_deliveries,"first");
        this.heatmap_obj.updateHeatMap(secondinnings_deliveries,"second");
        // this.partnership_obj.drawTable(first_innings,"first");
        // this.partnership_obj.drawTable(second_innings,"second");
        this.partnership_obj.drawTable(firstinnings_deliveries,"first");
        this.partnership_obj.drawTable(secondinnings_deliveries,"second");
        this.header.drawHeader(firstinnings_deliveries,secondinnings_deliveries,matchID);
        this.runperover_obj.draw_rpo(firstinnings_deliveries,secondinnings_deliveries);
       
        let max_balls = Math.max(firstinnings_deliveries[firstinnings_deliveries.length-1].ball_number,secondinnings_deliveries[secondinnings_deliveries.length-1].ball_number);
        let max_score = Math.max(first_innings[first_innings.length-1].cumulativescore,second_innings[second_innings.length-1].cumulativescore);
        
        // scales for the worm graph
        let xscale = d3.scaleLinear()
                        .domain([1,max_balls])
                        .range([PADDING.LEFT,LINE_CHART_WIDTH-PADDING.RIGHT-1]).nice();
        let yscale = d3.scaleLinear()
                        .domain([0,max_score])
                        .range([LINE_CHART_HEIGHT-PADDING.TOP,PADDING.BOTTOM]).nice();

        
        // Heading of worm graph
        d3.select("#header-worm").text("Worm Graph").attr('x',380).attr('y',30).style("font-weight","bold");
        d3.select("#brush-text").text("(Brush available on x-axis)").attr('x',347).attr('y',45).style("font-size",14);
        // Legend for worm graph
        let legend_data=[{"team1":firstinnings_deliveries[0].BattingTeam,"color1":COLOR_PALLETE[firstinnings_deliveries[0].BattingTeam],
        "team2":secondinnings_deliveries[0].BattingTeam,"color2":COLOR_PALLETE[secondinnings_deliveries[0].BattingTeam]}];
        d3.select("#legend").selectAll("*").remove();
        d3.select("#line-chart").select("#legend").selectAll(".header-data")
                                                    .data(legend_data)
                                                    .join("g")
                                                    .classed("header-data",true);
        d3.select(".header-data").append("rect").attr('x',PADDING.LEFT+15).attr('y',PADDING.TOP-10).attr("width",10).attr("height",10).attr("fill",d=>d.color1);
        d3.select(".header-data").append("text").attr('x',PADDING.LEFT+28).attr('y',PADDING.TOP).text(d=>SHORT_FORM[d.team1]);
        d3.select(".header-data").append("rect").attr('x',PADDING.LEFT+70).attr('y',PADDING.TOP-10).attr("width",10).attr("height",10).attr("fill",d=>d.color2);
        d3.select(".header-data").append("text").attr('x',PADDING.LEFT+83).attr('y',PADDING.TOP).text(d=>SHORT_FORM[d.team2]);
        
        // Lines in worm graph
        let lines = d3.select("#lines");
        const data = [firstinnings_deliveries,secondinnings_deliveries];
        let dline = d3.line()
                        .x(d=>xscale(d['ball_number']))
                        .y(d=>yscale(d.cumulativescore));
        lines.selectAll('path')
             .data(data)
             .join('path')
             .attr('fill','none')
             .attr('stroke',(d)=>COLOR_PALLETE[d[0].BattingTeam])
             .attr("d",dline);

        // wickets circle over worm graph    
        d3.select("#wickets-circle")
            .selectAll("circle")
            .data(wicket_deliveries)
            .join("circle")
            .attr("cx",d=>xscale(d['ball_number']))
            .attr("cy",d=>yscale(d['cumulativescore']))
            .attr("r",4)
            .attr("fill",(d)=>COLOR_PALLETE[d.BattingTeam]);
        
        //x-axis
        let xaxis = d3.axisBottom()
                        .scale(xscale);
        d3.select("#x-axis").attr("transform","translate(0,"+(LINE_CHART_HEIGHT-PADDING.BOTTOM)+")")
                            .call(xaxis);
        
        //y-axis                    
        let yaxis = d3.axisLeft()
                        .scale(yscale);
        d3.select("#y-axis").attr("transform","translate("+PADDING.LEFT+",0)")
                            .call(yaxis);
        
        //xaxis label 
        d3.select("#labels")
            .append("text")
            .attr("text-anchor","end")
            .attr('x',LINE_CHART_WIDTH/2)
            .attr('y',LINE_CHART_HEIGHT-17)
            .text("Balls");   
           
        //yaxis label
        d3.select("#labels")
            .append("text")
            .attr("text-anchor","end")
            .attr('x',-LINE_CHART_WIDTH/4)
            .attr('y',PADDING.RIGHT - 15)
            .attr("transform","rotate(-90)")
            .text("Runs");
        
        // Sliding bar on the graph 
        d3.select("#line-chart").on("mousemove",(event)=>{
            if(d3.pointer(event)[0]>PADDING.LEFT && d3.pointer(event)[0]<LINE_CHART_WIDTH-PADDING.RIGHT){
                d3.select("#overlay")
                    .select("line")
                    .attr("stroke","black")
                    .attr('x1',d3.pointer(event)[0])
                    .attr('x2',d3.pointer(event)[0])
                    .attr('y1',LINE_CHART_HEIGHT-PADDING.TOP)
                    .attr('y2',PADDING.BOTTOM);
                
                // data to be displayed for slider
                const ballno = Math.floor(xscale.invert(d3.pointer(event)[0]));
                let arr = [[{"text":"overs","BattingTeam":null}]];
                for(let innings of data){
                    let filtered = innings.filter((ball)=>ball.ball_number === ballno);
                    if(filtered.length!==0){
                        arr.push(filtered);
                        arr[0][0]["overs"] = filtered[0]["overs"];
                        arr[0][0]['balls'] = filtered[0]["ballnumber"];
                        arr[0][0]['ball_number'] = filtered[0]['ball_number'];
                    }
                }

                //data formatting for slider
                let overlaytext = function(d){
                    let overs = "";
                    if(d[0]["text"] === "overs"){
                        
                        let over = Math.floor(d[0]['ball_number']/6);
                        let ball = d[0]['ball_number']%6;
                        overs = "Overs: "+d[0].overs+"."+d[0].balls;
                        return "Overs: "+over+"."+ball;
                    }
                    overs += SHORT_FORM[d[0].BattingTeam]+": "+d[0].cumulativescore + "/"+d[0].total_wickets;
                    return overs; 
                }
                //slider text
                d3.select("#overlay")
                    .selectAll("text")
                    .data(arr)
                    .join("text")
                    .text((d)=>overlaytext(d))
                    .attr('x',d3.pointer(event)[0]>(LINE_CHART_WIDTH-d3.select("#overlay").node().getBoundingClientRect().width)?d3.pointer(event)[0]-d3.select("#overlay").node().getBoundingClientRect().width: d3.pointer(event)[0]+10)
                    .attr('y',(d,i)=>20*i + PADDING.TOP)
                    .attr('alignment-baseline','hanging')
                    .style("fill",(d)=>{
                        if(d[0].BattingTeam !== null){
                            return COLOR_PALLETE[d[0].BattingTeam]
                        }
                        
                    });
            }
        })

        // Brush on the worm graph
        const that = this;
        let brush = d3.brushX()
                        .extent([[PADDING.LEFT,LINE_CHART_HEIGHT-PADDING.BOTTOM],[LINE_CHART_WIDTH-PADDING.RIGHT,LINE_CHART_HEIGHT-20]])
                        .on("brush",function(e){
                            if(e.selection){
                                const [left,right] = e.selection;
                                let from = Math.floor(xscale.invert(left));
                                let to = Math.floor(xscale.invert(right));
                                d3.select("#over-choosen").select("text").text("SELECTED BALLS: "+from+" to "+to).attr('x',LINE_CHART_WIDTH/2-100).attr('y',LINE_CHART_HEIGHT);
                                
                                // update pie chart, heatmap and partnership chart according to brushed part
                                that.piechart_obj.updatePieChart(firstinnings_deliveries,secondinnings_deliveries,from,to);
                                that.heatmap_obj.updateHeatMap(firstinnings_deliveries,"first",from,to);
                                that.heatmap_obj.updateHeatMap(secondinnings_deliveries,"second",from,to);
                                that.partnership_obj.drawTable(first_innings,"first",from,to);
                                that.partnership_obj.drawTable(second_innings,"second",from,to);
                            }
                        })
                        .on("end",function(e){
                            if(e.selection){
                                const [left,right] = e.selection;
                                let from = Math.floor(xscale.invert(left));
                                let to = Math.floor(xscale.invert(right));
                                d3.select("#over-choosen").select("text").text("SELECTED BALLS: "+from+" to "+to).attr('x',LINE_CHART_WIDTH/2-100).attr('y',LINE_CHART_HEIGHT);
                                // update pie chart, heatmap and partnership chart according to brushed part
                                that.piechart_obj.updatePieChart(firstinnings_deliveries,secondinnings_deliveries,from,to);
                                that.heatmap_obj.updateHeatMap(firstinnings_deliveries,"first",from,to);
                                that.heatmap_obj.updateHeatMap(secondinnings_deliveries,"second",from,to);
                                that.partnership_obj.drawTable(first_innings,"first",from,to);
                                that.partnership_obj.drawTable(second_innings,"second",from,to);
                            }
                        })
        d3.select("#worm-brush").call(brush);
        d3.select("#lines").raise();
        
        d3.select("#brush_reset").on("click",function(d,e){
            d3.select("#worm-brush").call(brush.move,null);
            that.drawWormGraph(matchID);
            d3.select("#over-choosen").selectAll("*").remove();
        })
    }
}