'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import { useAuth } from '@/lib/AuthContext';
import { bookingService } from '@/lib/api';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user, isAuthenticated } = useAuth();
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsData = await bookingService.getMyBookings();
        setBookings(bookingsData);
      } catch (err) {
        setError('Error al cargar tus reservas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (isAuthenticated) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);
  
  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingService.updateBookingStatus(bookingId, 'cancelled');
      // Actualizar la lista de reservas
      const updatedBookings = bookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: 'cancelled' } 
          : booking
      );
      setBookings(updatedBookings);
    } catch (err) {
      setError('Error al cancelar la reserva');
      console.error(err);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Necesitas iniciar sesión</h1>
            <p className="mb-6">Para ver tus reservas, por favor inicia sesión o regístrate.</p>
            <div className="flex justify-center space-x-4">
              <Button href="/login" variant="primary">Iniciar sesión</Button>
              <Button href="/register" variant="outline">Registrarse</Button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }
  
  if (loading) {
    return (
      <main className="flex min-h-screen flex-col">
        <Header isLoggedIn={isAuthenticated} />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <p>Cargando tus reservas...</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Header isLoggedIn={isAuthenticated} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Mis reservas</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {bookings.length === 0 ? (
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">No tienes reservas todavía</h2>
            <p className="text-gray-600 mb-6">Explora propiedades y realiza tu primera reserva.</p>
            <Button href="/" variant="primary">Explorar alojamientos</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="border rounded-lg overflow-hidden shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-4">
                  <div className="bg-gray-200 h-48 md:h-auto">
                    {booking.property?.images && booking.property.images.length > 0 ? (
                      <img 
                        src={booking.property.images[0]} 
                        alt={booking.property.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Imagen no disponible
                      </div>
                    )}
                  </div>
                  <div className="p-6 md:col-span-3">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                      <div>
                        <h2 className="text-xl font-bold mb-2">{booking.property?.title || 'Propiedad'}</h2>
                        <p className="text-gray-600 mb-4">{booking.property?.address?.city || 'Ciudad'}, {booking.property?.address?.country || 'País'}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <h3 className="font-medium text-gray-700">Fechas</h3>
                            <p>{new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-700">Huéspedes</h3>
                            <p>{booking.guestCount} huéspedes</p>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-700">Total</h3>
                            <p className="font-bold">€{booking.totalPrice}</p>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-700">Estado</h3>
                            <p className={`capitalize ${
                              booking.status === 'confirmed' ? 'text-green-600' : 
                              booking.status === 'cancelled' ? 'text-red-600' : 
                              'text-yellow-600'
                            }`}>
                              {booking.status === 'confirmed' ? 'Confirmada' : 
                               booking.status === 'cancelled' ? 'Cancelada' : 
                               booking.status === 'completed' ? 'Completada' : 'Pendiente'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0 flex flex-col space-y-2">
                        <Button 
                          href={`/properties/${booking.property?._id}`} 
                          variant="outline"
                        >
                          Ver propiedad
                        </Button>
                        
                        {booking.status === 'pending' || booking.status === 'confirmed' ? (
                          <Button 
                            variant="outline" 
                            onClick={() => handleCancelBooking(booking._id)}
                          >
                            Cancelar reserva
                          </Button>
                        ) : null}
                        
                        {booking.status === 'completed' && (
                          <Button 
                            href={`/properties/${booking.property?._id}/review`} 
                            variant="primary"
                          >
                            Dejar reseña
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </main>
  );
}
