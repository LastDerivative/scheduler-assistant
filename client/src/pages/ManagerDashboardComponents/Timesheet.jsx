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
        { field: "sun" },
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
        { name: "", ID: "", sun: "", mon: "", tue: "" , wed: "", thu: "" , fri: "", sat: "", total: ""},
        { name: "", ID: "", sun: "", mon: "", tue: "" , wed: "", thu: "" , fri: "", sat: "", total: ""},
        { name: "", ID: "", sun: "", mon: "", tue: "" , wed: "", thu: "" , fri: "", sat: "", total: ""},
        { name: "", ID: "", sun: "", mon: "", tue: "" , wed: "", thu: "" , fri: "", sat: "", total: ""},
        { name: "", ID: "", sun: "", mon: "", tue: "" , wed: "", thu: "" , fri: "", sat: "", total: ""},
    ]);

    return (
        // wrapping container with theme & size
        <div
            className="ag-theme-quartz-dark" // applying the Data Grid theme
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