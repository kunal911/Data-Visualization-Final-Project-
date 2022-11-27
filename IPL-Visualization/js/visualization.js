const LINE_CHART_WIDTH = 800;
const LINE_CHART_HEIGHT = 350;
const PADDING = {
    LEFT: 60,
    RIGHT:30,
    TOP:50,
    BOTTOM:50
};
const TEAM_WIDTH = 200;
const TEAM_HEIGHT = 300;
class viz{
    constructor(matchData,perBallData){
        this.matchData = matchData;
        this.perBallData = perBallData;
        
        //console.log(this.teams);
        //console.log(matchData);
        //console.log(perBallData);
        d3.select(".content").append("svg").attr("class","team1").attr("width",TEAM_WIDTH).attr("height",TEAM_HEIGHT);
        d3.select(".team1").append("g").attr("class","team-name");
        d3.select(".team1").append("g").attr("class","player-name");
        let linesvg = d3.select(".content").append("svg").attr("width",LINE_CHART_WIDTH).attr("height",LINE_CHART_HEIGHT).attr("id","line-chart");
        let x_axisg = linesvg.append("g").attr("id","x-axis");
        let y_axisg = linesvg.append("g").attr("id","y-axis");
        let linesg = linesvg.append("g").attr("id","lines");
        let overlayg = linesvg.append("g").attr("id","overlay");
        let overlayline = overlayg.append("line");
        let brushg = linesvg.append("g").attr("id","worm-brush");
        let circleg = linesvg.append("g").attr("id","wickets-circle");
        linesvg.append("g").attr("id","labels");
        d3.select(".content").append("svg").attr("class","team2").attr("width",TEAM_WIDTH).attr("height",TEAM_HEIGHT);
        d3.select(".team2").append("g").attr("class","team-name");
        d3.select(".team2").append("g").attr("class","player-name");

        
    //console.log(COLOR_PALLETE["Sunrisers Hyderabad"]);
    }
    drawWormGraph(matchID){
        //console.log(matchID);
        
        let groupbyID = d3.group(this.perBallData,d=>d.ID);
        let matchDetails = groupbyID.get(matchID);
        //console.log(groupbyID.get(matchID).length);
        let innings_group = d3.group(matchDetails,d=>d.innings);
        let first_innings = innings_group.get("1");
        let second_innings = innings_group.get("2");
        let svgheight = 300;
        let svgwidth = 300;
        let totalruns_1 = 0;
        let totalruns_2 = 0;
        let totalwickets_1 = 0;
        let totalwickets_2=0;
        let ball_number = 0;
        let wicket_deliveries = [];
        let firstinnings_deliveries = [];
        let secondinnings_deliveries = [];
        let COLOR_PALLETE = {"Delhi Capitals": "#17479E",
        "Kolkata Knight Riders":"#552792",
        "Mumbai Indians":"#003B7A",
        "Royal Challengers Bangalore":"#8c0b01",
        "Chennai Super Kings":"#f2a619",
        "Gujarat Titans":"#0B4973",
        "Lucknow Super Giants":"#FFCC00",
        "Punjab Kings" :"#84171B",
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
        //console.log(first_innings);
        first_innings.map(d=>{
            //console.log(d);
            if(d.extra_type === "wides" || d.extra_type === "noballs"){
                totalruns_1 += Number(d.total_run);
                d['cumulativescore'] = totalruns_1;
                //ball_number += 1;
                d['ball_number'] = ball_number;
            }
            else{
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
        second_innings.map(d=>{
            if(d.extra_type === "wides" || d.extra_type === "noballs"){
                totalruns_2 += Number(d.total_run);
                d['cumulativescore'] = totalruns_2;
                //ball_number += 1;
                d['ball_number'] = ball_number;
            }
            else{
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
        console.log(wicket_deliveries);
        console.log(firstinnings_deliveries);
        console.log(secondinnings_deliveries);
        let max_balls = Math.max(firstinnings_deliveries[firstinnings_deliveries.length-1].ball_number,secondinnings_deliveries[secondinnings_deliveries.length-1].ball_number);
        let max_score = Math.max(first_innings[first_innings.length-1].cumulativescore,second_innings[second_innings.length-1].cumulativescore);
        let xscale = d3.scaleLinear()
                        .domain([0,max_balls])
                        .range([PADDING.LEFT,LINE_CHART_WIDTH-PADDING.RIGHT]).nice();
        let yscale = d3.scaleLinear()
                        .domain([0,max_score])
                        .range([LINE_CHART_HEIGHT-PADDING.TOP,PADDING.BOTTOM]).nice();
        //console.log(yscale);
        let lines = d3.select("#lines");
        
        const data = [firstinnings_deliveries,secondinnings_deliveries];
        let dline = d3.line()
                        .x(d=>xscale(d['ball_number']))
                        .y(d=>yscale(d.cumulativescore));
        //runs scored
        //console.log(first_innings);
        //console.log(COLOR_PALLETE["Sunrisers Hyderabad"]);
        lines.selectAll('path')
             .data(data)
             .join('path')
             .attr('fill','none')
             .attr('stroke',(d)=>COLOR_PALLETE[d[0].BattingTeam])
             .attr("d",dline);

         // wickets circle    
        d3.select("#wickets-circle")
            .selectAll("circle")
            .data(wicket_deliveries)
            .join("circle")
            .attr("cx",d=>xscale(d['ball_number']))
            .attr("cy",d=>yscale(d['cumulativescore']))
            .attr("r",4)
            .attr("fill",(d)=>COLOR_PALLETE[d.BattingTeam]);
        let count = -12;
            let xaxis = d3.axisBottom()
                        .scale(xscale)
                        .ticks(9)
                        .tickFormat((d)=>{
                            if(d%30===0)     
                                return d/6;
                        });
        d3.select("#x-axis").attr("transform","translate(0,"+(LINE_CHART_HEIGHT-PADDING.BOTTOM)+")")
                            .call(xaxis);
        let yaxis = d3.axisLeft()
                        .scale(yscale);
        d3.select("#y-axis").attr("transform","translate("+PADDING.LEFT+",0)")
                            .call(yaxis);
        
        //xaxis label 
        d3.select("#labels")
            .append("text")
            .attr("text-anchor","end")
            .attr('x',LINE_CHART_WIDTH/2)
            .attr('y',LINE_CHART_HEIGHT)
            .text("Overs");   
           
        //yaxis label
        d3.select("#labels")
            .append("text")
            .attr("text-anchor","end")
            .attr('x',-LINE_CHART_WIDTH/5)
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
            
                const ballno = Math.floor(xscale.invert(d3.pointer(event)[0]));
                let arr = [[{"text":"overs","BattingTeam":null}]];
                for(let innings of data){
                    let filtered = innings.filter((ball)=>ball.ball_number === ballno);
                    if(filtered.length!==0){
                        arr.push(filtered);
                        //console.log(arr[0][0]);
                        arr[0][0]["overs"] = filtered[0]["overs"];
                        arr[0][0]['balls'] = filtered[0]["ballnumber"];
                    }
                }
                //console.log(arr);
                let overlaytext = function(d){
                    
                    let overs = "";
                    if(d[0]["text"] === "overs"){
                        //console.log(d[0]);
                        overs = "Overs: "+d[0].overs+"."+d[0].balls;
                        //console.log(overs);
                        return overs;
                    }
                    overs += SHORT_FORM[d[0].BattingTeam]+": "+d[0].cumulativescore + "/"+d[0].total_wickets;
                    return overs; 
                }
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
                            //console.log("brush");
                            //console.log(e.selection);
                            if(e.selection){
                                const [left,right] = e.selection;
                                console.log(xscale.invert(left));
                                console.log(xscale.invert(right));
                            }
                        })
                        .on("end",function(e){
                            console.log("end");
                            console.log(e.selection);
                            if(e.selection){
                                const [left,right] = e.selection;
                                console.log(xscale.invert(left));
                                console.log(xscale.invert(right));
                            }
                        })
        d3.select("#worm-brush").call(brush);
        d3.select("#lines").raise();
    }
}