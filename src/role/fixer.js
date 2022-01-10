var sourcePath = require("pathing.sourcepath");

var fixer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let flag = Room.flags["Flag1"];
        if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
            creep.memory.repairing = true;
            creep.say('🚧 build');
        }

        if(creep.memory.repairing) {
            let targets = creep.room.find(FIND_STRUCTURES);
            targets = _.sortBy(targets, t => t.hits - t.hitsMax);
            targets = _.sortBy(targets, t => creep.pos.getRangeTo(t));
            if(targets.length > 0) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                creep.moveTo(flag, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            let target = sourcePath.path(creep, flag);
            if(target !== flag) {
                if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                creep.moveTo(flag,{visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = fixer;