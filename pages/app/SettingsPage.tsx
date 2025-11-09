

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
                    addToast("Could not load business details.", 'error');
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
                addToast('URL copied to clipboard!', 'success');
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                addToast('Failed to copy URL.', 'error');
            });
    };

    const handleSaveLogo = async () => {
        if (!business) return;
        setIsSavingLogo(true);
        try {
            await firebaseService.updateBusinessDetails(business.id, { logoUrl: logoUrl });
            setBusiness(prev => prev ? { ...prev, logoUrl } : null);
            addToast('Logo updated successfully!', 'success');
        } catch (error) {
            console.error("Failed to save logo", error);
            addToast('Failed to save logo.', 'error');
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
        return <p>Could not find business information.</p>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-light mb-6">Settings</h1>
            <div className="space-y-8">
                 <Card className="p-6">
                    <h2 className="text-2xl font-semibold text-brand-light mb-4">Business Logo</h2>
                    <p className="text-gray-400 mb-4">
                        Add a URL to your business logo to personalize the dashboard.
                    </p>
                    <div className="space-y-2">
                        <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-300">
                            Logo URL
                        </label>
                        <div className="flex items-center space-x-2">
                            <Input id="logoUrl" type="url" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://example.com/logo.png" />
                            <Button onClick={handleSaveLogo} disabled={isSavingLogo} className="flex-shrink-0">
                                {isSavingLogo ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                        {logoUrl && (
                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-300 mb-2">Logo Preview:</p>
                                <img src={logoUrl} alt="Logo Preview" className="h-16 w-auto bg-white p-2 rounded-md object-contain" />
                            </div>
                        )}
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="p-6">
                        <h2 className="text-2xl font-semibold text-brand-light mb-4">Your Menu Access</h2>
                        <p className="text-gray-400 mb-4">
                            Share this URL with your customers or use the QR code for easy access to your menu.
                        </p>
                        
                        <div className="space-y-2">
                            <label htmlFor="menuUrl" className="block text-sm font-medium text-gray-300">
                                Public Menu URL
                            </label>
                            <div className="flex space-x-2">
                                <Input id="menuUrl" type="text" value={menuUrl} readOnly />
                                <Button onClick={handleCopyUrl} className="flex-shrink-0">
                                    Copy
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 flex flex-col items-center justify-center">
                        <h2 className="text-2xl font-semibold text-brand-light mb-4">Menu QR Code</h2>
                        <QRCodeGenerator slug={business.slug} />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;