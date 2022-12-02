const cellwidth = {
    "left":160,
    "middle":300,
    "right":160
}
const Partnership_SVGWidth = 1300;
const Partnership_SVGHeight = 500;
const startpositions = {
    0:0,
    1:160,
    2:460
}
class partnership{
    constructor(matchData,ballbyball){
        this.matchData = matchData;
        this.ballbyball = ballbyball;
    
        this.tablesvg = d3.select(".content").append("svg").attr("id","partnership").attr("width",Partnership_SVGWidth).attr("height",Partnership_SVGHeight);
        this.tablesvg.append("text").attr("id","partnership-label");
        this.tablesvg.append("text").attr("id","first-innings");
        this.tablesvg.append("text").attr("id","second-innings");
        this.tableg = this.tablesvg.append("g").attr("class","table-group").attr("transform","translate(45,22)");
    
        this.tableg_2 = this.tablesvg.append("g").attr("class","table-group-i2").attr("transform","translate(700,22)");

    }
    drawTable(first_innings,innings,from=0,to=120){
        
        let last_element = first_innings.length-1
        let last_ball = first_innings[last_element];
        
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

        //console.log(partnership_details);
        //console.log(max_runs);
        let row_height = 40;
        let rows;
        d3.select("#partnership-label").text("Partnership").attr('x',Partnership_SVGWidth/2-50).attr('y',11).style("font-weight","bold");
        d3.select("#first-innings").text("First Innings").attr('x',310).attr('y',30).style("font-weight","bold");
        d3.select("#second-innings").text("Second Innings").attr('x',930).attr('y',30).style("font-weight","bold");
        if(innings==="first"){
            rows = this.tableg.selectAll(".table-row")
            .data(partnership_details)
            .join("g")
            .classed("table-row",true)
            .attr("transform",(d,i)=>"translate(0,"+((i+1)*row_height)+")");
        }
        else{
            rows = this.tableg_2.selectAll(".table-row")
            .data(partnership_details)
            .join("g")
            .classed("table-row",true)
            .attr("transform",(d,i)=>"translate(0,"+((i+1)*row_height)+")");
        }
            let table_cells = rows.selectAll(".table-cells")
            .data(d=>Object.entries(d))
            .join("g")
            .classed("table-cells",true)
            .attr("transform",(d,i)=>{
                if(i===0)
                    return "translate("+(startpositions[i])+",5)"
                else if(i===2)
                    return "translate("+(startpositions[i])+",5)"
                return "translate("+(startpositions[i])+",0)";
            });

            table_cells.filter(d=>d[0]==="batter1")
                .selectAll("text")
                .data(d=>[d])
                .join("text")
                .text(d=>d[1].name+" \n "+d[1].batter1_runs + "("+d[1].batter1_balls+")");

            table_cells.filter(d=>d[0]==="batter2")
                .selectAll("text")
                .data(d=>[d])
                .join("text")
                .text(d=>d[1].name+" \n "+d[1].batter2_runs + "("+d[1].batter2_balls+")");
 
            let xscale = d3.scaleLinear()
                        .domain([0,max_runs])
                        .range([0,145]);
            //console.log(d3.selectAll(".table-cells").filter(d=>d[0]==="partnership"));
            let partnership_group = table_cells.filter(d=>d[0]==="partnership")
                .selectAll("g")
                .data(d=>Object.entries(d[1]))
                .join("g")
                .attr("class","partnership-data")
                .attr("transform",(d)=>{
                    if(d[0] === "total"){
                        return "translate(130,0)";
                    }
                    else if(d[0]==="batter1_contri"){
                        return "translate(0,7)";
                    }
                    else{
                        return "translate(145,7)";
                    }
                });
                partnership_group.filter(d=>d[0]==="total")
                    .selectAll("text")
                    .data(d=>[d])
                    .join("text")
                    .text(d=>d[1].total_runs+"("+d[1].total_balls+")")
                partnership_group.filter(d=>d[0]==="batter1_contri")
                    .selectAll("rect")
                    .data(d=>[d])
                    .join("rect")
                    .attr('x',d=>{return 145-xscale(d[1]);})
                    .attr('y',0)
                    .attr("width",d=>xscale(d[1]))
                    .attr("height",10)
                    .attr("fill","red");
                partnership_group.filter(d=>d[0]==="batter2_contri")
                    .selectAll("rect")
                    .data(d=>[d])
                    .join("rect")
                    .attr('x',0)
                    .attr('y',0)
                    .attr("width",d=>xscale(d[1]))
                    .attr("height",10)
                    .attr("fill","blue");
                                       
    }
}