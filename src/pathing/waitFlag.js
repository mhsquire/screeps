function blocked(creep, target) {
    let range = 1;
    let top = target.y - range;
    let left = target.x - range;
    let bottom = target.y + range;
    let right = target.x + range;
    let area = creep.room.lookAtArea(top, left, bottom, right);
    // console.log(target.x + " " + target.y)
    let blocked = true;
    for (var row = top; row <= bottom; row++) {
        // console.log("row = " + Object.values(area[row]));
        for (var col = left; col <= right; col++) {
            // console.log("col " + Object.values(area[row][col]));
            for (var list = 0; list < area[row][col].length; list++) {
                var currItem = area[row][col][list];
                if (area[row][col][list + 1]) var nextItem = area[row][col][list + 1];
                // console.log("list " + Object.values(area[row][col][list]));
                if (currItem["type"] === "terrain") {
                    if (currItem["terrain"] === "wall") break; // item blocks pos
                    if (currItem["terrain"] === "plain" || currItem["terrain"] === "swamp") {
                        if (nextItem) {
                            if (nextItem["type"] === "creep" && nextItem["creep"] !== creep) {
                                break;
                            } else if (nextItem["type"] === "source") {
                                break; // item blocks pos
                            } else if (nextItem["type"] === "structure") {
                                break;
                            } else {
                                blocked = false;
                            }
                        }
                    }
                } else if (currItem["type"] === "creep" && currItem["creep"] !== creep) {
                    break;
                } else if (currItem["type"] === "source") {
                    break; // item blocks pos
                } else if (currItem["type"] === "structure") {
                    break;
                } else {
                    blocked = false;
                }
            }
        }
    }
    return blocked;
}

const waitFlag = {
    sourcePath: function (creep, flag) {
        var sources = _.sortBy(creep.room.find(FIND_SOURCES), s => creep.pos.getRangeTo(s));
        var target = sources[0];
        if (blocked(creep, sources[0].pos)) {
            target = flag;
        }
        return target;
    }
};

module.exports = waitFlag;
