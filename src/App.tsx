import { Button } from "@mui/joy";
import CalenderApi from "./helpers/CalendarAPI";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { scheduleAtom, todayAtom } from "./atoms/neededAtom";
import Timetable from "./components/Timetable";
import { hour, oneDayInSec } from "./const";
import { Schedule, Time } from "./types/types";

function App() {
  const calendarAPI = new CalenderApi();
  const [today, setToday]= useRecoilState(todayAtom);
  const [, setSchedule] = useRecoilState(scheduleAtom)


  useEffect(() => {
    setToday(Date.now());
  }, []);

  const getEvent = async () => {
    let queryStartDay = new Date(today + oneDayInSec);
    queryStartDay.setHours(0, 0, 0, 0);
    let queryEndDay = new Date(today + 7 * oneDayInSec);
    queryEndDay.setHours(24, 0, 0, 0);
    const res = await calendarAPI.listUpcomingEvents(queryStartDay, queryEndDay);
    if(res !== undefined && res.result.items.length > 0) {
      const events: gapi.client.calendar.Event[] = res.result.items;

      // create new empty schedule state
      let newSchedule: Schedule[] = [];
          for(let i = 1; i <= 7; i++) {
              let newDate = new Date(today + i * oneDayInSec);
              let timeArray: Time[] = hour.map((item) => ( {time: item, isFree: true} ));
              newSchedule.push( { date: newDate, time: timeArray } );
      }

      // go through each event and upgrade the current schedule.
      events.forEach((e) => {
        const start = new Date(Date.parse(e.start.dateTime as string));
        const end = new Date(Date.parse(e.end.dateTime as string));

        const startHour = start.getHours();
        const endHour = end.getHours();

        const beginOfToday = new Date(today);
        beginOfToday.setHours(0, 0, 0, 0);

        const beginOfStart = new Date(start.getTime());
        beginOfStart.setHours(0, 0, 0, 0)


        const arrayPosition = Math.floor(( beginOfStart.getTime() - beginOfToday.getTime() ) / oneDayInSec) - 1;

        console.log(arrayPosition);

        for(let i = startHour; i < endHour; i++) {
          if(i >= 6 && i <= 23) {
             newSchedule[arrayPosition].time[i - 6].isFree = false;
          }
        }
      });

      setSchedule(newSchedule);

    } else {
      console.log("get events error", res?.statusText);
    }
  }

  return (
    <div>
      <Button onClick={calendarAPI.handleAuthOnclick}> Sign in </Button>
      <Button onClick={calendarAPI.handleSignOutClick}> Log out </Button>
      <Button onClick={getEvent}> Get Event </Button>

      {/*<div>
        {events.length === 0 ? <p>No events to show</p> : null}
        {events.map((event) => (
              <EventView key={event.id} event={event}/>
        ))}
      </dv>*/
      }

      <Timetable />
    </div>
  )
}

export default App
