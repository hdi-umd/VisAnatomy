function displaySVG(text, chartName) {
    // text = IDadder(text);
    // let svgInfo = text.substring(0, text.indexOf('>')+1);
    // if (svgInfo.indexOf('width') == -1) {
    //     text = text.substring(0, text.indexOf('>')) + " width=\"50%\"" + text.substring(text.indexOf('>'))
    // }
    // if (svgInfo.indexOf('height') == -1) {
    //     text = text.substring(0, text.indexOf('>')) + " height=\"100%\"" + text.substring(text.indexOf('>'))
    // }
    // if (svgInfo.indexOf('viewBox') > -1) {
    //     text = text.substring(0, text.indexOf('viewBox')) + "viewBox_old" + text.substring(text.indexOf('viewBox')+7)
    // }
    // if (svgInfo.indexOf('preserveAspectRatio') > -1) {
    //     text = text.substring(0, text.indexOf('preserveAspectRatio')) + "preserveAspectRatio_old" + text.substring(text.indexOf('preserveAspectRatio')+19)
    // }
    // text = text.substring(0, text.indexOf('>')) + " viewBox=\"-50 -50 1000 750\" preserveAspectRatio=\"xMinYMid\"" + text.substring(text.indexOf('>'))
    // if (text.indexOf("<a") > 0) {
    //     text = text.substring(0, text.indexOf('<a')) + text.substring(text.indexOf('</a>')+4)
    // }

    document.getElementById('rbox1').innerHTML = text;
    let vis = d3.select("#rbox1").select("svg").attr("id", "vis");

    let indices = {};

    function addClassAndIdToLeaves(element) {
        // set ID
        if (element.nodeType === Node.ELEMENT_NODE && element.nodeName!== "svg") {
            if (!Object.keys(indices).includes(element.nodeName)) {indices[element.nodeName] = 0;}
            element.setAttribute("id", element.nodeName + indices[element.nodeName]++);
        }

        if (element.hasChildNodes()) {
            element.childNodes.forEach(childNode => {
                addClassAndIdToLeaves(childNode);
            });
        } else {
            // set class
            if (["rect", "circle", "text", "line", "polyline", "path", "image"].includes(element.nodeName)) {
                if (element.hasAttribute('class')) {
                    const existingClasses = element.getAttribute('class').split(' ');
                    if (!existingClasses.includes('mark')) {
                    element.setAttribute('class', `${element.getAttribute('class')} mark`);
                    }
                } else {
                    element.setAttribute('class', 'mark');
                }
                element.addEventListener('contextmenu', (event) => {
                    event.preventDefault();
                    console.log('Right-clicked on leaf node with class "mark"');
                    // Your code to handle the right-click event goes here
                });
            }
        }
      }
      
    const svgElement = document.querySelector('#vis');
    addClassAndIdToLeaves(svgElement);

    vis.style("height", "100%").style("width", "100%");
}

function displayAxis(axis) {
    d3.select("#" + axis.type + "Labels").selectAll("button").remove();
    if (axis.upperLevels) {
        for (let [i, level] of axis.upperLevels.entries()) {
            d3.select("#" + axis.type + "Labels" + (i+1)).selectAll("button").remove();
        }
    }

    let labels = axis['labels'];
    let type;
    if (labels.length === 0) {
        type = "Null";
    } else {
        type = typeByAtlas(_inferType(labels.map(xl => xl.content)));
    }
    if (axis.fieldType) {
        type = axis.fieldType;
    }
    d3.select("#" + axis.type + "FieldType").property("value", type);

    labels = labels.sort((a, b) => (parseFloat(a.id.substring(4)) > parseFloat(b.id.substring(4))) ? 1 : -1)

    for (let label of labels) {
        displayAxisLabel(label, axis.type+"Labels");
    }
    if (axis.upperLevels) {
        for (let [i, level] of axis.upperLevels.entries()) {
            for (let label of level) {
                displayAxisLabel(label, axis.type+"Labels"+(i+1));
            }
        }
    }
}

