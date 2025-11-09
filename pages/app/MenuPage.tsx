
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { firebaseService } from '../../services/firebaseService';
import { Category, MenuItem } from '../../types';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { PlusIcon, EditIcon, TrashIcon } from '../../components/icons/Icons';

const MenuPage: React.FC = () => {
    const { user } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<MenuItem> | null>(null);

    useEffect(() => {
        const fetchMenu = async () => {
            if (user?.businessId) {
                try {
                    const menuData = await firebaseService.getMenu(user.businessId);
                    setCategories(menuData.categories);
                    setItems(menuData.items);
                } catch (error) {
                    console.error("Failed to fetch menu", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchMenu();
    }, [user]);

    const openModal = (item?: MenuItem) => {
        setCurrentItem(item || { name: '', description: '', price: 0, categoryId: categories[0]?.id });
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentItem || !user?.businessId) return;

        try {
            const itemToSave = { ...currentItem, businessId: user.businessId } as Omit<MenuItem, 'id'> & { id?: string };
            
            if (itemToSave.id) {
                const updatedItem = await firebaseService.updateMenuItem(itemToSave as MenuItem);
                setItems(items.map(i => i.id === updatedItem.id ? updatedItem : i));
            } else {
                const newItem = await firebaseService.addMenuItem(itemToSave);
                setItems([...items, newItem]);
            }
            setIsModalOpen(false);
            setCurrentItem(null);
        } catch (error) {
            console.error("Failed to save menu item", error);
        }
    };

    const handleDelete = async (itemId: string) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await firebaseService.deleteMenuItem(itemId);
                setItems(items.filter(i => i.id !== itemId));
            } catch (error) {
                console.error("Failed to delete menu item", error);
            }
        }
    };

    if (loading) return <div>Loading menu...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Menu</h1>
                <Button onClick={() => openModal()} className="flex items-center">
                    <PlusIcon className="h-5 w-5 mr-2" /> Add Item
                </Button>
            </div>

            {categories.map(category => (
                <div key={category.id} className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">{category.name}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.filter(item => item.categoryId === category.id).map(item => (
                            <Card key={item.id} className="flex flex-col">
                                <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover"/>
                                <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="text-lg font-bold">{item.name}</h3>
                                    <p className="text-gray-600 text-sm mt-1 flex-grow">{item.description}</p>
                                    <p className="text-primary-600 font-bold mt-2 text-lg">${item.price.toFixed(2)}</p>
                                </div>
                                <div className="p-4 bg-gray-50 flex justify-end space-x-2">
                                    <Button variant="ghost" size="sm" onClick={() => openModal(item)}>
                                        <EditIcon className="h-4 w-4"/>
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>
                                        <TrashIcon className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentItem?.id ? 'Edit Menu Item' : 'Add Menu Item'}>
                <form onSubmit={handleSave} className="space-y-4">
                    <Input label="Name" value={currentItem?.name || ''} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} required/>
                    <Input label="Description" value={currentItem?.description || ''} onChange={e => setCurrentItem({...currentItem, description: e.target.value})} required/>
                    <Input label="Price" type="number" step="0.01" value={currentItem?.price || ''} onChange={e => setCurrentItem({...currentItem, price: parseFloat(e.target.value)})} required/>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            id="category"
                            value={currentItem?.categoryId || ''}
                            onChange={e => setCurrentItem({...currentItem, categoryId: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        >
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Save Item</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default MenuPage;
