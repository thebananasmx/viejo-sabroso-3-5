

import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../hooks/useToast';

const StyleguidePage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addToast } = useToast();

    const colors = [
        { name: 'Primario', hex: '#D4FF4F', class: 'bg-brand-primary' },
        { name: 'Oscuro', hex: '#0A1F1B', class: 'bg-brand-dark' },
        { name: 'Claro', hex: '#F9F9F7', class: 'bg-brand-light' },
        { name: 'Acento Oscuro', hex: '#112b26', class: 'bg-brand-dark-accent' },
    ];

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="font-serif text-5xl font-bold text-brand-light mb-8">Style Guide</h1>
            
            {/* Colors Section */}
            <section className="mb-12">
                <h2 className="font-serif text-3xl font-bold text-brand-light mb-4 border-b border-gray-700 pb-2">Colores</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {colors.map(color => (
                        <div key={color.name}>
                            <div className={`h-24 rounded-lg ${color.class} border border-gray-700`}></div>
                            <p className="mt-2 font-semibold text-brand-light">{color.name}</p>
                            <p className="text-sm text-gray-400">{color.hex}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Typography Section */}
            <section className="mb-12">
                <h2 className="font-serif text-3xl font-bold text-brand-light mb-4 border-b border-gray-700 pb-2">Tipografía</h2>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-400 mb-1">H1 - Playfair Display</p>
                        <h1 className="font-serif text-5xl font-bold text-brand-light">El Rápido Zorro Marrón Salta</h1>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">H2 - Playfair Display</p>
                        <h2 className="font-serif text-4xl font-bold text-brand-light">El Rápido Zorro Marrón Salta</h2>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">H3 - Playfair Display</p>
                        <h3 className="font-serif text-3xl font-bold text-brand-light">El Rápido Zorro Marrón Salta</h3>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Texto de Párrafo - Inter</p>
                        <p className="text-lg text-brand-light max-w-2xl">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.
                        </p>
                    </div>
                </div>
            </section>

            {/* Components Section */}
            <section>
                <h2 className="font-serif text-3xl font-bold text-brand-light mb-4 border-b border-gray-700 pb-2">Componentes</h2>
                <div className="space-y-8">
                    {/* Buttons */}
                    <div>
                        <h3 className="text-2xl font-semibold text-brand-light mb-4">Botones</h3>
                        <div className="flex flex-wrap items-center gap-4">
                            <Button size="sm">Pequeño</Button>
                            <Button size="md">Mediano</Button>
                            <Button size="lg">Grande</Button>
                            <Button variant="secondary">Secundario</Button>
                            <Button variant="danger">Peligro</Button>
                            <Button variant="ghost">Fantasma</Button>
                            <Button disabled>Deshabilitado</Button>
                        </div>
                    </div>

                    {/* Cards */}
                    <div>
                        <h3 className="text-2xl font-semibold text-brand-light mb-4">Tarjeta</h3>
                        <Card className="max-w-sm p-6">
                            <h4 className="font-bold text-xl text-brand-light">Título de la Tarjeta</h4>
                            <p className="text-gray-400 mt-2">Este es el contenido dentro de un componente de tarjeta. Es ideal para agrupar información relacionada.</p>
                        </Card>
                    </div>

                    {/* Product Card */}
                    <div>
                        <h3 className="text-2xl font-semibold text-brand-light mb-4">Tarjeta de Producto</h3>
                        <div className="max-w-lg">
                            <Card className="flex">
                                <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" alt="Hamburguesa Clásica" className="w-32 h-32 object-cover flex-shrink-0"/>
                                <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="text-lg font-bold text-brand-light">Hamburguesa Clásica</h3>
                                    <p className="text-gray-400 text-sm mt-1 flex-grow line-clamp-2">Carne de res jugosa, lechuga fresca, tomate y queso cheddar en un pan brioche. Acompañada de nuestras papas fritas caseras y una salsa especial de la casa que te encantará.</p>
                                    <div className="flex justify-between items-center mt-4">
                                        <p className="text-brand-primary font-bold text-lg">$14.99</p>
                                        <Button size="sm">Añadir</Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Inputs */}
                    <div>
                        <h3 className="text-2xl font-semibold text-brand-light mb-4">Campo de Entrada</h3>
                        <div className="max-w-sm">
                            <Input label="Correo Electrónico" placeholder="tu@ejemplo.com" />
                        </div>
                    </div>

                    {/* Modal */}
                    <div>
                        <h3 className="text-2xl font-semibold text-brand-light mb-4">Modal</h3>
                        <Button onClick={() => setIsModalOpen(true)}>Abrir Modal</Button>
                        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Esto es un Modal">
                            <p className="text-gray-300">Este es el contenido del modal. Puedes poner cualquier componente de React que desees aquí.</p>
                            <div className="mt-6 flex justify-end space-x-2">
                                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                                <Button onClick={() => setIsModalOpen(false)}>Confirmar</Button>
                            </div>
                        </Modal>
                    </div>
                    
                    {/* Toasts */}
                    <div>
                        <h3 className="text-2xl font-semibold text-brand-light mb-4">Notificaciones</h3>
                        <div className="flex space-x-4">
                            <Button onClick={() => addToast('¡Este es un mensaje de éxito!', 'success')}>Mostrar Notificación de Éxito</Button>
                            <Button variant="danger" onClick={() => addToast('¡Este es un mensaje de error!', 'error')}>Mostrar Notificación de Error</Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default StyleguidePage;