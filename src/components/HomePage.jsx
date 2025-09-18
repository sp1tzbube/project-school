import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'; // Still needed for apartment detail navigation 

import ApartmentFilter from './ApartmentFilter'; 
import GalleryModal from './GalleryModal';
import { FaInstagram, FaXTwitter } from 'react-icons/fa6';
import { FiMail, FiPhone, FiMapPin, FiHome } from 'react-icons/fi';
// axios import removed because `fetch` is used
// import axios from 'axios';
import { apiFetch } from '../apiClient';

// Hook for mobile view
function useIsMobile(breakpoint = 978) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);

  return isMobile;
}

const HomePage = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const { t, i18n } = useTranslation();
  
  // States for real data
  const [apartments, setApartments] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showGallery, setShowGallery] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);

  // This filter value comes from ApartmentFilter (supports 'all', 'rent', 'sale', 'available', 'rented', 'sold')
  const [saleTypeFilter, setSaleTypeFilter] = useState('all');

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Handle navbar visibility on scroll and gallery modal
  useEffect(() => {
    let prevScrollpos = window.pageYOffset;
    let scrollThreshold = 5; // Minimum scroll distance to trigger hide/show
    
    const handleScroll = () => {
      // Hide navbar when gallery modal is open
      if (showGallery) {
        setIsNavVisible(false);
        return;
      }
      
      const currentScrollPos = window.pageYOffset;
      
      // Always show navbar when at the top of the page
      if (currentScrollPos <= 10) {
        setIsNavVisible(true);
        prevScrollpos = currentScrollPos;
        return;
      }
      
      const scrollDifference = Math.abs(currentScrollPos - prevScrollpos);
      
      // Only trigger if scroll difference is above threshold
      if (scrollDifference > scrollThreshold) {
        if (prevScrollpos > currentScrollPos) {
          // Scrolling up - show navbar
          setIsNavVisible(true);
        } else {
          // Scrolling down - hide navbar
          setIsNavVisible(false);
        }
        prevScrollpos = currentScrollPos;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showGallery]);

  const loadData = async () => {
    try {
    setLoading(true);
    
    // Load all data in parallel
    const [apartmentsRes, galleryRes, profileRes] = await Promise.all([
    apiFetch('/api/apartments'),
    apiFetch('/api/gallery'),
    apiFetch('/api/profile')
    ]);

    const apartmentsData = await apartmentsRes.json();
    const galleryData = await galleryRes.json();
    const profileData = await profileRes.json();

    setApartments(apartmentsData);
    setGalleryImages(galleryData);
    setProfile(profileData);
    } catch (error) {
    console.error('Error loading data:', error);
    } finally {
    setLoading(false);
    }
  };

  const openGallery = (index = 0) => {
    setGalleryStartIndex(index);
    setShowGallery(true);
    // Hide menu when opening gallery
    setIsNavVisible(false);
    closeMenu();
  };

  const closeGallery = () => {
    setShowGallery(false);
    // Always show menu when closing gallery
    setIsNavVisible(true);
  };

  const toggleMenu = () => setIsMenuOpen(prevState => !prevState);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
    if (isMenuOpen && !event.target.closest('.nav-mobile') && !event.target.closest('.menu-toggle')) {
    closeMenu();
    }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
    document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Hide menu when gallery modal is open
  useEffect(() => {
    if (showGallery) {
      setIsNavVisible(false);
      closeMenu();
    }
  }, [showGallery]);

  const links = [
    { key: 'home', href: '#home' },
    { key: 'aboutTitle', href: '#about' },
    { key: 'workPortfolio', href: '#gallery' },
    { key: 'apartments', href: '#portfolio' },
    { key: 'contactTitle', href: '#contact' },
  ];

  // Handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const contactData = {
    name: formData.get('name').trim(),
    email: formData.get('email').trim(),
    phone: formData.get('phone')?.trim() || '',
    message: formData.get('message').trim()
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!contactData.name || !contactData.email || !contactData.message) {
    alert(t('allFieldsRequired', { defaultValue: 'All fields are required' }));
    return;
    }
    
    if (!emailRegex.test(contactData.email)) {
    alert(t('invalidEmail', { defaultValue: 'Invalid email address' }));
    return;
    }

    try {
    await apiFetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contactData)
    });
    
    alert(t('messageSent', { defaultValue: 'Message sent successfully!' }));
    e.target.reset();
    } catch (error) {
    console.error('Error sending message:', error);
    alert(t('messageError', { defaultValue: 'Error sending message. Please try again.' }));
    }
  };

  const itemVariants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 }
  };

  // Derive filtered apartments based on selected filter value.
  // Supports both status ('available' | 'rented' | 'sold') and type ('rent' | 'sale').
  const filteredApartments = useMemo(() => {
    const f = (saleTypeFilter || 'all').toString().toLowerCase();

    return (apartments || []).filter((apartment) => {
    if (!apartment || f === 'all' || f === '') return true;

    const status = (apartment.status || '').toLowerCase();
    const type = (apartment.type || apartment.saleType || '').toLowerCase();

    // Match by status if filter is a known status
    if (['available', 'rented', 'sold'].includes(f)) {
    return status === f;
    }
    // Match by type if filter is a known type
    if (['rent', 'sale'].includes(f)) {
    return type === f;
    }
    // Fallback: partial match on either field
    return status.includes(f) || type.includes(f);
    });
  }, [apartments, saleTypeFilter]);

  if (loading) {
    return (
    <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>{t('loading', { defaultValue: 'Loading...' })}</p>
    </div>
    );
  }

  return (
    <div className="app">
    {/* Header */}
    {!(isMobile && isMenuOpen) && !showGallery && (
    <header 
    className={`header ${!isNavVisible ? 'header-hidden' : ''}`}
    >
    <div className="container">
    <motion.div className="logo" whileHover={{ scale: 1.05 }}>
    <img src="/HM-musta-valk.png" alt="H Mykrä Oy Logo" className="logo-icon" />
    <span className="logo-text">{t('companyName', { defaultValue: 'H Mykrä Oy' })}</span>
    </motion.div>

    {/* Desktop menu */}
    {!isMobile && (
    <nav className="nav-desktop">
    {links.map(({ key, href }) => (
    <a key={key} href={href}>
    {t(key)}
    </a>
    ))}

    {/* Language switcher (only FI/EN) */}
    <div className="language-switcher">
    {[
    { lng: 'fi', flag: '/flags/fi.svg' },
    { lng: 'en', flag: '/flags/en.svg' }
    ].map(({ lng, flag }) => (
    <button
    key={lng}
    onClick={() => i18n.changeLanguage(lng)}
    className={i18n.language === lng ? 'active-lang' : ''}
    >
    <img src={flag} alt={lng} />
    </button>
    ))}
                    </div>
    </nav>
    )}

    {/* Burger button */}
    {isMobile && (
    <div className="menu-toggle" onClick={toggleMenu}>
    <span className="bar top"></span>
    <span className="bar middle"></span>
    <span className="bar bottom"></span>
    </div>
    )}
    </div>
    </header>
    )}

    {/* Mobile menu */}
    {isMobile && (
    <AnimatePresence>
    {isMenuOpen && (
    <motion.nav
    className="nav-mobile"
    initial="closed"
    animate="open"
    exit="closed"
    variants={{
    closed: { opacity: 0, y: '-100%' },
    open: { opacity: 1, y: '0%' },
    }}
    >
    <div className="menu-toggle open" onClick={toggleMenu}>
    <span className="bar top"></span>
    <span className="bar middle"></span>
    <span className="bar bottom"></span>
    </div>

    {links.map(({ key, href }) => (
    <motion.a
    key={key}
    href={href}
    onClick={toggleMenu}
    variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
    whileHover={{ scale: 1.1 }}
    >
    {t(key)}
    </motion.a>
    ))}
    
    <div className="language-switcher">
    {[
    { lng: 'fi', flag: '/flags/fi.svg' },
    { lng: 'en', flag: '/flags/en.svg' }
    ].map(({ lng, flag }) => (
    <button
    key={lng}
    onClick={() => i18n.changeLanguage(lng)}
    className={i18n.language === lng ? 'active-lang' : ''}
    >
    <img src={flag} alt={lng} />
    </button>
    ))}
                    </div>
    </motion.nav>
    )}
    </AnimatePresence>
    )}

    {/* Hero Section */}
    <motion.section 
    id="home" 
    className="hero" 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    transition={{ duration: 1 }}
    >
    <video 
      autoPlay 
      muted 
      loop 
      playsInline 
      webkit-playsinline 
      disablePictureInPicture
      disableRemotePlayback
      className="hero-video"
    >
      <source src="/background_3.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <div className="container hero-content">
    <motion.h1 
    initial={{ y: 50, opacity: 0 }} 
    animate={{ y: 0, opacity: 1 }} 
    transition={{ delay: 0.2 }}
    >
    {t('heroTitle', { defaultValue: 'Welcome to H Mykrä Oy' })}
    </motion.h1>
    <motion.div 
    className="hero-subtitle"
    initial={{ y: 30, opacity: 0 }} 
    animate={{ y: 0, opacity: 1 }} 
    transition={{ delay: 0.4 }}
    >
    {(() => {
      const subtitleText = t('heroSubtitle', { defaultValue: 'We build the future' });
      const lines = subtitleText.split('\n');
      
      // Find the partnership section (starts with "Yhteistyö kumppanit:" or "Partnership companies:")
      const partnershipIndex = lines.findIndex(line => 
        line.includes('Yhteistyö kumppanit:') || line.includes('Partnership companies:')
      );
      
      if (partnershipIndex === -1) {
        // Fallback: just display the text as is
        return <p>{subtitleText}</p>;
      }
      
      const mainText = lines.slice(0, partnershipIndex).join('\n');
      const partnershipTitle = lines[partnershipIndex];
      const partnershipCompanies = lines.slice(partnershipIndex + 1);
      
      return (
        <>
          <div className="main-text">{mainText}</div>
          <div className="partnership-section">
            <div className="partnership-title">{partnershipTitle}</div>
            <div className="partnership-companies">{partnershipCompanies.join('\n')}</div>
          </div>
        </>
      );
    })()}
    </motion.div>
    
    <motion.div 
    className="hero-buttons"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.6 }}
    >
    <motion.a
    href="#contact"
    className="hero-button"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={closeMenu}
    >
    {t('contactUs', { defaultValue: 'Contact Us' })}
    </motion.a>
    
    <motion.a
    href="#portfolio"
    className="hero-button"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={closeMenu}
    >
    {t('viewApartments', { defaultValue: 'View Apartments' })}
    </motion.a>
    </motion.div>
    </div>
    </motion.section>

    {/* About Section */}
    <motion.section 
    id="about"
    className="about"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.8 }}
    >
    <div className="container">
    <h2 className="h2-title">{t('aboutTitle', { defaultValue: 'About Us' })}</h2>
    <div className="about-content">
    <motion.div 
    className="about-image"
    initial={{ x: -100, opacity: 0 }}
    whileInView={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.2 }}
    >
    <img 
    src={profile?.photo || "photo_1.jpg"} 
    alt={t('aboutAlt', { defaultValue: 'About Us' })} 
    />
    </motion.div>
    <motion.div 
    className="about-text"
    initial={{ x: 100, opacity: 0 }}
    whileInView={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.4 }}
    >
    <h3>{profile?.name || t('aboutName', { defaultValue: 'Henkka Oy' })}</h3>
    <p className="about-experience">{t('aboutExperience', { defaultValue: '20 years of experience in the field' })}</p>
    <p>{i18n.language === 'en' ? (profile?.bioEn || t('aboutBio1En', { defaultValue: 'Seasoned professional driven by quality, clarity and practical solutions.' })) : (profile?.bio || t('aboutBio1', { defaultValue: 'Olen kokenut ammattilainen, jota motivoi laatu, selkeys ja toimivat ratkaisut.' }))}</p>
    <div className="about-details">
    <div className="contact-info-item">
    <div className="contact-icon"><FiMail /></div>
    <div className="contact-text">
    <span className="contact-label">{t('email', { defaultValue: 'Email' })}</span>
    <a href={`mailto:${profile?.email}`} className="contact-value">{profile?.email}</a>
    </div>
    </div>
    <div className="contact-info-item">
    <div className="contact-icon"><FiPhone /></div>
    <div className="contact-text">
    <span className="contact-label">{t('phone', { defaultValue: 'Phone' })}</span>
    <a href={`tel:${profile?.phone?.replace(/\s/g, '')}`} className="contact-value phone">
      {(() => {
        const phone = profile?.phone;
        if (!phone) return '';
        // Clean up messy spacing and format properly
        const cleaned = phone.replace(/\s+/g, ' ').trim();
        // Format Finnish phone number properly
        if (cleaned.startsWith('+358')) {
          return cleaned.replace(/(\+358)\s*(\d{1,2})\s*(\d{3,4})\s*(\d{4}).*/, '$1 $2 $3 $4');
        }
        return cleaned;
      })()}
    </a>
    </div>
    </div>
    </div>
    </motion.div>
    </div>
    </div>
    </motion.section>

    {/* Gallery Section - Improved */}
    <motion.section
  id="gallery"
  className="gallery work-portfolio"
  initial="hidden"
  animate="visible"
  variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
