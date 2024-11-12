import { useRecoilState, useRecoilValue } from "recoil";
import { scheduleAtom, todayAtom } from "../atoms/neededAtom";
import { useEffect } from "react";
import { Box, Table } from "@mui/joy";
import { hour, oneDayInSec } from "../const";
import { Schedule, Time } from "../types/types";

interface Props {}

const Timetable: React.FC<Props> = () => {
    const [schedule, setSchedule] = useRecoilState(scheduleAtom)
    const today = new Date(useRecoilValue(todayAtom));
    
    const dateFormat = new Intl.DateTimeFormat('fi-FI', { day: '2-digit', month: '2-digit'});

    useEffect(() => {
        const newSchedule: Schedule[] = [];
        for(let i = 1; i <= 7; i++) {
            let newDate = new Date(today.getTime() + i * oneDayInSec);
            let timeArray: Time[] = hour.map((item) => ( {time: item, isFree: true} ));
            newSchedule.push( { date: newDate, time: timeArray } );
        }
        setSchedule(newSchedule);
    }, []);

    return (
        <Box sx={{ width: "100%"}}>
            <Table borderAxis="both">
                <thead>
                    <tr>
                        <th>  </th>
                        { 
                            hour.map((item, index) => 
                                (<th><Box key={`hour-${item}-${index}`}> {item} </Box></th>)) 
                        }
                    </tr>
                </thead>

                <tbody>
                    { 
                        schedule.map((item) => 
                            (
                                <tr>
                                    <th><Box key={`date-${item}`}> {dateFormat.format(item.date)} </Box></th>
                                    { 
                                        item.time.map((item) => 
                                            (item.isFree ? 
                                                <td key={`${item.time}`} style={{ width: "100%", height: "100%", backgroundColor: "white" }}><Box></Box></td> : 
                                                <td key={`${item.time}`} style={{ width: "100%", height: "100%", backgroundColor: "#D3D3D3" }}><Box></Box></td>))
                                    }
                                </tr>
                            ))
                        
                    }
                </tbody>
            </Table>
        </Box>
    );
}

export default Timetable;