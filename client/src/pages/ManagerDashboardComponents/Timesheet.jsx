import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
    {   field: 'id',
        headerName: 'Employee ID',
        width: 110
    },
    {
        field: 'fullName',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        pinned: true,
        width: 160,
        valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    },
    {
        field: 'sunday',
        headerName: 'Sun',
        type: 'datetime',
        width: 110,
        editable: true,
    },
    {
        field: 'monday',
        headerName: 'Mon',
        type: 'datetime',
        width: 110,
        editable: true,
    },
    {
        field: 'tuesday',
        headerName: 'Tue',
        type: 'datetime',
        width: 110,
        editable: true,
    },
    {
        field: 'wednesday',
        headerName: 'Wed',
        type: 'datetime',
        width: 110,
        editable: true,
    },
    {
        field: 'thursday',
        headerName: 'Thu',
        type: 'datetime',
        width: 110,
        editable: true,
    },
    {
        field: 'friday',
        headerName: 'Fri',
        type: 'datetime',
        width: 110,
        editable: true,
    },
    {
        field: 'saturday',
        headerName: 'Sat',
        type: 'datetime',
        width: 110,
        editable: true,
    },
    {
        field: 'totalHours',
        headerName: 'Total (hrs)',
        type: 'datetime',
        width: 110,
        editable: true,
        valueGetter: (value, row) => {
            return parseInt(row.sunday) +
                parseInt(row.monday) +
                parseInt(row.tuesday) +
                parseInt(row.wednesday) +
                parseInt(row.thursday) +
                parseInt(row.friday) +
                parseInt(row.saturday);
        },
    }
];

const rows = [
    { id: 1, lastName: 'Skywalker', firstName: 'Luke', sunday: '0:00', monday: '0:00', tuesday: '0:00', wednesday: '0:00', thursday: '0:00', friday: '0:00', saturday: '0:00' },
    { id: 2, lastName: 'Tano', firstName: 'Ahsoka', sunday: '0:00', monday: '0:00', tuesday: '0:00', wednesday: '0:00', thursday: '0:00', friday: '0:00', saturday: '0:00' },
    { id: 3, lastName: 'Kenobi', firstName: 'Obi-Wan', sunday: '0:00', monday: '0:00', tuesday: '0:00', wednesday: '0:00', thursday: '0:00', friday: '0:00', saturday: '0:00' },
    { id: 4, lastName: 'Organa', firstName: 'Leia', sunday: '0:00', monday: '0:00', tuesday: '0:00', wednesday: '0:00', thursday: '0:00', friday: '0:00', saturday: '0:00' },
    { id: 5, lastName: 'Djarin', firstName: 'Din', sunday: '0:00', monday: '0:00', tuesday: '0:00', wednesday: '0:00', thursday: '0:00', friday: '0:00', saturday: '0:00' },
];

const Timesheet = () => {
    return (
        <Box sx={{ height: '100%', width: '900px' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    )
};

export default Timesheet;