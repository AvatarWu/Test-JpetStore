/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.802907915993538, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "03_02_ Click on Sign In"], "isController": true}, {"data": [1.0, 500, 1500, "03_06_ Click on Add to Cart"], "isController": true}, {"data": [1.0, 500, 1500, "04_06_Click on Add to Cart"], "isController": true}, {"data": [0.5816993464052288, 500, 1500, "02_01_Open Url"], "isController": true}, {"data": [1.0, 500, 1500, "04_04_Click on Category"], "isController": true}, {"data": [1.0, 500, 1500, "02_04_Click on Item Id"], "isController": true}, {"data": [0.51661918328585, 500, 1500, "01_Open URL"], "isController": true}, {"data": [1.0, 500, 1500, "04_08_Key in payment details and lick continue"], "isController": true}, {"data": [1.0, 500, 1500, "04_05_Click on Product ID"], "isController": true}, {"data": [1.0, 500, 1500, "04_10_Click on Sign Out"], "isController": true}, {"data": [1.0, 500, 1500, "04_03_Enter User name and password, Click on Login"], "isController": true}, {"data": [1.0, 500, 1500, "04_09_Click on Confirm"], "isController": true}, {"data": [1.0, 500, 1500, "04_10_Click on Sign Out-1"], "isController": false}, {"data": [1.0, 500, 1500, "04_10_Click on Sign Out-0"], "isController": false}, {"data": [1.0, 500, 1500, "03_04_ Click on Category"], "isController": true}, {"data": [1.0, 500, 1500, "03_05_ Click on Product Id"], "isController": true}, {"data": [1.0, 500, 1500, "03_03_ Key in User name and password in Login"], "isController": true}, {"data": [1.0, 500, 1500, "02_02_Click On Category"], "isController": true}, {"data": [1.0, 500, 1500, "04_07_Click on Proeed to checkout"], "isController": true}, {"data": [1.0, 500, 1500, "03_07_ Click on Sign Out"], "isController": true}, {"data": [1.0, 500, 1500, "03_03_ Key in User name and password in Login-0"], "isController": false}, {"data": [1.0, 500, 1500, "02_03_Click on Product Id"], "isController": true}, {"data": [1.0, 500, 1500, "03_07_ Click on Sign Out-1"], "isController": false}, {"data": [0.5, 500, 1500, "03_01_Open Url"], "isController": true}, {"data": [0.9979757085020243, 500, 1500, "02_Search"], "isController": true}, {"data": [1.0, 500, 1500, "04_02_Click on Sign In"], "isController": true}, {"data": [1.0, 500, 1500, "04_03_Enter User name and password, Click on Login-1"], "isController": false}, {"data": [1.0, 500, 1500, "04_03_Enter User name and password, Click on Login-0"], "isController": false}, {"data": [1.0, 500, 1500, "03_07_ Click on Sign Out-0"], "isController": false}, {"data": [1.0, 500, 1500, "03_03_ Key in User name and password in Login-1"], "isController": false}, {"data": [0.5, 500, 1500, "04_01_Open Url"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1659, 0, 0.0, 532.0223025919213, 0, 18999, 238.0, 956.0, 959.0, 969.0, 17.201157112196338, 67.79011602551142, 12.243143416850705], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["03_02_ Click on Sign In", 61, 0, 0.0, 227.50819672131152, 0, 240, 229.0, 239.0, 240.0, 240.0, 0.6635122640996356, 2.609987695110676, 0.4340277777777778], "isController": true}, {"data": ["03_06_ Click on Add to Cart", 48, 0, 0.0, 232.04166666666674, 220, 243, 231.0, 241.1, 242.55, 243.0, 0.6276807197405586, 2.987715274871849, 0.4228467609059525], "isController": true}, {"data": ["04_06_Click on Add to Cart", 4, 0, 0.0, 231.5, 231, 232, 231.5, 232.0, 232.0, 232.0, 0.11078491109510885, 0.5269315522350856, 0.07464998892150888], "isController": true}, {"data": ["02_01_Open Url", 153, 0, 0.0, 998.3660130718955, 0, 18999, 917.0, 959.0, 962.0, 18950.4, 1.549869324743208, 6.608727796602443, 0.7201502955388075], "isController": true}, {"data": ["04_04_Click on Category", 4, 0, 0.0, 227.5, 227, 228, 227.5, 228.0, 228.0, 228.0, 0.12494143370295174, 0.47072661252537873, 0.07991859284710291], "isController": true}, {"data": ["02_04_Click on Item Id", 120, 0, 0.0, 232.11666666666667, 219, 242, 230.5, 241.0, 241.0, 242.0, 1.734730755330683, 6.459500361402241, 1.1533249006143838], "isController": true}, {"data": ["01_Open URL", 1053, 0, 0.0, 930.9012345679022, 0, 7199, 921.0, 960.0, 962.0, 971.0, 10.702089600780551, 50.91099250955362, 5.992551636565981], "isController": true}, {"data": ["04_08_Key in payment details and lick continue", 4, 0, 0.0, 229.5, 228, 231, 229.5, 231.0, 231.0, 231.0, 0.12487122654762275, 0.5754563653107733, 0.15608903318452844], "isController": true}, {"data": ["04_05_Click on Product ID", 4, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 0.11079411683239619, 0.46622250920976094, 0.07443979724676619], "isController": true}, {"data": ["04_10_Click on Sign Out", 4, 0, 0.0, 455.5, 455, 456, 455.5, 456.0, 456.0, 456.0, 0.11023535247753954, 0.5681857327895056, 0.1404854833820206], "isController": true}, {"data": ["04_03_Enter User name and password, Click on Login", 5, 0, 0.0, 363.6, 0, 455, 454.0, 455.0, 455.0, 455.0, 0.07873147841970177, 0.334055202576094, 0.11053161462515944], "isController": true}, {"data": ["04_09_Click on Confirm", 4, 0, 0.0, 231.0, 229, 233, 231.0, 233.0, 233.0, 233.0, 0.1109416169740674, 0.5869396581611427, 0.06998855914574954], "isController": true}, {"data": ["04_10_Click on Sign Out-1", 2, 0, 0.0, 229.5, 229, 230, 229.5, 230.0, 230.0, 230.0, 0.06254691018263697, 0.30833672129096823, 0.039580466599949966], "isController": false}, {"data": ["04_10_Click on Sign Out-0", 2, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 0.06255473539346929, 0.014050380020017515, 0.040135215970223945], "isController": false}, {"data": ["03_04_ Click on Category", 54, 0, 0.0, 222.29629629629633, 0, 240, 229.0, 239.0, 240.0, 240.0, 0.6736190808841874, 2.571096439798413, 0.41528635827803], "isController": true}, {"data": ["03_05_ Click on Product Id", 50, 0, 0.0, 221.88000000000002, 0, 243, 230.0, 240.0, 241.89999999999998, 243.0, 0.6540735701951756, 2.580677930903668, 0.421392007548009], "isController": true}, {"data": ["03_03_ Key in User name and password in Login", 58, 0, 0.0, 445.1724137931034, 0, 478, 458.0, 477.0, 477.05, 478.0, 0.6616925639446004, 3.38841139594314, 1.1211517728797318], "isController": true}, {"data": ["02_02_Click On Category", 121, 0, 0.0, 229.9173553719008, 0, 261, 230.0, 241.0, 243.79999999999998, 261.0, 1.738880505856147, 6.413244592943882, 1.1043710030897465], "isController": true}, {"data": ["04_07_Click on Proeed to checkout", 4, 0, 0.0, 230.0, 228, 232, 230.0, 232.0, 232.0, 232.0, 0.11077877478675086, 0.6062541542040546, 0.0723740237620472], "isController": true}, {"data": ["03_07_ Click on Sign Out", 48, 0, 0.0, 457.87500000000006, 434, 476, 455.0, 475.0, 475.55, 476.0, 0.6609294320137694, 3.4066265060240966, 0.8539156626506024], "isController": true}, {"data": ["03_03_ Key in User name and password in Login-0", 28, 0, 0.0, 229.5, 217, 238, 228.5, 237.0, 237.55, 238.0, 0.3482760336335141, 0.07822606224190258, 0.349636486889895], "isController": false}, {"data": ["02_03_Click on Product Id", 120, 0, 0.0, 232.8333333333334, 219, 244, 231.0, 242.0, 243.0, 244.0, 1.7349564815082554, 6.843166485339618, 1.164487880606078], "isController": true}, {"data": ["03_07_ Click on Sign Out-1", 24, 0, 0.0, 230.25, 218, 239, 229.0, 239.0, 239.0, 239.0, 0.33150087018978425, 1.634195696013702, 0.21269147628387525], "isController": false}, {"data": ["03_01_Open Url", 64, 0, 0.0, 939.7812500000001, 878, 1273, 926.0, 959.5, 960.0, 1273.0, 0.6632536738035526, 3.3329468671627254, 0.3819861856695753], "isController": true}, {"data": ["02_Search", 988, 0, 0.0, 232.73987854250996, 0, 2303, 229.0, 239.0, 240.0, 243.0, 10.9766801097668, 37.9203399104534, 10.049342287993422], "isController": true}, {"data": ["04_02_Click on Sign In", 6, 0, 0.0, 227.33333333333331, 226, 228, 228.0, 228.0, 228.0, 228.0, 0.08854912262577665, 0.3541676659189185, 0.05888862549624404], "isController": true}, {"data": ["04_03_Enter User name and password, Click on Login-1", 2, 0, 0.0, 228.0, 227, 229, 228.0, 229.0, 229.0, 229.0, 0.06247266820765915, 0.3173050267070656, 0.0469155096207909], "isController": false}, {"data": ["04_03_Enter User name and password, Click on Login-0", 2, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 0.06247657128576784, 0.01403282362863926, 0.06272062039235286], "isController": false}, {"data": ["03_07_ Click on Sign Out-0", 24, 0, 0.0, 227.29166666666669, 216, 237, 226.0, 236.5, 237.0, 237.0, 0.3314642432947546, 0.07444997652128275, 0.21558123636162746], "isController": false}, {"data": ["03_03_ Key in User name and password in Login-1", 28, 0, 0.0, 231.17857142857142, 219, 240, 230.0, 239.0, 239.55, 240.0, 0.348280365694384, 1.768951349586417, 0.2615503918154114], "isController": false}, {"data": ["04_01_Open Url", 6, 0, 0.0, 918.0, 917, 920, 917.0, 920.0, 920.0, 920.0, 0.09311275955181725, 0.4731413335299047, 0.05322461125422887], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1659, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
