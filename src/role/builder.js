var waitFlag = require("pathing.waitFlag");

var builder = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if (creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            targets = _.find(FIND_CONSTRUCTION_SITES, {
                filter: (site) => {
                    return (site.structureType === STRUCTURE_TOWER ||
                            site.structureType === STRUCTURE_SPAWN ||
                            site.structureType === STRUCTURE_EXTENSION)
                }
            });
        }
        if (targets.length) {
            if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            var flag = Game.flags.Flag1;
            creep.moveTo(flag.pos.x, flag.pos.y, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    } else {
        var target = waitFlag.sourcePath(creep, Game.flags["Flag1"]);
        if(target !== Game.flags['Flag1']
)
{
    if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
    }
}
else
{
    creep.moveTo(target.pos, {visualizePathStyle: {stroke: '#ffffff'}});
}
}
}
}
;

module.exports = builder;