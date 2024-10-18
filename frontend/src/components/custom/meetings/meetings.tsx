import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
}

type ViewType = 'month' | 'week' | 'day';

const Meetings: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('week');
  // const [events, setEvents] = useState<Event[]>([
  //   { id: '1', title: 'Breakfast', start: new Date(2024, 9, 12, 6, 0), end: new Date(2024, 9, 12, 7, 0), color: 'bg-blue-100' },
  //   { id: '2', title: 'Flight to Paris', start: new Date(2024, 9, 12, 7, 30), end: new Date(2024, 9, 12, 10, 0), color: 'bg-pink-100' },
  //   { id: '3', title: 'Meeting with design team', start: new Date(2024, 9, 14, 10, 0), end: new Date(2024, 9, 14, 11, 0), color: 'bg-gray-100' },
  // ]);

  const events: Event[] = [
    { id: '1', title: 'Breakfast', start: new Date(2024, 9, 12, 6, 0), end: new Date(2024, 9, 12, 7, 0), color: 'bg-blue-100' },
    { id: '2', title: 'Flight to Paris', start: new Date(2024, 9, 12, 7, 30), end: new Date(2024, 9, 12, 10, 0), color: 'bg-pink-100' },
    { id: '3', title: 'Meeting with design team', start: new Date(2024, 9, 14, 10, 0), end: new Date(2024, 9, 14, 11, 0), color: 'bg-gray-100' },
  ]

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  useEffect(() => {
    // Reset to the start of the week/month when changing views
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setDate(1);
    } else if (view === 'week') {
      const day = currentDate.getDay();
      newDate.setDate(currentDate.getDate() - day);
    }
    setCurrentDate(newDate);
  }, [view]);

  const getMonthDates = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const result = [];

    // Get the day of the week for the first day of the month (0-6)
    const firstDayOfWeek = firstDay.getDay();

    // Add days from the previous month
    for (let i = firstDayOfWeek; i > 0; i--) {
      const d = new Date(year, month, 1 - i);
      result.push(d);
    }

    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      result.push(d);
    }

    // Add days from the next month to complete the grid
    const remainingDays = 42 - result.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const d = new Date(year, month + 1, i);
      result.push(d);
    }

    return result;
  };

  const getWeekDates = (date: Date) => {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const first = date.getDate() - date.getDay() + i;
      const day = new Date(date.setDate(first));
      week.push(day);
    }
    return week;
  };

  const getDayDate = (date: Date) => {
    return [new Date(date.getFullYear(), date.getMonth(), date.getDate())];
  };

  const getDates = () => {
    switch (view) {
      case 'month':
        return getMonthDates(currentDate);
      case 'week':
        return getWeekDates(currentDate);
      case 'day':
        return getDayDate(currentDate);
      default:
        return [];
    }
  };

  const dates = getDates();

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleAddEvent = () => {
    // Implement add event functionality
    console.log('Add event clicked');
  };

  const EventItem: React.FC<{ event: Event; isMonthView?: boolean }> = ({ event, isMonthView }) => {
    if (isMonthView) {
      return (
        <div className={`text-xs truncate ${event.color} p-1 mb-1 rounded`}>
          {event.title}
        </div>
      );
    }

    const startHour = event.start.getHours();
    const startMinutes = event.start.getMinutes();
    const duration = (event.end.getTime() - event.start.getTime()) / (1000 * 60); // duration in minutes
    const height = `${duration}px`;
    const top = `${startHour * 60 + startMinutes}px`;

    return (
      <div 
        className={`absolute left-0 right-0 p-1 text-xs ${event.color} rounded`} 
        style={{ top, height, overflow: 'hidden' }}
      >
        <div className="font-bold">{event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        <div>{event.title}</div>
      </div>
    );
  };

  const renderMonthView = () => (
    <div className="grid grid-cols-7 gap-1">
      {daysOfWeek.map(day => (
        <div key={day} className="text-center font-semibold p-2">{day}</div>
      ))}
      {dates.map((date, index) => (
        <div key={index} className={`border p-1 min-h-[100px] ${date.getMonth() !== currentDate.getMonth() ? 'bg-gray-100' : ''}`}>
          <div className={`text-right ${date.toDateString() === new Date().toDateString() ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center ml-auto' : ''}`}>
            {date.getDate()}
          </div>
          <div>
            {events
              .filter(event => event.start.toDateString() === date.toDateString())
              .map(event => (
                <EventItem key={event.id} event={event} isMonthView={true} />
              ))
            }
          </div>
        </div>
      ))}
    </div>
  );

  const renderWeekView = () => (
    <div className="grid grid-cols-8 border rounded-lg overflow-hidden">
      <div className="col-span-1 border-r"></div>
      {dates.map((date, index) => (
        <div key={index} className="col-span-1 text-center border-r p-2">
          <div className="font-semibold">{daysOfWeek[date.getDay()]}</div>
          <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${date.toDateString() === new Date().toDateString() ? 'bg-blue-500 text-white' : ''}`}>
            {date.getDate()}
          </div>
        </div>
      ))}
      <div className="col-span-1 border-r">
        {hours.map((hour) => (
          <div key={hour} className="h-[60px] border-b text-xs p-1">
            {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
          </div>
        ))}
      </div>
      {dates.map((date, dateIndex) => (
        <div key={dateIndex} className="col-span-1 border-r relative">
          {hours.map((hour) => (
            <div key={hour} className="h-[60px] border-b"></div>
          ))}
          {events
            .filter(event => event.start.toDateString() === date.toDateString())
            .map(event => (
              <EventItem key={event.id} event={event} />
            ))
          }
        </div>
      ))}
    </div>
  );

  const renderDayView = () => (
    <div className="grid grid-cols-2 border rounded-lg overflow-hidden">
      <div className="col-span-1 border-r">
        {hours.map((hour) => (
          <div key={hour} className="h-[60px] border-b text-xs p-1">
            {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
          </div>
        ))}
      </div>
      <div className="col-span-1 relative">
        {hours.map((hour) => (
          <div key={hour} className="h-[60px] border-b"></div>
        ))}
        {events
          .filter(event => event.start.toDateString() === currentDate.toDateString())
          .map(event => (
            <EventItem key={event.id} event={event} />
          ))
        }
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          {view === 'day' && ` ${currentDate.getDate()}`}
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handlePrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handleToday}>Today</Button>
          <Button variant="outline" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Select value={view} onValueChange={(value: ViewType) => setView(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month view</SelectItem>
              <SelectItem value="week">Week view</SelectItem>
              <SelectItem value="day">Day view</SelectItem>
            </SelectContent>
          </Select>
          <Button className="text-white" onClick={handleAddEvent}>Add event</Button>
        </div>
      </div>
      {view === 'month' && renderMonthView()}
      {view === 'week' && renderWeekView()}
      {view === 'day' && renderDayView()}
    </div>
  );
};

export default Meetings;