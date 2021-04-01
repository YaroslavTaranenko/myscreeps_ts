export default class RoadWorker {
  public static run(creep: Creep): void {
    if (creep.memory.working && creep.store.energy === 0) {
      creep.memory.working = false;
      creep.say("Harvesting.");
    }
    if (!creep.memory.working && creep.store.energy === creep.store.getCapacity()) {
      creep.memory.working = true;
      creep.say("Delivering.");
    }

    if (creep.memory.working) {
      const targets: Structure[] = creep.room.find(FIND_STRUCTURES, {
        filter: (structure: Structure) => {
          if (structure.structureType === STRUCTURE_ROAD) {
            const structExt: StructureRoad = structure as StructureRoad;
            return structExt.hits < structExt.hitsMax - 100;
          }
          return false;
        }
      });
      if (targets.length > 0) {
        if (creep.repair(targets[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffccaa" } });
        }
      }
    } else {
      const dropped = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
        filter: d => {
          return d.resourceType === RESOURCE_ENERGY;
        }
      });
      const ruins = creep.pos.findClosestByPath(FIND_RUINS, {
        filter: d => {
          return d.store.getUsedCapacity() > 0;
        }
      });

      if (ruins) {
        console.log("Harvesting ruins", ruins);
        if (creep.withdraw(ruins, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(ruins);
        }
        return;
      }
      if (dropped) {
        console.log("DROPPED RESOURCES", dropped.pos.x, dropped.pos.y);
        if (creep.pickup(dropped) === ERR_NOT_IN_RANGE) {
          creep.moveTo(dropped);
        }
      } else {
        const targets: Source[] = creep.room.find(FIND_SOURCES);
        if (targets.length > 0) {
          if (creep.harvest(targets[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0]);
          }
        }
      }
    }
  }
}
