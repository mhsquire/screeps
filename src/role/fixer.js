var fixer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
            creep.memory.repairing = true;
            creep.say('🚧 build');
        }

        if(creep.memory.repairing) {
            var targets = creep.room.find(FIND_STRUCTURES);
            var targets = _.sortBy(targets, t => t.hits - t.hitsMax);
            var targets = _.sortBy(targets, t => creep.pos.getRangeTo(t));
            if(targets.length) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else {
            var sources = creep.room.find(FIND_SOURCES);
            var sources = _.sortBy(sources, s => creep.pos.getRangeTo(s));
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            } else {
                var flag = Game.flags.Flag1;
                creep.moveTo(flag.pos.x, flag.pos.y,{visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = fixer;