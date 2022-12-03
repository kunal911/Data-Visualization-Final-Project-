const RPO_SVGWIDTH = 1300;
const RPO_SVGHEIGHT = 600;
class runperover{
    constructor(){
        d3.select(".content").append("svg").attr("width",RPO_SVGWIDTH).attr("height",RPO_SVGHEIGHT).attr("id","runsperover");
        d3.select("#runsperover").append("text");
        d3.select("#runsperover").append("g").attr("id","rpo-group").attr("transform","translate(130,40)");
        d3.select("#runsperover").append('div').attr('id','tooltip').attr('style', 'position: absolute; opacity: 0;');
        this.x = d3.select("#rpo-group").append("g").attr("id","x-axis").attr("transform","translate(0,400)");
        this.y = d3.select("#rpo-group").append("g").attr("id","y-axis").attr("transform","translate(0,0)")
        this.bar_group = d3.select("#rpo-group").append("g").attr("id","bar-groups").attr("transform","translate(0,0)");
        this.legend_group = d3.select("#runsperover").append("g").attr("id","legend");
    }
    draw_rpo(firstinnings,secondinnings){
        console.log(firstinnings);
        console.log(secondinnings);
        let groupByOver_1 = d3.group(firstinnings,d=>d.overs);
        let groupByOver_2 = d3.group(secondinnings,d=>d.overs)
        console.log(groupByOver_1);
        console.log(groupByOver_2);
        let data = []
        let obj={};
        for(let i=0;i<20;i++){
            obj={};
            let over_1 = groupByOver_1.get(""+i);
            let over_2 = groupByOver_2.get(""+i);
            //console.log(groupByOver_1.get('0'));
            if(over_1!==undefined && over_2!==undefined){
                obj['over'] = i+1;
                let run_1 = d3.sum(over_1,d=>Number(d.total_run))
                let run_2 = d3.sum(over_2,d=>Number(d.total_run))
                obj['innings1_run'] = run_1 
                obj['innings2_run'] = run_2
            }
            else if(over_1===undefined){
                obj['over'] = i+1;
                let run_2 = d3.sum(over_2,d=>Number(d.total_run))
                obj['innings1_run'] = 0
                obj['innings2_run'] = run_2
            }
            else{
                obj['over'] = i+1;
                let run_1 = d3.sum(over_1,d=>Number(d.total_run))
                obj['innings1_run'] = run_1
                obj['innings2_run'] = 0
            }
            data.push(obj);
        }
        console.log(data);
        //console.log(data.columns)
        let groups = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
        let subgroups = ["innings1","innings2"];
        let legend_data=[{"i1":"First Innings","color1":"blue","i2":"Second Innings","color2":"red"}];
        this.legend_group.selectAll("*").remove();
        this.legend_group.selectAll(".header-data-rpo")
                        .data(legend_data)
                        .join("g")
                        .classed("header-data-rpo",true);
        
        d3.select(".header-data-rpo").append("rect").attr('x',150).attr('y',28).attr("width",10).attr("height",10).attr("fill",d=>d.color1);
        d3.select(".header-data-rpo").append("text").attr('x',165).attr('y',38).text(d=>d.i1);
        d3.select(".header-data-rpo").append("rect").attr('x',260).attr('y',28).attr("width",10).attr("height",10).attr("fill",d=>d.color2);
        d3.select(".header-data-rpo").append("text").attr('x',275).attr('y',38).text(d=>d.i2);
        
        //x-axis
        let xscale = d3.scaleBand()
                        .domain(groups)
                        .range([0,1100])
                        .padding([0.2]);
        let xaxis = d3.axisBottom().scale(xscale);                
        this.x.call(xaxis);
        let max_runs = d3.max([d3.max(data,d=>d['innings1_run']),d3.max(data,d=>d['innings2_run'])]);
        let yscale = d3.scaleLinear()
                        .domain([max_runs,0])
                        .range([0,400]);
        let yaxis = d3.axisLeft().scale(yscale);
        this.y.call(yaxis);
        d3.select("#runsperover").select("text").text("Runs Per Over").attr('x',RPO_SVGWIDTH/2).attr('y',15).style("font-weight","bold");
        let subgroup_scale = d3.scaleBand()
                                .domain(subgroups)
                                .range([0,xscale.bandwidth()])
                                .padding([0.05]);
        let color = d3.scaleOrdinal()
                        .domain(subgroups)
                        .range(["blue","red"]);
        // var tooltip = d3.select("#runsperover")
        //                 .append("div")
        //                 .style("opacity", 0)
        //                 .attr("class", "tooltip")
        //                 .style("background-color", "white")
        //                 .style("border", "solid")
        //                 .style("border-width", "2px")
        //                 .style("border-radius", "5px")
        //                 .style("padding", "5px")

        let rect_group = this.bar_group.selectAll(".maingroups")
                                        .data(data)
                                        .join("g")
                                        .classed("maingroups",true)
                                        .attr("transform",d=>"translate("+(xscale(d.over))+",0)");
        
        rect_group.selectAll("rect")
                    .data(d=>{
                        console.log(d);
                        return [{"key":"innings1","value":d['innings1_run']},{"key":"innings2","value":d['innings2_run']}]
                    })
                    .join("rect")
                    .attr('x',d=>subgroup_scale(d.key))
                    .attr('y',d=>yscale(d.value))
                    .attr("width",subgroup_scale.bandwidth())
                    .attr("height",d=>400-yscale(d.value))
                    .attr("fill",d=>color(d.key))
                    
                    // .on("mouseover",function(d){
                    //     d3.select('#tooltip')
                    //     .style('opacity',1)
                    //     .text(d.value)
                    //     console.log(d=>400-yscale(d.value))
                    // })
                    // .on("mouseout",function()
                    // {
                    //     d3.select("#tooltip")
                    //     .style('opacity',0)

                    // })
        
       

    }
}