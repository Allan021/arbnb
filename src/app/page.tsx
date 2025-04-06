"use client";

import Link from "next/link";
import { useProperties } from "../hooks/useProperties";
import Image from "next/image";
import Header from "@/components/Header";
import Playa from "@assets/web/playa.webp";
import Montana from "@assets/web/montain.webp";
import Ciudad from "@assets/web/ciudad.webp";
import Campo from "@assets/web/campo.webp";

export default function Home() {
  const { data: properties, isLoading } = useProperties();

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="w-full bg-[#57bd9e] py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl font-semibold mb-6">
            Encuentra alojamientos únicos
          </h1>
          <p className="text-xl mb-8">
            Descubre espacios que se adaptan a ti en cualquier parte del mundo
          </p>
          <div className="max-w-2xl mx-auto bg-white rounded-full shadow-lg p-2 flex">
            <input
              type="text"
              placeholder="¿A dónde quieres ir?"
              className="flex-grow px-4 py-2 focus:outline-none"
            />
            <button className="btn-primary rounded-full">Buscar</button>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="w-full py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Alojamientos destacados</h2>
          {isLoading ? (
            <p className="text-center text-gray-500">Cargando propiedades...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties &&
                properties.map((property) => (
                  <Link
                    key={property._id}
                    href={`/properties/${property._id}`}
                    style={{
                      borderRadius: "1rem",
                    }}
                    className="card hover:shadow-lg transition-shadow border  overflow-hidden bg-white"
                  >
                    <div className="relative h-64 w-full">
                      <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-lg">{property.title}</h3>
                        <div className="flex items-center text-yellow-500 font-semibold">
                          <span className="mr-1">★</span>
                          <span>{property.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">
                        {property.address.city}, {property.address.country}
                      </p>
                      <p className="text-gray-600 mb-4">Fechas flexibles</p>
                      <p>
                        <span className="font-bold">
                          €{property.pricePerNight}
                        </span>{" "}
                        noche
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Explora por categoría</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Playa",
                img: Playa.src,
              },
              {
                name: "Montaña",
                img: Montana.src,
              },
              {
                name: "Ciudad",
                img: Ciudad.src,
              },
              {
                name: "Campo",
                img: Campo.src,
              },
            ].map((category) => (
              <div
                key={category.name}
                className="card hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="relative h-40 w-full bg-gray-200 overflow-hidden rounded-t">
                  <Image
                    src={category.img}
                    alt={`Imagen de ${category.name}`}
                    className="w-full h-full object-cover"
                    fill
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold">{category.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-100 py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-4">Soporte</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:underline">
                    Centro de ayuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Información de seguridad
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Opciones de cancelación
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Comunidad</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:underline">
                    Foro de la comunidad
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Cómo hospedar
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Reglas de la casa
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Acerca de</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:underline">
                    Cómo funciona
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Términos y condiciones
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Privacidad
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p>© 2025 Nomhy. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
