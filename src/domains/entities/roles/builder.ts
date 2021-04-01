export default class Builder {
  public static run(creep: Creep): void {
    if (creep.memory.working && creep.store.energy === 0) {
      creep.memory.working = false;
      creep.say("Harvesting.");
    }
    if (!creep.memory.working && creep.store.energy === creep.store.getCapacity()) {
      creep.memory.working = true;
      creep.say("Building.");
    }

    if (creep.memory.working) {
      const targets: ConstructionSite[] = creep.room
        .find(FIND_CONSTRUCTION_SITES)
        .sort((a, b) => b.progress - a.progress);

      if (targets.length > 0) {
        if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#aaffff" } });
        }
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
