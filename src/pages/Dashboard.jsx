import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { useAuth } from '../App'

export default function Dashboard() {
  const { user } = useAuth()
  const [services, setServices] = useState([])
  const [bookings, setBookings] = useState([])
  const [stats, setStats] = useState({ totalServices: 0, pending: 0, confirmed: 0, earnings: 0 })
  const [showAddService, setShowAddService] = useState(false)
  const [newService, setNewService] = useState({ name: '', category: 'restaurants', description: '', price: '', duration: '' })

  useEffect(() => {
    if (user && user.user_metadata?.type === 'provider') {
      fetchProviderData()
    }
  }, [user])

  const fetchProviderData = async () => {
    const { data: servicesData } = await supabase
      .from('services')
      .select('*')
      .eq('provider_id', user.id)

    const { data: bookingsData } = await supabase
      .from('bookings')
      .select(`
        *,
        services (provider_id)
      `)
      .eq('services.provider_id', user.id)
      .order('created_at', { ascending: false })

    const services = servicesData || []
    const providerBookings = (bookingsData || []).filter(b => b.services?.provider_id === user.id)

    setServices(services)
    setBookings(providerBookings)

    setStats({
      totalServices: services.length,
      pending: providerBookings.filter(b => b.status === 'pending').length,
      confirmed: providerBookings.filter(b => b.status === 'confirmed').length,
      earnings: providerBookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + (b.total_price || 0), 0)
    })
  }

  const handleAddService = async (e) => {
    e.preventDefault()

    const categoryMap = { restaurants: 1, houseworkers: 2, laundry: 3, carwash: 4 }
    const categoryId = categoryMap[newService.category]

    const { data, error } = await supabase
      .from('services')
      .insert({
        provider_id: user.id,
        category_id: categoryId,
        name: newService.name,
        description: newService.description,
        price: parseFloat(newService.price),
        duration: newService.duration,
        is_active: true,
        rating: 0
      })

    if (!error) {
      alert('Service added successfully!')
      setShowAddService(false)
      setNewService({ name: '', category: 'restaurants', description: '', price: '', duration: '' })
      fetchProviderData()
    } else {
      alert('Failed to add service. Using local fallback.')
      const localService = {
        id: Date.now(),
        provider_id: user.id,
        category_id: categoryId,
        name: newService.name,
        description: newService.description,
        price: parseFloat(newService.price),
        duration: newService.duration,
        rating: 0,
        is_active: true,
        category_name: newService.category
      }
      setServices([...services, localService])
      setShowAddService(false)
      setNewService({ name: '', category: 'restaurants', description: '', price: '', duration: '' })
    }
  }

  const handleUpdateStatus = async (bookingId, status) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)

    if (!error) {
      fetchProviderData()
    }
  }

  const categoryMap = { 1: 'restaurants', 2: 'houseworkers', 3: 'laundry', 4: 'carwash' }

  if (user?.user_metadata?.type !== 'provider') {
    return (
      <section className="section">
        <div className="container text-center">
          <h2>Access Denied</h2>
          <p>This page is only for service providers.</p>
        </div>
      </section>
    )
  }

  return (
    <div id="page-dashboard">
      <section className="section">
        <div className="container">
          <h2 className="mb-4">Provider Dashboard</h2>
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <div className="dashboard-card">
                <div className="number">{stats.totalServices}</div>
                <div className="label">Total Services</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="dashboard-card">
                <div className="number">{stats.pending}</div>
                <div className="label">Pending Bookings</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="dashboard-card">
                <div className="number">{stats.confirmed}</div>
                <div className="label">Confirmed</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="dashboard-card">
                <div className="number">${stats.earnings}</div>
                <div className="label">Total Earnings</div>
              </div>
            </div>
          </div>

          <h4 className="mb-3">Manage My Services</h4>
          <div className="dashboard-card mb-4">
            {services.length === 0 ? (
              <p className="text-muted">No services yet. Add your first service below.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map(service => (
                    <tr key={service.id}>
                      <td>{service.name}</td>
                      <td>{categoryMap[service.category_id] || service.category_name || 'N/A'}</td>
                      <td>${service.price}</td>
                      <td><span className="rating"><i className="fas fa-star"></i> {service.rating}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button className="btn btn-primary mt-3" onClick={() => setShowAddService(true)}>
              <i className="fas fa-plus"></i> Add New Service
            </button>
          </div>

          {showAddService && (
            <div className="dashboard-card mb-4">
              <h5>Add New Service</h5>
              <form onSubmit={handleAddService}>
                <div className="mb-3">
                  <label className="form-label">Service Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={newService.category}
                    onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                    required
                  >
                    <option value="restaurants">Restaurants</option>
                    <option value="houseworkers">Houseworkers</option>
                    <option value="laundry">Laundry Wash</option>
                    <option value="carwash">Car Wash</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    rows="3"
                    required
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Price ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newService.price}
                      onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Duration</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newService.duration}
                      onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                      placeholder="e.g., 2 hours"
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">Add Service</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => setShowAddService(false)}>Cancel</button>
              </form>
            </div>
          )}

          <h4 className="mb-3">Incoming Bookings</h4>
          <div className="dashboard-card">
            {bookings.length === 0 ? (
              <p className="text-muted">No bookings yet.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking.id}>
                      <td>{booking.customer_id}</td>
                      <td>{booking.services?.name || 'Service'}</td>
                      <td>{booking.booking_date} {booking.booking_time}</td>
                      <td>
                        <span className={`status-badge status-${booking.status}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        {booking.status === 'pending' && (
                          <>
                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                            >
                              Accept
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}