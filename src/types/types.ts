export interface Time {
    time: string;
    isFree: boolean;
}

export interface Schedule {
    date: Date;
    time: Time[];
}