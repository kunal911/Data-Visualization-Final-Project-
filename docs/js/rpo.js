console.log("test")
class RPO{
    constructor(matchData,ballbyball,rpodata)
    {
        this.matchData = matchData;
        this.ballbyball = ballbyball;
        this.rpodata = rpodata;
        this.barsvg = d3.select(".content").append("svg").attr("id","rpo").attr("width",700).attr("height",800);
    }
    drawbar(matchID, from = 0, to = 120)
    {
        let matches = d3.group(this.rpodata,(d)=>d.ID);
        let match = matches.get(matchID);
        let groupbyID = d3.group(this.rpodata,d=>d.ID);
        let matchDetails = groupbyID.get(matchID);
        let innings_group = d3.group(matchDetails,d=>d.innings);
        let first_innings = innings_group.get("1");
        let second_innings = innings_group.get("2");
        let last_element = first_innings.length-1
        let last_ball = first_innings[last_element];

        console.log(last_ball)
       
    }
}