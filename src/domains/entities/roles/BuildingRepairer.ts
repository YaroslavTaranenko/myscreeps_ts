import Worker from "../Worker";

export default class BuildingRepairer extends Worker {
  protected doWork(targets: Structure[]): void {
    if (targets.length > 0) {
      if (this.creep.repair(targets[0]) === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffccaa" } });
      }
    }
  }
  protected getTargets(): Structure[] {
    const targets: Structure[] = this.creep.room.find(FIND_STRUCTURES, {
      filter: (structure: Structure) => {
        if (structure.structureType === STRUCTURE_CONTAINER) {
          const structExt: StructureContainer = structure as StructureContainer;
          return structExt.hits < structExt.hitsMax;
        }
        if (structure.structureType === STRUCTURE_TOWER) {
          const structExt: StructureTower = structure as StructureTower;
          return structExt.hits < structExt.hitsMax;
        }
        if (structure.structureType === STRUCTURE_EXTENSION) {
          const structExt: StructureExtension = structure as StructureExtension;
          return structExt.hits < structExt.hitsMax;
        }
        return false;
      }
    });
    return targets;
  }
}
