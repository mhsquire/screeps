function blocked(creep, target) {
    let range = 1;
    let top = target.y - range;
    let left = target.x - range;
    let bottom = target.y + range;
    let right = target.x + range;
    let area = creep.room.lookAtArea(top, left, bottom, right);
    // console.log(target.x + " " + target.y)
    let blocked = true;
    for (let row = top; row <= bottom; row++) {
        // console.log("row = " + Object.values(area[row]));
        for (let col = left; col <= right; col++) {
            // console.log("col " + Object.values(area[row][col]));
            for (let list = 0; list < area[row][col].length; list++) {
                let currItem = area[row][col][list];
                if (area[row][col][list + 1]) var nextItem = area[row][col][list + 1];
                // console.log("list " + Object.values(area[row][col][list]));
                if (currItem["type"] === "terrain") {
                    if (currItem["terrain"] === "wall") {
                        // console.log(creep + " " + col + " " + row + " wall");
                        break;
                    }
                    if (currItem["terrain"] === "plain" || currItem["terrain"] === "swamp") {
                        if (nextItem) {
                            if (nextItem["type"] === "creep" && nextItem["creep"] !== creep) {
                                // console.log(creep + " " + col + " " + row + " creep");
                                break;
                            } else if (nextItem["type"] === "source") {
                                // console.log(creep + " " + col + " " + row + " source");
                                break; // item blocks pos
                            } else if (nextItem["type"] === "structure" && nextItem["structure"]["structureType"] !== STRUCTURE_ROAD) {
                                // console.log(creep + " " + col + " " + row + " structure " + nextItem["structure"] );
                                break;
                            } else {
                                // console.log(creep + " " + col + " " + row + " should be free");
                                blocked = false;
                                break;
                            }
                        }
                    }
                } else if (currItem["type"] === "creep" && currItem["creep"] !== creep) {
                    // console.log(creep + " " + col + " " + row + " creep 1");
                    break;
                } else if (currItem["type"] === "source") {
                    // console.log(creep + " " + col + " " + row + " source 1");
                    break; // item blocks pos
                } else if (currItem["type"] === "structure" && currItem["structure"]["structureType"] !== "road") {
                    // console.log(creep + " " + col + " " + row + " structure 1 " + currItem["Structure"]);
                    break;
                } else {
                    // console.log(creep + " " + col + " " + row + " should be free 1");
                    blocked = false;
                    break;
                }
            }
        }
    }
    return blocked;
}

const sourcepath = {
    path: function (creep, flag) {
        var sources = _.sortBy(creep.room.find(FIND_SOURCES), s => creep.pos.getRangeTo(s));
        let target = undefined;
        for (let i = 0; i < sources.length; i++) {
            if (!blocked(creep, sources[i].pos)) {
               target = sources[i];
               break;
            }
            if (i + 1 === sources.length) {
                target = flag;
            }
        }
        return target;
    }
};

module.exports = sourcepath;
