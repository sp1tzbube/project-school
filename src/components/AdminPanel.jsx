import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { 
  FaUser, 
  FaImages, 
  FaHome, 
  FaEnvelope, 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes,
  FaPlus,
  FaEye,
  FaEyeSlash,
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaMapMarkerAlt,
  FaBed,
  FaRulerCombined,
  FaBuilding,
  FaCalendarAlt,
  FaEuroSign,
  FaCog,
  FaListUl,
  FaUpload,
  FaTree,
  FaLeaf,
  FaParking,
  FaFire,
  FaSnowflake,
  FaWifi,
  FaPaw,
  FaHotTub
} from "react-icons/fa";
import "./App.css";

function AdminPanel() {
  const { t } = useTranslation();
  const [tab, setTab] = useState("profile");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if already authenticated from sessionStorage
  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Send password to server for authentication
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('adminAuth', 'true');
        sessionStorage.setItem('adminToken', data.token);
        setPassword("");
      } else {
        setError(data.error || t('invalidPassword', { defaultValue: 'Invalid password' }));
        setPassword("");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(t('loginError', { defaultValue: 'Login failed. Please try again.' }));
      setPassword("");
    }
    
    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
    sessionStorage.removeItem('adminToken');
    setTab("profile"); // Reset to default tab
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="admin-panel main-section">
        <div className="admin-header">
          <h1 className="admin-title">{t('adminPanel')}</h1>
        </div>
        <div className="admin-content">
          <div className="admin-card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '2rem', color: '#FFCC00' }}>
              {t('adminLogin', { defaultValue: 'Admin Login' })}
            </h3>
            <form onSubmit={handleLogin} className="admin-form">
              <div className="form-group">
                <label htmlFor="password" style={{ color: '#FFCC00', marginBottom: '0.5rem' }}>
                  {t('password', { defaultValue: 'Password' })}
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('enterPassword', { defaultValue: 'Enter admin password' })}
                  required
                  className="admin-input"
                  autoFocus
                />
              </div>
              {error && (
                <div style={{ 
                  color: '#f44336', 
                  textAlign: 'center', 
                  marginBottom: '1rem',
                  padding: '0.5rem',
                  background: 'rgba(244, 67, 54, 0.1)',
                  borderRadius: '4px',
                  border: '1px solid rgba(244, 67, 54, 0.3)'
                }}>
                  {error}
                </div>
              )}
              <button 
                type="submit" 
                disabled={isLoading || !password.trim()}
                className="admin-button primary large"
                style={{ width: '100%' }}
              >
                {isLoading ? t('authenticating', { defaultValue: 'Authenticating...' }) : t('login', { defaultValue: 'Login' })}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel main-section">
      <div className="admin-header">
        <div className="admin-header-top">
          <h1 className="admin-title">{t('adminPanel')}</h1>
          <button 
            onClick={handleLogout}
            className="admin-button secondary admin-logout-btn"
          >
            {t('logout', { defaultValue: 'Logout' })}
          </button>
        </div>
        <div className="admin-tabs">
          <button
            className={tab === "profile" ? "admin-tab active" : "admin-tab"}
            onClick={() => setTab("profile")}
          >
            <FaUser /> {t('profile')}
          </button>
          <button
            className={tab === "gallery" ? "admin-tab active" : "admin-tab"}
            onClick={() => setTab("gallery")}
          >
            <FaImages /> {t('gallery')}
          </button>
          <button
            className={tab === "apartments" ? "admin-tab active" : "admin-tab"}
            onClick={() => setTab("apartments")}
          >
            <FaHome /> {t('apartments')}
          </button>
          <button
            className={tab === "contacts" ? "admin-tab active" : "admin-tab"}
            onClick={() => setTab("contacts")}
          >
            <FaEnvelope /> {t('messages')}
          </button>
        </div>
      </div>

      <div className="admin-content">
        {tab === "profile" && <ProfileAdmin />}
        {tab === "gallery" && <GalleryAdmin />}
        {tab === "apartments" && <ApartmentsAdmin />}
        {tab === "contacts" && <ContactsAdmin />}
      </div>
    </div>
  );
}

