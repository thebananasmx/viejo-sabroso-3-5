

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { firebaseService } from '../../services/firebaseService';
import { Business } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import QRCodeGenerator from '../../components/QRCodeGenerator';
import { useToast } from '../../hooks/useToast';
import Spinner from '../../components/ui/Spinner';

const SettingsPage: React.FC = () => {
    const { user } = useAuth();
    const [business, setBusiness] = useState<Business | null>(null);
    const [loading, setLoading] = useState(true);
    const [logoUrl, setLogoUrl] = useState('');
    const [isSavingLogo, setIsSavingLogo] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchBusiness = async () => {
            if (user?.businessId) {
                try {
                    const biz = await firebaseService.getBusinessById(user.businessId);
                    setBusiness(biz);
                    if (biz?.logoUrl) {
                        setLogoUrl(biz.logoUrl);
                    }
                } catch (error) {
                    console.error("Failed to fetch business details", error);
                    addToast("No se pudieron cargar los detalles del negocio.", 'error');
                } finally {
                    setLoading(false);
                }
            } else if (user && !user.businessId) {
                setLoading(false);
            }
        };
        fetchBusiness();
    }, [user, addToast]);

    const menuUrl = business ? `${window.location.origin}/#/menu/${business.slug}` : '';

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(menuUrl)
            .then(() => {
                addToast('¡URL copiada al portapapeles!', 'success');
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                addToast('Error al copiar la URL.', 'error');
            });
    };

    const handleSaveLogo = async () => {
        if (!business) return;
        setIsSavingLogo(true);
        try {
            await firebaseService.updateBusinessDetails(business.id, { logoUrl: logoUrl });
            setBusiness(prev => prev ? { ...prev, logoUrl } : null);
            addToast('¡Logo actualizado con éxito!', 'success');
        } catch (error) {
            console.error("Failed to save logo", error);
            addToast('Error al guardar el logo.', 'error');
        } finally {
            setIsSavingLogo(false);
        }
    };


    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!business) {
        return <p>No se pudo encontrar la información del negocio.</p>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-light mb-6">Configuración</h1>
            <div className="space-y-8">
                 <Card className="p-6">
                    <h2 className="text-2xl font-semibold text-brand-light mb-4">Logo del Negocio</h2>
                    <p className="text-gray-400 mb-4">
                        Añade una URL del logo de tu negocio para personalizar el tablero.
                    </p>
                    <div className="space-y-2">
                        <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-300">
                            URL del Logo
                        </label>
                        <div className="flex items-center space-x-2">
                            <Input id="logoUrl" type="url" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://example.com/logo.png" />
                            <Button onClick={handleSaveLogo} disabled={isSavingLogo} className="flex-shrink-0">
                                {isSavingLogo ? 'Guardando...' : 'Guardar'}
                            </Button>
                        </div>
                        {logoUrl && (
                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-300 mb-2">Vista Previa del Logo:</p>
                                <img src={logoUrl} alt="Logo Preview" className="h-16 w-auto bg-white p-2 rounded-md object-contain" />
                            </div>
                        )}
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="p-6">
                        <h2 className="text-2xl font-semibold text-brand-light mb-4">Acceso a tu Menú</h2>
                        <p className="text-gray-400 mb-4">
                            Comparte esta URL con tus clientes o usa el código QR para un fácil acceso a tu menú.
                        </p>
                        
                        <div className="space-y-2">
                            <label htmlFor="menuUrl" className="block text-sm font-medium text-gray-300">
                                URL Pública del Menú
                            </label>
                            <div className="flex space-x-2">
                                <Input id="menuUrl" type="text" value={menuUrl} readOnly />
                                <Button onClick={handleCopyUrl} className="flex-shrink-0">
                                    Copiar
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 flex flex-col items-center justify-center">
                        <h2 className="text-2xl font-semibold text-brand-light mb-4">Código QR del Menú</h2>
                        <QRCodeGenerator slug={business.slug} />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;