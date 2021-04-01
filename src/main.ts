import { CreepManager } from "domains/entities/CreepManager";
import { ErrorMapper } from "utils/ErrorMapper";
import config from "./config";

class App {
  public static go() {
    if (!Memory.uuid || Memory.uuid > 1000) {
      Memory.uuid = 0;
    }
    console.log(`Current game tick is ${Game.time}`);

    for (const roomName in Game.rooms) {
      const room: Room = Game.rooms[roomName];
      const creepManager = new CreepManager(config);
      creepManager.run(room);
    }
  }
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  // Automatically delete memory of missing creeps
  App.go();
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      console.log("Deleting creep", name);
      delete Memory.creeps[name];
      continue;
    }
  }
});