function displayAxisLabel(label, divID) {
    let btn = d3.select("#"+divID).append("button")
            .datum(label)
            .attr("type", "button")
            .attr("class", "labelButton")
            .attr("id", "IDinSVG"+label['id'])
            .attr("draggable", true)
            .text(label['content'])
            .on('dragstart', drag)
            ;
    if (label['id'] in btnCheck) {
        let message = btnCheck[label['id']];
        btn.attr("style", "background-color: #FC6F51")
            .on("mouseover", function(event) {
                d3.select("body").append("div")	
                    .attr("class", "tooltip")
                    .style("opacity", .75)		
                    .html(message.substring(0, message.length-1) + '.')	
                    .style("left", (event.pageX) + "px")		
                    .style("top", (event.pageY - 28) + "px");	
                })					
            .on("mouseout", function() {		
                d3.select(".tooltip").remove();
            });
    }
}   

function displayLegend(legend) {
    d3.select("#legendLabels").selectAll("button").remove();

    let labels = legend['labels'];
    let type;
    if (labels.length === 0) {
        type = "Null";
    } else {
        type = typeByAtlas(_inferType(labels.map(xl => xl.content)));
    }
    d3.select("#legendFieldType").property("value", type);

    labels = labels.sort((a, b) => (parseFloat(a.id.substring(4)) > parseFloat(b.id.substring(4))) ? 1 : -1)

    for (let label of labels) {
        let btn = d3.select("#legendLabels").append("button")
            .datum(label)
            .attr("type", "button")
            .attr("class", "labelButton")
            .attr("id", "IDinSVG"+label['id'])
            .attr("draggable", true) //
            .style("background-color", function(d, i){
                if (legend.type == "continuous") {
                    let rgbC;
                    if (legend.colors) if (legend.colors.length > 0) rgbC = legend.colors[labels.indexOf(label)];
                    return !legend.colors? "#f2f2f2" : legend.colors.length == 0 ? "#f2f2f2" : ConvertRGBtoHex(rgbC[0], rgbC[1], rgbC[2]);
                } else {
                    return legend.mapping[d.content];
                }
            })
            .text(label['content'])
            .on('dragstart', drag)
            ;
        if (label['id'] in btnCheck) {
            let message = btnCheck[label['id']];
            btn.attr("style", "background-color: #FC6F51")
                .on("mouseover", function(event) {
                    d3.select("body").append("div")	
                        .attr("class", "tooltip")
                        .style("opacity", .75)		
                        .html(message.substring(0, message.length-1) + '.')	
                        .style("left", (event.pageX) + "px")		
                        .style("top", (event.pageY) + "px");	
                    })					
                .on("mouseout", function() {		
                    d3.select(".tooltip").remove();
                });
        }
    }
}

function displayTitleXLabel(text)
{
    let title = text;
    let btn = d3.select("#xTitle").append("button")
            //.datum(text)
            .attr("type", "button")
            .attr("class", "titlebutton")
            .attr("style", "position: absolute; top: 1px; left: 200px")
            .attr("style", "width: 100%")
            .attr("id", 'xTitleID')
            //.attr("style", "width: 100px; height: 15px;")

            //.attr("id", "IDinSVGtext1")
            .attr("draggable", true)
            .text(text['content'])
            .on('dragstart', drag)
            ; 
            
    btn.attr("style", "background-color: #f2f2f2")
                .on("mouseover", function(event) {
                    d3.select("body").append("div")	
                        .attr("class", "tooltip")
                        .style("opacity", .75)		
                        .style("width", "100%")
                        .style("left", (event.pageX) + "px")		
                        .style("top", (event.pageY - 28) + "px");

                        
                    })					
                .on("mouseout", function() {		
                    d3.select(".tooltip").remove();
                });
    btn.attr("style", "width: 100%");
}

function displayTitleYLabel(text)
{
    let title = text;
    let btn = d3.select("#yTitle").append("button")
            //.datum(text)
            .attr("type", "button")
            .attr("class", "titlebutton")
            .attr("style", "position: absolute; top: 1px; left: 200px")
            .attr("id", 'yTitleID')
            //.attr("style", "width: 100px; height: 15px;")

            //.attr("id", "IDinSVGtext1")
            .attr("draggable", true)
            .text(text['content'])
            .on('dragstart', drag)
            ; 
            
    btn.attr("style", "background-color: #f2f2f2")
                .on("mouseover", function(event) {
                    d3.select("body").append("div")	
                        .attr("class", "tooltip")
                        .style("opacity", .75)		
                        .style("left", (event.pageX) + "px")		
                        .style("top", (event.pageY - 28) + "px");	
                    })					
                .on("mouseout", function() {		
                    d3.select(".tooltip").remove();
                });
}

