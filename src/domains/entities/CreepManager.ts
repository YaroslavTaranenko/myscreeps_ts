import Builder from "./roles/builder";
import BuildingRepairer from "./roles/BuildingRepairer";
import Harvester from "./roles/Harvester";
import RoadWorker from "./roles/RoadWorker";
import Upgrader from "./roles/Upgrader";

const ROLE_BUILDER = "builder";
const ROLE_HARVESTER = "harvester";
const ROLE_HEALER = "healer";
const ROLE_LOGISTIC = "logistic";
const ROLE_MINER = "miner";
const ROLE_REPAIRER_BUILDINGS = "building-repairer";
const ROLE_REPAIRER_ROAD = "road-worker";
const ROLE_UPGRADER = "upgrader";

/* eslint-disable no-underscore-dangle */
export class CreepManager {
  private _config: CreepManagerConfig;
  private creeps: Creep[] = [];
  private upgraders: Creep[] = [];
  private harvesters: Creep[] = [];
  private builders: Creep[] = [];
  private roadWorkers: Creep[] = [];
  private miners: Creep[] = [];
  private buildingRepairers: Creep[] = [];

  public constructor(config: CreepManagerConfig) {
    this._config = config;
  }
  public run(room: Room): void {
    this.creeps = room.find(FIND_MY_CREEPS);
    this.upgraders = this.creeps.filter(creep => creep.memory.role === ROLE_UPGRADER);
    this.harvesters = this.creeps.filter(creep => creep.memory.role === ROLE_HARVESTER);
    this.upgraders.forEach(c => Upgrader.run(c));
    this.harvesters.forEach(c => new Harvester(c).run());
    this.builders = this.creeps.filter(creep => creep.memory.role === ROLE_BUILDER);
    this.builders.forEach(c => Builder.run(c));
    this.roadWorkers = this.creeps.filter(creep => creep.memory.role === ROLE_REPAIRER_ROAD);
    this.roadWorkers.forEach(c => RoadWorker.run(c));
    this.buildingRepairers = this.creeps.filter(creep => creep.memory.role === ROLE_REPAIRER_BUILDINGS);
    this.buildingRepairers.forEach(c => new BuildingRepairer(c).run());

    this.miners = this.creeps.filter(creep => creep.memory.role === ROLE_MINER);
    // this.miners.forEach(c => {
    //   if (!c.memory.targetId) {
    //   }
    // });
    // room.memory.assignedResources

    this._spawnMissingCreeps(room);
    this.log();
  }
  private _spawnMissingCreeps(room: Room) {
    if (this.harvesters.length < this._config.harvestersNeed) {
      console.log(`"Missing ${this._config.harvestersNeed - this.harvesters.length} harvester(s)"`);
      this._spawnCreep(room, "lesser", ROLE_HARVESTER);
      return;
    }
    if (this.upgraders.length < this._config.upgradersNeed) {
      console.log(`"Missing ${this._config.upgradersNeed - this.upgraders.length} upgrader(s)"`);
      this._spawnCreep(room, "lesser", ROLE_UPGRADER);
      return;
    }
    if (this.builders.length < this._config.buildersNeed) {
      console.log(`"Missing ${this._config.buildersNeed - this.builders.length} builder(s)"`);
      this._spawnCreep(room, "lesser", ROLE_BUILDER);
      return;
    }
    if (this.roadWorkers.length < this._config.roadWorkersNeed) {
      console.log(`"Missing ${this._config.roadWorkersNeed - this.roadWorkers.length} roadWorker(s)"`);
      this._spawnCreep(room, "lesser", ROLE_REPAIRER_ROAD);
    }
    if (this.buildingRepairers.length < this._config.buildingRepairerNeed) {
      console.log(
        `"Missing ${this._config.buildingRepairerNeed - this.buildingRepairers.length} building-repairer(s)"`
      );
      this._spawnCreep(room, "lesser", ROLE_REPAIRER_BUILDINGS);
      return;
    }
    if (this.miners.length < this._config.sourceContainers.length) {
      console.log(`"Missing ${this._config.sourceContainers.length - this.miners.length} miner(s)"`);
      // room.memory.assignedResources.forEach(r => {
      //   if (!Game.creeps[r.worker]) {
      //     // this._spawnCreep(room, "lesser", ROLE_MINER, r.source);
      //   }
      // });
      // this._spawnCreep(room, "lesser", ROLE_MINER);
    }
  }
  private _spawnCreep(room: Room, type: string, role: string, targetId?: string) {
    const spawns: StructureSpawn[] = room.find(FIND_MY_SPAWNS, {
      filter: (spawn: StructureSpawn) => {
        return spawn.spawning === null;
      }
    });
    const name = role + Memory.uuid.toString();
    let body: BodyPartConstant[] = [];
    switch (type) {
      case "lesser":
        body = [WORK, WORK, CARRY, MOVE];
        break;
      case "small":
        body = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
        break;
    }
    const so: SpawnOptions = {
      memory: {
        role,
        type,
        room: room.name,
        working: false,
        targetId
      }
    };
    if (role === "miner") {
      body = [WORK, WORK, WORK, WORK, WORK, MOVE];
    }
    if (spawns.length > 0) {
      const res = spawns[0].spawnCreep(body, name, so);
      if (res === OK) {
        room.visual.text(`Spawning ${type} ${role}:${Memory.uuid}`, spawns[0].pos);
        Memory.uuid++;
      }
    }
  }
  private log() {
    let stats = `Creeps count: ${this.creeps.length};`;
    stats += ` Upgraders: ${this.upgraders.length};`;
    stats += ` harvs: ${this.harvesters.length};`;
    stats += ` buiders: ${this.builders.length};`;
    stats += ` RW: ${this.roadWorkers.length};`;
    stats += ` BR: ${this.buildingRepairers.length};`;
    console.log(stats);
  }
}