// ProfileAdmin (untouched from previous, kept as-is)
function ProfileAdmin() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    bioEn: '',
    email: '',
    phone: '',
    photo: ''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (e) => {
    setProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    console.log('Submitting profile data:', profile); // Debug log
    
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      
      console.log('Response status:', res.status); // Debug log
      
      if (res.ok) {
        const updated = await res.json();
        console.log('Profile updated successfully:', updated); // Debug log
        setProfile(updated);
        alert(t('profileUpdated'));
      } else {
        const errorData = await res.json();
        console.error('Server error response:', errorData); // Debug log
        throw new Error(`${t('failedToUpdateProfile')}: ${errorData.error || t('unknownError')}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Error updating profile: ${error.message}`);
    }
    setLoading(false);
  };

  const handlePhotoUpload = async (e) => {
    e.preventDefault();
    if (!photoFile) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append("photo", photoFile);
    
    try {
      const res = await fetch("/api/profile/photo", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setPhotoFile(null);
        alert(t('photoUpdatedSuccessfully'));
      } else {
        throw new Error(t('failedToUploadPhoto'));
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert(t('errorUploadingPhoto'));
    }
    setLoading(false);
  };

  return (
    <div className="admin-section">
      <h2 className="admin-subtitle">{t('profileInformation')}</h2>

      <div className="admin-card">
        <h3>{t('profilePhoto')}</h3>
        {profile.photo && (
          <div className="profile-photo-container">
            <img 
              src={profile.photo} 
              alt="Profile" 
              className="admin-profile-photo"
            />
          </div>
        )}
        <form onSubmit={handlePhotoUpload} className="admin-form">
          <div className="form-group">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files[0])}
              className="admin-input file-input"
            />
            <button type="submit" disabled={!photoFile || loading} className="admin-button primary">
              {loading ? t('uploading') : t('updatePhoto')}
            </button>
          </div>
        </form>
      </div>

      <div className="admin-card">
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <input
              name="name"
              placeholder={t('yourName')}
              value={profile.name}
              onChange={handleChange}
              required
              className="admin-input"
            />
          </div>

          <div className="form-group">
            <label>{t('bioFinnish')}</label>
            <textarea
              name="bio"
              placeholder={t('tellAboutYourself')}
              value={profile.bio}
              onChange={handleChange}
              required
              className="admin-textarea"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>{t('bioEnglish')}</label>
            <textarea
              name="bioEn"
              placeholder={t('tellAboutYourselfEn')}
              value={profile.bioEn}
              onChange={handleChange}
              required
              className="admin-textarea"
              rows="4"
            />
          </div>

          <div className="form-group">
            <input
              name="email"
              type="email"
              placeholder={t('emailPlaceholder')}
              value={profile.email}
              onChange={handleChange}
              required
              className="admin-input"
            />
          </div>

          <div className="form-group">
            <input
              name="phone"
              placeholder={t('phonePlaceholder')}
              value={profile.phone}
              onChange={handleChange}
              required
              className="admin-input"
            />
          </div>

          <button type="submit" disabled={loading} className="admin-button primary">
            <FaSave /> {loading ? t('updating') : t('updateProfile')}
          </button>
        </form>
      </div>
    </div>
  );
}

