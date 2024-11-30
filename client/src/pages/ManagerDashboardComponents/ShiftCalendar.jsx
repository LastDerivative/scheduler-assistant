import React, { useEffect, useRef, useState } from 'react';
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import { Typography } from '@mui/material';
// To make authenticated call
import axiosInstance from '../../axiosInstance';

const ShiftCalendar = ( { employeeData } ) => {
  // Will use to get all shifts for the day by given org
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShifts = async () => {
        try {
            const today = new Date().toISOString().split('T')[0]; // Current date (YYYY-MM-DD)
            
            const response = await axiosInstance.get(`/shifts/org/${employeeData.orgID}/shifts`, {
                params: { date: today } // Send date
            });
            //console.log('Shifts for today:', response.data);
            setShifts(response.data); // Store shifts in state
        } catch (error) {
            console.error('Error fetching shifts:', error);
        } finally {
            setLoading(false);
        }
    };

    if (employeeData?.orgID) {
        fetchShifts();
    }
}, [employeeData]);

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
      {/* renders daypilot calendar */}
      <DayPilotCalendar
        {...config}
        events={events}
        controlRef={setCalendar}
      />
      
      
      {/* Render JSX based on the JSON data */}
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

    </div>
  );
}
export default ShiftCalendar;