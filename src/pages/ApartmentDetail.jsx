import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../apiClient";

import GalleryModal from "../components/GalleryModal";
import { 
  FaParking, 
  FaWifi, 
  FaBath, 
  FaHotTub, 
  FaArrowLeft, 
  FaBed,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaEuroSign,
  FaCalendarAlt,
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaUser,
  FaHome,
  FaSnowflake,
  FaFire,
  FaCar,
  FaTree,
  FaShieldAlt,
  FaDumbbell,
  FaSwimmingPool,
  FaLeaf,
  FaPaw
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "./ApartmentDetail.css";

const featureIcons = {
  parking: <FaParking />,
  wifi: <FaWifi />,
  sauna: <FaHotTub />,
  bath: <FaBath />,
  aircon: <FaSnowflake />,
  airConditioning: <FaSnowflake />,
  heating: <FaFire />,
  garage: <FaCar />,
  balcony: <FaTree />,
  security: <FaShieldAlt />,
  gym: <FaDumbbell />,
  pool: <FaSwimmingPool />,
  elevator: <FaBuilding />,
  garden: <FaLeaf />,
  terrace: <FaTree />,
  fireplace: <FaFire />,
  internet: <FaWifi />,
  petsAllowed: <FaPaw />
};

const ApartmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gallery modal state (aligned with HomePage pattern)
  const [isGalleryOpen, setGalleryOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);
    apiFetch(`/api/apartments/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setApartment(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{t('loading')}</p>
      </div>
    );
  }

  if (error || !apartment) {
    return (
      <div className="apartment-detail not-found">
        <div className="not-found-content">
          <h2>{t('apartment_not_found')}</h2>
          <p>{t('apartment_not_found_desc')}</p>
          <button onClick={() => navigate(-1)} className="back-btn">
            <FaArrowLeft /> {t('back')}
          </button>
        </div>
      </div>
    );
  }

  // Open gallery at given index
  const openGallery = (idx = 0) => {
    setSelectedImage(idx);
    setGalleryOpen(true);
  };

  const getLocalizedText = (textObj) => {
    if (typeof textObj === 'string') return textObj;
    return textObj?.[i18n.language] || textObj?.fi || textObj?.en || '';
  };

  // Normalize image URLs to support {url}, {imageUrl} or plain string
  const imageUrls = (apartment.images || []).map(img => img?.url || img?.imageUrl || img);

  return (
    <div className="apartment-detail">
      <button onClick={() => navigate(-1)} className="back-btn">
        <FaArrowLeft /> {t('back')}
      </button>

      <div className="apartment-header">
        <h1 className="apartment-title">{getLocalizedText(apartment.title)}</h1>
        <div className="apartment-status">
          <span className={`status-badge ${apartment.type}`}>
            {t(apartment.type)}
          </span>
          <span className={`availability-badge ${apartment.status}`}>
            {t(apartment.status)}
          </span>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="apartment-gallery">
        {imageUrls.length > 0 ? (
          <div className="gallery-grid">
            <div className="main-image">
              <img
                src={imageUrls[0]}
                alt="Main apartment view"
                onClick={() => openGallery(0)}
                className="main-apartment-image"
              />
              <div className="image-hover-overlay" onClick={() => openGallery(0)}>
                <span>{t('viewLarger')}</span>
              </div>
              <span className="photo-count-badge" aria-label={`photos-count`}>
                {imageUrls.length}
              </span>
              
            </div>

            {imageUrls.length > 1 && (
              <div className="thumbnail-grid">
                {imageUrls.slice(1, 5).map((src, idx) => (
                  <img
                    key={idx + 1}
                    src={src}
                    alt={`apartment-${idx + 1}`}
                    loading="lazy"
                    onClick={() => openGallery(idx + 1)}
                    className="apartment-thumb"
                  />
                ))}

                {imageUrls.length > 5 && (
                  <div
                    className="more-images"
                    onClick={() => openGallery(5)}
                  >
                    +{imageUrls.length - 5}
                  </div>
                )}
              </div>


            )}
          </div>
        ) : (
          <div className="no-images">
            <FaHome size={48} />
            <p>{t("no_images")}</p>
          </div>
        )}
      </div>

      <div className="apartment-content">
        {/* Main Info */}
        <div className="apartment-main-info">
          <div className="price-section">
            <div className="price">
              <FaEuroSign />
              <span className="price-amount">{apartment.price}</span>
              <span className="price-period">
                {apartment.type === 'rent' ? `/${t('month')}` : ''}
              </span>
            </div>

            {apartment.deposit && apartment.deposit !== "" && apartment.type === 'rent' && (
              <div className="deposit">
                {t('deposit')}: €{apartment.deposit}
              </div>
            )}
            {apartment.utilities && apartment.utilities !== "" && apartment.type === 'rent' && (
              <div className="utilities">
                {t('utilities')}: €{apartment.utilities}/{t('month')}
              </div>
            )}
          </div>

          {/* Key Details */}
          <div className="key-details">
            {apartment.rooms && apartment.rooms !== "" && (
              <div className="detail-item">
                <FaBed />
                <span>{apartment.rooms} {t('rooms')}</span>
              </div>
            )}
            {apartment.area && apartment.area !== "" && (
              <div className="detail-item">
                <FaRulerCombined />
                <span>{apartment.area} m²</span>
              </div>
            )}
            {apartment.floor && apartment.floor !== "" && (
              <div className="detail-item">
                <FaBuilding />
                <span>{t('floor')} {apartment.floor}</span>
              </div>
            )}
            {apartment.location && apartment.location !== "" && (
              <div className="detail-item">
                <FaMapMarkerAlt />
                <span>{apartment.location}</span>
              </div>
            )}
            {apartment.builtYear && apartment.builtYear !== "" && (
              <div className="detail-item">
                <FaCalendarAlt />
                <span>{t('built')} {apartment.builtYear}</span>
              </div>
            )}
            {apartment.availableFrom && apartment.availableFrom !== "" && (
              <div className="detail-item">
                <FaCalendarAlt />
                <span>{t('available_from')} {new Date(apartment.availableFrom).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="apartment-description">
          <h3>{t('description')}</h3>
          <p>{getLocalizedText(apartment.description)}</p>
        </div>

        {/* Features */}
        {apartment.features && apartment.features.length > 0 && (
          <div className="apartment-features">
            <h3>{t('features')}</h3>
            <div className="features-grid">
              {apartment.features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <div className="feature-icon">
                    {featureIcons[feature] || <FaHome />}
                  </div>
                  <span className="feature-name">{t(feature)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Information */}
        {apartment.contact && (
          <div className="contact-section">
            <h3>{t('contact_info')}</h3>
            <div className="contact-card">
              {apartment.contact.name && (
                <div className="contact-item">
                  <FaUser />
                  <span>{apartment.contact.name}</span>
                </div>
              )}
              {apartment.contact.phone && (
                <div className="contact-item">
                  <FaPhone />
                  <a href={`tel:${apartment.contact.phone}`}>
                    {apartment.contact.phone}
                  </a>
                </div>
              )}
              {apartment.contact.email && (
                <div className="contact-item">
                  <FaEnvelope />
                  <a href={`mailto:${apartment.contact.email}`}>
                    {apartment.contact.email}
                  </a>
                </div>
              )}
              {apartment.contact.whatsapp && (
                <div className="contact-item">
                  <FaWhatsapp />
                  <a
                    href={`https://wa.me/${apartment.contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Gallery Modal - always mounted, visibility via isOpen (same as HomePage) */}
      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setGalleryOpen(false)}
        images={imageUrls}
        initialIndex={selectedImage}
      />

    </div>
  );
};

export default ApartmentDetail;
