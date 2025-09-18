import React, { useState, useEffect } from 'react';
import './GalleryModal.css';

const GalleryModal = ({ isOpen, onClose, images, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [initialIndex, isOpen]);



  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, currentIndex]);

  if (!isOpen || !images || images.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    resetImagePositionMobile();
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    resetImagePositionMobile();
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 4));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const newZoom = Math.max(prev - 0.25, 1);
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };

  const resetImagePosition = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setIsDragging(false);
    setDragStart({ x: 0, y: 0 });
  };

  // Enhanced reset for mobile - ensures clean state
  const resetImagePositionMobile = () => {
    // Force a complete reset with a small delay to ensure clean rendering
    setTimeout(() => {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      setIsDragging(false);
      setDragStart({ x: 0, y: 0 });
    }, 50);
  };

  const handleImageDoubleClick = () => {
    if (zoom === 1) {
      setZoom(2);
      setPosition({ x: 0, y: 0 });
    } else {
      resetImagePosition();
    }
  };

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && zoom > 1) {
      e.preventDefault(); // Prevent scrolling
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="gallery-modal-overlay" onClick={onClose}>
      <div className="gallery-modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="gallery-close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        {/* Image Container */}
        <div className="gallery-image-container">
          <img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Gallery ${currentIndex + 1}`}
            className="gallery-image"
            style={{
              transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
              cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
            }}
            onDoubleClick={handleImageDoubleClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            draggable={false}
          />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button 
              className="gallery-nav-btn gallery-nav-prev" 
              onClick={handlePrevious}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button 
              className="gallery-nav-btn gallery-nav-next" 
              onClick={handleNext}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </>
        )}

        {/* Control Panel */}
        <div className="gallery-controls">
          <button className="gallery-control-btn" onClick={handleZoomOut} disabled={zoom <= 1}>
            <i className="fas fa-search-minus"></i>
          </button>
          
          <button className="gallery-control-btn" onClick={handleZoomIn} disabled={zoom >= 4}>
            <i className="fas fa-search-plus"></i>
          </button>
          
          <button className="gallery-control-btn" onClick={resetImagePosition}>
            <i className="fas fa-expand-arrows-alt"></i>
          </button>
        </div>

        {/* Image Thumbnails */}
        {images.length > 1 && (
          <div className="gallery-thumbnails">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className={`gallery-thumbnail ${index === currentIndex ? 'active' : ''}`}
                onClick={() => {
                  setCurrentIndex(index);
                  resetImagePositionMobile();
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryModal;