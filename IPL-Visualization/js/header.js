const HEADER_SVGWIDTH = 1366;
const HEADER_SVGHEIGHT = 100; 
class header{
    constructor(matchData,perBallData){
        this.matchData = matchData;
        this.perBallData = perBallData;

        this.headersvg = d3.select(".content").select(".header-div").append("svg").attr("id","header").attr("width",HEADER_SVGWIDTH).attr("height",HEADER_SVGHEIGHT);
    }
    drawHeader(firstinnings,secondinnings,matchID){
        console.log(firstinnings);
        console.log(secondinnings);
        console.log(firstinnings[firstinnings.length -1].cumulativescore);
        let team1_score = firstinnings[firstinnings.length -1].cumulativescore;
        let team2_score = secondinnings[secondinnings.length -1].cumulativescore;
        let team1_wickets = firstinnings[firstinnings.length -1].total_wickets;
        let team2_wickets = secondinnings[secondinnings.length -1].total_wickets;
        let matchgroup = d3.group(this.matchData,d=>d.ID)
        let match = matchgroup.get(matchID);
        console.log(match);
        let obj = {"date":{"d":match[0].Date,"venue":match[0].Venue},
                    "teams":{"team1":match[0].Team1,"team2":match[0].Team2,"t1_run":team1_score,"t2_run":team2_score,"t1_wickets":team1_wickets,"t2_wickets":team2_wickets},
                    //"scores":{"t1_run":team1_score,"t2_run":team2_score,"t1_wickets":team1_wickets,"t2_wickets":team2_wickets},
                    "result":{"winning_team":match[0].WinningTeam,"wonby":match[0].WonBy,"margin":match[0].Margin}
                }
        console.log(obj);
        console.log(Object.entries(obj));
        d3.select("#header").selectAll(".header-g-data")
                                .data(Object.entries(obj))
                                .join("g")
                                .classed("header-g-data",true)
                                .attr("transform",d=>{
                                    if(d[0] === "date")
                                        return "translate(500,10)";
                                    else if(d[0]==="teams")
                                        return "translate(400,38)"
                                    else    
                                        return "translate(530,75)"
                                })
        
        d3.selectAll(".header-g-data").filter(d=>d[0]==="date")
                                            .selectAll("text")
                                            .data(d=>[d])
                                            .join("text")
                                            .text(d=>{
                                                return d[1].d + ", "+d[1].venue
                                            })
                                            .attr("x",0)
                                            .attr("y",10)
                                            .attr('fill',"white")
                                            .style("font-weight", "bold");
        d3.selectAll(".header-g-data").filter(d=>d[0]==="teams")
                                            .selectAll("text")
                                            .data(d=>[d])
                                            .join("text")
                                            .text(d=>{
                                                return d[1].team1+": "+d[1].t1_run+"/"+d[1].t1_wickets + "  VS  "+d[1].team2+": "+d[1].t2_run+"/"+d[1].t2_wickets
                                            })
                                            .attr("x",d=>{
                                                if( d[1].team1==="Royal Challengers Bangalore")
                                                    return -100;
                                                else if(d[1].team1 ==="Lucknow Super Giants")
                                                    return -80;
                                                return 0;
                                            })
                                            .attr("y",15)
                                            .attr('fill',"white")
                                            .style("font-weight", "bold")
                                            .style("font-size","25px");
        // d3.selectAll(".header-g-data").filter(d=>d[0]==="scores")
        //                                     .selectAll("text")
        //                                     .data(d=>[d])
        //                                     .join("text")
        //                                     .text(d=>{
        //                                         return d[1].t1_run+"/"+d[1].t1_wickets + " VS "+d[1].t2_run+"/"+d[1].t2_wickets
        //                                     })
        //                                     .attr("x",0)
        //                                     .attr("y",5);
        d3.selectAll(".header-g-data").filter(d=>d[0]==="result")
                                            .selectAll("text")
                                            .data(d=>[d])
                                            .join("text")
                                            .text(d=>{
                                                if (d[1].wonby === "Wickets")
                                                    return d[1].winning_team+" won by "+d[1].margin+" wickets";
                                                else
                                                    return d[1].winning_team+" won by "+d[1].margin+" runs";
                                            })
                                            .attr("x",0)
                                            .attr("y",5)
                                            .attr('fill',"white")
                                            .style("font-weight", "bold")
                                            .style("font-size","15px");
    }
}