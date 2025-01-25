import { GiBookAura, GiFlexibleStar, GiFloatingGhost } from "react-icons/gi";

enum Core {
  // user menu / permissions
  userInfoMenu = 'user-info-menu',
  // Home
  nextSession = 'next-session',
  myCalendar = 'my-calendar',
  // Sessions
  mySessions = 'my-sessions',
  sessionInfo = 'session-info-basic',
  // Character sheets
  mySheets = 'my-sheets',
  characterSheetInfo = 'character-sheet-info-basic',
}

enum Ghostbusters {
  // Sessions
  sessionInfo = 'session-info-gb',
  // Character sheet
  characterSheetInfo = 'character-sheet-info-gb',
  // Ecto one
  ectoOneList = 'gb-ecto-one-list',
  ectoOneDetail = 'gb-ecto-one-details',
  // Ecto one upgrades
  ectoOneUpgradesList = 'gb-ecto-one-upgrades-list',
  ectoOneUpgradesDetail = 'gb-ecto-one-upgrade-details',
  // Equipment
  equipmentList = 'gb-equipment-list',
  equipmentDetail = 'gb-equipment-details',
  // Equipment upgrades
  equipmentUpgradesList = 'gb-equipment-upgrades-list',
  equipmentUpgradesDetail = 'gb-equipment-upgrade-details',
  // Talents
  talentList = 'gb-talents-list',
  talentDetail = 'gb-talent-details',
  // Headquarters
  headquartersList = 'gb-headquarters-list',
  headquartersDetail = 'gb-headquarters-details'
}

export const ReactQueryKeys = {
  Core,
  Ghostbusters
}

export enum TRpgKind {
  callOfCthulhu = 'CALL_OF_CTHULHU',
  ghostbusters = 'GHOSTBUSTERS'
}

export namespace TRpgKind {
  export function getLabel(kind: TRpgKind) {
    switch (kind) {
      case TRpgKind.callOfCthulhu:
        return 'Call of Cthulhu'
      case TRpgKind.ghostbusters:
        return 'Ghostbusters'
      default:
        return '';
    }
  }

  export function getIcon(kind: TRpgKind) {
    switch (kind) {
      case TRpgKind.callOfCthulhu:
        return <GiFlexibleStar size={24} />
      case TRpgKind.ghostbusters:
        return <GiFloatingGhost size={24} />
      default:
        return <GiBookAura size={24} />
    }
  }
}