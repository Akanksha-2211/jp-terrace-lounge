import { useEffect, useMemo, useState } from 'react';
import Reveal from './Reveal';
import RippleLink from './RippleLink';
import { perfectForEvents, timeSlots } from '../data/content';
import { getConfirmedDates, createBooking, BookingApiError } from '../lib/bookingApi';
import { notifyAdminOfBooking } from '../lib/emailNotify';
import { isSupabaseConfigured } from '../lib/supabaseClient';

const EVENT_TYPE_OPTIONS = [...perfectForEvents.map((e) => e.title), 'Other'];

const EMPTY_FORM = {
  name: '',
  phone: '',
  email: '',
  eventType: EVENT_TYPE_OPTIONS[0],
  date: '',
  timeSlot: timeSlots[0].id,
  guestCount: 10,
  specialRequests: '',
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function buildWhatsAppLink(booking, referenceId) {
  const slotLabel = timeSlots.find((s) => s.id === booking.timeSlot)?.label || booking.timeSlot;
  const lines = [
    "Hi JP Terrace Lounge! I'd like to confirm my booking request:",
    '',
    `Name: ${booking.name}`,
    `Phone: ${booking.phone}`,
    `Event: ${booking.eventType}`,
    `Date: ${formatDate(booking.date)}`,
    `Time: ${slotLabel}`,
    `Guests: ${booking.guestCount}`,
    `Special Requests: ${booking.specialRequests || 'None'}`,
    '',
    `Reference: ${referenceId}`,
  ];
  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/91XXXXXXXXXX?text=${text}`;
}

export default function Booking() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [confirmedDates, setConfirmedDates] = useState(new Set());
  const [dateWarning, setDateWarning] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    getConfirmedDates()
      .then(setConfirmedDates)
      .catch((err) => console.error('[booking] Failed to load confirmed dates:', err));
  }, []);

  const minDate = useMemo(todayISO, []);

  const handleChange = (field) => (e) => {
    const value = field === 'guestCount' ? Number(e.target.value) : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));

    if (field === 'date') {
      setDateWarning(confirmedDates.has(e.target.value) ? 'This date is already booked. Please choose another date.' : '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!isSupabaseConfigured) {
      setSubmitError('Booking system is not configured yet. Please contact us directly using the details below.');
      return;
    }
    if (confirmedDates.has(form.date)) {
      setDateWarning('This date is already booked. Please choose another date.');
      return;
    }

    setSubmitting(true);
    try {
      const row = await createBooking(form);
      const referenceId = row.id.slice(0, 8).toUpperCase();
      notifyAdminOfBooking(form);
      setConfirmation({ ...form, referenceId });
    } catch (err) {
      if (err instanceof BookingApiError && err.code === '23505') {
        setConfirmedDates((prev) => new Set(prev).add(form.date));
        setDateWarning(err.message);
      } else {
        setSubmitError(err.message || 'Something went wrong. Please try again or contact us directly.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setDateWarning('');
    setSubmitError('');
    setConfirmation(null);
  };

  return (
    <section id="booking" className="booking section">
      <div className="container">
        <Reveal className="section-header">
          <span className="section-tag">Book Now</span>
          <h2>Reserve Your Rooftop Celebration</h2>
        </Reveal>

        <Reveal className="booking-card">
          {confirmation ? (
            <div className="booking-confirmation">
              <div className="booking-confirmation-icon">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <h3>Booking Request Received!</h3>
              <p>
                Thanks, {confirmation.name.split(' ')[0]} -- we've received your request and it's pending
                confirmation. We'll review availability and get back to you shortly.
              </p>

              <div className="booking-summary">
                <div>
                  <span>Reference</span>
                  <strong>{confirmation.referenceId}</strong>
                </div>
                <div>
                  <span>Event</span>
                  <strong>{confirmation.eventType}</strong>
                </div>
                <div>
                  <span>Date</span>
                  <strong>{formatDate(confirmation.date)}</strong>
                </div>
                <div>
                  <span>Time</span>
                  <strong>{timeSlots.find((s) => s.id === confirmation.timeSlot)?.label}</strong>
                </div>
                <div>
                  <span>Guests</span>
                  <strong>{confirmation.guestCount}</strong>
                </div>
              </div>

              <div className="booking-confirmation-actions">
                <RippleLink
                  href={buildWhatsAppLink(confirmation, confirmation.referenceId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                >
                  <i className="fa-brands fa-whatsapp"></i> Confirm via WhatsApp
                </RippleLink>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Book Another Event
                </button>
              </div>
            </div>
          ) : (
            <form className="booking-form" onSubmit={handleSubmit}>
              <div className="booking-form-grid">
                <label>
                  Full Name *
                  <input type="text" required value={form.name} onChange={handleChange('name')} placeholder="Your name" />
                </label>
                <label>
                  Phone Number *
                  <input type="tel" required value={form.phone} onChange={handleChange('phone')} placeholder="+91 XXXXX XXXXX" />
                </label>
                <label>
                  Email (optional)
                  <input type="email" value={form.email} onChange={handleChange('email')} placeholder="you@example.com" />
                </label>
                <label>
                  Event Type *
                  <select required value={form.eventType} onChange={handleChange('eventType')}>
                    {EVENT_TYPE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Date *
                  <input type="date" required min={minDate} value={form.date} onChange={handleChange('date')} />
                  {dateWarning && <span className="field-warning">{dateWarning}</span>}
                </label>
                <label>
                  Time Slot *
                  <select required value={form.timeSlot} onChange={handleChange('timeSlot')}>
                    {timeSlots.map((slot) => (
                      <option key={slot.id} value={slot.id}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Guest Count *
                  <input type="number" required min={1} max={50} value={form.guestCount} onChange={handleChange('guestCount')} />
                </label>
                <label className="booking-form-full">
                  Special Requests
                  <textarea
                    rows={3}
                    value={form.specialRequests}
                    onChange={handleChange('specialRequests')}
                    placeholder="Decor preferences, cake arrangement, anything else we should know"
                  />
                </label>
              </div>

              {submitError && <p className="form-error">{submitError}</p>}

              <button type="submit" className="btn btn-primary" disabled={submitting || Boolean(dateWarning)}>
                {submitting ? 'Submitting...' : 'Request Booking'}
              </button>
              <p className="booking-form-note">
                This sends a request only -- your date is reserved once our team confirms it.
              </p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
