// example declaration file - remove these and add your own custom typings

// Roles
type CreepRoles =
  | ROLE_BUILDER
  | ROLE_HARVESTER
  | ROLE_HEALER
  | ROLE_LOGISTIC
  | ROLE_MINER
  | ROLE_REPAIRER_BUILDINGS
  | ROLE_REPAIRER_ROAD
  | ROLE_UPGRADER;

type ROLE_BUILDER = "builder";
type ROLE_HARVESTER = "harvester";
type ROLE_HEALER = "healer";
type ROLE_LOGISTIC = "logistic";
type ROLE_MINER = "miner";
type ROLE_REPAIRER_BUILDINGS = "building-repairer";
type ROLE_REPAIRER_ROAD = "road-worker";
type ROLE_UPGRADER = "upgrader";

declare const ROLE_BUILDER: ROLE_BUILDER;
declare const ROLE_HARVESTER: ROLE_HARVESTER;
declare const ROLE_HEALER: ROLE_HEALER;
declare const ROLE_LOGISTIC: ROLE_LOGISTIC;
declare const ROLE_MINER: ROLE_MINER;
declare const ROLE_REPAIRER_BUILDINGS: ROLE_REPAIRER_BUILDINGS;
declare const ROLE_REPAIRER_ROAD: ROLE_REPAIRER_ROAD;
declare const ROLE_UPGRADER: ROLE_UPGRADER;

interface AssignedResource {
  source: string;
  worker: string;
}

interface CreepMemory {
  role: string;
  type: string;
  room: string;
  working: boolean;
  targetId?: string;
}
interface RoomMemory {
  assignedResources: AssignedResource[];
}
// memory extension samples
interface Memory {
  uuid: number;
  log: any;
}

interface CreepManagerConfig {
  buildersNeed: number;
  harvestersNeed: number;
  upgradersNeed: number;
  roadWorkersNeed: number;
  sourceContainers: string[];
  buildingRepairerNeed: number;
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}
