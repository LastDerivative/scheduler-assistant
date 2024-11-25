import * as React from 'react';
import { useState } from "react";
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import {validateTime} from "@mui/x-date-pickers"; // Optional Theme applied to the Data Grid

const Timesheet = () => {
    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState([
        { headerName: "Full Name", field: "name" },
        { headerName: "Employee ID", field: "ID" },
        { field: "sun", type: 'datetime' },
        { field: "mon" },
        { field: "tue" },
        { field: "wed" },
        { field: "thu" },
        { field: "fri" },
        { field: "sat" },
        { field: "total"}
    ]);

    // Row Data: The data to be displayed.
    const [rowData, setRowData] = useState([
        { name: "Luke", ID: "1", sun: "0:00", mon: "0:00", tue: "0:00" , wed: "0:00", thu: "0:00" , fri: "0:00", sat: "0:00", total: "0:00"},
        { name: "Ahsoka", ID: "2", sun: "0:00", mon: "0:00", tue: "0:00" , wed: "0:00", thu: "0:00" , fri: "0:00", sat: "0:00", total: "0:00"},
        { name: "Obi-Wan", ID: "3", sun: "0:00", mon: "0:00", tue: "0:00" , wed: "0:00", thu: "0:00" , fri: "0:00", sat: "0:00", total: "0:00"},
        { name: "Mace", ID: "4", sun: "0:00", mon: "0:00", tue: "0:00" , wed: "0:00", thu: "0:00" , fri: "0:00", sat: "0:00", total: "0:00"},
        { name: "Leia", ID: "5", sun: "0:00", mon: "0:00", tue: "0:00" , wed: "0:00", thu: "0:00" , fri: "0:00", sat: "0:00", total: "0:00"},
    ]);

    return (
        // wrapping container with theme & size
        <div
            className="ag-theme-quartz" // applying the Data Grid theme
            style={{ height: 280, width: 1150 }} // the Data Grid will fill the size of the parent container
        >
            <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
            />
        </div>
    );
}

export default Timesheet;