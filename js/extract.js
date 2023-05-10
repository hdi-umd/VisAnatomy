const gridGap = -0.2, whDiff = 1, gridAllignmentDiff = 1;
const stackMinGap = -1, stackMaxGap = 1, stackAllignmentDiff = 0.15;
var legend, xAxis, yAxis, xGridlines, yGridlines;
var rects4Grouping;

function extract(jsonArr, chartName) {
    let nodes = jsonArr["allNodes"];
    let rects = jsonArr["rects"];
    let originalRects = [...rects];
    console.log([...rects])
    rects = rects.filter(filterRect);

    let texts = textProcessor(jsonArr["texts"]);
    let lines = jsonArr["lines"];
    let rectWith0WH = jsonArr["rectWith0WH"];

    let nodeIndex = {};
    nodes.map((n, i) => nodeIndex[n["id"]] = i);

    let attrs = ['x', 'y', 'width', 'height', 'fill', 'right', 'bottom', 'level'];
    let thisColors;
    for (let attr of attrs) {
        attrValues = rects.map(rect => rect[attr]).filter(onlyUnique);
        if (attr == 'fill') {
            thisColors = attrValues;
            numOfColor = attrValues.length;
        }
    }

    // GridLines
    //let rbox2Html = "<svg id='overlay' height='100%' width='100%' viewbox=\"-50 -50 1000 750\" preserveAspectRatio=\"xMinYMin\">";
    
    //rbox2Html = 
    findGridlines(rects, lines);
    console.log("xGridlines", xGridlines);
    console.log("yGridlines", yGridlines);
    // Legend
    //let colorMapping = {}
    //let legendArea = {"elements": [], "type": null};
    legend = findLegend(texts, rects, lines, numOfColor);
    console.log("legend", legend);
    
    //rbox2Html = displayLegend(legend, rbox2Html);
    displayLegend(legend);
    
    // further filtering out rects
    // cannot filter rects that are not within the mapping values because the bars' colors could be coded differently from that of the legend squares (e.g., Grouped Bar Chart V2)
    // if (Object.values(colorMapping).length > 0) rects = rects.filter(rect => rect.fill ? Object.values(colorMapping).includes(rect.fill) : true);
    let backgroundRect = rects.filter(rect => Math.abs(rect.y - Math.min(...rects.map(r => r.y))) < 0.1 && Math.abs(rect.x - Math.min(...rects.map(r => r.x))) < 0.1 && Math.abs(rect.bottom - Math.max(...rects.map(r => r.bottom))) < 0.1 && Math.abs(rect.right - Math.max(...rects.map(r => r.right))) < 0.1);
    if (backgroundRect.length == 1) {
        if (backgroundRect[0].fill) {
            rects = rects.filter(rect => rect.fill ? rect.fill !== backgroundRect[0].fill : true);
            if(!['#ffffff','#FFFFFF','white','none','transparent'].includes(backgroundRect[0].fill)) {
                rects = [...rects, ...originalRects.filter(r => r.fill ? ['#ffffff','#FFFFFF','white','none','transparent'].includes(r.fill) ? rects.filter(r2 => r2!=r && !(r.right < r2.x || r.x > r2.right || r.y > r2.bottom || r.bottom < r2.y)).length > 0 : false : false)];
            }
        }
        else rects.splice(rects.indexOf(backgroundRect[0]), 1);
    }

    // filter out rects who contain the legend area if any
    if (legend.marks)
        rects = rects.filter(r => legend["marks"].filter(e => e.x>=r.x && e.x<=r.right-10 && e.y>=r.y && e.y<=r.bottom-10).length == 0);
    // console.log("Rects in the main chart area:")
    // console.log(rects)

    // X axis
    xAxis = findxAxis(texts, rects, lines, nodes, nodeIndex);
    console.log("x axis", xAxis);
    displayAxis(xAxis);

    // Y axis
    yAxis = findyAxis(texts, rects, lines, nodes, nodeIndex, xAxis);
    console.log("y axis", yAxis);
    displayAxis(yAxis);

    // if Y labels are found while X labels are not; perform X label heuristic again
    if ('labels' in yAxis && !('labels' in xAxis)) {
        xAxis = findxAxis(texts, rects, lines, nodes, nodeIndex);
        console.log("x axis", xAxis);
        displayAxis(xAxis);
    }

    rects4Grouping = [rects, rectWith0WH]; // record a global variable for the later grouping heuristics
    // console.log(JSON.stringify({'rects': rects, "texts": texts, "lines": lines}))
    return {'rects': rects, "texts": texts, "lines": lines};
}

