const LINE_CHART_WIDTH = 600;
const LINE_CHART_HEIGHT = 300;
const PADDING = {
    LEFT: 80,
    RIGHT:50,
    TOP:50,
    BOTTOM:50
};
class viz{
    constructor(matchData,perBallData){
        this.matchData = matchData;
        this.perBallData = perBallData;
        
        console.log(this.teams);
        console.log(matchData);
        console.log(perBallData);

        let linesvg = d3.select(".content").append("svg").attr("width",LINE_CHART_WIDTH).attr("height",LINE_CHART_HEIGHT).attr("id","line-chart");
        let x_axisg = linesvg.append("g").attr("id","x-axis");
        let y_axisg = linesvg.append("g").attr("id","y-axis");
        let linesg = linesvg.append("g").attr("id","lines");
        let overlayg = linesvg.append("g").attr("id","overlay");
        let overlayline = overlayg.append("line");
    }
    drawWormGraph(matchID){
        console.log(matchID);
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
        let ball_number = 0;
        first_innings.map(d=>{
            totalruns_1 += Number(d.total_run)
            d['cumulativescore'] = totalruns_1;
            ball_number += 1;
            d['ball_number'] = ball_number;
        });
        ball_number = 0;
        second_innings.map(d=>{
            totalruns_2 += Number(d.total_run)
            d['cumulativescore'] = totalruns_2;
            ball_number += 1;
            d['ball_number'] = ball_number;
        });
        console.log(first_innings);
        console.log(second_innings);
        let max_balls = Math.max(first_innings[first_innings.length-1].ball_number,second_innings[second_innings.length-1].ball_number);
        let max_score = Math.max(first_innings[first_innings.length-1].cumulativescore,second_innings[second_innings.length-1].cumulativescore);
        let xscale = d3.scaleLinear()
                        .domain([0,max_balls])
                        .range([PADDING.LEFT,LINE_CHART_WIDTH-PADDING.RIGHT]).nice();
        let yscale = d3.scaleLinear()
                        .domain([0,max_score])
                        .range([LINE_CHART_HEIGHT-PADDING.TOP,PADDING.BOTTOM]).nice();
        //console.log(yscale);
        let lines = d3.select("#lines");
        let fun_x = function(d){
            //console.log(d);
            //console.log("x-axis : "+xscale(d['ball_number']));
            return xscale(d['ball_number']);
        }
        let fun_y= function(d){
            //console.log(d);
            //console.log("y-axis: "+yscale(d.cumulativescore));
            return yscale(d.cumulativescore);
        }
        //console.log(yscale(0));
        //console.log(yscale(130));
        const data = [first_innings,second_innings];
        let dline = d3.line()
                        .x(d=>fun_x(d))
                        .y(d=>fun_y(d));
        lines.selectAll('path')
             .data(data)
             .join('path')
             .attr('fill','none')
             .attr('stroke','black')
             .attr("d",dline);
        
        let xaxis = d3.axisBottom()
                        .scale(xscale);
        d3.select("#x-axis").attr("transform","translate(0,"+(LINE_CHART_HEIGHT-PADDING.BOTTOM)+")")
                            .call(xaxis);
        let yaxis = d3.axisLeft()
                        .scale(yscale);
        d3.select("#y-axis").attr("transform","translate("+PADDING.LEFT+",0)")
                            .call(yaxis);
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
                //console.log(Math.floor(ballno));
                //ballno = Math.floor(ballno);
                let arr = [];
                for(let innings of data){
                    console.log(innings);
                    console.log(innings.filter((ball)=>{console.log(ball); return ball.ball_number === ballno}));
                    arr.push(innings.filter((ball)=>ball.ball_number === ballno))
                }
                console.log(arr);
                let overlaytext = function(d){
                    console.log(d);
                    console.log(Math.floor(d[0].ball_number/6));
                    let overs = "";
                    if(d[0].innings==="1"){
                        console.log("first innings");
                        overs =""+ (Math.floor(d[0].ball_number/6)) +"."+ (d[0].ball_number%6) + "overs \n";
                    }
                        
                    overs = d[0].cumulativescore + " runs";
                    return overs; 
                }
                d3.select("#overlay")
                    .selectAll("text")
                    .data(arr)
                    .join("text")
                    .text((d)=>overlaytext(d))
                    .attr('x',d3.pointer(event)[0]>(LINE_CHART_WIDTH-d3.select("#overlay").node().getBoundingClientRect().width)?d3.pointer(event)[0]-d3.select("#overlay").node().getBoundingClientRect().width: d3.pointer(event)[0]+10)
                    .attr('y',(d,i)=>20*i + PADDING.TOP)
                    .attr('alignment-baseline','hanging');
            }
        })
    }
}