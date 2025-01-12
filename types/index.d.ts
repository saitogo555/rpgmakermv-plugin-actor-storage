/// <reference types="../types/rpgmakermv.d.ts" />

interface ActorStorageInterface {
  addPartyMember: (actor: Game_Actor) => void;
  removePartyMember: (actor: Game_Actor) => void;
  addReserveMember: (actor: Game_Actor) => void;
  removeReserveMember: (actor: Game_Actor) => void;
  getPartyMembers: () => Game_Actor[];
  getReserveMembers: () => Game_Actor[];
}

declare interface Game_System {
  ActorStorage: ActorStorageInterface;
  _ActorStorage_reserveMembers: Game_Actor[];
}