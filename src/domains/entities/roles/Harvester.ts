export default class Harvester {
  private creep: Creep;
  public constructor(creep: Creep) {
    this.creep = creep;
  }
  public run(): void {
    // меняет режим работы с работы на добычу
    if (this.creep.memory.working && this.creep.store.energy === 0) {
      this.creep.memory.working = false;
      this.creep.say("Harvesting.");
    }
    // меняет режим работы с добычи на работу
    if (!this.creep.memory.working && this.creep.store.energy === this.creep.store.getCapacity()) {
      this.creep.memory.working = true;
      this.creep.say("Delivering.");
    }

    if (this.creep.memory.working) {
      const targets = this.getTargets();
      this.doWork(targets);
    } else {
      this.getResources();
    }
  }
  private getTargets(): Structure[] {
    const targets: Structure[] = this.creep.room.find(FIND_STRUCTURES, {
      filter: (structure: Structure) => {
        if (structure.structureType === STRUCTURE_EXTENSION) {
          const structExt: StructureExtension = structure as StructureExtension;
          return structExt.store[RESOURCE_ENERGY] < structExt.store.getCapacity(RESOURCE_ENERGY);
        }
        if (structure.structureType === STRUCTURE_SPAWN) {
          const structExt: StructureSpawn = structure as StructureSpawn;
          return structExt.store[RESOURCE_ENERGY] < structExt.store.getCapacity(RESOURCE_ENERGY);
        }
        if (structure.structureType === STRUCTURE_TOWER) {
          const structExt: StructureTower = structure as StructureTower;
          return structExt.store[RESOURCE_ENERGY] < structExt.store.getCapacity(RESOURCE_ENERGY);
        }
        return false;
      }
    });
    return targets;
  }
  private doWork(targets: Structure[]): void {
    if (targets.length > 0) {
      if (this.creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
      }
    }
  }
  private getResources(): void {
    const ruins = this.creep.pos.findClosestByPath(FIND_RUINS, {
      filter: d => {
        return d.store.getUsedCapacity() > 0;
      }
    });

    if (ruins) {
      console.log("Harvesting ruins", ruins);
      if (this.creep.withdraw(ruins, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(ruins);
      }
      return;
    }
    const dropped = this.creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
      filter: d => {
        return d.resourceType === RESOURCE_ENERGY;
      }
    });
    if (dropped) {
      console.log("DROPPED RESOURCES", dropped.pos.x, dropped.pos.y);
      if (this.creep.pickup(dropped) === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(dropped);
      }
      return;
    }
    const targets: Source[] = this.creep.room.find(FIND_SOURCES);
    if (targets.length > 0) {
      if (this.creep.harvest(targets[0]) === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(targets[0]);
      }
    }
  }
}
