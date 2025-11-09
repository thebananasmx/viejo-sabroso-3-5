
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  slug: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ slug }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateQRCode = async () => {
      setLoading(true);
      try {
        const fullUrl = `${window.location.origin}/#/menu/${slug}`;
        const url = await QRCode.toDataURL(fullUrl, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.9,
            margin: 1,
            color: {
                dark: '#0A1F1B',
                light: '#FFFFFF',
            },
        });
        setQrCodeUrl(url);
      } catch (err) {
        console.error('Failed to generate QR code', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      generateQRCode();
    }
  }, [slug]);

  if (loading) {
    return <div className="w-64 h-64 bg-gray-700 animate-pulse rounded-lg"></div>;
  }

  return (
    <div className="flex flex-col items-center">
      {qrCodeUrl ? (
        <>
            <img src={qrCodeUrl} alt={`QR Code for ${slug}`} className="w-64 h-64 border-4 border-gray-700 rounded-lg bg-white p-2"/>
            <p className="mt-2 text-sm text-gray-400">Scan this to view your menu</p>
            <a 
                href={qrCodeUrl} 
                download={`${slug}-qrcode.png`}
                className="mt-4 text-brand-primary hover:opacity-80 font-medium"
            >
                Download QR Code
            </a>
        </>
      ) : (
        <p className="text-red-500">Could not generate QR code.</p>
      )}
    </div>
  );
};

export default QRCodeGenerator;