function filterRect(rect) {
    // consider stroke attrs
    // are stoke and fill-in independent?
    if (!rect['opacity'] || rect['opacity']!=="0") {
        if (rect['stroke']) {
            if (rect['stroke']!=='#ffffff' && rect['stroke']!=='#FFFFFF' && rect['stroke']!=='white' && rect['stroke']!=='none' && rect['stroke']!=='transparent' && rect['stroke']!=='rgb(255, 255, 255)') {
                if ((rect['stroke-width'] ? !['0', '0px', '0%'].includes(removeSpace(rect['stroke-width'])) : true) && (rect['stroke-opacity'] ? parseFloat(rect['stroke-opacity']) > 0.05 : true)) {
                    return rect;
                }
            }
        }
        if (!rect['fill-opacity'] || parseFloat(rect['fill-opacity']) > 0.05) {
            if(rect['tag']=="circle" || !rect['fill']) return rect;
            if ((rect['width']<2000 || rect['height']<2000) && (rect['fill']!=='#ffffff' && rect['fill']!=='#FFFFFF' && rect['fill']!=='white' && rect['fill']!=='none' && rect['fill']!=='transparent')) {
                return rect; 
                // to-dos: to avoid deleting white rects in heatmaps or matrix charts
            }
        }
    }
}

function findGridlines(rects, lines) {
    // gridlines (according to the tests, there could be repeated lines inside)
    let rectMostLeft = Math.min(...rects.map(r => r['x']));
    let rectMostRight = Math.max(...rects.map(r => r['right']));
    let rectMostTop = Math.min(...rects.map(r => r['y']));
    let rectMostBottom = Math.max(...rects.map(r => r['bottom']));
    // horizontal gridlines
    let Hlines = lines.filter(l => l['y1'] == l['y2'] && Math.abs(l['x1']-l['x2']) - (rectMostRight - rectMostLeft) > -50);
    if (Hlines.length >= 3) {
        // for (let l of Hlines) {
        //     // rbox2Html = rbox2Html + "<line x1 = '" + l['x1'] + "' x2 = '" + l['x2'] + "' y1 = '" + l['y1'] + "' y2 = '" + l['y2'] +"' stroke='red' stroke-width='3' stroke-dasharray='4' />";
        // }
        yGridlines = {stroke: Hlines[0].stroke, opacity: "stroke-opacity" in Hlines[0] ? parseFloat(Hlines[0]["stroke-opacity"]) : 1};
    }
    let Vlines = lines.filter(l => l['x1'] == l['x2'] && Math.abs(l['y1']-l['y2']) - (rectMostBottom - rectMostTop) > -50);
    if (Vlines.length >= 3) {
        // for (let l of Vlines) {
        //     // rbox2Html = rbox2Html + "<line x1 = '" + l['x1'] + "' x2 = '" + l['x2'] + "' y1 = '" + l['y1'] + "' y2 = '" + l['y2'] +"' stroke='red' stroke-width='3' stroke-dasharray='4' />";
        // }
        if(Hlines[0]) xGridlines = {stroke: Vlines[0].stroke, opacity: "stroke-opacity" in Hlines[0] ? parseFloat(Hlines[0]["stroke-opacity"]) : 1};
    }
    //return rbox2Html
}

function findLegendInArea(tl, br, texts, rects) {
    let labels = [], marks = [];
    for (let text of texts) {
        let left = 'left' in text ? text.left : text.x
        if (left >= tl.x && left + text.width <= br.x && text.y >= tl.y && text.y + text.height <= br.y) {
            labels.push(text);
        }
    }
    
    if (labels.length == 0) return;

    for (let r of rects) {
        if (r.x >= tl.x && r.x + r.width <= br.x && r.y >= tl.y && r.y + r.height <= br.y) {
            marks.push(r);
        }
    }
    let result = {'labels': labels, 'marks': marks};
    
    //todo: find ticks
    if (marks.length == 1)
        result['type'] = 'continuous';
    else
        result['type'] = 'discrete';
    
    //todo: determine orientation and mapping
    let left = d3.min(labels.map(d => "left" in d ? d.left : d.x)),
        right = d3.max(labels.map(d => "left" in d ? d.left + d.width : d.x + d.width)),
        top = d3.min(labels.map(d => d.y)),
        btm = d3.max(labels.map(d => d.y + d.height));
    let xDiffs = labels.map(d => "left" in d ? Math.abs(d.left - left) : Math.abs(d.x - left)),
        yDiffs = labels.map(d => Math.abs(d.y - btm));
    if (d3.sum(xDiffs) < d3.sum(yDiffs)) {
        result['orientation'] = 'vert';
        if (result['type'] = 'discrete') {
            labels.sort((a,b) => a.y - b.y);
            marks.sort((a,b) => a.y - b.y);
            result.mapping = {};
            for (let i = 0; i < labels.length; i++) {
                result.mapping[labels[i].content] = marks[i] ? marks[i].fill : "white";
            }
        }
    } else {
        result['orientation'] = 'horz';
        if (result['type'] = 'discrete') {
            labels.sort((a,b) => a.x - b.x);
            marks.sort((a,b) => a.x - b.x);
            result.mapping = {};
            for (let i = 0; i < labels.length; i++) {
                result.mapping[labels[i].content] = marks[i] ? marks[i].fill : "white";
            }
        }
    }
    result['x'] = d3.min(result['marks'].map(d => d.x));
    result['y'] = d3.min(result['marks'].map(d => d.y));

    legend = result;
    console.log(legend);

    for (let l of labels){
        if (mainContent.texts.indexOf(l) >= 0)
            mainContent.texts.splice(mainContent.texts.indexOf(l), 1);
        if (xAxis.labels.indexOf(l) >= 0)
            xAxis.labels.splice(xAxis.labels.indexOf(l), 1);
        if (yAxis.labels.indexOf(l) >= 0)
            yAxis.labels.splice(yAxis.labels.indexOf(l), 1);
    }

    for (let r of marks){
        if (mainContent.rects.indexOf(r) >= 0)
            mainContent.rects.splice(mainContent.rects.indexOf(r), 1);
    }
}

