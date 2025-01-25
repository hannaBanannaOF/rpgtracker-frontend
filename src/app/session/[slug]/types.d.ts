type SessionCharacterSheet = {
  id: string;
  description: string;
}

type SessionDetail = {
  slug: string;
  sessionName: string;
  characterSheets: SessionCharacterSheet[];
  dmed: boolean;
  id: number;
  system: TRpgKind;
  inPlay: boolean;
};

type Schedule = {
  dateTime: Date;
}

type GbSessionInfo = {
  id: number,
  coreId: number,
  teamSavings: number,
}

type EnableHq = {
  enabled: boolean;
  initialLoad: number;
  initialCapacity: number;
}