/**
 * Unhandled:
 * horizontalbar_highchart (rect3, rect4), stacked_highchart (rect8, rect13), highcharts_grouped_3
 */
function setViewBox(texts, lines, rects) {
    let vb = getViewBox(texts, lines, rects);
    let margin = 15, vbString = [vb.left - margin, vb.top - margin, vb.right - vb.left + margin * 2, vb.bottom - vb.top + margin * 2].join(",");
    d3.select("#vis").attr("viewBox", vbString);
    //d3.select("#overlay").attr("viewBox", vbString);
    if (legend.type === "continuous") {
        let legendBar = legend.marks[0];
        let pos = document.getElementById(legendBar.id).getBoundingClientRect();
        let rbox1Pos = document.getElementById("rbox1").getBoundingClientRect();
        // console.log(rbox1Pos);
        html2canvas(document.getElementById("rbox1"), {width: rbox1Pos.width, height: rbox1Pos.height}).then(function(canvas) {
            canvas.style.position = "absolute";
            canvas.style.left = rbox1Pos.x + "px";
            canvas.style.top = rbox1Pos.y + "px";
            canvas.style.opacity = 1;
            document.body.appendChild(canvas);

            var ctx = canvas.getContext('2d');
            ctx.strokeStyle = "#FF0000";
            ctx.fillStyle = 'green';
            ctx.lineWidth = 1;
            ctx.beginPath();
            // ctx.rect(pos.left, pos.top, pos.width, pos.height);
            ctx.stroke();

            // console.log("Position of the legend bar from getBoundingClientRect() ", pos.left, pos.top, pos.width, pos.height)
            const hiddenX = (thisPos) => {return thisPos.left - (rbox1Pos.x - ((thisPos.left - rbox1Pos.x) * parseFloat(canvas.width) / parseFloat(canvas.style.width) - (thisPos.left - rbox1Pos.x)))};
            const hiddenY = (thisPos) => {return thisPos.top - (rbox1Pos.y - ((thisPos.top - rbox1Pos.y) * parseFloat(canvas.height) / parseFloat(canvas.style.height) - (thisPos.top - rbox1Pos.y)))};
            const hiddenW = (thisPos) => {return thisPos.width * parseFloat(canvas.width) / parseFloat(canvas.style.width)};
            const hiddenH = (thisPos) => {return thisPos.height * parseFloat(canvas.height) / parseFloat(canvas.style.height)};
            let hiddenLeft = hiddenX(pos); //pos.left - (281 - ((pos.left - 281) * parseFloat(canvas.width) / parseFloat(canvas.style.width) - (pos.left - 281)));
            let hiddenTop = hiddenY(pos); //pos.top - (281 - ((pos.top - 281) * parseFloat(canvas.height) / parseFloat(canvas.style.height) - (pos.top - 281)));
            let hiddenWidth = hiddenW(pos);
            let hiddenHeight = hiddenH(pos);
            // console.log("Hidden position of the legend bar: ", hiddenLeft, hiddenTop, hiddenWidth, hiddenHeight)

            let colors = [];
            let tickPos = legend.ticks.map(tick => document.getElementById(tick.id).getBoundingClientRect());
            let labelPos = legend.labels.map(label => document.getElementById(label.id).getBoundingClientRect())
            switch (legend.orientation){
                case "horz":
                    if (labelPos.length > 0) {
                        for (let aLabel of labelPos) {
                            let ratio = (aLabel.left - pos.left) / pos.width;
                            ratio = ratio < 0 ? 0 : 1-ratio<0.01 || ratio>=1 ? 1 : ratio;
                            let p = ratio < 1 ? ctx.getImageData(hiddenLeft + hiddenWidth * ratio + 3, hiddenTop + hiddenHeight / 2, 1, 1).data : ctx.getImageData(hiddenLeft + hiddenWidth - 3, hiddenTop + hiddenHeight / 2, 1, 1).data;
                            colors.push([p[0], p[1], p[2]]);
                        }
                    } else if (tickPos.length > 0) {
                        for (let aTick of tickPos) {
                            let ratio = (aTick.left - pos.left) / pos.width;
                            ratio = ratio < 0 ? 0 : 1-ratio<0.01 || ratio>=1 ? 1 : ratio;
                            let p = ratio < 1 ? ctx.getImageData(hiddenLeft + hiddenWidth * ratio + 3, hiddenTop + hiddenHeight / 2, 1, 1).data : ctx.getImageData(hiddenLeft + hiddenWidth - 3, hiddenTop + hiddenHeight / 2, 1, 1).data;
                            colors.push([p[0], p[1], p[2]]);
                        }
                    } else {}
                    break;
                case "vert":
                    if (labelPos.length > 0) {
                        for (let aLabel of labelPos) {
                            let ratio = (aLabel.top - pos.top) / pos.height;
                            ratio = ratio < 0 ? 0 : 1-ratio<0.01 || ratio>=1 ? 1 : ratio;
                            let p = ratio < 1 ? ctx.getImageData(hiddenLeft + hiddenWidth / 2, hiddenTop + hiddenHeight * ratio + 3, 1, 1).data : ctx.getImageData(hiddenLeft + hiddenWidth / 2, hiddenTop + hiddenHeight - 3, 1, 1).data;
                            colors.push([p[0], p[1], p[2], p[3]]);
                        }
                    } if (tickPos.length > 0) {
                        for (let aTick of tickPos) {
                            let ratio = (aTick.top - pos.top) / pos.height;
                            ratio = ratio < 0 ? 0 : 1-ratio<0.01 || ratio>=1 ? 1 : ratio;
                            let p = ratio < 1 ? ctx.getImageData(hiddenLeft + hiddenWidth / 2, hiddenTop + hiddenHeight * ratio + 3, 1, 1).data : ctx.getImageData(hiddenLeft + hiddenWidth / 2, hiddenTop + hiddenHeight - 3, 1, 1).data;
                            colors.push([p[0], p[1], p[2]]);
                        }
                    } else {}
                    break;
            }
            legend.colors = colors; //colors.map(rgbC => ConvertRGBtoHex(rgbC[0], rgbC[1], rgbC[2]));
            displayLegend(legend);
            d3.select("canvas").remove();
        });
    }
}

function getViewBox(texts, lines, rects) {
    // let rects = jsonArr["rects"];
    texts = textProcessor(texts);
    //let lines = jsonArr["lines"];
    let allNodes = rects.concat(texts).concat(lines);
    let bbox = getBoundingBox(allNodes[0]);
    // console.log(allNodes[0], bbox.bottom);
    for (let i = 1; i < allNodes.length; i++) {
        let bbox2 = getBoundingBox(allNodes[i]);
        bbox.left = isNaN(bbox2.left) ? bbox.left : Math.min(bbox.left, bbox2.left);
        bbox.right = isNaN(bbox2.right) ? bbox.right : Math.max(bbox.right, bbox2.right);
        bbox.top = isNaN(bbox2.top) ? bbox.top : Math.min(bbox.top, bbox2.top);
        bbox.bottom = isNaN(bbox2.bottom) ? bbox.bottom : Math.max(bbox.bottom, bbox2.bottom);
    }
    return bbox;
}

function getBoundingBox(node) {
    switch(node.tag) {
        case 'rect':
            return {left: node.x, top: node.y, right: node.right, bottom: node.bottom};
        case 'text':
            return {left: "left" in node ? node.left : node.x, top: node.y, right: "left" in node ? node.left + node.width : node.x + node.width, bottom: node.y + node.height};
        case 'line':
            return {left: Math.min(node.x1, node.x2), right: Math.max(node.x1, node.x2), top: Math.min(node.y1, node.y2), bottom: Math.max(node.y1, node.y2)};
        case 'circle':
            return {left: node.x-node.radius, top: node.y-node.radius, right: node.x+node.radius, bottom: node.y+node.radius}
    }
}

