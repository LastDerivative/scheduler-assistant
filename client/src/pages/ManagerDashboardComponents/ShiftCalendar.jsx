import React, { useEffect, useRef, useState } from 'react';
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";

const ShiftCalendar = () => {
  const [calendar, setCalendar] = useState(null);
  const [events, setEvents] = useState([]);
  const config = {
    viewType: "Week",
    headerDateFormat: "ddd M/d/yyyy",
    timeRangeSelectedHandling: "Enabled",
    onTimeRangeSelected: async (args) => {
      const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
      const calendar = args.control;
      calendar.clearSelection();
      if (modal.canceled) { return; }
      calendar.events.add({
        start: args.start,
        end: args.end,
        id: DayPilot.guid(),
        text: modal.result
      });
    },
    eventDeleteHandling: "Update",
    onEventDeleted: (args) => {
      console.log("Event deleted: " + args.e.text());
    },
    eventMoveHandling: "Update",
    onEventMoved: (args) => {
      console.log("Event moved: " + args.e.text());
    },
    eventResizeHandling: "Update",
    onEventResized: (args) => {
      console.log("Event resized: " + args.e.text());
    },
    eventClickHandling: "ContextMenu",
    contextMenu: new DayPilot.Menu({
      items: [
        { text: "Delete", onClick: (args) => { const dp = args.source.calendar; dp.events.remove(args.source); } }
      ]
    }),
  };

  useEffect(() => {

    const events = [
      {
        id: 1,
        text: "Event 1",
        start: DayPilot.Date.today().addHours(10),
        end: DayPilot.Date.today().addHours(12),
        resource: "R1"
      },
      {
        id: 2,
        text: "Event 2",
        start: "2024-06-02T10:00:00",
        end: "2024-06-02T11:00:00",
        resource: "R2",
        barColor: "#38761d",
        barBackColor: "#93c47d"
      }
    ];

    setEvents(events);
  }, []);

  return (
    <div>
      <DayPilotCalendar
        {...config}
        events={events}
        controlRef={setCalendar}
      />
    </div>
  );
}
export default ShiftCalendar;