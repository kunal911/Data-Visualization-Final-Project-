const PIECHART_SVGWIDTH = 550;
const PIECHART_SVGHEIGHT = 300;
class piechart{

    constructor(){
        d3.select(".content").append("svg").attr("id","pie-chart").attr("width",PIECHART_SVGWIDTH).attr("height",PIECHART_SVGHEIGHT);
        d3.select("#pie-chart").append("g").attr("class","innings1").attr("transform","translate(150,150)");
        d3.select("#pie-chart").append("g").attr("class","innings1-labels");
        d3.select("#pie-chart").append("g").attr("class","innings2").attr("transform","translate(450,150)");
        d3.select("#pie-chart").append("g").attr("class","innings2-labels");
    }
    updatePieChart(firstinnings,secondinnings,start=0,end=120){
        let striker = d3.group(firstinnings,d=>d.batter);
        let striker_i2 = d3.group(secondinnings,d=>d.batter);
        let highest_scorer_1 = "";
        let max = -1;
        striker.forEach((element,key) => {
            let runs_scored=0;
            for(let i=0;i<element.length;i++){
               if(element[i].ball_number>=start && element[i].ball_number<=end){
                    runs_scored += Number(element[i].total_run);
               }
            }
            console.log(key+": "+runs_scored);
            if(runs_scored>max){
                highest_scorer_1 = key;
                max = runs_scored;
            }
        });
        let highest_scorer_2 = "";
        max = -1;
        striker_i2.forEach((element,key) => {
            let runs_scored=0;
            for(let i=0;i<element.length;i++){
               if(element[i].ball_number>=start && element[i].ball_number<=end){
                    runs_scored += Number(element[i].total_run);
               }
            }
            console.log(key+": "+runs_scored);
            if(runs_scored>max){
                highest_scorer_2 = key;
                max = runs_scored;
            }
        });
        console.log(highest_scorer_2);
        let deliveries_played = striker.get(highest_scorer_1);
        let deliveries_played_i2 = striker_i2.get(highest_scorer_2);
        let shot_regions = d3.group(deliveries_played,d=>d.batting_shot);
        let shot_regions_i2 = d3.group(deliveries_played_i2,d=>d.batting_shot);
        let regions = ["fine leg","square leg","mid wicket","On","Off","cover","point","third man"];
        let positions = ["fine leg","square leg","mid wicket","On","Off","cover","point","third man"];
        console.log(shot_regions);
        let runs_perregion = [];
        let runs_perregion_i2 = [];
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
        //console.log(runs_perregion);
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
        //console.log(runsdata);
        
        let anglegenerator = d3.pie().value((d)=>d.size);
        let data = anglegenerator(runsdata);
        console.log(data);
        let arcgenerator = d3.arc().innerRadius(0).outerRadius(90);

        d3.select("#pie-chart").select(".innings1").selectAll("path")
                                                    .data(data)
                                                    .join("path")
                                                    .attr("d",arcgenerator)
                                                    .attr("stroke","black")
                                                    .attr("fill","none");
        d3.select(".innings1-labels").selectAll("text")
                                        .data(data)
                                        .join("text")
                                        .transition()
                                        .duration(1000)
                                        .attr('x',d=>d3.pointRadial((d.startAngle+d.endAngle-0.1)/2,60)[0])
                                        .attr('y',d=>d3.pointRadial((d.startAngle+d.endAngle-0.1)/2,60)[1])
                                        .attr('text-anchor',"middle")
                                        .text(d=>d.data.runs)
                                        .attr("transform","translate(150,150)");

        let data_i2 = anglegenerator(runsdata_i2);
        console.log(data_i2);

        d3.select("#pie-chart").select(".innings2").selectAll("path")
                                                    .data(data_i2)
                                                    .join("path")
                                                    .attr("d",arcgenerator)
                                                    .attr("stroke","black")
                                                    .attr("fill","none");
        d3.select(".innings2-labels").selectAll("text")
                                        .data(data_i2)
                                        .join("text")
                                        .transition()
                                        .duration(1000)
                                        .attr('x',d=>d3.pointRadial((d.startAngle+d.endAngle-0.1)/2,60)[0])
                                        .attr('y',d=>d3.pointRadial((d.startAngle+d.endAngle-0.1)/2,60)[1])
                                        .attr('text-anchor',"middle")
                                        .text(d=>d.data.runs)
                                        .attr("transform","translate(450,150)");

    }
}