>
  <div className="container">
    <h2 className="h2-title">{t('workPortfolio', { defaultValue: 'Work Portfolio' })}</h2>
    <div className="gallery-grid improved">
      {(() => {
        const itemsPerRow = 3;
        const totalItems = galleryImages.length;
        const totalSlots = Math.ceil(totalItems / itemsPerRow) * itemsPerRow;
        const items = [];
        
        // Add actual gallery images
        galleryImages.forEach((image, index) => {
          items.push(
            <motion.div 
              key={image._id || index} 
              className="gallery-item"
              onClick={() => openGallery(index)}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="gallery-image-wrapper">
                <img src={image.imageUrl || image} alt={image.description || `Gallery ${index + 1}`} />
                <div className="gallery-overlay">
                  <div className="gallery-overlay-content">
                    <i className="fas fa-search-plus"></i>
                    <span>{t('viewLarger', { defaultValue: 'View Larger' })}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        });
        
        // Add empty placeholder items to complete the row
        for (let i = totalItems; i < totalSlots; i++) {
          items.push(
            <div 
              key={`empty-${i}`} 
              className="gallery-item empty"
            >
              <div className="gallery-image-wrapper">
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%',
                  color: 'rgba(255, 255, 255, 0.3)',
                  fontSize: '0.9rem'
                }}>
                  {t('comingSoon', { defaultValue: 'Coming Soon' })}
                </div>
              </div>
            </div>
          );
        }
        
        return items;
      })()}
    </div>
  </div>
