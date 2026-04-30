import { useState } from 'react'

export default function BookingModal({ service, onClose, onConfirm }) {
  const [date, setDate] = useState(() => {
    const today = new Date().toISOString().split('T')[0]
    return today
  })
  const [time, setTime] = useState('09:00')
  const [notes, setNotes] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onConfirm({ date, time, notes })
  }

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ]

  const formatTime = (t) => {
    const [hour] = t.split(':')
    const h = parseInt(hour)
    return h >= 12 ? `${h === 12 ? 12 : h - 12}:00 PM` : `${h}:00 AM`
  }

  return (
    <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">{service?.name}</h4>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <div
                  style={{
                    height: '300px',
                    background: 'linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '5rem',
                    color: '#636E72'
                  }}
                >
                  <i className={`fas ${service?.icon || 'fa-star'}`}></i>
                </div>
              </div>
              <div className="col-md-6">
                <p className="mb-3">{service?.description}</p>
                <div className="mb-3">
                  <strong>Provider:</strong> {service?.provider_name}
                </div>
                <div className="mb-3">
                  <strong>Duration:</strong> {service?.duration}
                </div>
                <div className="mb-3">
                  <strong>Rating:</strong> <span className="rating"><i className="fas fa-star"></i> {service?.rating}</span>
                </div>
                <div className="mb-3" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>
                  <strong>${service?.price}</strong>
                </div>
              </div>
            </div>
            <hr />
            <h5 className="mb-3">Book This Service</h5>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Select Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Select Time</label>
                  <select
                    className="form-select"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  >
                    {timeSlots.map(t => (
                      <option key={t} value={t}>{formatTime(t)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Notes (Optional)</label>
                <textarea
                  className="form-control"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                  placeholder="Any special instructions..."
                ></textarea>
              </div>
              <div className="booking-summary">
                <div className="item">
                  <span>Service</span>
                  <span>{service?.name}</span>
                </div>
                <div className="item">
                  <span>Date</span>
                  <span>{date}</span>
                </div>
                <div className="item">
                  <span>Time</span>
                  <span>{formatTime(time)}</span>
                </div>
                <div className="item">
                  <span>Total</span>
                  <span className="total">${service?.price}</span>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>Confirm Booking</button>
          </div>
        </div>
      </div>
    </div>
  )
}