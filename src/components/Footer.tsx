import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-100 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold mb-4">Soporte</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Centro de ayuda</a></li>
              <li><a href="#" className="hover:underline">Información de seguridad</a></li>
              <li><a href="#" className="hover:underline">Opciones de cancelación</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Comunidad</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Foro de la comunidad</a></li>
              <li><a href="#" className="hover:underline">Cómo hospedar</a></li>
              <li><a href="#" className="hover:underline">Reglas de la casa</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Acerca de</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Cómo funciona</a></li>
              <li><a href="#" className="hover:underline">Términos y condiciones</a></li>
              <li><a href="#" className="hover:underline">Privacidad</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p>© 2025 AirBnB Clone. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
