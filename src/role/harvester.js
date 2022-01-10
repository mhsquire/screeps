var sourcePath = require("pathing.sourcepath");

var harvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let flag = Game.flags["Flag1"];
        if(creep.store.getFreeCapacity() > 0) {
            let target = sourcePath.path(creep, flag);
            if(target !== flag) {
                if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                creep.moveTo(flag,{visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            let targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION ||
                            structure.structureType === STRUCTURE_SPAWN ||
                            structure.structureType === STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {

                creep.moveTo(flag.pos,{visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
	}
}

module.exports = harvester;
