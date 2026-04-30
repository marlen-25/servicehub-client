import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { useAuth } from '../App'

export default function Bookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        services (name, icon, price)
      `)
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      setBookings([])
    } else {
      setBookings(data || [])
    }
    setLoading(false)
  }

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return

    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)

    if (!error) {
      fetchBookings()
      alert('Booking cancelled successfully')
    }
  }

  const getStatusBadgeClass = (status) => {
    const classes = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    }
    return classes[status] || 'status-pending'
  }

  if (loading) {
    return (
      <section className="section">
        <div className="container text-center">
          <p>Loading bookings...</p>
        </div>
      </section>
    )
  }

  return (
    <div id="page-my-bookings">
      <section className="section">
        <div className="container">
          <h2 className="mb-4">My Bookings</h2>
          {bookings.length === 0 ? (
            <div className="text-center p-5">
              <i className="fas fa-calendar-times" style={{ fontSize: '4rem', color: '#ccc' }}></i>
              <p className="mt-3 text-muted">No bookings yet. Browse services to make your first booking!</p>
            </div>
          ) : (
            <div className="row">
              {bookings.map(booking => (
                <div className="col-md-6 mb-4" key={booking.id}>
                  <div className="dashboard-card">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5>{booking.services?.name || 'Service'}</h5>
                        <span className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="text-end">
                        <div className="price">${booking.total_price}</div>
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">
                        <i className="fas fa-calendar"></i> {booking.booking_date} at {booking.booking_time}
                      </small>
                    </div>
                    {booking.notes && (
                      <div className="mb-2">
                        <small className="text-muted">Notes: {booking.notes}</small>
                      </div>
                    )}
                    {booking.status === 'pending' && (
                      <button
                        className="btn btn-outline-primary btn-sm mt-2"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}