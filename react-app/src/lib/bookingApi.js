import { supabase } from './supabaseClient';

const UNIQUE_VIOLATION = '23505';

export class BookingApiError extends Error {
  constructor(message, { code, cause } = {}) {
    super(message);
    this.name = 'BookingApiError';
    this.code = code;
    this.cause = cause;
  }
}

function assertConfigured() {
  if (!supabase) {
    throw new BookingApiError(
      'Booking system is not configured yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    );
  }
}

/** Dates (YYYY-MM-DD strings) that already have an admin-confirmed booking. Public, no auth required. */
export async function getConfirmedDates() {
  assertConfigured();
  const { data, error } = await supabase.from('confirmed_dates').select('booking_date');
  if (error) throw new BookingApiError('Could not load availability.', { cause: error });
  return new Set((data || []).map((row) => row.booking_date));
}

/** Create a new pending booking request. Public, no auth required. */
export async function createBooking(booking) {
  assertConfigured();
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      name: booking.name,
      phone: booking.phone,
      email: booking.email || null,
      event_type: booking.eventType,
      booking_date: booking.date,
      time_slot: booking.timeSlot,
      guest_count: booking.guestCount,
      special_requests: booking.specialRequests || null,
    })
    .select()
    .single();

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      throw new BookingApiError('That date was just confirmed for another booking. Please choose a different date.', {
        code: UNIQUE_VIOLATION,
        cause: error,
      });
    }
    throw new BookingApiError('Could not submit your booking request. Please try again.', { cause: error });
  }
  return data;
}

/** All bookings, most recent first. Requires an authenticated admin session (enforced by RLS). */
export async function getAllBookings() {
  assertConfigured();
  const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
  if (error) throw new BookingApiError('Could not load bookings.', { cause: error });
  return data;
}

/** Confirm or reject a pending booking. Requires an authenticated admin session (enforced by RLS). */
export async function updateBookingStatus(id, status) {
  assertConfigured();
  const { data, error } = await supabase.from('bookings').update({ status }).eq('id', id).select().single();

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      throw new BookingApiError('Another booking on that date is already confirmed.', {
        code: UNIQUE_VIOLATION,
        cause: error,
      });
    }
    throw new BookingApiError('Could not update this booking.', { cause: error });
  }
  return data;
}

export async function signInAdmin(email, password) {
  assertConfigured();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new BookingApiError('Invalid email or password.', { cause: error });
  return data.session;
}

export async function signOutAdmin() {
  assertConfigured();
  await supabase.auth.signOut();
}

export async function getSession() {
  assertConfigured();
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export function onAuthStateChange(callback) {
  assertConfigured();
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
  return () => data.subscription.unsubscribe();
}
