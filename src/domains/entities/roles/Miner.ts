export class Miner {
  private creep: Creep;
  public constructor(creep: Creep) {
    this.creep = creep;
    if (!creep.memory.targetId) {
      console.log(`Creep ${creep.name} don't have container id.`);
      return;
    }
  }

  public run(): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const container = Game.getObjectById(this.creep.memory.targetId!) as StructureContainer;
    if (this.creep.pos.getRangeTo(container) === 0) {
      const source = this.creep.pos.findClosestByPath(FIND_SOURCES);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.creep.harvest(source!);
    } else {
      this.creep.moveTo(container);
    }
  }
}
