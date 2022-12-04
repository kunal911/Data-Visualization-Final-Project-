// This class returns the match id according to the teams selected in the dropdown menu.

//call your function in the addListener function below.
class matchSelection{
    constructor(matchData,perBallData){
        console.log(matchData);
        this.matchData = matchData;
        this.perBallData = perBallData;
        this.teams = matchData.map(d=>d.Team1);
        this.teams = [...new Set(this.teams)];
        this.dropdown = document.getElementById("team1");
        for(const team of this.teams){
            this.opt = document.createElement("option");
            this.opt.value = team;
            this.opt.textContent = team;
            this.dropdown.appendChild(this.opt);
        }
        this.dropdown2 = document.getElementById("team2");
        for(const team of this.teams){
            this.opt = document.createElement("option");
            this.opt.value = team;
            this.opt.textContent = team;
            this.dropdown2.appendChild(this.opt);
        }
        this.addListener();
        this.visulization = new viz(this.matchData,this.perBallData);
        this.teamsheet = new teamsheets(this.matchData);
        
    }
    getMatchID(team1,team2){
        let matches = this.matchData.filter(d=>(d.Team1 === team1 && d.Team2 ===team2)) 
        if (matches.length===0){
            matches = this.matchData.filter(d=>(d.Team1 === team2 && d.Team2 === team1));
        } 
        // && (d.Team2 ===team2 || d.Team2 === team1)
        console.log(matches)    
        return matches[0].ID;
    }
    addListener(){
        const that = this;
        this.dropdown.addEventListener("change",function(){
            if(that.dropdown.value !== "Select Team 1" && that.dropdown2.value!=="Select Team 2")
            {
                //getting matchID according to selected teams
                let matchID = that.getMatchID(that.dropdown.value,that.dropdown2.value);
                
                //creating worm graph from the matchID
                that.teamsheet.drawTable(matchID,"team1");
                that.visulization.drawWormGraph(matchID);
                that.teamsheet.drawTable(matchID,"team2");
            }
        });
        this.dropdown2.addEventListener("change",function(){
            if(that.dropdown.value !== "Select Team 1" && that.dropdown2.value!=="Select Team 2")
            {
                let matchID = that.getMatchID(that.dropdown.value,that.dropdown2.value);
                
                that.teamsheet.drawTable(matchID,"team1");
                that.visulization.drawWormGraph(matchID);   //draws worm graph for the selected match
                that.teamsheet.drawTable(matchID,"team2");
                
            }
        });
    }
}