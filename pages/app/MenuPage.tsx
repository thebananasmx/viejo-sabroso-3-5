import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { firebaseService } from '../../services/firebaseService';
import { Category, MenuItem } from '../../types';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { PlusIcon, EditIcon, TrashIcon } from '../../components/icons/Icons';
import { useToast } from '../../hooks/useToast';
import Spinner from '../../components/ui/Spinner';

const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    return reject(new Error('Could not get canvas context'));
                }
                ctx.drawImage(img, 0, 0, width, height);
                
                resolve(canvas.toDataURL('image/jpeg', 0.8)); // Adjust quality as needed
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};


const MenuPage: React.FC = () => {
    const { user } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Menu item modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<MenuItem> | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Category modal state
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<Partial<Category> | null>(null);
    const [isSavingCategory, setIsSavingCategory] = useState(false);
    
    const { addToast } = useToast();

    const fetchMenu = async () => {
        if (user?.businessId) {
            try {
                setLoading(true);
                const menuData = await firebaseService.getMenu(user.businessId);
                setCategories(menuData.categories);
                setItems(menuData.items);
            } catch (error) {
                console.error("Failed to fetch menu", error);
                addToast('Error al cargar el menú.', 'error');
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchMenu();
    }, [user]);

    // --- Menu Item Modal Logic ---
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

    // --- Category Modal Logic ---
    const openCategoryModal = (category?: Category) => {
        setCurrentCategory(category || { name: '' });
        setIsCategoryModalOpen(true);
    };

    const closeCategoryModal = () => {
        setIsCategoryModalOpen(false);
        setCurrentCategory(null);
    };

    // --- CRUD Handlers ---
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentItem || !user?.businessId || !currentItem.categoryId) {
            addToast("Por favor, llena todos los campos, incluida la categoría.", 'error');
            return;
        };
        setIsSaving(true);

        try {
            let imageUrl = currentItem.imageUrl || '';
            if (imageFile) {
                imageUrl = await resizeImage(imageFile, 800, 600);
            }

            const itemToSave = { 
                ...currentItem, 
                imageUrl, 
                businessId: user.businessId 
            } as Omit<MenuItem, 'id'> & { id?: string };
            
            if (itemToSave.id) {
                await firebaseService.updateMenuItem(itemToSave as MenuItem);
                addToast('¡Platillo actualizado con éxito!', 'success');
            } else {
                await firebaseService.addMenuItem(itemToSave);
                addToast('¡Platillo añadido con éxito!', 'success');
            }
            
            await fetchMenu(); // Refetch all menu data to show updates
            closeModal();
        } catch (error) {
            console.error("Failed to save menu item", error);
            addToast("Error al guardar el platillo. Por favor, inténtalo de nuevo.", 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (itemId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este platillo?')) {
            try {
                await firebaseService.deleteMenuItem(itemId);
                setItems(items.filter(i => i.id !== itemId));
                addToast('Platillo eliminado con éxito.', 'success');
            } catch (error) {
                console.error("Failed to delete menu item", error);
                addToast("Error al eliminar el platillo. Por favor, inténtalo de nuevo.", 'error');
            }
        }
    };

    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentCategory?.name || !user?.businessId) {
            addToast("El nombre de la categoría no puede estar vacío.", 'error');
            return;
        }
        setIsSavingCategory(true);
        try {
            const categoryToSave = {
                name: currentCategory.name,
                businessId: user.businessId,
                id: currentCategory.id,
            };

            if (categoryToSave.id) {
                await firebaseService.updateCategory(categoryToSave as Category);
                addToast('¡Categoría actualizada con éxito!', 'success');
            } else {
                await firebaseService.addCategory({ name: categoryToSave.name, businessId: categoryToSave.businessId });
                addToast('¡Categoría añadida con éxito!', 'success');
            }
            await fetchMenu();
            closeCategoryModal();
        } catch (error) {
            console.error("Failed to save category", error);
            addToast("Error al guardar la categoría.", 'error');
        } finally {
            setIsSavingCategory(false);
        }
    };

    const handleDeleteCategory = async (categoryId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría? Esto también eliminará todos los platillos que contiene.')) {
            try {
                await firebaseService.deleteCategory(categoryId);
                addToast('Categoría y sus platillos eliminados con éxito.', 'success');
                await fetchMenu(); // Re-fetch everything
            } catch (error) {
                console.error("Failed to delete category", error);
                addToast("Error al eliminar la categoría.", 'error');
            }
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-96">
            <Spinner size="lg" />
        </div>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-brand-light">Menú</h1>
                <Button onClick={() => openModal()} className="flex items-center" disabled={categories.length === 0}>
                    <PlusIcon className="h-5 w-5 mr-2" /> Añadir Platillo
                </Button>
            </div>

            <Card className="p-6 mb-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-brand-light">Categorías</h2>
                    <Button onClick={() => openCategoryModal()} size="sm" className="flex items-center">
                        <PlusIcon className="h-4 w-4 mr-2" /> Nueva Categoría
                    </Button>
                </div>
                {categories.length === 0 ? (
                    <p className="mt-4 text-gray-400">Aún no has añadido categorías. Haz clic en "Nueva Categoría" para empezar.</p>
                ) : (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {categories.map(category => (
                            <div key={category.id} className="bg-gray-800 rounded-lg p-3 flex justify-between items-center">
                                <span className="font-medium text-gray-300">{category.name}</span>
                                <div className="flex space-x-2">
                                    <button onClick={() => openCategoryModal(category)} className="text-gray-400 hover:text-brand-primary">
                                        <EditIcon className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => handleDeleteCategory(category.id)} className="text-gray-400 hover:text-red-500">
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {categories.map(category => (
                <div key={category.id} className="mb-8">
                    <h2 className="text-2xl font-semibold text-brand-light mb-4">{category.name}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.filter(item => item.categoryId === category.id).map(item => (
                            <Card key={item.id} className="flex flex-col">
                                <img src={item.imageUrl || 'https://via.placeholder.com/400x300'} alt={item.name} className="w-full h-48 object-cover"/>
                                <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="text-lg font-bold text-brand-light">{item.name}</h3>
                                    <p className="text-gray-400 text-sm mt-1 flex-grow">{item.description}</p>
                                    <p className="text-brand-primary font-bold mt-2 text-lg">${item.price.toFixed(2)}</p>
                                </div>
                                <div className="p-4 bg-brand-dark flex justify-end space-x-2">
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

            <Modal isOpen={isModalOpen} onClose={closeModal} title={currentItem?.id ? 'Editar Platillo' : 'Añadir Platillo'}>
                <form onSubmit={handleSave} className="space-y-4">
                    <Input label="Nombre" value={currentItem?.name || ''} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} required/>
                    <Input label="Descripción" value={currentItem?.description || ''} onChange={e => setCurrentItem({...currentItem, description: e.target.value})} required/>
                    <Input label="Precio" type="number" step="0.01" value={currentItem?.price || ''} onChange={e => setCurrentItem({...currentItem, price: parseFloat(e.target.value)})} required/>
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-1">Imagen</label>
                        <input type="file" id="image" accept="image/*" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20"/>
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Categoría</label>
                        <select
                            id="category"
                            value={currentItem?.categoryId || ''}
                            onChange={e => setCurrentItem({...currentItem, categoryId: e.target.value})}
                            required
                            className="w-full px-3 py-2 bg-brand-dark-accent border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                        >
                             <option value="" disabled>Selecciona una categoría</option>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="ghost" type="button" onClick={closeModal} disabled={isSaving}>Cancelar</Button>
                        <Button type="submit" disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar Platillo'}</Button>
                    </div>
                </form>
            </Modal>
            
            <Modal isOpen={isCategoryModalOpen} onClose={closeCategoryModal} title={currentCategory?.id ? 'Editar Categoría' : 'Añadir Categoría'}>
                <form onSubmit={handleSaveCategory} className="space-y-4">
                    <Input 
                        label="Nombre de Categoría" 
                        value={currentCategory?.name || ''} 
                        onChange={e => setCurrentCategory({...currentCategory, name: e.target.value})} 
                        required 
                        autoFocus
                    />
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="ghost" type="button" onClick={closeCategoryModal} disabled={isSavingCategory}>Cancelar</Button>
                        <Button type="submit" disabled={isSavingCategory}>{isSavingCategory ? 'Guardando...' : 'Guardar Categoría'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default MenuPage;