</motion.section>

    {/* Portfolio/Apartments */}
    <motion.section id="portfolio" className="portfolio">
    <div className="container">
    <h2 className="h2-title">{t('apartments', { defaultValue: 'Apartments' })}</h2>

    {/* ApartmentFilter provides the filter value; keep API as-is */}
    <ApartmentFilter 
    activeFilter={saleTypeFilter}
    setFilter={setSaleTypeFilter}
    />

    <div className="portfolio-grid">
    {/* Render filtered apartments (not the raw array) */}
    {filteredApartments.length === 0 ? (
    <p>{t('noApartmentsMatch', { defaultValue: 'No apartments match your filters.' })}</p>
    ) : (
    filteredApartments.map(apartment => (
    <motion.div 
    key={apartment._id}
    className="portfolio-item" 
    variants={itemVariants}
    whileHover={{ scale: 1.02 }}
    >
    <Link to={`/apartment/${apartment._id}`} className="portfolio-image-container">
    <img
    src={apartment.images?.[0]?.url || 'demo1.jpg'}
    alt={apartment.title}
    className="portfolio-image"
    />
    <div className="portfolio-image-overlay"></div>
    </Link>
    <div className="portfolio-content">
    <h3 className="portfolio-price">€{apartment.price}</h3>
    <p className="portfolio-location">
    <FiMapPin className="portfolio-icon" />
    {apartment.location}
    </p>
    <p className="portfolio-details">
    <FiHome className="portfolio-icon" />
    {apartment.area && `${apartment.area} m²`}
    {apartment.rooms && ` • ${apartment.rooms} ${t('rooms', { defaultValue: 'rooms' })}`}
    </p>
    <div className={`apartment-status ${apartment.status?.toLowerCase() || ''}`}>
    {t(apartment.status, { defaultValue: apartment.status })}
    </div>
    </div>
    </motion.div>
    ))
    )}
    </div>
    </div>
    </motion.section>

    {/* Contact - Improved vertical form */}
    <motion.section 
    id="contact" 
    className="contact" 
    initial={{ opacity: 0 }} 
    whileInView={{ opacity: 1 }} 
    viewport={{ once: true, amount: 0.2 }}
    >
    <div className="container">
    <h2 className="h2-title">{t('contactTitle', { defaultValue: 'Contact' })}</h2>
    <div className="contact-wrapper">
    <form className="contact-form vertical" onSubmit={handleContactSubmit}>
    <motion.div 
    className="form-field"
    whileFocus={{ scale: 1.02 }}
    >
    <label htmlFor="name">{t('name', { defaultValue: 'Name' })}</label>
    <input 
    id="name"
    name="name" 
    type="text" 
    placeholder={t('namePlaceholder', { defaultValue: 'Enter your name' })} 
    required 
    />
    </motion.div>
    
    <motion.div 
    className="form-field"
    whileFocus={{ scale: 1.02 }}
    >
    <label htmlFor="email">{t('email', { defaultValue: 'Email' })}</label>
    <input 
    id="email"
    name="email" 
    type="email" 
    placeholder={t('emailPlaceholder', { defaultValue: 'Enter your email' })} 
    required 
    />
    </motion.div>
    
    <motion.div 
    className="form-field"
    whileFocus={{ scale: 1.02 }}
    >
    <label htmlFor="phone">{t('phone', { defaultValue: 'Phone' })}</label>
    <input 
    id="phone"
    name="phone" 
    type="tel" 
    placeholder={t('phonePlaceholder', { defaultValue: 'Enter your phone (optional)' })} 
    />
    </motion.div>
    
    <motion.div 
    className="form-field"
    whileFocus={{ scale: 1.02 }}
    >
    <label htmlFor="message">{t('message', { defaultValue: 'Message' })}</label>
    <textarea 
    id="message"
    name="message" 
    placeholder={t('messagePlaceholder', { defaultValue: 'Enter your message' })} 
    required 
    rows="5"
    />
    </motion.div>
    
    <motion.button 
    type="submit" 
    whileHover={{ scale: 1.05 }} 
    whileTap={{ scale: 0.95 }}
    className="submit-button"
    >
    {t('send', { defaultValue: 'Send' })}
    </motion.button>
    </form>
    </div>
    </div>
    </motion.section>

    {/* Footer */}
    <footer className="footer">
    <motion.div className="container footer-inner" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
    <div className="footer-left">
    <p>© 2021-{new Date().getFullYear()} {profile?.name || 'H Myrkä Oy'}</p>
    </div>
    <div className="footer-right">
    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
    <FaInstagram size={30} />
    </a>
    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
    <FaXTwitter size={30} />
    </a>
    </div>
    </motion.div>
    </footer>

    <GalleryModal
    isOpen={showGallery}
    onClose={closeGallery}
    images={galleryImages.map(img => img.imageUrl || img)}
    initialIndex={galleryStartIndex}
    />

    </div>
  );
};

export default HomePage;