function findLegend(texts, rects, lines, numOfColor) {
    if (texts.length == 0) return {'labels': [], 'marks': []};
    let LegendExist = false, legendArea = {"elements": [], "type": null}, colorMapping = {};
    let result = {'labels': [], 'marks': []};
    let allY, uniqueY, allX, uniqueX;
    if (numOfColor>20) {
        let legendBar = rects.filter(function(rect) {if (rect['fill']) { if (rect['fill'].indexOf("url")!==-1) return rect;}})[0]; // assuming there is only one bar
        if (legendBar) {
            LegendExist = true;
            let legendLabel=[], legendTick=[];
            rects.splice(rects.indexOf(legendBar), 1);
            if (legendBar['width'] > legendBar['height']) {
                allY = texts.map(text => text['y']);
                uniqueY = texts.map(text => text['y']).filter(onlyUnique).filter(function (y) {if (Math.abs(y-legendBar['y']) < 30 || Math.abs(y-legendBar['y']-legendBar['height']) < 30) return y;});
                for (let y of uniqueY) {
                    texts4legend = texts.filter(function (text) {if (text['y'] == y) return text;});
                    if (texts4legend.length <= 1) {
                        continue
                    }
                    if ((Math.abs(y-legendBar['y']) < 30 || Math.abs(y-legendBar['y']-legendBar['height']) < 30) && Math.max(...texts4legend.map(text => text['x'])) - Math.min(...texts4legend.map(text => text['x'])) < legendBar['width'] + 20) {
                        legendLabel = texts4legend;
                        line4ticks = lines.filter(line => line['x1']==line['x2'] && line['x1'] >= legendBar['x']-10 && line['x1'] <= legendBar['x'] + legendBar['width'] + 10 && line['y1'] >= legendBar['y']-10 && line['y2'] <= legendBar['y'] + legendBar['height'] + 10);
                        legendTick = line4ticks ? line4ticks : [];
                        break;
                    }
                }
            } else {
                allX = texts.map(text => text['x']);
                uniqueX = texts.map(text => text['x']).filter(onlyUnique).filter(function (x) {if (Math.abs(x-legendBar['x']) < 30 || Math.abs(x-legendBar['x']-legendBar['width']) < 30) return x;});
                for (let x of uniqueX) {
                    texts4legend = texts.filter(function (text) {if (text['x'] == x) return text;});
                    if (texts4legend.length <= 1) {
                        continue
                    }
                    if ((Math.abs(x-legendBar['x']) < 30 || Math.abs(x-legendBar['x']-legendBar['width']) < 30) && Math.max(...texts4legend.map(text => text['y'])) - Math.min(...texts4legend.map(text => text['y'])) < legendBar['height'] + 20) {
                        legendLabel = texts4legend;
                        line4ticks = lines.filter(line => line['y1']==line['y2'] && line['y1'] >= legendBar['y']-10 && line['y1'] <= legendBar['y'] + legendBar['height'] + 10 && line['x1'] >= legendBar['x']-10 && line['x2'] <= legendBar['x'] + legendBar['width'] + 10);
                        legendTick = line4ticks ? line4ticks : [];
                        break;
                    }
                }
            }

            for (let line of legendTick){
                lines.splice(lines.indexOf(line), 1);
            }
            for (let label of legendLabel){
                texts.splice(texts.indexOf(label), 1);
            }

            result['type'] = 'continuous';
            result['ticks'] = legendTick;
            result['labels'] = legendLabel;
            result['marks'] = [legendBar];
            result['x'] = result['marks'][0].x;
            result['y'] = result['marks'][0].y;
            result['orientation'] = result['marks'][0].width > result['marks'][0].height ? "horz" : "vert";
            return result;
        }
    }
    if (LegendExist == false) // there is not a continous legend
    {
        candidateRects = [];
        // assuming the legend rects are square or circles
        for (let rect of rects) {
            if (rect['width'] == rect['height'] || rect['tag'] == "circle") {
                candidateRects.push(rect)
            }
        }
        let alllegendElements = [], isLegend;
        if (candidateRects != []) {
            // find any horizontal legend
            allY = candidateRects.map(c => c['y']);
            uniqueY = allY.filter(onlyUnique);
            for (let y of uniqueY) {
                if (countInArray(allY, y)>=2) {
                    // sort the texts
                    rectOfy = rects.filter(function(rect) {if(rect['y'] == y) return rect}).sort((a, b) => (a['x'] > b['x']) ? 1 : -1);
                    if(rectOfy.map(r => r['fill']).filter(onlyUnique).length == rectOfy.length) {
                        isLegend = true;
                    } else {
                        continue
                    }
                    let legendElements = [];
                    for (let i = 0; i < rectOfy.length-1; i++) {
                        legendElements.push(rectOfy[i]);
                        finding = findBetween(rectOfy[i], rectOfy[i+1], texts);
                        if (finding) {
                            legendElements.push(finding);
                            continue
                        }
                        else {
                            isLegend = false;
                            break
                        }
                    }
                    if (isLegend == true) {
                        legendElements.push(rectOfy[rectOfy.length-1]);
                        lastText = texts.filter(text => (Math.abs(text['y'] - legendElements[1]['y']) < 10 && (text['x']>legendElements[legendElements.length-1]['x'] || text['x']<legendElements[0]['x'])));
                        legendElements.push(lastText[0]);
                        alllegendElements = alllegendElements.concat(legendElements);
                    }
                }
            }

            if (alllegendElements.length > 0) {
                result['type'] = 'discrete';
                result['mapping'] = {};
                result['labels'] = alllegendElements.filter(d => d.tag == "text");
                // legendArea.type = "discrete";
                //legendArea.elements = [].concat(alllegendElements);
                result['marks'] = alllegendElements.filter(d => d.tag != "text");
                result['orientation'] = "horz";
                //colorMapping = {};
                for (let i = 0; i < alllegendElements.length-1; i+=2) {
                    // colorMapping[alllegendElements[i+1]['content']] = alllegendElements[i]['fill'];
                    result['mapping'][alllegendElements[i+1]['content']] = alllegendElements[i]['fill'];
                    rects.splice(rects.indexOf(alllegendElements[i]), 1);
                    texts.splice(texts.indexOf(alllegendElements[i+1]), 1);
                }
                result['x'] = d3.min(result['marks'].map(d => d.x));
                result['y'] = d3.min(result['marks'].map(d => d.y));
                return result;
                // calculating bounding box
            } else {
                LegendExist == false;
                // find any vertical legend
                allX = texts.map(text => text['x']);
                uniqueX = texts.map(text => text['x']).filter(onlyUnique);
                // finding the legend area
                for (let x of uniqueX) {
                    legendElements = [];
                    if (countInArray(allX, x)>=2) {
                        // sort the texts
                        textOfx = texts.filter(function(text) {if(text['x'] == x) return text}).sort((a, b) => (a['y'] > b['y']) ? 1 : -1);
                        isLegend = true;
                        firstFinding = candidateRects.filter(function(rect) {
                            if (((rect['x'] - textOfx[0]['right'] > 0 && rect['x'] - textOfx[0]['right'] < 30) || (textOfx[0]['x'] - rect['x'] > 0 && textOfx[0]['x'] - rect['x'] < 30)) && Math.abs(rect['y'] - textOfx[0]['y']) < 30) {
                                return rect
                            }
                        });
                        if (firstFinding == []) {
                            continue
                        }
                        legendElements = legendElements.concat(textOfx);
                        if (firstFinding.length > 1) {
                            // firstFinding = firstFinding.sort((a, b) => (Math.abs(a['y'] - textOfx[0]['y']) > Math.abs(b['y'] - textOfx[0]['y'])) ? 1 : -1);
                            firstFinding = firstFinding[0];
                        }
                        findings = candidateRects.filter(function(rect) {
                            if (rect['x'] == firstFinding['x']) {
                                return rect
                            }
                        });
                        if (findings.length != textOfx.length || findings.map(r => r['fill']).filter(onlyUnique).length !== findings.length) { 
                            // tbd: check the relation positioning of the rects
                            isLegend = false;
                        } else {
                            legendElements = legendElements.concat(findings);
                        }
                        if (isLegend == true) {
                            result['type'] = 'discrete';
                            result['mapping'] = {};
                            result['orientation'] = "vert";
                            //result['x'] = x;
                            //result['marks'] = [];
                            // legendArea.type = "discrete";
                            // legendArea.elements = legendArea.elements.concat(legendElements);
                            //result['marks'] = result['marks'].concat(legendElements);
                            result['labels'] = legendElements.filter(d => d.tag == "text");
                            result['marks'] = legendElements.filter(d => d.tag != "text");
                            result['x'] = d3.min(result['marks'].map(d => d.x));
                            result['y'] = d3.min(result['marks'].map(d => d.y));
                            // colorMapping = {};
                            for (let i = 0; i < legendElements.length / 2; i+=1) {
                                // colorMapping[legendElements[i]['content']] = legendElements[i + legendElements.length / 2]['fill'];
                                result['mapping'][legendElements[i]['content']] = legendElements[i + legendElements.length / 2]['fill'];
                                rects.splice(rects.indexOf(legendElements[i + legendElements.length / 2]), 1);
                                texts.splice(texts.indexOf(legendElements[i]), 1);
                            }
                            return result;
                            // calculating bounding box
                            //rbox2Html = rbox2Html + "<rect x = '" + (x - 30) + "' y = '" + (legendElements[legendElements.length/2]['y'] - 10) + "' width='" + (legendElements[0]['x'] - legendElements[legendElements.length-1]['x'] + 100) +"' stroke='#CF27CF' stroke-width='3' stroke-dasharray='4' height='" + (legendElements[legendElements.length-1]['y'] - legendElements[0]['y'] + 50) + "' style='fill-opacity: 0;'' />";
                        }
                    }
                }
            }
        }
    }
    return {'labels': [], 'marks': []};
}

