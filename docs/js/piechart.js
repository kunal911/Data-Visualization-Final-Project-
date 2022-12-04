const PIECHART_SVGWIDTH = 600;
const PIECHART_SVGHEIGHT = 400;
const PIECHART_RADIUS = 100;
class piechart{

    constructor(){
        d3.select(".content").append("svg").attr("id","pie-chart").attr("width",PIECHART_SVGWIDTH).attr("height",PIECHART_SVGHEIGHT).style("margin-right","80");
        d3.select("#pie-chart").append("text");
        d3.select("#pie-chart").append("g").attr("class","innings1").attr("transform","translate("+(PIECHART_SVGWIDTH/2-200)+",40)");
        d3.select("#pie-chart").append("g").attr("class","innings2").attr("transform","translate("+(PIECHART_SVGWIDTH/2+110)+",40)");;
        d3.select("#pie-chart").append("g").attr("class","innings1-piechart").attr("transform","translate("+(PIECHART_RADIUS+50)+","+(PIECHART_SVGHEIGHT/2+30)+")");
        d3.select("#pie-chart").append("g").attr("class","innings1-labels").attr("transform","translate("+(PIECHART_RADIUS+50)+","+(PIECHART_SVGHEIGHT/2+30)+")");
        d3.select("#pie-chart").append("g").attr("class","innings2-piechart").attr("transform","translate("+(4*PIECHART_RADIUS+60)+","+(PIECHART_SVGHEIGHT/2+20)+")");
        d3.select("#pie-chart").append("g").attr("class","innings2-labels").attr("transform","translate("+(4*PIECHART_RADIUS+60)+","+(PIECHART_SVGHEIGHT/2+20)+")");
    }
    updatePieChart(firstinnings,secondinnings,start=0,end=120){
        let striker = d3.group(firstinnings,d=>d.batter);
        let striker_i2 = d3.group(secondinnings,d=>d.batter);
        let highest_scorer_1 = "";
        let balls_faced_1 = 0;
        let score_1 = 0;
        let max = -1;
        let score_2 = 0;

        //choosing best batsman for first innings - according to the runs scored
        striker.forEach((element,key) => {
            let runs_scored=0;
            let balls_played_1 = 0;
            for(let i=0;i<element.length;i++){
               if(element[i].ball_number>=start && element[i].ball_number<=end){
                    runs_scored += Number(element[i].total_run);
                    balls_played_1 += 1;
               }
            }
            if(runs_scored>max){
                highest_scorer_1 = key;
                max = runs_scored;
                balls_faced_1 = balls_played_1;
            }
        });
        //choosing best batsman for second innings - according to the runs scored
        let highest_scorer_2 = "";
        let balls_faced_2 = 0;
        score_1 = max;
        max = -1;
        striker_i2.forEach((element,key) => {
            let runs_scored=0;
            let balls_played_2=0;
            for(let i=0;i<element.length;i++){
               if(element[i].ball_number>=start && element[i].ball_number<=end){
                    runs_scored += Number(element[i].total_run);
                    balls_played_2 += 1
               }
            }
            if(runs_scored>max){
                highest_scorer_2 = key;
                max = runs_scored;
                balls_faced_2 = balls_played_2;
            }
        });
        
        score_2 = max;
        let deliveries_played = striker.get(highest_scorer_1);
        let deliveries_played_i2 = striker_i2.get(highest_scorer_2);
        let shot_regions = d3.group(deliveries_played,d=>d.batting_shot);
        let shot_regions_i2 = d3.group(deliveries_played_i2,d=>d.batting_shot);
        let regions = ["fine leg","square leg","mid wicket","On","Off","cover","point","third man"];
        let positions = ["fine leg","square leg","mid wicket","On","Off","cover","point","third man"];
        let runs_perregion = [];
        let runs_perregion_i2 = [];

        //calculating runs scored in each region of the ground by the selected batsman-first innings
        shot_regions.forEach((element,key)=>{
            let runs = 0;    
            for(let i =0;i<element.length;i++){
                if(element[i].ball_number>=start && element[i].ball_number<=end){
                    runs += Number(element[i].total_run);
               }
                
            }
            let obj={}
            obj['region'] = key;
            obj['runs'] = runs;
            obj['size']=1;
            runs_perregion.push(obj);
            regions.splice(regions.indexOf(key),1);
        })
        for(const region of regions){
            let obj={}
            obj['region'] = region;
            obj['runs'] = 0;
            obj['size'] = 1;
            runs_perregion.push(obj);
        }


        //calculating runs scored in each region of the ground by the selected batsman-first innings
        regions = ["fine leg","square leg","mid wicket","On","Off","cover","point","third man"];
        shot_regions_i2.forEach((element,key)=>{
            let runs = 0;    
            for(let i =0;i<element.length;i++){
                if(element[i].ball_number>=start && element[i].ball_number<=end){
                    runs += Number(element[i].total_run);
               }
                
            }
            let obj={}
            obj['region'] = key;
            obj['runs'] = runs;
            obj['size']=1;
            runs_perregion_i2.push(obj);
            regions.splice(regions.indexOf(key),1);
        })
        for(const region of regions){
            let obj={}
            obj['region'] = region;
            obj['runs'] = 0;
            obj['size'] = 1;
            runs_perregion_i2.push(obj);
        }
        
        let runsdata = [];
        for(let i=0;i<positions.length;i++){
            for(let j = 0;j<runs_perregion.length;j++){
                if(runs_perregion[j].region === positions[i])
                {
                    runsdata.push(runs_perregion[j]);
                    break;
                }
            }
        }
        let runsdata_i2 = [];
        for(let i=0;i<positions.length;i++){
            for(let j = 0;j<runs_perregion_i2.length;j++){
                if(runs_perregion_i2[j].region === positions[i])
                {
                    runsdata_i2.push(runs_perregion_i2[j]);
                    break;
                }
            }
        }

        let innings1 = {"i":"First Innings","name":highest_scorer_1,"data":{"score":score_1,"balls":balls_faced_1}}
        let innings2 = {"i":"Second Innings","name":highest_scorer_2,"data":{"score":score_2,"balls":balls_faced_2}}
        
        //heading for pie chart - batmans name and runsscored - first innigngs
        d3.select(".innings1").selectAll("text")
                                .data(Object.entries(innings1))
                                .join("text")
                                .text(d=>{
                                    if(d[0]==="i")
                                        return d[1]
                                    else if(d[0]==="name")
                                        return d[1]
                                    else
                                        return d[1].score+"("+d[1].balls+")";
                                })
                                .attr('x',0)
                                .attr('y',(d,i)=>{
                                    if(i>0)
                                        return (i+1)*20
                                    return (i+1)*15;
                                })
                                .style("font-weight",(d)=>{
                                    if(d[0]==="i")
                                        return "bold";
                                });
        //heading for pie chart - batmans name and runsscored - second innigngs
        d3.select(".innings2").selectAll("text")
                                .data(Object.entries(innings2))
                                .join("text")
                                .text(d=>{
                                    if(d[0]==="i")
                                        return d[1]
                                    else if(d[0]==="name")
                                        return d[1]
                                    else
                                        return d[1].score+"("+d[1].balls+")";
                                })
                                .attr('x',0)
                                .attr('y',(d,i)=>{
                                    if(i>0)
                                        return (i+1)*20
                                    return (i+1)*15;
                                })
                                .style("font-weight",(d)=>{
                                    if(d[0]==="i")
                                        return "bold";
                                });         
                                
        //angle generator for pie chart                        
        let anglegenerator = d3.pie().value((d)=>d.size);
        //generating angle for the data
        let data = anglegenerator(runsdata);
        let arcgenerator = d3.arc().innerRadius(0).outerRadius(PIECHART_RADIUS);
        d3.select("#pie-chart").select("text").text("Wagon Wheel of Best Performers").attr('x',PIECHART_SVGWIDTH/2-100).attr('y',30).style("font-weight","bold");
        
        //pie chart for first innings
        d3.select("#pie-chart").select(".innings1-piechart").selectAll("path")
                                                    .data(data)
                                                    .join("path")
                                                    .attr("d",arcgenerator)
                                                    .attr("stroke","black")
                                                    .attr("fill","none");
        //text in pie chart-first innings
        d3.select(".innings1-labels").selectAll("text")
                                        .data(data)
                                        .join("text")
                                        .transition()
                                        .duration(1000)
                                        .attr('x',d=>d3.pointRadial((d.startAngle+d.endAngle-0.1)/2,60)[0])
                                        .attr('y',d=>d3.pointRadial((d.startAngle+d.endAngle-0.1)/2,60)[1])
                                        .attr('text-anchor',"middle")
                                        .text(d=>d.data.runs);

        let data_i2 = anglegenerator(runsdata_i2);
        
        //pie chart for second innings
        d3.select("#pie-chart").select(".innings2-piechart").selectAll("path")
                                                    .data(data_i2)
                                                    .join("path")
                                                    .attr("d",arcgenerator)
                                                    .attr("stroke","black")
                                                    .attr("fill","none");
        //pie chart text for second innings
        d3.select(".innings2-labels").selectAll("text")
                                        .data(data_i2)
                                        .join("text")
                                        .transition()
                                        .duration(1000)
                                        .attr('x',d=>d3.pointRadial((d.startAngle+d.endAngle-0.1)/2,60)[0])
                                        .attr('y',d=>d3.pointRadial((d.startAngle+d.endAngle-0.1)/2,60)[1])
                                        .attr('text-anchor',"middle")
                                        .text(d=>d.data.runs);

    }
}