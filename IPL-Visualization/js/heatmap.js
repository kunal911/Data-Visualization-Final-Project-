const HEATMAP_WIDTHSVG = 600;
const HEATPMAP_HEIGHTSVG = 400;
const HEATMAP_WIDTH = 250;
const HEATMAP_HEIGHT = 260;
const margin_heatmap={top:40,bottom:20,left:80,right:40}
class heatmap{
    constructor(){
        d3.select(".content").append("svg").attr("id","heatmap").attr("width",HEATMAP_WIDTHSVG).attr("height",HEATPMAP_HEIGHTSVG);
        d3.select("#heatmap").append("text");
        d3.select("#heatmap").append("g").attr("class","innings1-label").attr("transform","translate("+(HEATMAP_WIDTHSVG/2-200)+",40)");
        d3.select("#heatmap").append("g").attr("class","innings2-label").attr("transform","translate("+(HEATMAP_WIDTHSVG/2+130)+",40)");;
        d3.select("#heatmap").append("g").attr("class","heatmap-header-1").attr("transform","translate("+margin_heatmap.left+","+(margin_heatmap.top+63)+")");
        d3.select("#heatmap").append("g").attr("class","innings1-heatmap").attr("transform","translate("+margin_heatmap.left+","+(margin_heatmap.top+81)+")");
        d3.select("#heatmap").append("g").attr("class","innings1-heatmap-labels").attr("transform","translate("+margin_heatmap.left+","+(margin_heatmap.top+81)+")");
        d3.select("#heatmap").append("g").attr("class","heatmap-header-2").attr("transform","translate("+(margin_heatmap.left+HEATMAP_WIDTH+90)+","+(margin_heatmap.top+63)+")");
        d3.select("#heatmap").append("g").attr("class","innings2-heatmap").attr("transform","translate("+(margin_heatmap.left+HEATMAP_WIDTH+90)+","+(margin_heatmap.top+81)+")");
        d3.select("#heatmap").append("g").attr("class","innings2-heatmap-labels").attr("transform","translate("+(margin_heatmap.left+HEATMAP_WIDTH+90)+","+(margin_heatmap.top+81)+")");
        
    }
    updateHeatMap(firstinnings,innings,start = 0,end=120){
        let fi = firstinnings.filter(d=> d.ball_number>=start && d.ball_number<=end);
        let bowler = d3.group(fi,(d)=>d.bowler);
        let max = 1;
        let highest_wickettaker_1 = [];
        let best_bowler = "";
        let best_economy_bowler = "";
        let min_economy = 999;
        bowler.forEach((element,key) => {
            let wickets_1 = 0;
            let runs = 0;
            for(let i=0;i<element.length;i++){
                if(element[i].ball_number>=start && element[i].ball_number<=end){
                    wickets_1 += Number(element[i].isWicketDelivery);
                    runs += Number(element[i].total_run)
                }
            }
            let economy = runs/element.length;
            if(wickets_1>=max){
                max = wickets_1;
                highest_wickettaker_1.push(key);
            }
            if(economy<min_economy){
                best_economy_bowler = key;
                min_economy = economy;
            }
        });
        // console.log(bowler);
        // console.log(best_economy_bowler);
        // console.log(max);
        // console.log(highest_wickettaker_1);
        if(highest_wickettaker_1.length>1){
            let min = 999;
            highest_wickettaker_1.forEach((element)=>{
                let deliveries = bowler.get(element);
                let runs = 0;
                for(let i=0;i<deliveries.length;i++){
                    if(deliveries[i].ball_number>=start && deliveries[i].ball_number<=end){
                        runs += Number(deliveries[i].total_run);
                    }
                }
                let economy = runs/deliveries.length;
                if(economy<min){
                    min = economy;
                    best_bowler = element;
                }
            })
           // console.log(best_bowler);
        }
        else if(highest_wickettaker_1.length==1){
            best_bowler = highest_wickettaker_1[0];
        }
        if(best_bowler === "")
        {
            best_bowler = best_economy_bowler;
        }
       // console.log(best_bowler);
        let deliveries_bowled = bowler.get(best_bowler);
        let bowling_lengths = d3.group(deliveries_bowled,(d)=>d.bowling_length);
        //console.log(bowling_lengths);
        bowling_lengths.forEach((element,key)=>{
            //console.log(key);
            let landing_area = d3.group(element,(d)=>d.landing_area);
            //console.log(landing_area);
        })
        let data = [];
        let lengths = ["short","length","full","yorker"];
        let land = ["outside off","middle","legside"];
        let max_size = 0;
        for(const length of lengths){
            let bowl_length = bowling_lengths.get(length);
            //console.log(bowl_length);
            if(bowl_length !== undefined){
                let landing_area = d3.group(bowl_length,(d)=>d.landing_area);
                //console.log(landing_area);
                for (const landing of land){
                    let area = landing_area.get(landing);
                    //console.log(area);
                    let obj={};
                    obj['length'] = length;
                    obj['area'] = landing;
                    obj['size'] = 0;
                    obj['wicket'] = 0;
                    if(area!==undefined){
                        for(let i=0;i<area.length;i++){
                            if(area[i].ball_number>=start && area[i].ball_number<=end){
                                obj['size'] += 1;
                                if(Number(area[i].isWicketDelivery)===1){
                                    obj['wicket'] += 1;
                                }
                                    
                            }
                        }
                    }
                    if(obj['size']>max_size){
                        max_size = obj['size']
                    }
                    data.push(obj);
                }
            }
            else{
                for(const landing of land){
                    let obj = {};
                    obj['length'] = length;
                    obj['area'] = landing;
                    obj['size'] = 0;
                    obj['wicket'] = 0;
                    data.push(obj);
                }
            }
        }
        //console.log(max_size);
        //console.log(data);
        
        let xscale = d3.scaleBand()
                        .domain(land)
                        .range([0,HEATMAP_WIDTH-margin_heatmap.left-margin_heatmap.right]);
        let yscale = d3.scaleBand()
                        .domain(lengths)
                        .range([HEATMAP_HEIGHT-margin_heatmap.top-margin_heatmap.bottom,0]);
        
        let wicket_deliveries = data.filter(d=>d.wicket>0);
       // console.log(wicket_deliveries);
        d3.select("#heatmap").select("text").text("Bowling Performance").attr('x',HEATMAP_WIDTHSVG/2-50).attr('y',30).style("font-weight","bold");
        
        //let innings2 = {"i":"Second Innings","name":highest_scorer_2,"data":{"score":score_2,"balls":balls_faced_2}}
        if(innings ==="first"){
            let innings_data = {"i":"First Innings","name":best_bowler,"data":{"wickets":max}};
            d3.select(".innings1-label").selectAll("text")
                                .data(Object.entries(innings_data))
                                .join("text")
                                .text(d=>{
                                    if(d[0]==="i")
                                        return d[1]
                                    else if(d[0]==="name")
                                        return d[1]
                                    else
                                        return "Wickets: "+d[1].wickets;
                                })
                                .attr('x',0)
                                .attr('y',(d,i)=>{
                                    if(i>0)
                                        return (i+1)*17
                                    return (i+1)*15;
                                })
                                .style("font-weight",(d)=>{
                                    if(d[0]==="i")
                                        return "bold";
                                });
        
            d3.select(".innings1-heatmap-labels").call(d3.axisLeft(yscale));
            d3.select(".innings1-heatmap-labels").select('path').attr("stroke","#FFFFFF");
            d3.select(".heatmap-header-1").selectAll(".heatmap-header-text")
                                            .data(land)
                                            .join("g")
                                            .classed("heatmap-header-text",true)
                                            .attr("transform",d=>{
                                               if(d==="middle")
                                                    return "translate("+xscale("middle")+",0)";
                                                else if(d==="legside")
                                                    return "translate("+xscale("legside")+",0)";
                                            })
            
            d3.select(".heatmap-header-1").selectAll(".heatmap-header-text").selectAll('text')
                                                .data(d=>[d])
                                                .join('text')
                                                .text(d=>{
                                                    if(d==="outside off")
                                                        return "Off";
                                                    if(d==="middle")
                                                        return "mid"
                                                    if(d==="legside")
                                                        return "leg"
                                                })
                                                .attr('x',8)
                                                .attr('y',15)
                    
            let mycolor = d3.scaleLinear()
                            .domain([0,max_size])
                            .range(["white","#EF7D30"]);
            
            d3.select(".innings1-heatmap").selectAll("rect")
                                            .data(data,function(d){return d.area+':'+d.length})
                                            .join("rect")
                                            .attr('x',(d)=>xscale(d.area))
                                            .attr('y',(d)=>yscale(d.length))
                                            .attr("width",xscale.bandwidth())
                                            .attr("height",yscale.bandwidth())
                                            .attr("stroke","black")
                                            .style("fill",(d)=>mycolor(d.size));

            d3.select(".innings1-heatmap").selectAll("text")
                                            .data(wicket_deliveries)
                                            .join("text")
                                            .attr('x',d=>xscale(d.area)+(xscale.bandwidth()/2)-12)
                                            .attr('y',d=>yscale(d.length)+(yscale.bandwidth()/2)+5)
                                            .text(d=>d.wicket+"W")
                                            .style("fill","black");
        }
        else{
            let innings_data = {"i":"Second Innings","name":best_bowler,"data":{"wickets":max}};
            d3.select(".innings2-label").selectAll("text")
                                .data(Object.entries(innings_data))
                                .join("text")
                                .text(d=>{
                                    if(d[0]==="i")
                                        return d[1]
                                    else if(d[0]==="name")
                                        return d[1]
                                    else
                                        return "Wickets: "+d[1].wickets;
                                })
                                .attr('x',0)
                                .attr('y',(d,i)=>{
                                    if(i>0)
                                        return (i+1)*17
                                    return (i+1)*15;
                                })
                                .style("font-weight",(d)=>{
                                    if(d[0]==="i")
                                        return "bold";
                                });
            d3.select(".innings2-heatmap-labels").call(d3.axisLeft(yscale));
            d3.select(".innings2-heatmap-labels").select('path').attr("stroke","#FFFFFF");
        
            d3.select(".heatmap-header-2").selectAll(".heatmap-header-text")
                                            .data(land)
                                            .join("g")
                                            .classed("heatmap-header-text",true)
                                            .attr("transform",d=>{
                                               if(d==="middle")
                                                    return "translate("+xscale("middle")+",0)";
                                                else if(d==="legside")
                                                    return "translate("+xscale("legside")+",0)";
                                            })
            
            d3.select(".heatmap-header-2").selectAll(".heatmap-header-text").selectAll('text')
                                                .data(d=>[d])
                                                .join('text')
                                                .text(d=>{
                                                    if(d==="outside off")
                                                        return "Off";
                                                    if(d==="middle")
                                                        return "mid"
                                                    if(d==="legside")
                                                        return "leg"
                                                })
                                                .attr('x',8)
                                                .attr('y',15)
            
            let mycolor = d3.scaleLinear()
                            .domain([0,max_size])
                            .range(["white","#EF7D30"]);
            
            d3.select(".innings2-heatmap").selectAll("rect")
                                            .data(data,function(d){return d.area+':'+d.length})
                                            .join("rect")
                                            .attr('x',(d)=>xscale(d.area))
                                            .attr('y',(d)=>yscale(d.length))
                                            .attr("width",xscale.bandwidth())
                                            .attr("height",yscale.bandwidth())
                                            .attr("stroke","black")
                                            .style("fill",(d)=>mycolor(d.size));

            d3.select(".innings2-heatmap").selectAll("text")
                                            .data(wicket_deliveries)
                                            .join("text")
                                            .attr('x',d=>xscale(d.area)+(xscale.bandwidth()/2)-12)
                                            .attr('y',d=>yscale(d.length)+(yscale.bandwidth()/2)+5)
                                            .text(d=>d.wicket+"W")
                                            .style("fill","black");
        }
            
    }
}