function findAxisInArea(o, tl, br, texts, rects, lines) {
    let labels = [];
    for (let text of texts) {
        let left = 'left' in text ? text.left : text.x
        if (left >= tl.x && left + text.width <= br.x && text.y >= tl.y && text.y + text.height <= br.y) {
            labels.push(text);
        }
    }
    if (labels.length == 0) return;

    let axis = o == "x" ? xAxis : yAxis;
    axis['type'] = o;
    axis['labels'] = labels;
    axis['attrX'] = Object.keys(labels[0]);
    axis['baseline'] = o == "x" ? d3.mean(labels.map(d => d.y)) : d3.mean(labels.map(d => d.x));

    //remove from main content and the other axis/legend
    let otherAxis = o == "y" ? xAxis : yAxis;
    for (let l of labels){
        if (mainContent.texts.indexOf(l) >= 0)
            mainContent.texts.splice(mainContent.texts.indexOf(l), 1);
        if (otherAxis.labels.indexOf(l) >= 0)
            otherAxis.labels.splice(otherAxis.labels.indexOf(l), 1);
        if (legend.labels.indexOf(l) >= 0)
            legend.labels.splice(legend.labels.indexOf(l), 1);
    }

    //todo: find axis path and ticks
    let candidateLines = [], ticks = [], path;
    for (let l of lines) {
        if (l.x1 >= tl.x && l.x2 <= br.x) {
            candidateLines.push(l);
        }
    }
    if (o == "x") {
        for (let l of candidateLines) {
            if (l.x1 == l.x2) {
                ticks.push(l);
                lines.splice(lines.indexOf(l), 1);
            } 
            if (l.y1 == l.y2) {
                path = l;
                lines.splice(lines.indexOf(l), 1);
            }
        }
    } else if (o == "y") {
        for (let l of candidateLines) {
            if (l.y1 == l.y2) {
                ticks.push(l);
                lines.splice(lines.indexOf(l), 1);
            }
            if (l.x1 == l.x2) {
                path = l;
                lines.splice(lines.indexOf(l), 1);
            }
        }
    }
    axis.ticks = ticks;
    axis.path = path;
    
}

