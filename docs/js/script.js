
// add the required csv file in this function
async function loadData(){
    const matchData = await d3.csv('Data/IPL_Matches_2022.csv');
    const perBallData = await d3.csv('Data/IPL_Ball_by_Ball_2022.csv');
    const rpodata = await d3.csv('Data/RPO_out.csv')
    const rankings = await d3.csv("Data/IPL_2008_2022_WINNINGS.csv")
    return {matchData,perBallData,rpodata,rankings};
}


// Call your function here
loadData().then(loadedData=>{
    console.log("Data Imported");
    const perBallData = loadedData.perBallData;
    const matchData = loadedData.matchData;
    const rpodata = loadedData.rpodata;
    const rankings = loadedData.rankings;
    header = new matchSelection(matchData,perBallData,rankings);

    //ranking = new Ranking(rankings);
    //ranking.drawRankingGraph();

});