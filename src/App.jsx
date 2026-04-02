import { useState, useEffect } from 'react';

function App() {
  const [stats, setStats] = useState({ currentMonthResortBookings: 0, currentMonthPoolBookings: 0 });
  const [bookings, setBookings] = useState({ resorts: [], pools: [] });
  const [resortForm, setResortForm] = useState({ name: '', phone: '', startDate: '', endDate: '' });
  const [poolForm, setPoolForm] = useState({ name: '', phone: '', date: '' });
  const [message, setMessage] = useState('');
  
  // Calendar State
  const [calendarDate, setCalendarDate] = useState(new Date());

  const fetchDashboardData = async () => {
    try {
      const statsRes = await fetch('https://saras-classics-backend.onrender.com');
      const statsData = await statsRes.json();
      setStats(statsData);

      const bookingsRes = await fetch('https://saras-classics-backend.onrender.com');
      const bookingsData = await bookingsRes.json();
      setBookings(bookingsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleResortSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://saras-classics-backend.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resortForm),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setResortForm({ name: '', phone: '', startDate: '', endDate: '' });
        fetchDashboardData();
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Server error.');
    }
  };

  const handlePoolSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://saras-classics-backend.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(poolForm),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setPoolForm({ name: '', phone: '', date: '' });
        fetchDashboardData();
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Server error.');
    }
  };

  // --- Calendar Logic ---
  const prevMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  const nextMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));

  const isSameDay = (d1, d2) => {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const isDateInRange = (date, start, end) => {
    const d = new Date(date).setHours(0,0,0,0);
    const s = new Date(start).setHours(0,0,0,0);
    const e = new Date(end).setHours(0,0,0,0);
    return d >= s && d <= e;
  };

  const daysInMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay();

  const days = Array(firstDay).fill(null);
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(calendarDate.getFullYear(), calendarDate.getMonth(), i));
  }

  return (
    <div className="min-h-screen text-white p-8 font-sans">
      <header className="text-center mb-12 mt-8">
        <h1 className="text-5xl font-bold text-luxury-gold drop-shadow-glow-gold mb-2">Sara's Classics</h1>
        <p className="text-xl text-gray-300 tracking-widest uppercase text-sm">Exclusive Resort & Pool Booking</p>
      </header>

      {message && (
        <div className="max-w-2xl mx-auto mb-8 p-4 border border-luxury-gold rounded-lg text-center shadow-glow-gold bg-black">
          <p className="text-luxury-gold font-bold">{message}</p>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Booking Forms Section */}
        <div className="space-y-8">
          <div className="bg-[#111] p-8 rounded-xl border border-gray-800 hover:border-luxury-gold transition-colors duration-300">
            <h2 className="text-2xl font-bold text-luxury-gold mb-6 border-b border-gray-800 pb-4">Book Resort Stays</h2>
            <form onSubmit={handleResortSubmit} className="space-y-5">
              <input type="text" placeholder="Guest Name" required className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-luxury-gold" value={resortForm.name} onChange={e => setResortForm({...resortForm, name: e.target.value})} />
              <input type="text" placeholder="Phone Number" required className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-luxury-gold" value={resortForm.phone} onChange={e => setResortForm({...resortForm, phone: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Start Date</label>
                  <input type="date" required className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-luxury-gold [color-scheme:dark] cursor-pointer" value={resortForm.startDate} onChange={e => setResortForm({...resortForm, startDate: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">End Date</label>
                  <input type="date" required className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-luxury-gold [color-scheme:dark] cursor-pointer" value={resortForm.endDate} onChange={e => setResortForm({...resortForm, endDate: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-luxury-gold text-black font-bold py-3 rounded hover:bg-yellow-400 transition-shadow shadow-glow-gold mt-2">Confirm Resort Booking</button>
            </form>
          </div>

          <div className="bg-[#111] p-8 rounded-xl border border-gray-800 hover:border-luxury-gold transition-colors duration-300">
            <h2 className="text-2xl font-bold text-luxury-gold mb-6 border-b border-gray-800 pb-4">Book Pool Only</h2>
            <form onSubmit={handlePoolSubmit} className="space-y-5">
              <input type="text" placeholder="Guest Name" required className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-luxury-gold" value={poolForm.name} onChange={e => setPoolForm({...poolForm, name: e.target.value})} />
              <input type="text" placeholder="Phone Number" required className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-luxury-gold" value={poolForm.phone} onChange={e => setPoolForm({...poolForm, phone: e.target.value})} />
              <div>
                <label className="block text-xs text-gray-400 mb-1">Date</label>
                <input type="date" required className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-luxury-gold [color-scheme:dark] cursor-pointer" value={poolForm.date} onChange={e => setPoolForm({...poolForm, date: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-transparent border-2 border-luxury-gold text-luxury-gold font-bold py-3 rounded hover:bg-luxury-gold hover:text-black transition-all shadow-glow-gold mt-2">Confirm Pool Booking</button>
            </form>
          </div>
        </div>

        {/* Dashboard Section */}
        <div className="space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#111] p-6 rounded-xl border border-gray-800 text-center">
              <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Resort Bookings</h3>
              <p className="text-5xl font-bold text-luxury-gold drop-shadow-glow-gold">{stats.currentMonthResortBookings}</p>
              <p className="text-xs text-gray-500 mt-2">This Month</p>
            </div>
            <div className="bg-[#111] p-6 rounded-xl border border-gray-800 text-center">
              <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Pool Bookings</h3>
              <p className="text-5xl font-bold text-luxury-gold drop-shadow-glow-gold">{stats.currentMonthPoolBookings}</p>
              <p className="text-xs text-gray-500 mt-2">This Month</p>
            </div>
          </div>

          {/* Interactive Calendar View */}
          <div className="bg-[#111] p-8 rounded-xl border border-gray-800">
            <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
              <h2 className="text-2xl font-bold text-luxury-gold">Availability</h2>
              <div className="flex items-center gap-4">
                <button onClick={prevMonth} className="text-gray-400 hover:text-luxury-gold text-xl font-bold px-2">&lt;</button>
                <span className="text-white font-bold w-32 text-center">
                  {calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <button onClick={nextMonth} className="text-gray-400 hover:text-luxury-gold text-xl font-bold px-2">&gt;</button>
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 mb-6 text-sm">
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-luxury-gold rounded-full shadow-glow-gold"></span> Resort</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-500 rounded-full shadow-md"></span> Pool</div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-2 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-gray-500 text-xs font-bold py-2">{d}</div>
              ))}
              {days.map((day, idx) => {
                if (!day) return <div key={idx} className="p-2"></div>;

                const isResort = bookings.resorts.some(b => isDateInRange(day, b.start_date, b.end_date));
                const isPool = bookings.pools.some(b => isSameDay(day, b.booking_date));

                let bgClass = "bg-black border border-gray-800 text-gray-400 hover:border-gray-500";
                if (isResort && isPool) bgClass = "bg-gradient-to-br from-luxury-gold to-blue-500 text-white font-bold border-none";
                else if (isResort) bgClass = "bg-luxury-gold text-black font-bold border-none shadow-glow-gold";
                else if (isPool) bgClass = "bg-blue-500 text-white font-bold border-none";

                return (
                  <div key={idx} className={`rounded-md aspect-square flex items-center justify-center transition-all ${bgClass} cursor-default`}>
                    {day.getDate()}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;