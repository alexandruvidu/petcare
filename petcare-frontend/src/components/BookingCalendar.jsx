import React, { useState, useEffect } from 'react';

const BookingCalendar = ({ bookings, onBookingClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [bookingsByDate, setBookingsByDate] = useState({});

  // Get the days for the current month
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get the first day of the month
    const firstDay = new Date(year, month, 1);
    // Get the last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Create an array for all the days in the month
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    setCalendarDays(days);
  }, [currentDate]);

  // Organize bookings by date and mark start/end days
  useEffect(() => {
    if (!bookings || bookings.length === 0) {
      setBookingsByDate({});
      return;
    }

    const bookingMap = {};
    
    bookings.forEach(booking => {
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);
      
      // Loop through each day in the booking
      let currentDay = new Date(startDate);
      
      while (currentDay <= endDate) {
        const dateKey = currentDay.toISOString().split('T')[0]; // YYYY-MM-DD format
        
        if (!bookingMap[dateKey]) {
          bookingMap[dateKey] = [];
        }
        
        // Determine if this is the start day, end day, or middle day
        const isStartDay = currentDay.getDate() === startDate.getDate() && 
                           currentDay.getMonth() === startDate.getMonth() && 
                           currentDay.getFullYear() === startDate.getFullYear();
        
        const isEndDay = currentDay.getDate() === endDate.getDate() && 
                         currentDay.getMonth() === endDate.getMonth() && 
                         currentDay.getFullYear() === endDate.getFullYear();
        
        const position = isStartDay ? 'start' : (isEndDay ? 'end' : 'middle');
        
        // Add this booking to the current day with position info
        bookingMap[dateKey].push({
          ...booking,
          position,
          isStartDay,
          isEndDay
        });
        
        // Move to the next day
        currentDay = new Date(currentDay);
        currentDay.setDate(currentDay.getDate() + 1);
      }
    });
    
    setBookingsByDate(bookingMap);
  }, [bookings]);

  // Move to the previous month
  const prevMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  // Move to the next month
  const nextMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  // Format date to YYYY-MM-DD
  const formatDateKey = (date) => {
    if (!date) return null;
    return date.toISOString().split('T')[0];
  };

  // Determine if the date is today
  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Get the booking status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-200 border-yellow-300';
      case 'Accepted':
        return 'bg-green-200 border-green-300';
      case 'Rejected':
        return 'bg-red-200 border-red-300';
      case 'Completed':
        return 'bg-blue-200 border-blue-300';
      default:
        return 'bg-gray-200 border-gray-300';
    }
  };

  // Format time string
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Calendar header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-2 border-b flex flex-wrap gap-4">
        <div className="flex items-center text-sm">
          <div className="w-4 h-4 bg-yellow-200 border border-yellow-300 rounded mr-1"></div>
          <span>Pending</span>
        </div>
        <div className="flex items-center text-sm">
          <div className="w-4 h-4 bg-green-200 border border-green-300 rounded mr-1"></div>
          <span>Accepted</span>
        </div>
        <div className="flex items-center text-sm">
          <div className="w-4 h-4 bg-red-200 border border-red-300 rounded mr-1"></div>
          <span>Rejected</span>
        </div>
        <div className="flex items-center text-sm">
          <div className="w-4 h-4 bg-blue-200 border border-blue-300 rounded mr-1"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center ml-4 text-sm">
          <span className="flex items-center">
            <span className="font-bold">▶</span>&nbsp;Start
          </span>
          <span className="mx-2">|</span>
          <span className="flex items-center">
            End&nbsp;<span className="font-bold">◀</span>
          </span>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {/* Day names */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={index} className="bg-white p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarDays.map((day, index) => {
          // If day is null, render an empty cell
          if (!day) {
            return <div key={`empty-${index}`} className="bg-white p-2 h-32"></div>;
          }
          
          const dateKey = formatDateKey(day);
          const dayBookings = bookingsByDate[dateKey] || [];
          
          return (
            <div 
              key={dateKey} 
              className={`bg-white p-2 border-t h-32 overflow-y-auto ${isToday(day) ? 'bg-blue-50' : ''}`}
            >
              <div className="text-right">
                <span className={`text-sm font-medium ${isToday(day) ? 'text-blue-600' : 'text-gray-700'}`}>
                  {day.getDate()}
                </span>
              </div>
              
              {/* Bookings for this day */}
              <div className="mt-1 space-y-1">
                {dayBookings.map((booking, bookingIndex) => {
                  const { position, isStartDay, isEndDay } = booking;
                  
                  return (
                    <div
                      key={`${booking.id}-${bookingIndex}`}
                      className={`px-2 py-1 text-xs rounded border ${getStatusColor(booking.status)} cursor-pointer`}
                      onClick={() => onBookingClick && onBookingClick(booking)}
                      title={`${booking.petName}: ${new Date(booking.startDate).toLocaleString()} to ${new Date(booking.endDate).toLocaleString()}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 truncate">
                          {/* Show starting icon and time for the first day */}
                          {isStartDay && (
                            <span className="font-bold mr-1">▶ </span>
                          )}
                          
                          {/* Show the pet name */}
                          <span>{booking.petName || 'Booking'}</span>
                          
                          {/* Show ending icon and time for the last day */}
                          {isEndDay && (
                            <span className="font-bold ml-1"> ◀</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Show relevant time information */}
                      <div className="text-xs opacity-80 mt-0.5">
                        {isStartDay && !isEndDay && (
                          <span>Starts: {formatTime(booking.startDate)}</span>
                        )}
                        {!isStartDay && isEndDay && (
                          <span>Ends: {formatTime(booking.endDate)}</span>
                        )}
                        {isStartDay && isEndDay && (
                          <span>{formatTime(booking.startDate)} - {formatTime(booking.endDate)}</span>
                        )}
                        {!isStartDay && !isEndDay && (
                          <span>All day</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingCalendar;