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

    var data = {"OkPercent": 99.491007804547, "KoPercent": 0.508992195453003};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.994401085850017, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9949784791965567, 500, 1500, "J2_ViewProductDetails"], "isController": false}, {"data": [0.9949494949494949, 500, 1500, "J3_Login"], "isController": false}, {"data": [0.9949531362653208, 500, 1500, "J3_GetCategories"], "isController": false}, {"data": [0.9942897930049964, 500, 1500, "J1_ListProducts"], "isController": false}, {"data": [0.9932432432432432, 500, 1500, "J3_CreateCart"], "isController": false}, {"data": [0.9937275985663082, 500, 1500, "J2_ViewCart"], "isController": false}, {"data": [0.9928698752228164, 500, 1500, "J2_Login"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5894, 30, 0.508992195453003, 412.7114014251782, 0, 720782, 142.0, 241.0, 265.0, 323.0, 6.034458045466272, 20.082473840806102, 1.2326061565242585], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["J2_ViewProductDetails", 1394, 7, 0.5021520803443329, 139.62984218077492, 1, 356, 128.0, 188.5, 209.25, 244.0999999999999, 1.4299225133811615, 1.5541177412071048, 0.17784276596661325], "isController": false}, {"data": ["J3_Login", 297, 1, 0.3367003367003367, 246.5353535353536, 1, 953, 235.0, 297.0, 316.0, 361.03999999999996, 0.3043157506455183, 0.26831153748616743, 0.11868122156645763], "isController": false}, {"data": ["J3_GetCategories", 1387, 7, 0.5046863734679163, 139.23359769286213, 1, 325, 128.0, 187.0, 211.5999999999999, 244.0, 1.4241021328675996, 1.1250822763584671, 0.18956771390024302], "isController": false}, {"data": ["J1_ListProducts", 1401, 7, 0.49964311206281226, 155.32619557458978, 0, 550, 138.0, 221.0, 237.0, 301.96000000000004, 1.4343897239951593, 15.883659753619762, 0.18815926832302335], "isController": false}, {"data": ["J3_CreateCart", 296, 2, 0.6756756756756757, 146.06418918918925, 3, 344, 135.0, 198.3, 224.14999999999998, 308.80999999999926, 0.3036803805033092, 0.25692163314897065, 0.15523262904620766], "isController": false}, {"data": ["J2_ViewCart", 558, 3, 0.5376344086021505, 2822.467741935484, 4, 720782, 230.0, 281.0, 310.0999999999999, 388.50999999999965, 0.5725008746541141, 0.49524724240282103, 0.1812811226813971], "isController": false}, {"data": ["J2_Login", 561, 3, 0.5347593582887701, 241.98752228164, 0, 751, 231.0, 284.8, 313.0, 374.0799999999999, 0.5745337162192609, 0.507228549141067, 0.2235751295005141], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, 6.666666666666667, 0.0339328130302002], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Network is unreachable: connect", 1, 3.3333333333333335, 0.0169664065151001], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (fakestoreapi.com)", 1, 3.3333333333333335, 0.0169664065151001], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: fakestoreapi.com", 26, 86.66666666666667, 0.44112656939260264], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5894, 30, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: fakestoreapi.com", 26, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Network is unreachable: connect", 1, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (fakestoreapi.com)", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["J2_ViewProductDetails", 1394, 7, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: fakestoreapi.com", 6, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Network is unreachable: connect", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["J3_Login", 297, 1, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: fakestoreapi.com", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["J3_GetCategories", 1387, 7, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: fakestoreapi.com", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["J1_ListProducts", 1401, 7, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: fakestoreapi.com", 6, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (fakestoreapi.com)", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["J3_CreateCart", 296, 2, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: fakestoreapi.com", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["J2_ViewCart", 558, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: fakestoreapi.com", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["J2_Login", 561, 3, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: fakestoreapi.com", 3, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
