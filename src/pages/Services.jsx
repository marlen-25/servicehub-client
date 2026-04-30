import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import ServiceCard from '../components/ServiceCard'
import BookingModal from '../components/BookingModal'
import { useAuth } from '../App'

const sampleServices = [
  { id: 1, category_id: 1, name: 'Gourmet Dining Experience', description: 'Fine dining with gourmet cuisine using fresh local ingredients', price: 150, duration: '2 hours', rating: 4.8, icon: 'fa-utensils', provider_name: 'Chef Maria', category_name: 'restaurants' },
  { id: 2, category_id: 1, name: 'Family Restaurant Catering', description: 'Perfect for family gatherings with variety of dishes', price: 80, duration: '3 hours', rating: 4.5, icon: 'fa-utensils', provider_name: 'Family Eats', category_name: 'restaurants' },
  { id: 3, category_id: 1, name: 'Italian Cuisine Delivery', description: 'Authentic Italian cuisine delivered to your door', price: 45, duration: '1 hour', rating: 4.7, icon: 'fa-utensils', provider_name: 'Pizza Palace', category_name: 'restaurants' },
  { id: 4, category_id: 2, name: 'Deep House Cleaning', description: 'Thorough deep cleaning for your entire home', price: 100, duration: '4 hours', rating: 4.9, icon: 'fa-home', provider_name: 'Clean Pro', category_name: 'houseworkers' },
  { id: 5, category_id: 2, name: 'Professional Cooking Service', description: 'Personal chef service for your home', price: 75, duration: '2 hours', rating: 4.6, icon: 'fa-blender', provider_name: 'Chef John', category_name: 'houseworkers' },
  { id: 6, category_id: 2, name: 'Garden Maintenance', description: 'Full garden maintenance service', price: 60, duration: '2 hours', rating: 4.4, icon: 'fa-leaf', provider_name: 'Green Thumb', category_name: 'houseworkers' },
  { id: 7, category_id: 2, name: 'Move-In/Move-Out Cleaning', description: 'Complete cleaning for moving', price: 120, duration: '4 hours', rating: 4.8, icon: 'fa-home', provider_name: 'Sparkle Clean', category_name: 'houseworkers' },
  { id: 8, category_id: 3, name: 'Wash & Fold Service', description: 'We pick up, wash, dry, fold and return', price: 30, duration: '24 hours', rating: 4.7, icon: 'fa-soap', provider_name: 'Fresh Laundry', category_name: 'laundry' },
  { id: 9, category_id: 3, name: 'Premium Dry Cleaning', description: 'Professional dry cleaning for finest garments', price: 50, duration: '48 hours', rating: 4.9, icon: 'fa-soap', provider_name: 'Elegant Cleaners', category_name: 'laundry' },
  { id: 10, category_id: 3, name: 'Bedding & Linen Service', description: 'Professional cleaning for bedding and linens', price: 40, duration: '24 hours', rating: 4.5, icon: 'fa-soap', provider_name: 'Cozy Linens', category_name: 'laundry' },
  { id: 11, category_id: 4, name: 'Express Car Wash', description: 'Fast and efficient car wash', price: 25, duration: '30 min', rating: 4.3, icon: 'fa-car', provider_name: 'Quick Shine', category_name: 'carwash' },
  { id: 12, category_id: 4, name: 'Premium Detailing', description: 'Full interior and exterior detailing', price: 150, duration: '3 hours', rating: 4.9, icon: 'fa-car', provider_name: 'AutoDet Pros', category_name: 'carwash' },
  { id: 13, category_id: 4, name: 'Interior Deep Clean', description: 'Thorough interior cleaning', price: 80, duration: '2 hours', rating: 4.6, icon: 'fa-car', provider_name: 'Clean Interior', category_name: 'carwash' },
  { id: 14, category_id: 4, name: 'Mobile Car Wash', description: 'We come to your location', price: 35, duration: '45 min', rating: 4.4, icon: 'fa-car', provider_name: 'Wash On Wheels', category_name: 'carwash' }
]

const categoryTitles = {
  restaurants: 'Restaurants',
  houseworkers: 'Houseworkers',
  laundry: 'Laundry Wash',
  carwash: 'Car Wash'
}

export default function Services() {
  const { category } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)

  useEffect(() => {
    fetchServices()
  }, [category])

  const fetchServices = async () => {
    let query = supabase
      .from('services')
      .select('*, categories(name)')
      .eq('is_active', true)
      .order('rating', { ascending: false })

    if (category) {
      query = query.eq('categories.name', category)
    }

    const { data, error } = await query.limit(20)

    if (error || !data || data.length === 0) {
      if (category) {
        setServices(sampleServices.filter(s => s.category_name === category))
      } else {
        setServices(sampleServices)
      }
    } else {
      setServices(data.map(s => ({ ...s, category_name: s.categories?.name })))
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

  return (
    <div id="page-services">
      <section className="section">
        <div className="container">
          <h2 className="mb-4" id="services-title">
            {category ? categoryTitles[category] || 'Services' : 'All Services'}
          </h2>
          <div className="row g-4">
            {services.map(service => (
              <div className="col-md-6 col-lg-4" key={service.id}>
                <ServiceCard service={service} onBooking={handleBooking} />
              </div>
            ))}
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