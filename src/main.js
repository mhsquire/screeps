var bodyBuilder = require("spawn.bodybuilder")
var spawnRole = require("spawn.rolesorter");
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var rolefixer = require('role.fixer');


module.exports.loop = function () {

    // clear memory  of dead creeps
    console.log("***********start***********")
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var nextRole = spawnRole.spawnRole();
    var energy = Game.spawns.Spawn1.room.energyCapacityAvailable;
    if (nextRole) {
        let newName = nextRole + Game.time;
        console.log("Spawning new " + nextRole + ": " + newName);
        Game.spawns['Spawn1'].spawnCreep(bodyBuilder.body(energy), newName,
            {memory: {role: nextRole}});
        Memory.lastSpawn = nextRole;
    }

    //Visual for what is spawning
    if (Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'fixer') {
            rolefixer.run(creep);
        }
    }
}
