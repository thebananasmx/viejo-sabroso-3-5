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
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const fetchMenu = async () => {
        if (user?.businessId) {
            try {
                setLoading(true);
                const menuData = await firebaseService.getMenu(user.businessId);
                // Ensure categories exist before setting items, for the dropdown.
                if (menuData.categories.length === 0) {
                    // Handle case where there are no categories yet.
                    // You might want to prompt the user to create a category first.
                    console.warn("No categories found for this business.");
                }
                setCategories(menuData.categories);
                setItems(menuData.items);
            } catch (error) {
                console.error("Failed to fetch menu", error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchMenu();
    }, [user]);

    const openModal = (item?: MenuItem) => {
        setCurrentItem(item || { name: '', description: '', price: 0, imageUrl: '', categoryId: categories[0]?.id });
        setImageFile(null);
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentItem(null);
        setImageFile(null);
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentItem || !user?.businessId || !currentItem.categoryId) {
            alert("Please fill all fields, including category.");
            return;
        };
        setIsSaving(true);

        try {
            let imageUrl = currentItem.imageUrl || '';
            if (imageFile) {
                const imagePath = `menuItems/${user.businessId}/${Date.now()}_${imageFile.name}`;
                imageUrl = await firebaseService.uploadImage(imageFile, imagePath);
            }

            const itemToSave = { 
                ...currentItem, 
                imageUrl, 
                businessId: user.businessId 
            } as Omit<MenuItem, 'id'> & { id?: string };
            
            if (itemToSave.id) {
                await firebaseService.updateMenuItem(itemToSave as MenuItem);
            } else {
                await firebaseService.addMenuItem(itemToSave);
            }
            
            await fetchMenu(); // Refetch all menu data to show updates
            closeModal();
        } catch (error) {
            console.error("Failed to save menu item", error);
            alert("Failed to save item. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (itemId: string) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await firebaseService.deleteMenuItem(itemId);
                setItems(items.filter(i => i.id !== itemId));
            } catch (error) {
                console.error("Failed to delete menu item", error);
                alert("Failed to delete item. Please try again.");
            }
        }
    };

    if (loading) return <div>Loading menu...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Menu</h1>
                <Button onClick={() => openModal()} className="flex items-center" disabled={categories.length === 0}>
                    <PlusIcon className="h-5 w-5 mr-2" /> Add Item
                </Button>
            </div>
            {categories.length === 0 && (
                <Card className="p-6 text-center text-gray-600">
                    <p>You don't have any categories yet.</p>
                    <p>Please contact support to add categories to your menu.</p> 
                    {/* In a real app, you'd have a category management UI */}
                </Card>
            )}

            {categories.map(category => (
                <div key={category.id} className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">{category.name}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.filter(item => item.categoryId === category.id).map(item => (
                            <Card key={item.id} className="flex flex-col">
                                <img src={item.imageUrl || 'https://via.placeholder.com/400x300'} alt={item.name} className="w-full h-48 object-cover"/>
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

            <Modal isOpen={isModalOpen} onClose={closeModal} title={currentItem?.id ? 'Edit Menu Item' : 'Add Menu Item'}>
                <form onSubmit={handleSave} className="space-y-4">
                    <Input label="Name" value={currentItem?.name || ''} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} required/>
                    <Input label="Description" value={currentItem?.description || ''} onChange={e => setCurrentItem({...currentItem, description: e.target.value})} required/>
                    <Input label="Price" type="number" step="0.01" value={currentItem?.price || ''} onChange={e => setCurrentItem({...currentItem, price: parseFloat(e.target.value)})} required/>
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                        <input type="file" id="image" accept="image/*" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"/>
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            id="category"
                            value={currentItem?.categoryId || ''}
                            onChange={e => setCurrentItem({...currentItem, categoryId: e.target.value})}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        >
                             <option value="" disabled>Select a category</option>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="ghost" type="button" onClick={closeModal} disabled={isSaving}>Cancel</Button>
                        <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Item'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default MenuPage;