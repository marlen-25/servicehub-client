import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import ServiceCard from '../components/ServiceCard'
import BookingModal from '../components/BookingModal'
import { useAuth } from '../App'

const categories = [
  { id: 1, name: 'restaurants', description: 'Fine dining, casual eats, and catering', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0eb73?w=300&h=180&fit=crop' },
  { id: 2, name: 'houseworkers', description: 'Cleaning, cooking, and home maintenance', image: 'https://images.unsplash.com/photo-1581578731548-c64695b49655?w=300&h=180&fit=crop' },
  { id: 3, name: 'laundry', description: 'Wash & fold, dry cleaning services', image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=300&h=180&fit=crop' },
  { id: 4, name: 'carwash', description: 'Interior, exterior, and detailing services', image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=300&h=180&fit=crop' }
]

const sampleServices = [
  { id: 1, category_id: 1, name: 'Gourmet Dining Experience', description: 'Fine dining with gourmet cuisine using fresh local ingredients', price: 150, duration: '2 hours', rating: 4.8, icon: 'fa-utensils', provider_name: 'Chef Maria', category_name: 'restaurants' },
  { id: 2, category_id: 1, name: 'Italian Cuisine Delivery', description: 'Authentic Italian cuisine delivered to your door', price: 45, duration: '1 hour', rating: 4.7, icon: 'fa-utensils', provider_name: 'Pizza Palace', category_name: 'restaurants' },
  { id: 3, category_id: 2, name: 'Deep House Cleaning', description: 'Thorough deep cleaning for your entire home', price: 100, duration: '4 hours', rating: 4.9, icon: 'fa-home', provider_name: 'Clean Pro', category_name: 'houseworkers' },
  { id: 4, category_id: 3, name: 'Premium Dry Cleaning', description: 'Professional dry cleaning for finest garments', price: 50, duration: '48 hours', rating: 4.9, icon: 'fa-soap', provider_name: 'Fresh Laundry', category_name: 'laundry' },
  { id: 5, category_id: 4, name: 'Premium Detailing', description: 'Full interior and exterior detailing', price: 150, duration: '3 hours', rating: 4.9, icon: 'fa-car', provider_name: 'AutoDet Pros', category_name: 'carwash' },
  { id: 6, category_id: 2, name: 'Personal Chef Service', description: 'Professional cook for your home', price: 75, duration: '2 hours', rating: 4.6, icon: 'fa-blender', provider_name: 'Chef John', category_name: 'houseworkers' }
]

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [searchCategory, setSearchCategory] = useState('')

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*, categories(name)')
      .eq('is_active', true)
      .order('rating', { ascending: false })
      .limit(6)

    if (error) {
      setServices(sampleServices)
    } else if (data && data.length > 0) {
      setServices(data.map(s => ({ ...s, category_name: s.categories?.name })))
    } else {
      setServices(sampleServices)
    }
  }

  const handleBooking = (service) => {
    if (!user) {
      navigate('/login')
      return
    }
    setSelectedService(service)
  }

  const handleConfirmBooking = async (bookingData) => {
    if (!user) {
      navigate('/login')
      return
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        customer_id: user.id,
        service_id: selectedService.id,
        booking_date: bookingData.date,
        booking_time: bookingData.time,
        notes: bookingData.notes,
        total_price: selectedService.price,
        status: 'pending'
      })

    if (error) {
      alert('Booking failed. Please try again.')
    } else {
      alert('Booking confirmed successfully!')
      setSelectedService(null)
      navigate('/bookings')
    }
  }

  const handleCategoryClick = (categoryName) => {
    navigate(`/services/${categoryName}`)
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container text-center">
          <h1>Find Services Near You</h1>
          <p>Get services from providers close to your location</p>
          <div className="search-box">
            <div className="input-group mb-3">
              <select
                className="form-select"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
              >
                <option value="">All Services</option>
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name.charAt(0).toUpperCase() + c.name.slice(1)}</option>
                ))}
              </select>
            </div>
            <button
              className="btn btn-primary w-100"
              onClick={() => navigate(searchCategory ? `/services/${searchCategory}` : '/services')}
            >
              <i className="fas fa-search"></i> Find Services
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Browse by Category</h2>
            <p>Find exactly what you need from our wide range of services</p>
          </div>
          <div className="row g-4">
            {categories.map(category => (
              <div className="col-md-6 col-lg-3" key={category.id}>
                <div className="category-card" onClick={() => handleCategoryClick(category.name)}>
                  <div className="cat-image" style={{ backgroundImage: `url(${category.image})` }}></div>
                  <h3 style={{ marginTop: '10px' }}>{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</h3>
                  <p>{category.description}</p>
                  <span className="count">Click to see all</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-title">
            <h2>Featured Services</h2>
            <p>Top-rated services from our community</p>
          </div>
          <div className="row g-4">
            {services.map(service => (
              <div className="col-md-6 col-lg-4" key={service.id}>
                <ServiceCard service={service} onBooking={handleBooking} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>How It Works</h2>
            <p>Book your service in just 3 simple steps</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="text-center">
                <div className="icon-circle">
                  <i className="fas fa-search"></i>
                </div>
                <h4>1. Find a Service</h4>
                <p style={{ color: 'var(--text-secondary)' }}>Browse through categories or search for specific services in your area</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <div className="icon-circle" style={{ background: 'var(--accent)' }}>
                  <i className="fas fa-calendar-check"></i>
                </div>
                <h4>2. Book Online</h4>
                <p style={{ color: 'var(--text-secondary)' }}>Select date & time, and book your service instantly</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <div className="icon-circle" style={{ background: 'var(--secondary)' }}>
                  <i className="fas fa-check-circle"></i>
                </div>
                <h4>3. Get Service</h4>
                <p style={{ color: 'var(--text-secondary)' }}>Enjoy your booked service at your location</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {selectedService && (
        <BookingModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  )
}