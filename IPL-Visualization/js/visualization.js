class viz{
    constructor(matchData,perBallData){
        this.matchData = matchData;
        this.perBallData = perBallData;
        
        console.log(this.teams);
        console.log(matchData);
        console.log(perBallData);
        
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
                        .range([0,svgwidth]);
        let yscale = d3.scaleLinear()
                        .domain([0,max_score])
                        .range([svgheight,0]);
                        console.log(yscale);
        let lines = d3.select("#lines");
        let fun_x = function(d){
            console.log(d);
            console.log("x-axis : "+xscale(d['ball_number']));
            return xscale(d['ball_number']);
        }
        let fun_y= function(d){
            //console.log(d);
            //console.log("y-axis: "+yscale(d.cumulativescore));
            return yscale(d.cumulativescore);
        }
        //console.log(yscale(0));
        //console.log(yscale(130));
        
        let dline = d3.line()
                        .x(d=>fun_x(d))
                        .y(d=>fun_y(d));
        lines.append('path')
             .datum(first_innings)
             .attr('fill','none')
             .attr('stroke','black')
             .attr("d",dline);
        lines.append('path')
             .datum(second_innings)
             .attr('fill','none')
             .attr('stroke','black')
             .attr("d",dline);
        
        
    }
}