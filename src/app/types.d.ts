type NextSession = {
    slug: string;
    name: string;
    system: TRpgKind;
    date: Date;
    dmed: boolean;
    scheduleId: number;
};

type ScheduleId = {
    id: number;
}