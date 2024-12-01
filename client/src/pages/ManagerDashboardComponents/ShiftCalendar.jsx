import React, { useEffect, useRef, useState } from 'react';
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import { Box, Typography } from '@mui/material';
// To make authenticated call
import axiosInstance from '../../axiosInstance';

const ShiftCalendar = ( { employeeData } ) => {
  // Will use to get all shifts for the day by given org
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        // Get the current date in Eastern Time (YYYY-MM-DD format)
        const today = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/New_York',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        })
            .format(new Date()) // Convert to Eastern Time
            .split('/') // Split MM/DD/YYYY into parts
            .join('-'); // Join into ISO format
        
        console.log('Eastern Time Date:', today); // Debugging

        // Fetch shifts for the organization
        const response = await axiosInstance.get(`/shifts/org/${employeeData.orgID}/shifts`, {
            params: { date: today } // Send the Eastern Time date
        });

        // Store shifts in state
        setShifts(response.data);
    } catch (error) {
        console.error('Error fetching shifts:', error);
    } finally {
        setLoading(false);
    }
};

// Fetch shifts if orgID is available
if (employeeData?.orgID) {
    fetchShifts();
}
}, [employeeData]); // Dependency array to refetch when employeeData changes


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
        text: "Valerie",
        start: DayPilot.Date.today().addHours(5).addMinutes(0),
        end: DayPilot.Date.today().addHours(13),
        resource: "R1",
        barColor: "#b07298"
      },
      {
        id: 2,
        text: "Eric",
        start: DayPilot.Date.today().addHours(11),
        end: DayPilot.Date.today().addHours(18),
        resource: "R2",
        barColor: "#a972b0",
      },
      {
        id: 3,
        text: "John Doe",
        start: DayPilot.Date.today().addHours(7),
        end: DayPilot.Date.today().addHours(15),
        resource: "R3",
        barColor: "#8a72b0",
      },
    ];

    setEvents(events);
  }, []);

  return (
    <Box maxWidth='1100px'>
      {/* renders daypilot calendar */}
        <DayPilotCalendar
        {...config}
        events={events}
        controlRef={setCalendar}
        />
    </Box>
      

      
      /*{ Render JSX based on the JSON data
        {shifts.map((shift) => {
          const employeeName = shift.employeeID ? shift.employeeID.name : 'Unassigned'; // Default for unassigned shifts
          const totalHours =
              (new Date(shift.endTime) - new Date(shift.startTime)) / (1000 * 60 * 60); // Calculate duration
          const siteName = shift.siteID ? shift.siteID.siteName : 'Unknown Location'; // Default for missing site
          const employeeID = shift.employeeID ? shift._id : 'no id';

          return (
          <div key={shift._id}>
            <h2>{employeeName}, id:{employeeID}</h2>
            <p>{new Date(shift.startTime).toLocaleTimeString()}</p>
            <p>{new Date(shift.endTime).toLocaleTimeString()}</p>
            <p>{totalHours.toFixed(2)}</p>
            <p>{siteName}</p>
            <p>{shifts.length}</p>
          </div>
          );
        })}
      }*/
  );
}
export default ShiftCalendar;