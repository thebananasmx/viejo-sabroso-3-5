
import React from 'react';

const ChangelogPage: React.FC = () => {
  return (
    <div className="bg-brand-dark-accent py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-5xl font-bold text-brand-light text-center mb-4">Registro de Cambios</h1>
          <p className="text-xl text-gray-400 text-center mb-12">
            Mantente al día con las últimas características, mejoras y correcciones de Viejo Sabroso.
          </p>

          <div className="space-y-12">
            {/* Version 3.5.1 */}
            <article>
              <div className="flex items-center space-x-4 mb-4">
                <h2 className="font-serif text-4xl font-bold text-brand-light">Versión 3.5.1</h2>
                <span className="bg-blue-500 text-white font-bold text-sm px-3 py-1 rounded-full">
                  Mejoras
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-6">26 de Julio de 2024</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold text-brand-primary mb-3">🚀 Nuevas Características</h3>
                  <ul className="list-disc list-inside space-y-2 text-brand-light">
                    <li><strong>Internacionalización:</strong> Se cambió el nombre de "Tablero" a "Dashboard" en toda la aplicación para una mayor coherencia.</li>
                    <li><strong>Páginas Públicas:</strong> Se agregaron las páginas "Style Guide" y "Change Log" para mejorar la documentación y la transparencia del producto, accesibles desde el pie de página.</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold text-brand-primary mb-3">✨ Mejoras</h3>
                  <ul className="list-disc list-inside space-y-2 text-brand-light">
                    <li><strong>Diseño de Tarjeta de Producto:</strong> Se rediseñó la tarjeta de producto a un formato horizontal, con la imagen en formato cuadrado a la izquierda y los detalles a la derecha para una mejor legibilidad.</li>
                    <li><strong>Consistencia en la Interfaz:</strong> La descripción del producto ahora se limita a dos líneas, truncando el texto más largo con "..." para garantizar una altura de tarjeta uniforme en todo el menú.</li>
                    <li><strong>Visualización de Imágenes:</strong> Se mejoró la visualización de las imágenes del producto para que cubran completamente su contenedor (`object-cover`), evitando espacios en blanco y recortes.</li>
                  </ul>
                </div>

                 <div>
                  <h3 className="text-2xl font-semibold text-brand-primary mb-3">🐛 Correcciones de Errores</h3>
                   <p className="text-brand-light">Se corrigió un problema visual donde las imágenes de los productos no se ajustaban correctamente a la altura de la tarjeta, causando inconsistencias en el diseño.</p>
                </div>
              </div>
            </article>
            
            {/* Version 3.5.0 */}
            <article>
              <div className="flex items-center space-x-4 mb-4">
                <h2 className="font-serif text-4xl font-bold text-brand-light">Versión 3.5.0</h2>
                <span className="bg-brand-primary text-brand-dark font-bold text-sm px-3 py-1 rounded-full">
                  Lanzamiento Inicial
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-6">25 de Julio de 2024</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold text-brand-primary mb-3">🚀 Nuevas Características</h3>
                  <ul className="list-disc list-inside space-y-2 text-brand-light">
                    <li><strong>Registro y Autenticación:</strong> Sistema completo para que los negocios creen sus cuentas y gestionen el acceso.</li>
                    <li><strong>Gestión de Menú Dinámico:</strong> Crea, edita y elimina categorías y platillos con imágenes, descripciones y precios.</li>
                    <li><strong>Generación de Código QR:</strong> Cada negocio recibe un código QR único que enlaza directamente a su menú digital.</li>
                    <li><strong>Sistema de Pedidos del Cliente:</strong> Los clientes pueden escanear el QR, ver el menú y realizar pedidos directamente desde su mesa.</li>
                    <li><strong>Panel de Cocina en Tiempo Real:</strong> Una interfaz optimizada para que el personal de cocina vea y gestione los pedidos entrantes a medida que avanzan por las etapas de preparación.</li>
                    <li><strong>Dashboard de Negocio:</strong> Visualiza métricas clave como ingresos totales, número de pedidos y un resumen de ventas de los últimos 7 días.</li>
                    <li><strong>Panel de Administración:</strong> Una vista de superusuario para monitorear todos los negocios registrados y sus métricas de rendimiento.</li>
                     <li><strong>Página de Configuración:</strong> Permite a los negocios personalizar su logo y acceder fácilmente a la URL y al código QR de su menú.</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold text-brand-primary mb-3">✨ Mejoras</h3>
                  <ul className="list-disc list-inside space-y-2 text-brand-light">
                    <li><strong>Diseño Responsivo:</strong> Interfaz de usuario totalmente adaptativa para una experiencia perfecta en computadoras, tabletas y teléfonos móviles.</li>
                    <li><strong>Optimización de Imágenes:</strong> Las imágenes de los platillos se redimensionan en el lado del cliente antes de subirse para garantizar tiempos de carga rápidos.</li>
                    <li><strong>Feedback del Usuario Mejorado:</strong> Implementación de notificaciones (toasts) para confirmar acciones como registros exitosos, guardado de datos y errores.</li>
                    <li><strong>Flujo de Registro Simplificado:</strong> Un proceso de registro intuitivo en dos pasos que guía a los nuevos usuarios hasta la generación de su código QR.</li>
                  </ul>
                </div>

                 <div>
                  <h3 className="text-2xl font-semibold text-brand-primary mb-3">🐛 Correcciones de Errores</h3>
                   <p className="text-brand-light">¡Lanzamiento inicial! Aún no hay errores que corregir.</p>
                </div>
              </div>
            </article>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangelogPage;