import fs from 'fs';
import path from 'path';

const dir = "./restructured_annotations",
    files = fs.readdirSync(dir);
const filteredFiles = files.filter(file => path.extname(file).toLowerCase() === ".json");

for (let f of filteredFiles) {
    console.log(f);
    const file = fs.readFileSync("./restructured_annotations/" + f, "utf8");
    const json = JSON.parse(file);

    //chart title
    if ("chartTitle" in json) {
        json["chartTitle"] = json["chartTitle"].filter(d => d).map(d => d.id);
    }

    //change 'referenceElement' to 'referenceElements'
    json["referenceElements"] = json["referenceElement"]
    delete json["referenceElement"]

    //axis: change 'fieldType' to 'attrType', change 'type' to 'channel'
    if ("axes" in json["referenceElements"]) {
        for (let k in json["referenceElements"]["axes"]) {
            let axis = json["referenceElements"]["axes"][k];
            axis["attrType"] = axis["fieldType"];
            delete axis["fieldType"];
            axis["channel"] = axis["type"];
            delete axis["type"];

            //remove dup info on axis labels in referenceElements
            if ("labels" in axis) {
                axis["labels"] = axis["labels"].map(d => d.id);
            }

            if ("title" in axis) {
                axis["title"] = axis["title"].map(d => d.id);
            }
        }
        json["referenceElements"]["axes"] = Object.values(json["referenceElements"]["axes"]);
    }

    //delete 'groupInfo' and 'nestedGrouping'
    delete json["groupInfo"]
    delete json["layoutInfo"]
    delete json["nestedGrouping"]

    //merge markInfo with allElements
    for (let m in json["markInfo"]) {
        let mi = json["markInfo"][m];
        let elem = json["allElements"][m];
        if (elem) {
            elem.type = mi.Type;
            elem.role = mi.Role;
        } else {
            console.log(m, " not in all elements");
        }
    }
    delete json["markInfo"];

    let g = json["grouping"];
    json["grouping"] = [getObject(g)];

    // console.log(JSON.stringify(json, null, 2));
    // console.log(Object.keys(json))

    fs.writeFileSync("./final_annotations/" + f, JSON.stringify(json), "utf8");
}

function getObject(g) {
    if (typeof g === "string")
        return g;
    else {
        let obj = Object.values(g)[0];
        obj.id = Object.keys(g)[0];
        obj.children = obj.children.map(d => getObject(d));
        return obj;
    }
    
}

//const chart = process.argv[2];
