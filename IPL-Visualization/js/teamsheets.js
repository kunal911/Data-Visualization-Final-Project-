
class teamsheets{
    constructor(matchData){
        this.matchData = matchData;
        
    }
    drawTable(matchID,team){
        let matchDetails = this.matchData.filter(d=>d.ID === matchID);
        console.log(matchDetails);
        let players =[] ;
        let teamname = [];
        //let teamsvg = d3.select(".content").append("svg").attr("class",team).attr("width",TEAM_WIDTH).attr("height",TEAM_HEIGHT);
        if(team === "team1"){
            let player_name = matchDetails[0].Team1Players.split(",");
            teamname.push(matchDetails[0].Team1);
            for(let i = 0;i<player_name.length;i++){
                if(i===player_name.length-1){
                    players.push(player_name[i].slice(2,player_name[i].length-2));    
                }
                else{
                    players.push(player_name[i].slice(2,player_name[i].length-1));
                }
            }
            console.log(players);
        }
        else{
            let player_name = matchDetails[0].Team2Players.split(",");
            teamname.push(matchDetails[0].Team2);
            for(let i = 0;i<player_name.length;i++){
                if(i===player_name.length-1){
                    players.push(player_name[i].slice(2,player_name[i].length-2));    
                }
                else{
                    players.push(player_name[i].slice(2,player_name[i].length-1));
                }
            }
        }
        let row_height = TEAM_HEIGHT/(players.length+2);
        // console.log(players);
        d3.select("."+team).select(".team-name").selectAll("text")
                                                .data(teamname)
                                                .join("text")
                                                .text(d=>d)
                                                .attr('x',5)
                                                .attr('y',row_height);
        d3.select("."+team).select(".player-name").selectAll("text")
                    .data(players)
                    .join("text")
                    .text(d=>d)
                    .attr('x',5)
                    .attr('y',(d,i)=>row_height*(i+2));

    }
}