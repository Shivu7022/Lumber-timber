import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  const quickLinks = [
    { path: '/products', label: 'Our Toys' },
    { path: '/adopt', label: 'Adopt a Toy' },
    { path: '/subscribe', label: 'Subscription Box' },
    { path: '/about', label: 'Our Story' }
  ];

  const services = [
    { path: '/repair', label: 'Repair & Repaint' },
    { path: '/return', label: 'Return & Earn' },
    { path: '/faq', label: 'FAQ' },
    { path: '/contact', label: 'Contact Us' }
  ];

  const contacts = [
    { icon: MapPin, text: '123 Artisan Street, Channapatna, Karnataka 562160, India', color: 'text-primary' },
    { icon: Phone, text: '+91 98765 43210', color: 'text-primary' },
    { icon: Mail, text: 'hello@lumbertimber.in', color: 'text-primary' }
  ];

  return (
    <footer className="bg-secondary text-textMuted pt-16 pb-8 border-t border-borderColor transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div>
            <Logo textSize="text-2xl font-bold text-textMain" boxSize="w-9 h-9" iconSize={22} className="mb-6" />
            <p className="text-textMuted mb-6 leading-relaxed">
              Bringing the magic of eco-friendly Channapatna wooden toys to every home. Safe, sustainable, and handcrafted with love.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-textMuted hover:text-accent transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-textMuted hover:text-accent transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-textMuted hover:text-accent transition-colors"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-textMain mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-textMuted hover:text-accent font-medium transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-textMain mb-6">Services</h4>
            <ul className="space-y-4">
              {services.map((service) => (
                <li key={service.path}>
                  <Link to={service.path} className="text-textMuted hover:text-accent font-medium transition-colors">{service.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-textMain mb-6">Contact Info</h4>
            <ul className="space-y-4">
              {contacts.map((contact, idx) => {
                const Icon = contact.icon;
                return (
                  <li key={idx} className="flex items-start gap-3 text-textMuted">
                    <Icon size={20} className={`shrink-0 ${idx===0 ? 'mt-1' : ''} text-accent`} />
                    <span className="font-medium">{contact.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="border-t border-borderColor pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-textMuted">
            &copy; {new Date().getFullYear()} Lumber Timber. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link to="/privacy" className="text-textMuted hover:text-accent font-medium transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-textMuted hover:text-accent font-medium transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
