import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBookings, updateBookingStatus, signOutAdmin } from '../lib/bookingApi';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import { timeSlots } from '../data/content';

const TABS = ['pending', 'confirmed', 'rejected', 'all'];

// Shown when Supabase isn't connected yet, so the dashboard layout can still
// be reviewed and clicked around instead of dead-ending on an error.
const DEMO_BOOKINGS = [
  { id: 'demo-1', name: 'Ananya Rao', phone: '+91 98765 43210', email: 'ananya@example.com', event_type: 'Birthday Parties', booking_date: '2026-09-14', time_slot: 'regular', guest_count: 25, special_requests: 'Balloon arch + birthday cake table', status: 'pending', created_at: '2026-09-03T10:15:00Z' },
  { id: 'demo-2', name: 'Rohit Malhotra', phone: '+91 91234 56789', email: '', event_type: 'Office Meetings', booking_date: '2026-09-18', time_slot: 'regular', guest_count: 15, special_requests: '', status: 'pending', created_at: '2026-09-03T09:02:00Z' },
  { id: 'demo-3', name: 'Priya & Karthik', phone: '+91 99887 66554', email: 'priyak@example.com', event_type: 'Anniversary Celebrations', booking_date: '2026-09-20', time_slot: 'overnight', guest_count: 10, special_requests: 'Candlelight setup', status: 'confirmed', created_at: '2026-09-01T18:40:00Z' },
  { id: 'demo-4', name: 'Sneha Kitty Group', phone: '+91 90909 12121', email: '', event_type: 'Kitty Parties', booking_date: '2026-09-10', time_slot: 'regular', guest_count: 18, special_requests: 'Pastel theme decor', status: 'confirmed', created_at: '2026-08-30T12:00:00Z' },
  { id: 'demo-5', name: 'Vikram Enterprises', phone: '+91 98123 45670', email: 'events@vikramgroup.com', event_type: 'Farewell Parties', booking_date: '2026-09-08', time_slot: 'regular', guest_count: 40, special_requests: '', status: 'rejected', created_at: '2026-08-28T08:20:00Z' },
];

function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [tab, setTab] = useState('pending');

  const loadBookings = async () => {
    if (!isSupabaseConfigured) {
      setBookings(DEMO_BOOKINGS);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError('');
    try {
      setBookings(await getAllBookings());
    } catch (err) {
      setLoadError(err.message || 'Could not load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const filtered = useMemo(
    () => (tab === 'all' ? bookings : bookings.filter((b) => b.status === tab)),
    [bookings, tab]
  );

  const handleStatusChange = async (id, status) => {
    setActionError('');

    if (!isSupabaseConfigured) {
      // Demo mode: update in place locally, nothing is persisted anywhere.
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
      return;
    }

    setBusyId(id);
    try {
      const updated = await updateBookingStatus(id, status);
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch (err) {
      setActionError(err.message || 'Could not update this booking.');
    } finally {
      setBusyId(null);
    }
  };

  const handleLogout = async () => {
    if (!isSupabaseConfigured) {
      navigate('/');
      return;
    }
    await signOutAdmin();
    navigate('/admin/login');
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Bookings Dashboard</h1>
        <button type="button" className="btn btn-secondary" onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket"></i> {isSupabaseConfigured ? 'Log Out' : 'Back to Site'}
        </button>
      </header>

      {!isSupabaseConfigured && (
        <p className="admin-demo-banner">
          <i className="fa-solid fa-flask"></i> Demo data -- connect Supabase (see <code>.env.example</code>) to see
          and manage real bookings. Changes here aren't saved.
        </p>
      )}

      <div className="admin-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={`admin-tab${tab === t ? ' active' : ''}`}
            onClick={() => setTab(t)}
            type="button"
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {t !== 'all' && <span className="admin-tab-count">{bookings.filter((b) => b.status === t).length}</span>}
          </button>
        ))}
      </div>

      {actionError && <p className="form-error">{actionError}</p>}

      {loading ? (
        <div className="admin-loading">
          <i className="fa-solid fa-spinner fa-spin"></i>
        </div>
      ) : loadError ? (
        <p className="form-error">{loadError}</p>
      ) : filtered.length === 0 ? (
        <p className="admin-empty">No {tab !== 'all' ? tab : ''} bookings.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Event</th>
                <th>Date</th>
                <th>Time</th>
                <th>Guests</th>
                <th>Requested</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div className="admin-guest">
                      <strong>{b.name}</strong>
                      <span>{b.phone}</span>
                      {b.email && <span>{b.email}</span>}
                    </div>
                  </td>
                  <td>{b.event_type}</td>
                  <td>{formatDate(b.booking_date)}</td>
                  <td>{timeSlots.find((s) => s.id === b.time_slot)?.label || b.time_slot}</td>
                  <td>{b.guest_count}</td>
                  <td>{new Date(b.created_at).toLocaleDateString('en-IN')}</td>
                  <td>
                    <span className={`status-badge status-${b.status}`}>{b.status}</span>
                  </td>
                  <td>
                    {b.status === 'pending' && (
                      <div className="admin-actions">
                        <button
                          type="button"
                          className="btn-icon btn-icon-confirm"
                          disabled={busyId === b.id}
                          onClick={() => handleStatusChange(b.id, 'confirmed')}
                          aria-label="Confirm booking"
                        >
                          <i className="fa-solid fa-check"></i>
                        </button>
                        <button
                          type="button"
                          className="btn-icon btn-icon-reject"
                          disabled={busyId === b.id}
                          onClick={() => handleStatusChange(b.id, 'rejected')}
                          aria-label="Reject booking"
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
