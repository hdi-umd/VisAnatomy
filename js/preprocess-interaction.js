var undoStack = [], redoStack = [];
var btnCheck = {};
var chartDecomposition = {};

function addAxisLevel(t) {
    let axis = t === "x" ? xAxis : yAxis;
    if (!axis) return;
    if (! ("upperLevels" in axis)) {
        axis["upperLevels"] = [];
    }
    axis["upperLevels"].push([]);
    d3.select("#" + t + "AxisDiv").append("div").attr("class", "axisLabels").attr("id", t + "Labels" + axis["upperLevels"].length).on("drop", drop).on("dragover", allowDrop);
    let size = ["calc(", (100/(axis["upperLevels"].length + 1)).toFixed(1), "% - ", 150/(axis["upperLevels"].length + 1), "px)"].join("");
    d3.select("#" + t + "AxisDiv").selectAll(".axisLabels").style("width", size);
    //d3.select("#" + t + "AxisDiv").append("<div class="axisLabels" id="xLabels" ondrop="drop(event)" ondragover="allowDrop(event)"></div>")
}

function fieldTypeChanged(xy) {
    let val = d3.select("#"+xy+"FieldType").property("value");
    let axis = xy == "x" ? xAxis : yAxis;
    if (val == "Null") {
        undoStack.push({xAxis: duplicate(xAxis), yAxis: duplicate(yAxis), legend: duplicate(legend), btnCheck: Object.assign({}, btnCheck)});
        let labels = axis.labels.map(d => d);
        for (let l of labels) {
            removeAxisLabel(xy+"Labels", l);
        }
        axis.ticks = [];
        displayAxis(axis);
    }
    axis.fieldType = val;
}

function enableAreaSelection() {
    var clickHold = false, layerX, layerY, clientX, clientY;
    d3.select("#vis").on("mousedown", function(e){
        // e.stopImmediatePropagation();
        e.preventDefault();
        clickHold = true;
        clientX = e.clientX;
        clientY = e.clientY;
        layerX = e.layerX;
        layerY = e.layerY;
    }).on("mousemove", function(e){
        // e.stopImmediatePropagation();
        e.preventDefault();
        if (!clickHold || !areaSelection) return;
        let x = e.layerX, y = e.layerY;
        let left = Math.min(x, layerX), top = Math.min(y, layerY), wd = Math.abs(layerX - x), ht = Math.abs(layerY - y);
        d3.select("#overlaySelection").attr("width", wd).attr("height", ht).attr("x", left).attr("y", top).style("visibility", "visible");
    }).on("mouseup", function(e){
        // e.stopImmediatePropagation();
        e.preventDefault();
        if (clickHold && areaSelection) {
            let x = e.clientX, y = e.clientY;
            let left = Math.min(x, clientX), top = Math.min(y, clientY), right = Math.max(x, clientX), btm = Math.max(y, clientY);
            const topLeft = clientPt2SVGPt(left, top), btmRight = clientPt2SVGPt(right, btm);
            if (areaSelection == "x" || areaSelection == "y") {
                findAxisInArea(areaSelection, topLeft, btmRight, mainContent.texts, mainContent.rects, mainContent.lines);
            }
            else if (areaSelection == "legend") {
                let rects = mainContent.rects;
                if (xAxis.path)
                    rects = rects.concat([xAxis.path]);
                if (yAxis.path)
                    rects = rects.concat([yAxis.path]);
                findLegendInArea(topLeft, btmRight, mainContent.texts.concat(xAxis.labels).concat(yAxis.labels), rects);
            }
                
            displayAxis(xAxis);
            displayAxis(yAxis);
            displayLegend(legend);
            deactivateAreaSelect();
        }
        clickHold = false;
        d3.select("#overlaySelection").style("visibility", "hidden");
    });
}

function activateAreaSelect(type) {
    areaSelection=type;
    document.body.style.cursor='crosshair';
    d3.selectAll(".selectAreaBtn").style("background", "#eee");
    d3.select("#"+type+"Area").style("background", "#c8e6fa");
}

function deactivateAreaSelect() {
    areaSelection=undefined;
    document.body.style.cursor='default';
    d3.selectAll(".selectAreaBtn").style("background", "#eee");
}

