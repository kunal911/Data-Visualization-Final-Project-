Promise.all([d3.csv('Data/IPL_Matches_2022.csv'),d3.csv('Data/IPL_Ball_by_Ball_2022.csv')]).then( data =>
    {
        let perBallData = data[1];
        let matchData = data[0];
        header = new matchSelection(matchData,perBallData);
        visualization = new viz(matchData,perBallData); 
    });