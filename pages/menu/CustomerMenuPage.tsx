

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { firebaseService } from '../../services/firebaseService';
import { Business, Category, MenuItem, OrderItem } from '../../types';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import { CheckCircleIcon } from '../../components/icons/Icons';
import { useToast } from '../../hooks/useToast';
import Spinner from '../../components/ui/Spinner';

const CustomerMenuPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [business, setBusiness] = useState<Business | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [items, setItems] = useState<MenuItem[]>([]);
    const [cart, setCart] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [tableNumber, setTableNumber] = useState('');
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchBusinessAndMenu = async () => {
            if (!slug) return;
            try {
                const biz = await firebaseService.getBusinessBySlug(slug);
                if (biz) {
                    setBusiness(biz);
                    const menu = await firebaseService.getMenu(biz.id);
                    setCategories(menu.categories);
                    setItems(menu.items);
                }
            } catch (error) {
                console.error("Failed to fetch menu", error);
                addToast('Error al cargar el menú.', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchBusinessAndMenu();
    }, [slug, addToast]);

    const addToCart = (item: MenuItem) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(ci => ci.menuItemId === item.id);
            if (existingItem) {
                return prevCart.map(ci => 
                    ci.menuItemId === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
                );
            }
            return [...prevCart, { menuItemId: item.id, name: item.name, quantity: 1, price: item.price }];
        });
        addToast(`¡${item.name} añadido al carrito!`, 'success');
    };

    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const handlePlaceOrder = async () => {
        if (!tableNumber || cart.length === 0 || !business) return;
        setIsPlacingOrder(true);
        try {
            await firebaseService.placeOrder({
                businessId: business.id,
                tableNumber: parseInt(tableNumber, 10),
                items: cart,
                total: cartTotal,
            });
            setCart([]);
            setTableNumber('');
            setIsOrderPlaced(true);
            setIsCartModalOpen(false);
        } catch(error) {
            console.error("Failed to place order", error);
            addToast("Hubo un error al realizar tu pedido. Por favor, inténtalo de nuevo.", 'error');
        } finally {
            setIsPlacingOrder(false);
        }
    };

    const handleTableNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only digits by removing non-numeric characters
        const sanitizedValue = value.replace(/[^0-9]/g, '');
        setTableNumber(sanitizedValue);
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <Spinner size="lg" />
        </div>
    );

    if (!business) return <div className="text-center p-10">Menú no encontrado.</div>;

    const CartContent = () => (
        <>
            {cart.length === 0 ? (
                <p className="text-gray-400">Tu carrito está vacío.</p>
            ) : (
                <>
                    <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                        {cart.map(item => (
                            <div key={item.menuItemId} className="flex justify-between items-center text-sm">
                                <span className="font-medium text-brand-light">{item.quantity}x {item.name}</span>
                                <span className="text-gray-300">${(item.quantity * item.price).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-gray-700 pt-4 flex justify-between font-bold text-lg text-brand-light">
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="mt-4">
                        <input
                            type="tel"
                            placeholder="Tu Número de Mesa"
                            value={tableNumber}
                            onChange={handleTableNumberChange}
                            className="w-full px-4 py-2.5 bg-brand-dark-accent border border-gray-700 rounded-lg shadow-sm text-brand-light placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent sm:text-sm"
                        />
                    </div>
                    <Button 
                        className="w-full mt-4" 
                        onClick={handlePlaceOrder}
                        disabled={!tableNumber || cart.length === 0 || isPlacingOrder}
                    >
                        {isPlacingOrder ? 'Realizando Pedido...' : 'Realizar Pedido'}
                    </Button>
                </>
            )}
        </>
    );

    const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="container mx-auto p-4 md:p-8 pb-32 md:pb-8">
            <div className="text-center mb-8">
                {business.logoUrl ? (
                    <img src={business.logoUrl} alt={business.name} className="h-20 md:h-24 mx-auto w-auto object-contain" />
                ) : (
                    <h1 className="font-serif text-4xl font-bold text-brand-light">{business.name}</h1>
                )}
                <p className="text-lg text-gray-400 mt-2">¡Bienvenido! Ordena desde tu mesa.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    {categories.map(category => (
                        <div key={category.id} className="mb-8">
                            <h2 className="font-serif text-3xl font-semibold text-brand-light mb-4">{category.name}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {items.filter(item => item.categoryId === category.id).map(item => (
                                    <Card key={item.id} className="flex">
                                        <div className="w-32 flex-shrink-0">
                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover"/>
                                        </div>
                                        <div className="p-4 flex flex-col flex-grow">
                                            <h3 className="text-lg font-bold text-brand-light">{item.name}</h3>
                                            <p className="text-gray-400 text-sm mt-1 flex-grow line-clamp-2">{item.description}</p>
                                            <div className="flex justify-between items-center mt-4">
                                                <p className="text-brand-primary font-bold text-lg">${item.price.toFixed(2)}</p>
                                                <Button size="sm" onClick={() => addToCart(item)}>Añadir</Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="md:col-span-1">
                    <div className="hidden md:block sticky top-24">
                        <Card className="p-6">
                             <h2 className="text-xl font-bold mb-4 text-brand-light">Tu Pedido</h2>
                            <CartContent />
                        </Card>
                    </div>
                </div>
            </div>
            
            {cart.length > 0 && (
                <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-brand-dark/90 backdrop-blur-sm z-20 border-t border-gray-800">
                     <Button className="w-full shadow-lg" size="lg" onClick={() => setIsCartModalOpen(true)}>
                        <div className="flex justify-between items-center w-full px-2">
                            <span className="bg-brand-primary text-brand-dark font-bold rounded-full h-7 w-7 flex items-center justify-center text-sm">{cartItemCount}</span>
                            <span className="font-bold text-base text-brand-dark">Ver Pedido</span>
                            <span className="font-semibold text-base text-brand-dark">${cartTotal.toFixed(2)}</span>
                        </div>
                     </Button>
                </div>
            )}

            <Modal isOpen={isCartModalOpen} onClose={() => setIsCartModalOpen(false)} title="Tu Pedido">
                <CartContent />
            </Modal>
            
            <Modal isOpen={isOrderPlaced} onClose={() => setIsOrderPlaced(false)} title="¡Pedido Realizado!">
                <div className="text-center">
                    <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500 mb-4"/>
                    <p className="text-lg text-gray-300">
                        Tu pedido ha sido enviado a la cocina. ¡Estará contigo en breve!
                    </p>
                    <Button className="mt-6" onClick={() => setIsOrderPlaced(false)}>Cerrar</Button>
                </div>
            </Modal>
        </div>
    );
};

export default CustomerMenuPage;