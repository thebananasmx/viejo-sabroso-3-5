
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
        { name: 'Primary', hex: '#D4FF4F', class: 'bg-brand-primary' },
        { name: 'Dark', hex: '#0A1F1B', class: 'bg-brand-dark' },
        { name: 'Light', hex: '#F9F9F7', class: 'bg-brand-light' },
        { name: 'Dark Accent', hex: '#112b26', class: 'bg-brand-dark-accent' },
    ];

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="font-serif text-5xl font-bold text-brand-light mb-8">Styleguide</h1>
            
            {/* Colors Section */}
            <section className="mb-12">
                <h2 className="font-serif text-3xl font-bold text-brand-light mb-4 border-b border-gray-700 pb-2">Colors</h2>
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
                <h2 className="font-serif text-3xl font-bold text-brand-light mb-4 border-b border-gray-700 pb-2">Typography</h2>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-400 mb-1">H1 - Playfair Display</p>
                        <h1 className="font-serif text-5xl font-bold text-brand-light">The Quick Brown Fox Jumps</h1>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">H2 - Playfair Display</p>
                        <h2 className="font-serif text-4xl font-bold text-brand-light">The Quick Brown Fox Jumps</h2>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">H3 - Playfair Display</p>
                        <h3 className="font-serif text-3xl font-bold text-brand-light">The Quick Brown Fox Jumps</h3>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Body Text - Inter</p>
                        <p className="text-lg text-brand-light max-w-2xl">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.
                        </p>
                    </div>
                </div>
            </section>

            {/* Components Section */}
            <section>
                <h2 className="font-serif text-3xl font-bold text-brand-light mb-4 border-b border-gray-700 pb-2">Components</h2>
                <div className="space-y-8">
                    {/* Buttons */}
                    <div>
                        <h3 className="text-2xl font-semibold text-brand-light mb-4">Buttons</h3>
                        <div className="flex flex-wrap items-center gap-4">
                            <Button size="sm">Small</Button>
                            <Button size="md">Medium</Button>
                            <Button size="lg">Large</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="danger">Danger</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button disabled>Disabled</Button>
                        </div>
                    </div>

                    {/* Cards */}
                    <div>
                        <h3 className="text-2xl font-semibold text-brand-light mb-4">Card</h3>
                        <Card className="max-w-sm p-6">
                            <h4 className="font-bold text-xl text-brand-light">Card Title</h4>
                            <p className="text-gray-400 mt-2">This is some content inside a card component. It's great for grouping related information.</p>
                        </Card>
                    </div>

                    {/* Inputs */}
                    <div>
                        <h3 className="text-2xl font-semibold text-brand-light mb-4">Input</h3>
                        <div className="max-w-sm">
                            <Input label="Email Address" placeholder="you@example.com" />
                        </div>
                    </div>

                    {/* Modal */}
                    <div>
                        <h3 className="text-2xl font-semibold text-brand-light mb-4">Modal</h3>
                        <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
                        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="This is a Modal">
                            <p className="text-gray-300">This is the content of the modal. You can put any React components you want in here.</p>
                            <div className="mt-6 flex justify-end space-x-2">
                                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button onClick={() => setIsModalOpen(false)}>Confirm</Button>
                            </div>
                        </Modal>
                    </div>
                    
                    {/* Toasts */}
                    <div>
                        <h3 className="text-2xl font-semibold text-brand-light mb-4">Toasts</h3>
                        <div className="flex space-x-4">
                            <Button onClick={() => addToast('This is a success message!', 'success')}>Show Success Toast</Button>
                            <Button variant="danger" onClick={() => addToast('This is an error message!', 'error')}>Show Error Toast</Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default StyleguidePage;
