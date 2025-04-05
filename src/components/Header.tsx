"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@assets/icon/nomhy.webp";
import { useAuth } from "@/lib/AuthContext";
import UserMenu from "./ui/user-menu";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false); // cerrar menú móvil si estaba abierto
  };

  if (!isMounted) return null;

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src={Logo.src}
              alt="Airbnb"
              width={160}
              height={40}
              className="max-h-20 max-w-[160px] object-contain"
            />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-700 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex items-center justify-center flex-grow">
          <div className="flex items-center border border-gray-300 rounded-full p-2 shadow-sm hover:shadow-md transition-shadow">
            <button className="px-4 font-medium">Cualquier lugar</button>
            <span className="h-6 border-r border-gray-300"></span>
            <button className="px-4 font-medium">Cualquier semana</button>
            <span className="h-6 border-r border-gray-300"></span>
            <button className="px-4 text-gray-500">Añadir huéspedes</button>
            <button className="bg-[#008259] text-white p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated && user ? (
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-full border border-gray-300 hover:shadow-md transition-shadow"
              >
                Iniciar sesión
              </Link>
              <Link href="/register" className="btn-primary rounded-full">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-4 bg-white shadow">
          {isAuthenticated ? (
            <>
              <Link href="/host/properties" className="block py-2">
                Anfitrión
              </Link>
              <Link href="#" className="block py-2">
                Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="block py-2 w-full text-left text-red-500"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-2">
                Iniciar sesión
              </Link>
              <Link href="/register" className="block py-2">
                Registrarse
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
