
// add the required csv file in this function
async function loadData(){
    const matchData = await d3.csv('Data/IPL_Matches_2022.csv');
    const perBallData = await d3.csv('Data/IPL_Ball_by_Ball_2022.csv');
    return {matchData,perBallData};
}


// Call your function here
loadData().then(loadedData=>{
    console.log("Data Imported");
    //console.log(loadedData);
    const perBallData = loadedData.perBallData;
    const matchData = loadedData.matchData;
    //console.log(perBallData);
    //console.log(matchData);
    header = new matchSelection(matchData,perBallData);
    //visualization = new viz(matchData,perBallData);
});