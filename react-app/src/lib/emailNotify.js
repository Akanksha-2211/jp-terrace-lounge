import emailjs from '@emailjs/browser';

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const isEmailNotifyConfigured = Boolean(serviceId && templateId && publicKey);

if (!isEmailNotifyConfigured) {
  console.warn(
    '[emailjs] VITE_EMAILJS_SERVICE_ID / VITE_EMAILJS_TEMPLATE_ID / VITE_EMAILJS_PUBLIC_KEY are not set. ' +
      'Admin email notifications will be skipped until this is configured.'
  );
}

const TIME_SLOT_LABELS = {
  regular: 'Regular Hours',
  overnight: 'Overnight (10:00 PM - 6:00 AM)',
};

/**
 * Notify the admin by email that a new booking request came in.
 * Fire-and-forget: failures are logged, never thrown, so they can't block the
 * booking confirmation the guest sees (the booking row is already saved regardless).
 */
export async function notifyAdminOfBooking(booking) {
  if (!isEmailNotifyConfigured) return;

  try {
    await emailjs.send(
      serviceId,
      templateId,
      {
        guest_name: booking.name,
        guest_phone: booking.phone,
        guest_email: booking.email || 'Not provided',
        event_type: booking.eventType,
        booking_date: booking.date,
        time_slot: TIME_SLOT_LABELS[booking.timeSlot] || booking.timeSlot,
        guest_count: booking.guestCount,
        special_requests: booking.specialRequests || 'None',
      },
      { publicKey }
    );
  } catch (err) {
    console.error('[emailjs] Failed to send admin notification email:', err);
  }
}