function findxAxis(texts, rects, lines, nodes, nodeIndex) {
    let allY = texts.map(text => text['y']).filter(onlyUnique);
    let mostFrenquentY;
    let possible_Xlabels = {};
    // XLabelsExist = false;
    let Labels = [];
    let xAxis = {'labels': [], 'type': 'x'};
    for (let y of allY) {
        let yLabels = texts.filter(text => text['y'] === y);
        let leftout = texts.filter(text => yLabels.includes(text) == false && range(yLabels.map(l=>l['height']).concat(text['height']))<1 && range(yLabels.map(l=>l['y']).concat(text['y']))<3);
        yLabels = yLabels.concat(leftout);
        // below if for checking the relative position of rects and possible labels
        let withinRect = false;
        for (let yl of yLabels) {
            for (let rect of rects) {
                if (rect['tag']=="circle") {
                    continue
                } else {
                    if (yl['x']>rect['x'] && yl['x']<rect['right'] && yl['y']>rect['y'] && yl['y']<rect['bottom']) {
                        withinRect = true;
                        break;
                    }
                }
            }
            if (withinRect == true) break;
        }
        if (withinRect == false && yLabels.map(l => l['level']).filter(onlyUnique).length == 1) {
            possible_Xlabels[y] = yLabels;
        }
    }
    ys = FindKeysWithTheMostValues(possible_Xlabels);
    if (ys.length == 1) {
        Labels = possible_Xlabels[ys[0]];
        mostFrenquentY = ys[0];
    } else {
        if ((ys.map(k => possible_Xlabels[k].map(t => t['id']).sort().join(',')).filter(onlyUnique).length == 1) && range(ys) < 3) {
            let possibleLabelsGroupedByY = ys.map(k => texts.filter(text => text['y'] == parseFloat(k)));
            let indexOflongestSubArr = possibleLabelsGroupedByY.reduce((maxI,el,i,arr) => (el.length>arr[maxI].length) ? i : maxI, 0);
            mostFrenquentY = parseFloat(ys[indexOflongestSubArr]);
            Labels = possibleLabelsGroupedByY[indexOflongestSubArr];
            for (let i=0; i<possibleLabelsGroupedByY.length; i++) {
                if (i == indexOflongestSubArr) {
                    continue
                } else {
                    if (findNearesrParent(nodeIndex, nodes, Labels) == findNearesrParent(nodeIndex, nodes, Labels.concat(possibleLabelsGroupedByY[i]))) {
                        let controllabel = Labels[0];
                        for (let nl of possibleLabelsGroupedByY[i]) {
                            if (arrayCompare(Object.keys(nl), Object.keys(controllabel))) {
                                Labels.push(nl);
                            }
                        }
                    }
                }
            }
        } else {
            Labels = [];
            mostFrenquentY = ys[0];
        }
    }
    if (Labels.length >= 3) {
        XLabelsExist = true; 
        // XLabelSet = Labels;
        xAxis['type'] = 'x';
        xAxis['labels'] = Labels;
        //baselineX = mostFrenquentY; 
        xAxis['attrX'] = Object.keys(Labels[0]);
        xAxis['baseline'] = mostFrenquentY;
        for (let label of Labels) {
            texts.splice(texts.indexOf(label), 1);
        }
        x = Math.min(...Labels.map(t => t['x'])); width = Math.max(...Labels.map(t => t['x'])) - x;
        // rbox2Html = rbox2Html + "<rect x = '" + (x-20) + "' y = '" + (mostFrenquentY-10) + "' width='" + (width+40) +"' stroke='black' stroke-width='2' stroke-dasharray='4' height='20'" + "' style='fill-opacity: 0;'' />";
        ancestry = findNearesrParent(nodeIndex, nodes, Labels);
        candidateLines = findleaves(nodeIndex, nodes, ancestry, lines);
        let isXaxis = false;
        let isXticks = false;
        while (isXaxis == false || isXticks == false) {
            if (candidateLines.length !== 0) {
                if (isXaxis == false) {
                    possibleAxis = candidateLines.filter(function(line) {if(line['y1'] == line['y2'] && line['y1']<=mostFrenquentY && line['y1']-mostFrenquentY>-25 && Math.abs(line['x1']-line['x2'])>=width-10) return line});
                    possibleAxis = possibleAxis.sort((a, b) => (a['y1']-mostFrenquentY > b['y1']-mostFrenquentY) ? -1: 1); // sort based on distance to the labels
                    xAxisLine = possibleAxis[0];
                    if (xAxisLine) {
                        isXaxis = true;
                        lines.splice(lines.indexOf(xAxisLine), 1);
                        xAxis['path'] = xAxisLine;
                        // rbox2Html = rbox2Html + "<line x1 = '" + xAxisLine['x1'] + "' x2 = '" + xAxisLine['x2'] + "' y1 = '" + xAxisLine['y1'] + "' y2 = '" + xAxisLine['y2'] +"' stroke='red' stroke-width='3' stroke-dasharray='4' />";
                    } 
                }
                if (isXticks == false) {
                    possibleTicks = candidateLines.filter(function(line) {if (line['x1'] == line['x2'] && Labels[0]['y']>0.5*(line['y1']+line['y2']) && Labels[0]['y']<30+0.5*(line['y1']+line['y2']) && Math.abs(line['y1']-line['y2'])<10) return line});
                    if (possibleTicks.length !== 0) { // check whether the number of ticks >= the number of labels
                        isXticks = true;
                        xAxis['ticks'] = [];
                        for (let line of possibleTicks){
                            lines.splice(lines.indexOf(line), 1);
                            xAxis['ticks'].push(line);
                            // rbox2Html = rbox2Html + "<line x1 = '" + line['x1'] + "' x2 = '" + line['x2'] + "' y1='" + line['y1'] + "' y2='" + line['y2'] + "' stroke='#CF27CF' stroke-width='3' stroke-dasharray='4' />";
                        }
                    }
                }
            }
            ancestry = nodes.filter(n => n['id']==ancestry).map(n => n['parent'])[0];
            if (ancestry) {
                candidateLines = findleaves(nodeIndex, nodes, ancestry, lines);
                continue
            } else {
                break
            }
        }
        // find any possible thin rect to be the y axis
        if (isXaxis == false) {
            rect_xAxis = rects.filter(function(rect) {if(rect['bottom']>=Math.max(...Labels.map(t => t['y']))-30 && rect['bottom']-Math.max(...Labels.map(t => t['y']))<=30 && rect.width>=width && rect.height<2) return rect});
            if (rect_xAxis.length !== 0) {
                console.log("rect-x-axis!")
                xAxisLine = rect_xAxis[0];
                xAxis['path'] = xAxisLine;
                rects.splice(rects.indexOf(xAxisLine), 1);
            }
        }

        // find axis title
        let xTitle = "";
        possible_x_title = texts.filter(t => t['y'] > mostFrenquentY && Math.min(...Labels.map(l => l['x'])) < t['x'] && t['x'] < Math.max(...Labels.map(l => l['x'])));
        if (possible_x_title.length == 1) {
            xTitle = possible_x_title[0]['content'] + ":";
            xAxis['title'] = xTitle;
        }
    }

    return xAxis;
}

