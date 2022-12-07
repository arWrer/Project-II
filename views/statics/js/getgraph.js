// console.log('chart 동작')




var btn = document.getElementsByClassName("btn")[0];

btn.addEventListener("click",function(){
    alert("버튼 클릭");
    google.charts.load('current', {'packages': ['corechart', 'line']});
    google.charts.setOnLoadCallback(drawChart);
})

function drawChart(){
    var data = new google.visualization.DataTable();
    data.addColumn('date','');
    data.addColumn('number','매출');


    for(i =0;i<getrecords.length;i++){
        data.addRow([getrecords[i].date,getrecords[i].totalAmount]);
    }
    
    var options = {
        chart: {
        title: '',
        subtitle: '',
        },
        bars: 'vertical',
        vAxis: {
        format: ''
        },
        hAxis : {title: '매출'},
        height: 500,
        width : '100%',
        colors: ['#1b9e77'] 
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

    chart.draw(data,options);
}