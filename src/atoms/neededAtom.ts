import { atom } from "recoil";
import { Schedule } from "../types/types";

export const todayAtom = atom({
    key: 'Today',
    default: Date.now()
});

export const scheduleAtom = atom<Schedule[]>({
    key: 'PersonalSchedule',
    default: [],
});