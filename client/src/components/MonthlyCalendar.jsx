import Container from '@mui/material/Container';
import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Badge from '@mui/material/Badge';
import './MonthlyCalendar.css';

const MonthlyCalendar = () => {
    return (
        <Container>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar />
            </LocalizationProvider>
        </Container>
    )
}

export default MonthlyCalendar;