// Gallery Admin - Improved for consistent display
function GalleryAdmin() {
  const { t } = useTranslation();
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const res = await fetch("/api/gallery");
      if (res.ok) {
        const data = await res.json();
        setPhotos(data);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const newPhoto = await res.json();
        setPhotos(prev => [newPhoto, ...prev]);
        setFile(null);
        const fileInput = document.querySelector('input[type="file"].file-input');
        if (fileInput) fileInput.value = '';
      } else {
        throw new Error(t('failedToUploadPhoto'));
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert(t('errorUploadingPhoto'));
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirmDeletePhoto'))) return;
    
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPhotos(prev => prev.filter(p => p._id !== id));
      } else {
        throw new Error(t('failedToDeletePhoto'));
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert(t('errorDeletingPhoto'));
    }
  };

  // English comment: Gallery editing removed; only add and delete are supported

  return (
    <div className="admin-section">
      <h2 className="admin-subtitle">{t('galleryPhotos')}</h2>

      <div className="admin-card">
        <h3>{t('addNewPhoto')}</h3>
        <form onSubmit={handleUpload} className="admin-form">
          <div className="form-group">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              required
              className="admin-input file-input"
            />
          </div>
          <button type="submit" disabled={loading || !file} className="admin-button primary">
            <FaPlus /> {loading ? t('uploading') : t('addPhoto')}
          </button>
        </form>
      </div>

      {/* Gallery grid with improved layout */}
      <div className="admin-gallery">
        {photos.map((photo) => (
          <div key={photo._id} className="admin-gallery-item">
            {/* Image container with fixed height */}
            <div className="gallery-image-container-admin">
              {/* English comment: Overlay delete button for quick removal */}
              <button
                type="button"
                className="admin-button small danger gallery-delete-btn"
                title={t('delete')}
                onClick={() => handleDelete(photo._id)}
              >
                <FaTrash />
              </button>
              {/* Image displayed with object-fit: contain to show full image */}
              <img 
                src={photo.imageUrl || photo.url || photo.image} 

                className="admin-gallery-img" 
              />
            </div>

            {/* English comment: Only delete action remains */}
            <div className="admin-actions gallery-actions-fixed">
              <button
                onClick={() => handleDelete(photo._id)}
                className="admin-button small danger"
              >
                <FaTrash /> {t('delete')}
              </button>
            </div>
          </div>
        ))}

        {photos.length === 0 && (
          <div className="admin-empty">
            <FaImages size={48} />
            <p>{t('noPhotosYet')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ApartmentsAdmin - unchanged structurally (kept as before)
function ApartmentsAdmin() {
  const { t } = useTranslation();
  const [apartments, setApartments] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    type: "rent",
    status: "available",
    location: "",
    rooms: "",
    area: "",
    floor: "",
    builtYear: "",
    availableFrom: ""
  });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  // English comment: Edit mode image selection and previews
  const [editNewImages, setEditNewImages] = useState([]);
  const [editUploadedImages, setEditUploadedImages] = useState([]);



  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async () => {
    try {
      const res = await fetch("/api/apartments");
      if (res.ok) {
        const data = await res.json();
        setApartments(data);
      }
    } catch (error) {
      console.error('Error fetching apartments:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };



  const handleImageUpload = async (files) => {
    const uploadedImages = [];
    for (let file of files) {
      const formData = new FormData();
      formData.append("image", file);
    
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          uploadedImages.push({
            url: data.url,
            publicId: data.public_id
          });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
    return uploadedImages;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let apartmentData = { ...form };
    
      // Convert numeric fields to numbers
      if (apartmentData.price) apartmentData.price = Number(apartmentData.price);
      if (apartmentData.rooms) apartmentData.rooms = Number(apartmentData.rooms);
      if (apartmentData.area) apartmentData.area = Number(apartmentData.area);
      if (apartmentData.floor) apartmentData.floor = Number(apartmentData.floor);
      if (apartmentData.builtYear) apartmentData.builtYear = Number(apartmentData.builtYear);
    
      if (images.length > 0) {
        const uploadedImages = await handleImageUpload(images);
        apartmentData.images = uploadedImages;
      }
    
      const res = await fetch("/api/apartments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apartmentData),
      });
    
      if (res.ok) {
        const newApt = await res.json();
        setApartments(prev => [newApt, ...prev]);
        // Reset form
        setForm({
          title: "", description: "", price: "", type: "rent", status: "available",
          location: "", rooms: "", area: "", floor: "", builtYear: "", availableFrom: ""
        });
        setImages([]);
        setUploadedImages([]);
        const fileInput = document.querySelector('input[type="file"][multiple]');
        if (fileInput) fileInput.value = '';
      } else {
        throw new Error(t('failedToAddApartment'));
      }
    } catch (error) {
      console.error('Error adding apartment:', error);
      alert(t('errorAddingApartment'));
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirmDeleteApartment'))) return;
    
    try {
      const res = await fetch(`/api/apartments/${id}`, { method: "DELETE" });
      if (res.ok) {
        setApartments(prev => prev.filter(a => a._id !== id));
      } else {
        throw new Error(t('failedToDeleteApartment'));
      }
    } catch (error) {
      console.error('Error deleting apartment:', error);
      alert(t('errorDeletingApartment'));
    }
  };

  const startEdit = (apt) => {
    // Handle legacy year field and ensure all fields exist
    const editData = { ...apt };
    
    // Convert old 'year' field to 'builtYear' if it exists
    if (apt.year && !apt.builtYear) {
      editData.builtYear = apt.year;
    }
    
    // Ensure all fields have default values
    editData.images = apt.images || [];
    editData.location = apt.location || '';
    editData.rooms = apt.rooms || '';
    editData.area = apt.area || '';
    editData.floor = apt.floor || '';
    editData.builtYear = apt.builtYear || apt.year || '';
    editData.availableFrom = apt.availableFrom || '';
    editData.features = apt.features || [];
    
    setEditId(apt._id);
    setEditForm(editData);
    setEditNewImages([]);
    setEditUploadedImages([]);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditFeatureToggle = (feature) => {
    setEditForm(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleEdit = async (id) => {
    try {
      let updateData = { ...editForm };
    
      // Convert numeric fields to numbers
      if (updateData.price) updateData.price = Number(updateData.price);
      if (updateData.rooms) updateData.rooms = Number(updateData.rooms);
      if (updateData.area) updateData.area = Number(updateData.area);
      if (updateData.floor) updateData.floor = Number(updateData.floor);
      if (updateData.builtYear) updateData.builtYear = Number(updateData.builtYear);
    
      // English comment: If new images were selected in edit mode, upload and replace
      if (editNewImages.length > 0) {
        const uploaded = await handleImageUpload(editNewImages);
        updateData.images = uploaded;
      }

      const res = await fetch(`/api/apartments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
    
      if (res.ok) {
        const updated = await res.json();
        setApartments(prev =>
          prev.map(a => a._id === id ? updated : a)
        );
        setEditId(null);
        setEditNewImages([]);
        setEditUploadedImages([]);
      } else {
        throw new Error(t('failedToUpdateApartment'));
      }
    } catch (error) {
      console.error('Error updating apartment:', error);
      alert(t('errorUpdatingApartment'));
    }
  };

  const handleImagePreview = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setUploadedImages(previews);
  };

  // English comment: Edit-mode image handlers
  const handleEditImagePreview = (e) => {
    const files = Array.from(e.target.files);
    setEditNewImages(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setEditUploadedImages(previews);
  };

  const removeEditImage = (index) => {
    setEditNewImages(prev => prev.filter((_, i) => i !== index));
    setEditUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingEditImage = (index) => {
    setEditForm(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="admin-section">
      <h2 className="admin-subtitle">{t('apartmentsManagement')}</h2>

      <div className="admin-card">
        <h3>{t('addNewApartment')}</h3>
        <form onSubmit={handleAdd} className="admin-form apartment-form">
          {/* form fields... (kept same as earlier implementation) */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label-with-icon">
                <FaHome /> {t('apartmentTitle')}
              </label>
              <input
                name="title"
                placeholder={t('apartmentTitle')}
                value={form.title}
                onChange={handleChange}
                required
                className="admin-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label-with-icon">
                <FaCog /> {t('type')}
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="admin-input"
              >
                <option value="rent">{t('forRent')}</option>
                <option value="sale">{t('forSale')}</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label-with-icon">
              <FaListUl /> {t('description')}
            </label>
            <textarea
              name="description"
              placeholder={t('apartmentDescription')}
              value={form.description}
              onChange={handleChange}
              required
              className="admin-textarea"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label className="form-label-with-icon">
              <FaMapMarkerAlt /> {t('location')}
            </label>
            <input
              name="location"
              placeholder={t('location')}
              value={form.location}
              onChange={handleChange}
              className="admin-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label-with-icon">
                <FaBed /> {t('numberOfRooms')}
              </label>
              <input
                name="rooms"
                placeholder={t('numberOfRooms')}
                type="number"
                value={form.rooms}
                onChange={handleChange}
                className="admin-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label-with-icon">
                <FaRulerCombined /> {t('area')} (m²)
              </label>
              <input
                name="area"
                placeholder={`${t('area')} (m²)`}
                type="number"
                value={form.area}
                onChange={handleChange}
                className="admin-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label-with-icon">
                <FaBuilding /> {t('floor')}
              </label>
              <input
                name="floor"
                placeholder={t('floor')}
                type="number"
                value={form.floor}
                onChange={handleChange}
                className="admin-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label-with-icon">
                <FaCalendarAlt /> {t('builtYear')}
              </label>
              <input
                name="builtYear"
                placeholder={t('builtYear')}
                type="number"
                value={form.builtYear}
                onChange={handleChange}
                className="admin-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label-with-icon">
              <FaCalendarAlt /> {t('availableFrom')}
            </label>
            <input
              name="availableFrom"
              type="date"
              placeholder={t('availableFrom')}
              value={form.availableFrom}
              onChange={handleChange}
              className="admin-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label-with-icon">
                <FaEuroSign /> {t('price')} (€)
              </label>
              <input
                name="price"
                placeholder={`${t('price')} (€)`}
                type="number"
                value={form.price}
                onChange={handleChange}
                required
                className="admin-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label-with-icon">
                <FaCog /> {t('status')}
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="admin-input"
              >
                <option value="available">{t('available')}</option>
                <option value="rented">{t('rented')}</option>
                <option value="sold">{t('sold')}</option>
              </select>
            </div>
          </div>

          {/* rest of the apartment form (unchanged) */}
          <div className="form-group">
            <label className="form-label-with-icon">
              <FaUpload /> {t('images')}
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImagePreview}
              className="admin-input file-input"
            />

            {uploadedImages.length > 0 && (
              <div className="image-preview-grid">
                {uploadedImages.map((url, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={url} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="remove-image-btn"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="form-group">
            <label className="form-label-with-icon">
              <FaListUl /> {t('features')} ({t('selectAllThatApply')}):
            </label>
                              <div className="features-grid">
                    {['balcony', 'elevator', 'parking', 'garden', 'terrace', 'fireplace', 'airConditioning', 'heating', 'internet', 'petsAllowed', 'sauna'].map((feature) => (
                      <label key={feature} className="feature-checkbox">
                        <input
                          type="checkbox"
                          name="features"
                          value={feature}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setForm(prev => ({
                                ...prev,
                                features: [...(prev.features || []), feature]
                              }));
                            } else {
                              setForm(prev => ({
                                ...prev,
                                features: (prev.features || []).filter(f => f !== feature)
                              }));
                            }
                          }}
                        />
                        <span className="feature-label-with-icon">
                          {feature === 'balcony' && <FaTree />}
                          {feature === 'elevator' && <FaBuilding />}
                          {feature === 'parking' && <FaParking />}
                          {feature === 'garden' && <FaLeaf />}
                          {feature === 'terrace' && <FaTree />}
                          {feature === 'fireplace' && <FaFire />}
                          {feature === 'airConditioning' && <FaSnowflake />}
                          {feature === 'heating' && <FaFire />}
                          {feature === 'internet' && <FaWifi />}
                          {feature === 'petsAllowed' && <FaPaw />}
                          {feature === 'sauna' && <FaHotTub />}
                          {t(feature)}
                        </span>
                      </label>
                    ))}
                  </div>
          </div>

          <button type="submit" disabled={loading} className="admin-button primary large">
            <FaPlus /> {loading ? t('adding') : t('addApartment')}
          </button>
        </form>
      </div>

      <div className="admin-apartments-list">
        <h3>{t('existingApartments')} ({apartments.length})</h3>

        {apartments.map((apt) =>
          editId === apt._id ? (
            <div key={apt._id} className="admin-card apartment-edit">
              <h4>{t('editApartment')}</h4>
              <div className="admin-form apartment-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label-with-icon">
                      <FaHome /> {t('apartmentTitle')}
                    </label>
                    <input
                      name="title"
                      placeholder={t('apartmentTitle')}
                      value={editForm.title || ''}
                      onChange={handleEditChange}
                      required
                      className="admin-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label-with-icon">
                      <FaCog /> {t('type')}
                    </label>
                    <select
                      name="type"
                      value={editForm.type || 'rent'}
                      onChange={handleEditChange}
                      className="admin-input"
                    >
                      <option value="rent">{t('forRent')}</option>
                      <option value="sale">{t('forSale')}</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <textarea
                    name="description"
                    placeholder={t('apartmentDescription')}
                    value={editForm.description || ''}
                    onChange={handleEditChange}
                    required
                    className="admin-textarea"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <input
                    name="location"
                    placeholder={t('location')}
                    value={editForm.location || ''}
                    className="admin-input"
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <input
                      name="rooms"
                      placeholder={t('numberOfRooms')}
                      type="number"
                      value={editForm.rooms || ''}
                      onChange={handleEditChange}
                      className="admin-input"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      name="area"
                      placeholder={`${t('area')} (m²)`}
                      type="number"
                      value={editForm.area || ''}
                      className="admin-input"
                      onChange={handleEditChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <input
                      name="floor"
                      placeholder={t('floor')}
                      type="number"
                      value={editForm.floor || ''}
                      onChange={handleEditChange}
                      className="admin-input"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      name="builtYear"
                      placeholder={t('builtYear')}
                      type="number"
                      value={editForm.builtYear || ''}
                      onChange={handleEditChange}
                      className="admin-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <input
                    name="availableFrom"
                    type="date"
                    placeholder={t('availableFrom')}
                    value={editForm.availableFrom || ''}
                    onChange={handleEditChange}
                    className="admin-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <input
                      name="price"
                      placeholder={`${t('price')} (€)`}
                      type="number"
                      value={editForm.price || ''}
                      onChange={handleEditChange}
                      required
                      className="admin-input"
                    />
                  </div>
                  <div className="form-group">
                    <select
                      name="status"
                      value={editForm.status || 'available'}
                      onChange={handleEditChange}
                      className="admin-input"
                    >
                      <option value="available">{t('available')}</option>
                      <option value="rented">{t('rented')}</option>
                      <option value="sold">{t('sold')}</option>
                    </select>
                  </div>
                </div>

                {Array.isArray(editForm.images) && editForm.images.length > 0 && (
                  <div className="apartment-images">
                    <strong>{t('existingImages')} ({editForm.images.length}):</strong>
                    <div className="image-thumbnails">
                      {editForm.images.slice(0, 8).map((img, index) => (
                        <div key={index} style={{ position: 'relative' }}>
                          <img src={img.url || img} alt="" className="image-thumb" />
                          <button
                            type="button"
                            onClick={() => removeExistingEditImage(index)}
                            className="remove-image-btn"
                            title={t('remove')}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleEditImagePreview}
                    className="admin-input file-input"
                  />
                  {editUploadedImages.length > 0 && (
                    <div className="image-preview-grid">
                      {editUploadedImages.map((url, index) => (
                        <div key={index} className="image-preview-item">
                          <img src={url} alt={`Preview ${index + 1}`} />
                          <button
                            type="button"
                            onClick={() => removeEditImage(index)}
                            className="remove-image-btn"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Features Section for Edit */}
                <div className="form-group">
                  <label className="form-label-with-icon">
                    <FaListUl /> {t('features')} ({t('selectAllThatApply')}):
                  </label>
                  <div className="features-grid">
                    {['balcony', 'elevator', 'parking', 'garden', 'terrace', 'fireplace', 'airConditioning', 'heating', 'internet', 'petsAllowed', 'sauna'].map((feature) => (
                      <label key={feature} className="feature-checkbox">
                        <input
                          type="checkbox"
                          name="feature"
                          value={feature}
                          checked={(editForm.features || []).includes(feature)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditForm(prev => ({
                                ...prev,
                                features: [...(prev.features || []), feature]
                              }));
                            } else {
                              setEditForm(prev => ({
                                ...prev,
                                features: (prev.features || []).filter(f => f !== feature)
                              }));
                            }
                          }}
                        />
                        <span className="feature-label-with-icon">
                          {feature === 'balcony' && <FaTree />}
                          {feature === 'elevator' && <FaBuilding />}
                          {feature === 'parking' && <FaParking />}
                          {feature === 'garden' && <FaLeaf />}
                          {feature === 'terrace' && <FaTree />}
                          {feature === 'fireplace' && <FaFire />}
                          {feature === 'airConditioning' && <FaSnowflake />}
                          {feature === 'heating' && <FaFire />}
                          {feature === 'internet' && <FaWifi />}
                          {feature === 'petsAllowed' && <FaPaw />}
                          {feature === 'sauna' && <FaHotTub />}
                          {t(feature)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="admin-actions">
                  <button
                    onClick={() => handleEdit(apt._id)}
                    className="admin-button primary"
                  >
                    <FaSave /> {t('saveChanges')}
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="admin-button secondary"
                  >
                    <FaTimes /> {t('cancel')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div key={apt._id} className="admin-card apartment-item">
              <div className="apartment-header">
                <div className="apartment-info">
                  <h4 className="apartment-title">{apt.title}</h4>
                  <div className="apartment-badges">
                    <span className={`badge ${apt.type}`}>{apt.type}</span>
                    <span className={`badge ${apt.status}`}>{apt.status}</span>
                  </div>
                </div>
                <div className="apartment-price">€{apt.price}</div>
              </div>

              <p className="apartment-description">{apt.description}</p>

                             <div className="apartment-details">
                 {apt.location && <span><strong>{t('location')}:</strong> {apt.location}</span>}
                 {apt.rooms && <span><strong>{t('rooms')}:</strong> {apt.rooms}</span>}
                 {apt.area && <span><strong>{t('area')}:</strong> {apt.area} m²</span>}
                 {apt.floor && <span><strong>{t('floor')}:</strong> {apt.floor}</span>}
                 {(apt.builtYear || apt.year) && <span><strong>{t('builtYear')}:</strong> {apt.builtYear || apt.year}</span>}
                 {apt.availableFrom && <span><strong>{t('availableFrom')}:</strong> {new Date(apt.availableFrom).toLocaleDateString()}</span>}
               </div>

              {apt.features && apt.features.length > 0 && (
                <div className="apartment-features">
                  <strong>{t('features')}:</strong>
                  <div className="feature-tags">
                    {apt.features.map((feature, index) => (
                      <span key={index} className="feature-tag">{t(feature) || feature}</span>
                    ))}
                  </div>
                </div>
              )}

              {apt.images && apt.images.length > 0 && (
                <div className="apartment-images">
                  <strong>{t('images')} ({apt.images.length}):</strong>
                  <div className="image-thumbnails">
                    {apt.images.slice(0, 4).map((img, index) => (
                      <img 
                        key={index} 
                        src={img.url || img} 
                        alt="" 
                        className="image-thumb"
                      />
                    ))}
                    {apt.images.length > 4 && (
                      <div className="more-images-count">+{apt.images.length - 4}</div>
                    )}
                  </div>
                </div>
              )}

              <div className="admin-actions">
                <button
                  onClick={() => startEdit(apt)}
                  className="admin-button primary"
                >
                  <FaEdit /> {t('edit')}
                </button>
                <button
                  onClick={() => handleDelete(apt._id)}
                  className="admin-button danger"
                >
                  <FaTrash /> {t('delete')}
                </button>
              </div>
            </div>
          )
        )}

        {apartments.length === 0 && (
          <div className="admin-empty">
            <FaHome size={48} />
            <p>{t('noApartmentsYet')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ContactsAdmin (kept unchanged)
function ContactsAdmin() {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('all');
  // English comment: UI enhancements for search, sort, and expand
  const [query, setQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/contact");
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setContacts(prev =>
          prev.map(c => c._id === id ? updated : c)
        );
      }
    } catch (error) {
      console.error('Error updating contact status:', error);
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm(t('confirmDeleteMessage'))) return;
    
    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      if (res.ok) {
        setContacts(prev => prev.filter(c => c._id !== id));
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const filteredContacts = contacts
    .filter(contact => (filter === 'all' ? true : contact.status === filter))
    .filter(contact => {
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        (contact.name || '').toLowerCase().includes(q) ||
        (contact.email || '').toLowerCase().includes(q) ||
        (contact.phone || '').toLowerCase().includes(q) ||
        (contact.message || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? db - da : da - db;
    });

  const newCount = contacts.filter(c => c.status === 'new').length;

  return (
    <div className="admin-section">
      <div className="contacts-header">
        <h2 className="admin-subtitle">
          {t('messages')} 
          {newCount > 0 && <span className="admin-badge">{newCount}</span>}
        </h2>

        <div className="admin-filter-tabs">
          <button
            className={filter === 'all' ? 'filter-tab active' : 'filter-tab'}
            onClick={() => setFilter('all')}
          >
            {t('all')} ({contacts.length})
          </button>
          <button
            className={filter === 'new' ? 'filter-tab active' : 'filter-tab'}
            onClick={() => setFilter('new')}
          >
            {t('newMessages')} ({newCount})
          </button>
          <button
            className={filter === 'read' ? 'filter-tab active' : 'filter-tab'}
            onClick={() => setFilter('read')}
          >
            {t('readMessages')} ({contacts.length - newCount})
          </button>
        </div>
      </div>

      {/* English comment: Search and sort controls */}
      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div className="admin-form" style={{ gap: 12 }}>
          <div className="form-row" style={{ gridTemplateColumns: '2fr 1fr' }}>
            <div className="form-group">
              <div className="admin-input" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaSearch />
                <input
                  type="text"
                  placeholder={t('search_placeholder') || 'Search by name, email, phone or message'}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%' }}
                />
              </div>
            </div>
            <div className="form-group">
              <select
                className="admin-input"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="newest">{t('newest_first') || 'Newest first'}</option>
                <option value="oldest">{t('oldest_first') || 'Oldest first'}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-contacts-list">
        {filteredContacts.map((contact) => (
          <div 
            key={contact._id} 
            className={`admin-card contact-item ${contact.status === 'new' ? 'new' : ''}`}
          >
            <div className="contact-header">
              <div className="contact-info">
                <h4>{contact.name}</h4>
                <div className="contact-details">
                  <span>{contact.email}</span>
                  {contact.phone && <span>{contact.phone}</span>}
                </div>
              </div>
              <div className="contact-meta">
                <span className={`status-badge ${contact.status}`}>
                  {contact.status}
                </span>
                <span className="contact-date">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </span>
                {/* English comment: Actions moved to header right for consistent alignment */}
                <div className="admin-actions contact-actions">
                  {contact.status === 'new' ? (
                    <button
                      onClick={() => updateStatus(contact._id, 'read')}
                      className="admin-button primary small"
                    >
                      <FaEye /> {t('markAsRead')}
                    </button>
                  ) : (
                    <button
                      onClick={() => updateStatus(contact._id, 'new')}
                      className="admin-button secondary small"
                    >
                      <FaEyeSlash /> {t('markAsNew')}
                    </button>
                  )}
                  <button
                    onClick={() => deleteContact(contact._id)}
                    className="admin-button danger small"
                  >
                    <FaTrash /> {t('delete')}
                  </button>
                </div>
              </div>
            </div>

            <div className="contact-message">
              <p style={{ whiteSpace: 'pre-wrap' }}>
                {expandedId === contact._id
                  ? contact.message
                  : (contact.message || '').slice(0, 220)}
                {contact.message && contact.message.length > 220 && expandedId !== contact._id && '...'}
              </p>
                                {contact.message && contact.message.length > 220 && (
                    <button
                      className="admin-button small secondary"
                      onClick={() => setExpandedId(expandedId === contact._id ? null : contact._id)}
                    >
                      {expandedId === contact._id ? <><FaChevronUp /> {t('showLess')}</> : <><FaChevronDown /> {t('showMore')}</>}
                    </button>
                  )}
            </div>
          </div>
        ))}

        {filteredContacts.length === 0 && (
          <div className="admin-empty">
            <FaEnvelope size={48} />
            <p>{t('noMessagesFound')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;