function proceed() {
    xAxis.fieldType = d3.select("#xFieldType").property("value");
    yAxis.fieldType = d3.select("#yFieldType").property("value");
    legend.fieldType = d3.select("#legendFieldType").property("value");
    chartDecomposition = {};
    d3.select("#preprocessUI").style("visibility", "hidden");
    d3.select("#reuseUI").style("visibility", "visible");
    bottomUpGrouping();
    // if (!finalGroups) {
    //     if (allHoriColls) {
    //       if (allHoriColls.length > 0) finalGroups = allHoriColls;
    //     } else if (allVertColls) {
    //       if (allVertColls.length > 0) finalGroups = allVertColls;
    //     }
    //   }
    //   if (newColls) {
    //     if (newColls.length > 0) atlasSceneGraph = getAtlasScene();
    //   } else {
    //     newColls = [];
    //     newColls.push({});
    //     newColls[0].collections = finalGroups;
    //     atlasSceneGraph = getAtlasScene();
    //   }
    inferEncodings();
    chartDecomposition.objects = newColls[0];
    chartDecomposition.encodings = encodings;
    chartDecomposition.alignments = alignments;
    console.log("Chart Decomposition Results: ", chartDecomposition)
    atlasSceneGraph = getAtlasScene();  
    console.log("Atlas Scene Graph: ", atlasSceneGraph);

    schema = inferTblSchema(atlasSceneGraph);
    console.log("table columns", schema);
    d3.select("#tblSchemaInfo").text("Your dataset should have at least " + schema["categorical"] + " categorical columns and at least "  + schema["quantitative"] + " quantitative columns.");
    loadReuseUI();
}

function inferTblSchema(scene) {
    let collections = scene.children.filter(d => d.type === "collection");
    let levels = 0;
    for (let c of collections) {
        let item = c.firstChild, l = 1;
        while (item.type === "collection") {
            item = item.firstChild;
            l++;
        }
        if (l > levels) {
            levels = l;
        }
    }
    let encodedFields = {"categorical": 0, "quantitative": 0};
    for (let l = 0; l < encodings.length; l++) {
        let e = encodings[l];
        for (let channel of e) {
            switch (channel) {
                case "width":
                case "height":
                case "fill-opacity":
                case "x":
                case "y":
                case "area":
                    encodedFields["quantitative"] += 1;
                    break;
                default:
                    encodedFields["categorical"] += 1;
                    break;
            }
        }
    }
    // console.log(levels);
    // console.log(encodedFields);
    return {"categorical": Math.max(levels, encodedFields["categorical"]), "quantitative": encodedFields["quantitative"]};
}

function save() {
    xAxis['fieldType'] = d3.select("#xFieldType").property("value");
    yAxis['fieldType'] = d3.select("#yFieldType").property("value");
    legend['fieldType'] = d3.select("#legendFieldType").property("value");
    let result = {
        xAxis: xAxis,
        yAxis: yAxis,
        legend: legend,
        mainContent: mainContent
    };
    var file = new Blob([JSON.stringify(result)], {type: "json"});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, demoName +".json");
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = demoName +".json";
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

