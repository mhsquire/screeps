var roleHarvester = require('src/role/harvester');
var roleUpgrader = require('src/role/upgrader');
var roleBuilder = require('src/role/builder');
var rolefixer = require('src/role/fixer');


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
    totalHits = 0;
    totalHealh = 0;

        for (i = 0; i < Game.structures.length; i++) {
            totalHits = totalHits + Game.structures[i].hits;
            totalHealh = totalHealh + Game.structures[i].hitsMax;
        }
        if (totalHits != 0) {
            var repairRatio = totalHealth / totalHits;
        } else {
            // All build cause things are destroyed?
            var repairRatio = 0;
        }
        return repairRatio;

}

function calcRepairStrength() {
    var maxRepairCreeps = 3;
    var repairRatio = calcRepairRatio();
    var repairMult = 0.8;
    var repairCreeps = Math.floor(repairMult * repairRatio );
    if ( repairCreeps > maxRepairCreeps) {
        repairCreeps = 3;
    }
    return repairCreeps;
}

function calcBuildStrength() {
    var constructCreeps = 3
    return Math.floor(constructCreeps - calcRepairStrength());
}

function spawnMe() {
    var roles = ["harvester", "upgrader", "builder", "fixer"];
    for(i=0; i<roles.length; i++) {
        var creeps = _.filter(Game.creeps, (creep) => creep.memory.role === roles[i]);
        if (Memory.lastSpawn !== roles[i]) {
            if (roles[i].toLowerCase() === "harvester") {
                if (creeps.length < 3) {
                    return roles[i];
                }
            }
            if(roles[i].toLowerCase() === "upgrader") {
                if (creeps.length < 2) {
                    return roles[i];
                }
            }
            if (roles[i].toLowerCase() === "builder") {
                if(Game.structures.length > 0) {
                    var buildNum = calcBuildStrength();
                } else {
                    var buildNum = 1;
                }
                if (creeps.length < buildNum) {
                    return roles[i];
                }
            }
            if (roles[i].toLowerCase() === "fixer") {
                if(Game.structures.length > 0) {
                    if (creeps.length < calcRepairStrength()) {
                        return roles[i];
                    }
                }
            }
        }
    }
    // Nothing to spawn
    return false;
}

module.exports.loop = function () {

    // clear memory  of dead creeps
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    Memory.lastSpawn = 'fixer'
    var nextRole = spawnMe();
    if(nextRole) {
        let newName = nextRole + Game.time;
        console.log("Spawning new " + nextRole + ": " + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: nextRole}});
        Memory.lastSpawn = nextRole;
    }

    //Visual for what is spawning
    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'fixer') {
            rolefixer.run(creep);
        }
    }
}
