import { Card, Divider, Typography } from "@mui/joy";

interface Props {
    event: gapi.client.calendar.Event;
}
const EventView: React.FC<Props>= ({ event }) => {
    const start = Date.parse(event.start.dateTime as string);
    const end = Date.parse(event.end.dateTime as string);
    const dateFormat = new Intl.DateTimeFormat('fi-FI', { day: '2-digit', month: '2-digit', year:'numeric' });
    const hourFormat = new Intl.DateTimeFormat('en-US', {hour: '2-digit', minute: '2-digit' });
    return(
        <Card sx={{ width: "500px" }}>
            <Typography level="title-lg"> {event.summary} </Typography>
            <Divider />
            <Typography level="body-md"> Description: {event.description} </Typography>
            <Divider />
            <Typography level="body-sm"> Organizer: {event.organizer.email} </Typography>
            <Typography level="body-sm"> Start Time: {dateFormat.format(start)} at {hourFormat.format(start)} timezone: {event.start.timeZone}</Typography>
            <Typography level="body-sm"> End Time: {dateFormat.format(end)} at {hourFormat.format(end)} timezone: {event.start.timeZone}</Typography>
        </Card>
    );
}

export default EventView;