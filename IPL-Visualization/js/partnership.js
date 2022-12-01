
class partnership{
    constructor(matchData,ballbyball){
        this.matchData = matchData;
        this.ballbyball = ballbyball;
        this.cellwidth = [0,150,550];
        //d3.select(".content").append("svg").attr("width",HEADER_SVGWIDTH).attr("height",HEADER_SVGHEIGHT);
        this.tablesvg = d3.select(".content").append("svg").attr("id","partnership").attr("width",700).attr("height",800);
        this.tableg = this.tablesvg.append("g").attr("class","table-group");

    }
    drawTable(matchID,from=0,to=120){
        let matches = d3.group(this.matchData,(d)=>d.ID);
        let match = matches.get(matchID);
        let groupbyID = d3.group(this.ballbyball,d=>d.ID);
        let matchDetails = groupbyID.get(matchID);
        let innings_group = d3.group(matchDetails,d=>d.innings);
        let first_innings = innings_group.get("1");
        let second_innings = innings_group.get("2");
        let last_element = first_innings.length-1
        let last_ball = first_innings[last_element];
        // console.log(last_ball)
        // console.log(first_innings[first_innings.length-1].cumulativescore)
        let partnership_details = [];
        let obj = {};
        let max_runs = 0;
        for(let i=0;i<first_innings.length;i++){
            if(first_innings[i].ball_number>=from && first_innings[i].ball_number<=to){
                if(Number(first_innings[i].isWicketDelivery)===1){
                    if(Object.keys(obj).length === 0){
                        obj['batter1'] = {"name":first_innings[i].batter,"batter1_runs":0};
                        obj['partnership'] = {"total":{"total_runs":0}};
                        obj["batter2"] ={"name":first_innings[i]["non-striker"],"batter2_runs":0};
                        if(first_innings[i].batter === obj['batter1'].name){
                            obj['batter1']['batter1_balls'] = 1;
                            obj['batter2']['batter2_balls'] = 0;
                        }
                        else{
                            obj["batter2"]['batter2_balls'] = 1;
                            obj["batter1"]['batter1_balls'] = 0;
                        }
                        obj['partnership']['total']['total_balls'] = 1;
                    }
                    if(first_innings[i].batter === obj['batter1'].name){
                        obj['batter1']['batter1_balls'] += 1;
                    }
                    else{
                        obj['batter2']['batter2_balls'] += 1;
                    }
                    obj['partnership']['total']['total_balls'] += 1;
                    let mruns = Math.max(obj['batter1']['batter1_runs'],obj['batter2']['batter2_runs'])
                    if(mruns>max_runs){
                        max_runs = mruns;
                    }
                    partnership_details.push(obj);
                    obj={};
                }
                else{
                    if(Object.keys(obj).length === 0){
                        obj['batter1'] = {"name":first_innings[i].batter,"batter1_runs":0,"batter1_balls":0};
                        obj['partnership'] = {"total":{"total_runs":0,"total_balls":0},"batter1_contri":0,"batter2_contri":0};
                        obj['batter2'] = {"name":first_innings[i]["non-striker"],"batter2_runs":0,"batter2_balls":0};
                        
                    }
                    if(first_innings[i].batter === obj['batter1'].name){
                        if(first_innings[i].extra_type !== "wides" || first_innings[i].extra_type !== "noballs"){
                            obj['batter1']['batter1_balls'] += 1;
                            obj['partnership']['total']['total_balls'] += 1;
                            obj['batter1']['batter1_runs'] += Number(first_innings[i].batsman_run);
                            obj['partnership']['batter1_contri'] = obj['batter1']['batter1_runs'];
                        }
                        obj['partnership']['total']['total_runs'] += Number(first_innings[i].total_run);
                    }
                    else if(first_innings[i].batter === obj['batter2'].name){
                        if(first_innings[i].extra_type !== "wides" || first_innings[i].extra_type !== "noballs"){
                            obj['batter2']['batter2_balls'] += 1;
                            obj['partnership']['total']['total_balls'] += 1;
                            obj['batter2']['batter2_runs'] += Number(first_innings[i].batsman_run);
                            obj['partnership']['batter2_contri'] = obj['batter2']['batter2_runs'];
                        }
                        obj['partnership']['total']['total_runs'] += Number(first_innings[i].total_run);
                    }
                }
            }
            
        }
        if(Object.keys(obj).length !== 0){
            let mruns = Math.max(obj['batter1']['batter1_runs'],obj['batter2']['batter2_runs'])
            if(mruns>max_runs){
                max_runs = mruns;
            }
            partnership_details.push(obj);
        }

        console.log(partnership_details);
        console.log(max_runs);
        let row_height = 40;
        let rows = this.tableg.selectAll(".table-row")
                                .data(partnership_details)
                                .join("g")
                                .classed("table-row",true)
                                .attr("transform",(d,i)=>"translate(0,"+((i+1)*row_height)+")");
        
        let table_cells = rows.selectAll(".table-cells")
                                .data(d=>Object.entries(d))
                                .join("g")
                                .classed("table-cells",true)
                                .attr("transform",(d,i)=>"translate("+(this.cellwidth[i])+",0)");
        
        d3.selectAll(".table-cells").filter(d=>d[0]==="batter1")
                                    .selectAll("text")
                                    .data(d=>[d])
                                    .join("text")
                                    .text(d=>d[1].name+" \n "+d[1].batter1_runs + "("+d[1].batter1_balls+")");
        
        d3.selectAll(".table-cells").filter(d=>d[0]==="batter2")
                                    .selectAll("text")
                                    .data(d=>[d])
                                    .join("text")
                                    .text(d=>d[1].name+" \n "+d[1].batter2_runs + "("+d[1].batter2_balls+")");
        
        //let batter1_max = 
        let xscale = d3.scaleLinear()
                        .domain([0,max_runs])
                        .range([0,200]);
        console.log(d3.selectAll(".table-cells").filter(d=>d[0]==="partnership"));
        d3.selectAll(".table-cells").filter(d=>d[0]==="partnership")
                                    .selectAll("g")
                                    .data(d=>Object.entries(d[1]))
                                    .join("g")
                                    .attr("class","partnership-data")
                                    .attr("transform",(d)=>{
                                        if(d[0] === "total"){
                                            return "translate(160,0)";
                                        }
                                        else if(d[0]==="batter1_contri"){
                                            return "translate(0,10)";
                                        }
                                        else{
                                            return "translate(200,10)";
                                        }
                                    });
        d3.selectAll(".partnership-data").filter(d=>d[0]==="total")
                                        .selectAll("text")
                                        .data(d=>[d])
                                        .join("text")
                                        .text(d=>d[1].total_runs+"("+d[1].total_balls+")")
        d3.selectAll(".partnership-data").filter(d=>d[0]==="batter1_contri")
                                        .selectAll("rect")
                                        .data(d=>[d])
                                        .join("rect")
                                        .attr('x',d=>{console.log(d); return 200-xscale(d[1]);})
                                        .attr('y',0)
                                        .attr("width",d=>xscale(d[1]))
                                        .attr("height",15)
                                        .attr("fill","red");
        d3.selectAll(".partnership-data").filter(d=>d[0]==="batter2_contri")
                                        .selectAll("rect")
                                        .data(d=>[d])
                                        .join("rect")
                                        .attr('x',0)
                                        .attr('y',0)
                                        .attr("width",d=>xscale(d[1]))
                                        .attr("height",15)
                                        .attr("fill","blue");
                                    
    }
}