function undo() {
    if (undoStack.length > 0) {
        let h = undoStack.pop();
        xAxis = h['xAxis'];
        yAxis = h['yAxis'];
        legend = h['legend'];
        btnCheck = h['btnCheck'];
        redoStack.unshift(h);
        displayAxis(xAxis);
        displayAxis(yAxis);
        displayLegend(legend);
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    draggedFromNode = document.getElementById(data); // dragged element
    draggedFromID = draggedFromNode.parentNode.id; // id of parent of dragged element
    if (ev.currentTarget.id.startsWith("xLabels") || ev.currentTarget.id.startsWith("yLabels")) { // when the element is dropped in the detected region
        if (draggedFromID.startsWith("xLabels") || draggedFromID.startsWith("yLabels")){ // when the element is also from the detected region
            undoStack.push({xAxis: duplicate(xAxis), yAxis: duplicate(yAxis), legend: duplicate(legend), btnCheck: Object.assign({}, btnCheck)});
            moveAxisLabel(draggedFromID, ev.currentTarget.id, d3.select("#"+data).datum());
            buttonCheck(ev.currentTarget.id, d3.select("#"+data).datum());
            displayAxis(xAxis);
            displayAxis(yAxis);
            ev.stopImmediatePropagation();
        } 
    } else {
        // when an label from detected region are dropped outside delete it
        undoStack.push({xAxis: duplicate(xAxis), yAxis: duplicate(yAxis), legend: duplicate(legend), btnCheck: Object.assign({}, btnCheck)});
        if (draggedFromID.startsWith("xLabels") || draggedFromID.startsWith("yLabels")) {
            removeAxisLabel(draggedFromID, d3.select("#"+data).datum());
            displayAxis(xAxis);
            displayAxis(yAxis);
        } else if (draggedFromID =="legendLabels") {
            removeLegendLabel(d3.select("#"+data).datum());
            displayLegend(legend);
        }
        ev.stopImmediatePropagation();
    }
    d3.select(".tooltip").remove();
}

function buttonCheck(TargetID, thisText) {
    if (TargetID.split("Labels")[1]) return;
    let message = "Warnings: ";
    let attrCond = xAxis['attrX'].length > 0 && TargetID == "xLabels" ? !arrayCompare(Object.keys(thisText), xAxis['attrX']) : !arrayCompare(Object.keys(thisText), yAxis['attrY']);
    let levelCond = TargetID == "xLabels" ? !( xAxis['labels'].length == 0 || (thisText.level == xAxis['labels'][0].level)) : !( yAxis['labels'].length == 0 || (thisText.level == yAxis['labels'][0].level));
    let axisCond = TargetID == "xLabels" ? !( !("baseline" in xAxis) || Math.abs(thisText.y-xAxis['baseline'])<200) : !(!("baseline" in xAxis)|| Math.abs(thisText.x-yAxis['baseline'])<200);
    if (attrCond) {
        message = message + "this text's attribute set is different from that of the detected labels;";
    }

    if (levelCond) {
        message = message + "this text's hierarchy level within the SVG is different from that of the detected labels; ";
    }

    if (axisCond) {
        message = message + "this text is not close to the detected labels.";
    }

    if (message != "Warnings: ") {
        btnCheck[thisText['id']] = message;
    } else {
        if (thisText['id'] in btnCheck)
            delete btnCheck[thisText['id']]
    }
}

function addAxisLabel(TargetID, text) {
    let axis = TargetID.startsWith("xLabels") ? xAxis : yAxis, otherAxis = TargetID.startsWith("xLabels") ? yAxis : xAxis;
    let accessor = TargetID.split("Labels")[1];
    if (otherAxis['labels'].indexOf(text) >= 0) {
        otherAxis['labels'].splice(otherAxis['labels'].indexOf(text), 1);
    } 
    if (otherAxis["upperLevels"]) {
        for (let level of otherAxis.upperLevels) {
            if (level.indexOf(text) >= 0) {
                level.splice(level.indexOf(text), 1);
            } 
        }
    }
    if (accessor) {
        let level = axis['upperLevels'][parseInt(accessor) - 1];
        if (level.indexOf(text) < 0)
            level.push(text);
    } else {
        if (axis['labels'].indexOf(text) < 0)
            axis['labels'].push(text);
    }
    if (mainContent.texts.indexOf(text) >= 0)
        mainContent.texts.splice(mainContent.texts.indexOf(text), 1);
}

function addLegendLabel(text) {
    if (legend['labels'].indexOf(text) < 0)
        legend['labels'].push(text);
    if (mainContent.texts.indexOf(text) >= 0)
        mainContent.texts.splice(mainContent.texts.indexOf(text), 1);
}

function moveAxisLabel(fromID, toID, text) {
    let from = fromID.startsWith("xLabels") ? xAxis : yAxis, to = toID.startsWith("xLabels") ? xAxis : yAxis;
    if (from['labels'].indexOf(text) >= 0) {
        from['labels'].splice(from['labels'].indexOf(text), 1);
    } else if (from.upperLevels) {
        for (let level of from.upperLevels) {
            if (level.indexOf(text) >= 0)
                level.splice(level.indexOf(text), 1);
        }
    }
    let accessor = toID.split("Labels")[1];
    if (accessor) {
        let level = to['upperLevels'][parseInt(accessor) - 1];
        if (level.indexOf(text) < 0)
            level.push(text);
    } else if (to['labels'].indexOf(text) < 0)
        to['labels'].push(text);
}

function removeAxisLabel(fromID, text) {
    let axis = fromID.startsWith("xLabels") ? xAxis : yAxis;
    if (axis['labels'].indexOf(text) >= 0) {
        axis['labels'].splice(axis['labels'].indexOf(text), 1);
    } else if (axis.upperLevels) {
        for (let level of axis.upperLevels) {
            if (level.indexOf(text) >= 0)
                level.splice(level.indexOf(text), 1);
        }
    }
    mainContent.texts.push(text);
}

function removeLegendLabel(text) {
    if (legend['labels'].indexOf(text) >= 0) {
        legend['labels'].splice(legend['labels'].indexOf(text), 1);
    }
    mainContent.texts.push(text);
}

/**
 * bug: waterfall_04
 */
function enableDragDrop(texts) {
    let svg = d3.select("#rbox1");
    let dragHandler = d3.drag()
        .on("start", function (event) {
            if (areaSelection) return;
            let current = d3.select(this);
            let thisText = texts.filter(t => t['id']==current.attr("id"))[0];
            d3.select("body").append("div")
                .attr("class", "div4text")
                .attr("style", "display: block; position:absolute; top: " + (event.sourceEvent.pageY-12.5) +"px; left: " + (event.sourceEvent.pageX-50) +"px; height: " + 25 + "px; width: " + 100 + "px")
                .html(thisText['content']);                
        })
        .on("drag", function (event) {
            if (areaSelection) return;
            let current = d3.select(this);
            let thisText = texts.filter(t => t['id']==current.attr("id"))[0];
            d3.select(".div4text")
                .attr("style", "display: block; position:absolute; top: " + (event.sourceEvent.pageY-12.5) +"px; left: " + (event.sourceEvent.pageX-50) +"px; height: " + 25 + "px; width: " + 100 + "px");
        })
        .on("end", function (event) {
            if (areaSelection) return;
            let current = d3.select(this);
            let TargetID;
            let thisText = texts.filter(t => t['id']==current.attr("id"))[0];
            d3.select(".div4text").remove();
            let elements = document.elementsFromPoint(event.sourceEvent.pageX, event.sourceEvent.pageY);
            for (let e of elements) {
                if (e.tagName !== "DIV") continue;
                if (e.id == "legendLabels") {
                    undoStack.push({xAxis: duplicate(xAxis), yAxis: duplicate(yAxis), legend: duplicate(legend), btnCheck: Object.assign({}, btnCheck)});
                    addLegendLabel(thisText);
                    displayLegend(legend);
                } else if (e.id.startsWith("xLabels") || e.id.startsWith("yLabels")) {
                    TargetID = e.id;
                    undoStack.push({xAxis: duplicate(xAxis), yAxis: duplicate(yAxis), legend: duplicate(legend), btnCheck: Object.assign({}, btnCheck)});
                    addAxisLabel(TargetID, thisText);
                    displayAxis(xAxis);
                    displayAxis(yAxis);
                    if (TargetID.startsWith("xLabels") ? ( !('baseline' in xAxis) || Math.abs(xAxis['baseline'] - thisText.y)<=30) : (!('baseline' in yAxis) || Math.abs(yAxis['baseline'] - thisText.x)<=30)) {
                        let thisOri = TargetID.startsWith("xLabels") ? "y" : "x";
                        let thisHtml = "Add the other texts sharing the same " + thisOri + " coordinate as axis labels?";
                        d3.select("body").append("div")	
                            .attr("class", "tooltip2")
                            .style("border", "#ccc 1px solid").style("padding", "20px")
                            .html(thisHtml)	
                            .style("left", (event.sourceEvent.pageX) + "px")		
                            .style("top", (event.sourceEvent.pageY - 60) + "px");
                        d3.select(".tooltip2").append("button")
                            .attr("type","button")
                            .attr("id","yes")
                            .style("fill","white").style("margin-top", "10px")
                            .style("width", "100px")
                            .html("yes")
                            .on('click', function(e) { 
                                let toAdd = texts.filter(d => d[thisOri] == thisText[thisOri] && d.id != thisText.id);
                                if (toAdd.length > 0) {
                                    undoStack.push({xAxis: duplicate(xAxis), yAxis: duplicate(yAxis), legend: duplicate(legend), btnCheck: Object.assign({}, btnCheck)});
                                    for (let t of toAdd) {
                                        addAxisLabel(TargetID, t);
                                    }
                                    displayAxis(xAxis);
                                    displayAxis(yAxis);
                                }
                                d3.selectAll(".tooltip2").remove();
                            });;
                        d3.select(".tooltip2").append("button")
                            .attr("type","button")
                            .attr("id","no")
                            .style("fill","white").style("margin-top", "10px")
                            .style("width", "100px")
                            .html("no")
                            .on('click', function(e) { 
                                d3.selectAll(".tooltip2").remove();
                            });
                    }

                    // buttonCheck(TargetID, thisText);
                    break
                }
            }
        });
    
    dragHandler(svg.selectAll("text"));

    svg.selectAll("text").style("pointer-events", "auto").style("cursor", "pointer")
        .on("mouseover", function() {
            thisText = d3.select(this);
            thisText
                .style("fill", "#ff0000")
                .style("font-weight", "bold")
        })
        .on("mouseout", function() {
            thisText = d3.select(this);
            let thisT = texts.filter(t => t['id']==thisText.attr("id"))[0];
            thisText
                .style("fill", thisT ? thisT['fill'] : texts[0]['fill'])
                .style("font-weight", thisT ? thisT['font-weight'] : texts[0]['font-weight']);
        });
}

function duplicate(axis) {
    let copy = {};
    for (let k in axis) {
        if (Array.isArray(axis[k]))
            copy[k] = axis[k].map(d => d);
        else
            copy[k] = axis[k];
    }
    return copy;
}