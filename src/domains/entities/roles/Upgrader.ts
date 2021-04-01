export default class Upgrader {
  public static run(creep: Creep): void {
    if (creep.memory.working && creep.store.energy === 0) {
      creep.memory.working = false;
      creep.say("Harvesting.");
    }
    if (!creep.memory.working && creep.store.energy === creep.store.getCapacity()) {
      creep.memory.working = true;
      creep.say("Upgrading.");
    }

    if (creep.memory.working) {
      if (creep.room.controller && creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
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
