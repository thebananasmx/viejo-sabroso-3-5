
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { firebaseService } from '../../services/firebaseService';
import { Business, Category, MenuItem, OrderItem } from '../../types';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import { CheckCircleIcon } from '../../components/icons/Icons';

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
            } finally {
                setLoading(false);
            }
        };
        fetchBusinessAndMenu();
    }, [slug]);

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
        } catch(error) {
            console.error("Failed to place order", error);
            alert("There was an error placing your order. Please try again.");
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (loading) return <div className="text-center p-10">Loading Menu...</div>;
    if (!business) return <div className="text-center p-10">Menu not found.</div>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-4xl font-bold text-center mb-2">{business.name}</h1>
            <p className="text-lg text-gray-600 text-center mb-8">Welcome! Order from your table.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    {categories.map(category => (
                        <div key={category.id} className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{category.name}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {items.filter(item => item.categoryId === category.id).map(item => (
                                    <Card key={item.id} className="flex flex-col">
                                        <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover"/>
                                        <div className="p-4 flex flex-col flex-grow">
                                            <h3 className="text-lg font-bold">{item.name}</h3>
                                            <p className="text-gray-600 text-sm mt-1 flex-grow">{item.description}</p>
                                            <div className="flex justify-between items-center mt-4">
                                                <p className="text-primary-600 font-bold text-lg">${item.price.toFixed(2)}</p>
                                                <Button size="sm" onClick={() => addToCart(item)}>Add</Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="md:col-span-1">
                    <div className="sticky top-24">
                        <Card className="p-6">
                            <h2 className="text-xl font-bold mb-4">Your Order</h2>
                            {cart.length === 0 ? (
                                <p className="text-gray-500">Your cart is empty.</p>
                            ) : (
                                <>
                                    <div className="space-y-2 mb-4">
                                        {cart.map(item => (
                                            <div key={item.menuItemId} className="flex justify-between items-center text-sm">
                                                <span className="font-medium">{item.quantity}x {item.name}</span>
                                                <span>${(item.quantity * item.price).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t pt-4 flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="mt-4">
                                        <input
                                            type="number"
                                            placeholder="Your Table Number"
                                            value={tableNumber}
                                            onChange={e => setTableNumber(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>
                                    <Button 
                                        className="w-full mt-4" 
                                        onClick={handlePlaceOrder}
                                        disabled={!tableNumber || cart.length === 0 || isPlacingOrder}
                                    >
                                        {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                                    </Button>
                                </>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
            
            <Modal isOpen={isOrderPlaced} onClose={() => setIsOrderPlaced(false)} title="Order Placed!">
                <div className="text-center">
                    <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500 mb-4"/>
                    <p className="text-lg text-gray-700">
                        Your order has been sent to the kitchen. It will be with you shortly!
                    </p>
                    <Button className="mt-6" onClick={() => setIsOrderPlaced(false)}>Close</Button>
                </div>
            </Modal>
        </div>
    );
};

export default CustomerMenuPage;
