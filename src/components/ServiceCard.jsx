import BookingModal from './BookingModal'

const categoryImages = {
  restaurants: 'https://images.unsplash.com/photo-1565299624946-b28f40a0eb73?w=400&h=300&fit=crop',
  houseworkers: 'https://images.unsplash.com/photo-1581578731548-c64695b49655?w=400&h=300&fit=crop',
  laundry: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=400&h=300&fit=crop',
  carwash: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400&h=300&fit=crop'
}

const categoryIcons = {
  restaurants: 'fa-utensils',
  houseworkers: 'fa-home',
  laundry: 'fa-soap',
  carwash: 'fa-car'
}

export default function ServiceCard({ service, onBooking }) {
  const image = service.image || categoryImages[service.category_name] || categoryImages.restaurants
  const icon = service.icon || categoryIcons[service.category_name] || 'fa-star'

  return (
    <div className="service-card">
      <div className="image" style={{ backgroundImage: `url(${image})` }}></div>
      <div className="content">
        <h5 className="mb-2">{service.name}</h5>
        <p className="text-muted small mb-2">{service.description}</p>
        <div className="d-flex align-items-center mb-2">
          <div className="provider-avatar me-2">
            {(service.provider_name || 'P').charAt(0).toUpperCase()}
          </div>
          <span className="small">{service.provider_name || 'Provider'}</span>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span className="rating">
              <i className="fas fa-star"></i> {service.rating || '0.0'}
            </span>
            <span className="text-muted small ms-2">{service.duration}</span>
          </div>
          <span className="price">${service.price}</span>
        </div>
        <button
          className="btn btn-primary w-100 mt-3"
          onClick={() => onBooking(service)}
        >
          <i className="fas fa-calendar-plus"></i> Book Now
        </button>
      </div>
    </div>
  )
}