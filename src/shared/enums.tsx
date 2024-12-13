import { GiBookAura, GiFlexibleStar, GiFloatingGhost } from "react-icons/gi";

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