
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { firebaseService } from '../../services/firebaseService';
import { Business } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import QRCodeGenerator from '../../components/QRCodeGenerator';
import { useToast } from '../../hooks/useToast';

const SettingsPage: React.FC = () => {
    const { user } = useAuth();
    const [business, setBusiness] = useState<Business | null>(null);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchBusiness = async () => {
            if (user?.businessId) {
                try {
                    const biz = await firebaseService.getBusinessById(user.businessId);
                    setBusiness(biz);
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

    if (loading) {
        return <div>Loading settings...</div>;
    }

    if (!business) {
        return <p>Could not find business information.</p>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-light mb-6">Settings</h1>
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
    );
};

export default SettingsPage;