function findyAxis(texts, rects, lines, nodes, nodeIndex, xAxis) {
    let allX = texts.map(text => text['x']).filter(onlyUnique);
    let mostFrenquentX;
    let YLabelsExist = false;
    let Labels = [];
    let possible_Ylabels = {};
    let yAxis = {'labels': [], 'type': 'y'};
    for (let x of allX) {
        xLabels = texts.filter(text => text['x'] === x);
        let leftout = texts.filter(text => xLabels.includes(text) == false && range(xLabels.map(l=>l['height']).concat(text['height']))<1 && (range(xLabels.map(l=>l['left']).concat(text['left']))<5 || range(xLabels.map(l=>l['right']).concat(text['right']))<5));
        xLabels = xLabels.concat(leftout);
        // below if for checking the relative position of rects and possible labels
        let withinRect = false;
        for (let xl of xLabels) {
            for (let rect of rects) {
                if (rect['tag']=="circle") {
                    continue
                } else {
                    if (xl['x']>rect['x'] && xl['x']<rect['right'] && xl['y']>rect['y'] && xl['y']<rect['bottom']) {
                        withinRect = true;
                        break;
                    }
                }
            }
            if (withinRect == true) break;
        }
        if (withinRect == false && xLabels.map(l => l['level']).filter(onlyUnique).length == 1) {
            possible_Ylabels[x] = xLabels;
        }
    }
    xs = FindKeysWithTheMostValues(possible_Ylabels);
    if (xs.length == 1) {
        Labels = possible_Ylabels[xs[0]];
        mostFrenquentX = xs[0];
    } else {
        if ((xs.map(k => possible_Ylabels[k].map(t => t['id']).sort().join(',')).filter(onlyUnique).length == 1)) {
            let possibleLabelsGroupedByX = xs.map(k => texts.filter(text => text['x'] == parseFloat(k)));
            let indexOflongestSubArr = possibleLabelsGroupedByX.reduce((maxI,el,i,arr) => (el.length>arr[maxI].length) ? i : maxI, 0);
            mostFrenquentX = parseFloat(ys[indexOflongestSubArr]);
            Labels = possibleLabelsGroupedByX[indexOflongestSubArr];
            for (let i=0; i<possibleLabelsGroupedByX.length; i++) {
                if (i == indexOflongestSubArr) {
                    continue
                } else {
                    if (findNearesrParent(nodeIndex, nodes, Labels) == findNearesrParent(nodeIndex, nodes, Labels.concat(possibleLabelsGroupedByX[i]))) {
                        let controllabel = Labels[0];
                        for (let nl of possibleLabelsGroupedByX[i]) {
                            if (arrayCompare(Object.keys(nl), Object.keys(controllabel))) {
                                Labels.push(nl);
                            }
                        }
                    }
                }
            }
        } else {
            Labels = [];
            mostFrenquentX = xs[0];
        }
    }
    if (Labels.length >= 3) {
        YLabelsExist = true;
        // YLabelSet = Labels; 
        // baselineY = mostFrenquentX; 
        yAxis['type'] = 'y';
        yAxis['labels'] = Labels;
        yAxis['attrY'] = Object.keys(Labels[0]);
        yAxis['baseline'] = mostFrenquentX;
        for (let label of Labels) {
            texts.splice(texts.indexOf(label), 1);
        }
        y = Math.min(...Labels.map(t => t['y'])); height = Math.max(...Labels.map(t => t['y'])) - y;
        leftb = Math.min(...Labels.map(t => t['left'])); rightb = Math.max(...Labels.map(t => t['right']));
        // rbox2Html = rbox2Html + "<rect x = '" + (leftb-10) + "' y = '" + (y-10) + "' height='" + (height + 20) +"' stroke='black' stroke-width='2' stroke-dasharray='4' width=' " + (rightb - leftb + 20) + "' style='fill-opacity: 0;'' />";
        ancestry = findNearesrParent(nodeIndex, nodes, Labels);
        candidateLines = findleaves(nodeIndex, nodes, ancestry, lines);
        let isYaxis = false;
        let isYticks = false;
        while (isYaxis == false || isYticks == false) {
            if (candidateLines !== []) {
                if (isYaxis == false) {
                    possibleAxis = candidateLines.filter(function(line) {if(line['x1'] == line['x2'] && line['x1']>=Math.max(...Labels.map(t => t['right']))-30 && line['x1']-Math.max(...Labels.map(t => t['right']))<30 && Math.abs(line['y1']-line['y2'])>=Math.max(...Labels.map(t => t['y'])) - Math.min(...Labels.map(t => t['y']))) return line});
                    possibleAxis = possibleAxis.sort((a, b) => (Math.abs(a['x1']-mostFrenquentX) > Math.abs(b['x1']-mostFrenquentX)) ? 1 : -1);
                    yAxisLine = possibleAxis[0];
                    if (yAxisLine) {
                        isYaxis = true;
                        yAxis['path'] = yAxisLine;
                        lines.splice(lines.indexOf(yAxisLine), 1);
                        // rbox2Html = rbox2Html + "<line x1 = '" + yAxisLine['x1'] + "' x2 = '" + yAxisLine['x2'] + "' y1 = '" + yAxisLine['y1'] + "' y2 = '" + yAxisLine['y2'] +"' stroke='red' stroke-width='3' stroke-dasharray='4' />";
                    } 
                }
                if (isYticks == false) {
                    possibleTicks = candidateLines.filter(function(line) {if(line['y1'] == line['y2'] && ((0.5*(line['x1']+line['x2']) > Labels[0]['left']-30 && 0.5*(line['x1']+line['x2']) < Labels[0]['left'] + 30) || (0.5*(line['x1']+line['x2']) > Labels[0]['right']-30 && 0.5*(line['x1']+line['x2']) < Labels[0]['right'] + 30)) && Math.abs(line['x1']-line['x2'])<20) return line});
                    if (possibleTicks) {
                        isYticks = true;
                        yAxis['ticks'] = [];
                        for (let line of possibleTicks){
                            yAxis['ticks'].push(line);
                            lines.splice(lines.indexOf(line), 1);
                            // rbox2Html = rbox2Html + "<line x1 = '" + line['x1'] + "' x2 = '" + line['x2'] + "' y1='" + line['y1'] + "' y2='" + line['y2'] + "' stroke='#CF27CF' stroke-width='3' stroke-dasharray='4' />";
                        }
                    }
                }
            }
            ancestry = nodes.filter(n => n['id']==ancestry).map(n => n['parent'])[0];
            if (ancestry) {
                candidateLines = findleaves(nodeIndex, nodes, ancestry, lines);
                continue
            } else {
                break
            }
        }
        // find any possible thin rect to be the y axis
        if (isYaxis == false) {
            rect_yAxis = rects.filter(function(rect) {if(rect['x']>=Math.max(...Labels.map(t => t['right']))-30 && rect['x']-Math.max(...Labels.map(t => t['right']))<=30 && rect.height>=height && rect.width<2) return rect});
            if (rect_yAxis.length !== 0) {
                console.log("rect-y-axis!")
                yAxisLine = rect_yAxis[0];
                yAxis['path'] = yAxisLine;
                rects.splice(rects.indexOf(yAxisLine), 1);
            }
        }

        // find axis title
        let yTitle = "";
        possible_y_title = texts.filter(t => t['x'] < mostFrenquentX && Math.min(...Labels.map(l => l['y'])) < t['y'] && t['y'] < Math.max(...Labels.map(l => l['y'])));
        if (possible_y_title.length == 1) {
            yTitle = possible_y_title[0]['content'] + ":";
            yAxis['title'] = yTitle;
        }
    }

    return yAxis;
}