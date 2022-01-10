
function findRole(role) {
    switch (role.toLowerCase()) {
        case 0:
            return "harvester";
        case 1:
            return "upgrader";
        case 2:
            return "builder";
        case 3:
            return "fixer";

    }
}

function calcRepairRatio() {
    var totalHits = 0;
    var totalHealth = 0;
    Object.keys(Game.structures).forEach(function (key) {
        var structure = Game.structures[key];
        if(structure['hits'] > 0) {
            totalHits = totalHits + structure['hits'];
        }
        if(structure['hitsMax'] > 0) {
            totalHealth = totalHealth + structure['hitsMax'];
        }
    })
    if (totalHits !== 0) {
        var repairRatio = totalHealth / totalHits;
    } else {
        // All built cause things are destroyed?
        var repairRatio = 0;
    }
    return repairRatio;

}

function calcRepairStrength() {
    var maxRepairCreeps = 3;
    var repairRatio = calcRepairRatio();
    var repairMult = 0.8;
    var repairCreeps = Math.floor(repairMult * repairRatio);
    if (repairCreeps > maxRepairCreeps) {
        repairCreeps = 3;
    }
    return repairCreeps;
}

function calcBuildStrength() {
    var constructCreeps = 3;
    var repairCreeps = calcRepairStrength();
    return Math.floor(constructCreeps - repairCreeps);
}

var spawnRole = {

    spawnRole: function () {
        var roles = ["harvester", "upgrader", "builder", "fixer"];
        for (var i = 0; i < roles.length; i++) {
            var creeps = _.filter(Game.creeps, (creep) => creep.memory.role === roles[i]);
            if (roles[i].toLowerCase() === "harvester") {
                if (creeps.length < 3) {
                    return roles[i];
                }
            }
            if (roles[i].toLowerCase() === "upgrader") {
                if (creeps.length < 2) {
                    return roles[i];
                }
            }
            if (roles[i].toLowerCase() === "builder") {
                if (Object.keys(Game.constructionSites).length > 0) {
                    var builders = calcBuildStrength();
                    var buildNum = builders;
                } else {
                    var buildNum = 1;
                }
                if (creeps.length < buildNum) {
                    return roles[i];
                }
            }
            if (roles[i].toLowerCase() === "fixer") {
                if (Game.structures.length > 0) {
                    if (creeps.length < calcRepairStrength()) {
                        return roles[i];
                    }
                }
            }
        }
        // Nothing to spawn
        return false;
    }
}

module.exports = spawnRole;
