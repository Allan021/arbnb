'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useAuth } from '@/lib/AuthContext';
import { propertyService, bookingService } from '@/lib/api';

export default function BookingPage({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    checkOutDate: '',
    guestCount: 1,
    nights: 1,
    totalPrice: 0,
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    cardName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    const fetchPropertyDetails = async () => {
      try {
        const propertyData = await propertyService.getPropertyById(params.id);
        setProperty(propertyData);
        
        // Obtener parámetros de la URL
        const checkIn = searchParams.get('checkIn');
        const checkOut = searchParams.get('checkOut');
        const guests = searchParams.get('guests');
        const nights = searchParams.get('nights');
        
        if (checkIn && checkOut && guests && nights) {
          const totalPrice = calculateTotalPrice(propertyData.pricePerNight, parseInt(nights));
          
          setBookingData({
            checkInDate: checkIn,
            checkOutDate: checkOut,
            guestCount: parseInt(guests),
            nights: parseInt(nights),
            totalPrice,
          });
        }
      } catch (err) {
        setError('Error al cargar los detalles de la propiedad');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPropertyDetails();
  }, [params.id, isAuthenticated, router, searchParams]);
  
  const calculateTotalPrice = (pricePerNight, nights) => {
    const subtotal = pricePerNight * nights;
    const cleaningFee = 50;
    const serviceFee = Math.round(subtotal * 0.15);
    return subtotal + cleaningFee + serviceFee;
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo({
      ...paymentInfo,
      [name]: value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const bookingPayload = {
        propertyId: params.id,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        totalPrice: bookingData.totalPrice,
        guestCount: bookingData.guestCount,
      };
      
      const response = await bookingService.createBooking(bookingPayload);
      
      // Simular pago (en una aplicación real, aquí se procesaría el pago)
      await bookingService.updateBookingToPaid(response._id);
      
      // Redirigir a la página de confirmación
      router.push(`/bookings/${response._id}/confirmation`);
    } catch (err) {
      setError('Error al procesar la reserva. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <main className="flex min-h-screen flex-col">
        <Header isLoggedIn={isAuthenticated} />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <p>Cargando detalles de la reserva...</p>
        </div>
        <Footer />
      </main>
    );
  }
  
  if (error || !property) {
    return (
      <main className="flex min-h-screen flex-col">
        <Header isLoggedIn={isAuthenticated} />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error || 'No se pudo encontrar la propiedad'}</span>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Header isLoggedIn={isAuthenticated} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Confirmar y pagar</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario de reserva */}
          <div className="lg:col-span-2">
            <div className="border-b pb-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Tu viaje</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Fechas</h3>
                  <p className="text-gray-600">
                    {new Date(bookingData.checkInDate).toLocaleDateString()} - {new Date(bookingData.checkOutDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Huéspedes</h3>
                  <p className="text-gray-600">{bookingData.guestCount} huéspedes</p>
                </div>
              </div>
            </div>
            
            <div className="border-b pb-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Información de pago</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex space-x-2">
                  <div className="border rounded p-2 flex items-center">
                    <span>Tarjeta de crédito</span>
                  </div>
                  <div className="border rounded p-2 flex items-center">
                    <span>PayPal</span>
                  </div>
                </div>
                
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  label="Número de tarjeta"
                  placeholder="1234 5678 9012 3456"
                  value={paymentInfo.cardNumber}
                  onChange={handleInputChange}
                  required
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    id="expiry"
                    name="expiry"
                    label="Fecha de caducidad"
                    placeholder="MM/AA"
                    value={paymentInfo.expiry}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    id="cvc"
                    name="cvc"
                    label="CVC"
                    placeholder="123"
                    value={paymentInfo.cvc}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <Input
                  id="cardName"
                  name="cardName"
                  label="Nombre en la tarjeta"
                  placeholder="Juan Pérez"
                  value={paymentInfo.cardName}
                  onChange={handleInputChange}
                  required
                />
                
                <div className="border-t pt-6 mt-6">
                  <h2 className="text-xl font-semibold mb-4">Política de cancelación</h2>
                  <p className="text-gray-700">Cancelación gratuita por 48 horas. Después, cancelación gratuita hasta 5 días antes de la llegada. Cancelación parcial (50%) hasta 24 horas antes de la llegada.</p>
                </div>
                
                <div className="flex items-center mb-6">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-[#FF385C] focus:ring-[#FF385C] border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                    Acepto los <a href="#" className="text-[#FF385C]">términos y condiciones</a> y la <a href="#" className="text-[#FF385C]">política de privacidad</a>
                  </label>
                </div>
                
                <Button 
                  variant="primary" 
                  size="lg" 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Procesando...' : 'Confirmar y pagar'}
                </Button>
              </form>
            </div>
          </div>
          
          {/* Resumen de reserva */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 shadow-lg sticky top-24">
              <div className="flex items-start space-x-4 pb-6 mb-6 border-b">
                <div className="bg-gray-200 h-20 w-20 rounded-lg overflow-hidden">
                  {property.images && property.images.length > 0 ? (
                    <img 
                      src={property.images[0]} 
                      alt={property.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Imagen
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{property.title}</h3>
                  <p className="text-gray-600">{`${property.address.city}, ${property.address.country}`}</p>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-4">Detalles del precio</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>€{property.pricePerNight} x {bookingData.nights} noches</span>
                  <span>€{property.pricePerNight * bookingData.nights}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tarifa de limpieza</span>
                  <span>€50</span>
                </div>
                <div className="flex justify-between">
                  <span>Tarifa de servicio</span>
                  <span>€{Math.round(property.pricePerNight * bookingData.nights * 0.15)}</span>
                </div>
                <div className="pt-4 border-t flex justify-between font-bold">
                  <span>Total</span>
                  <span>€{bookingData.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
