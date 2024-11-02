import Container from '@mui/material/Container';
import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Badge from '@mui/material/Badge';
import GroupIcon from '@mui/icons-material/Group';
import './MonthlyCalendar.css';
import dayjs from "dayjs";

const MonthlyCalendar = () => {
    const currDate = new Date().toLocaleDateString();
    return (
        <Container>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                    referenceDate={dayjs(currDate)}
                />
            </LocalizationProvider>
        </Container>
    )
}

export default MonthlyCalendar;