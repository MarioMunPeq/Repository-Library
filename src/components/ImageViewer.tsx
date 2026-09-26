import { useEffect, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';
import { SmartImage } from './SmartImage';
import { resolveAssetSrc, ASSET_EXTENSIONS } from '../utils/assets';
import './ImageViewer.css';

interface ImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex: number;
  projectSlug: string;
  projectFallbackGradient: string;
  altTexts?: string[];
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  isOpen,
  onClose,
  images,
  initialIndex,
  projectSlug,
  projectFallbackGradient,
  altTexts = [],
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [attempt, setAttempt] = useState(0);
  const [loadedAttempt, setLoadedAttempt] = useState(-1);
  const viewerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const goPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Reset attempt when image changes
  useEffect(() => {
    setAttempt(0);
    setLoadedAttempt(-1);
  }, [currentIndex, images.length]);

  // El padre monta el visor con `key` (slug + apertura + índice), así que el
  // estado inicial ya es el de la captura pulsada y no hace falta sincronizarlo.

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goPrevious();
          break;
        case 'ArrowRight':
          goNext();
          break;
        case 'Tab':
          // Focus trap within viewer
          const focusableElements = viewerRef.current?.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (!focusableElements?.length) return;
          const first = focusableElements[0];
          const last = focusableElements[focusableElements.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goPrevious, goNext, images.length]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const currentAlt = altTexts[currentIndex] || `Captura ${currentIndex + 1} de ${images.length}`;
  const basePath = `/projects/${projectSlug}/screenshots/${currentImage}`;
  const candidates = resolveAssetSrc(basePath, ASSET_EXTENSIONS.screenshots);

  const handleError = () => {
    setAttempt((current) => current + 1);
  };

  const handleLoad = () => {
    setLoadedAttempt(attempt);
  };

  const isLoaded = loadedAttempt === attempt;

  if (attempt >= candidates.length) return null;

  const imageUrl = candidates[attempt];

  // Se monta en un portal para salir de cualquier ancestro con `contain` o
  // `transform`: si no, el overlay fixed se quedaría encerrado en la página.
  return createPortal(
    <div
      className="image-viewer-overlay"
      ref={viewerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Visor de capturas de pantalla"
      tabIndex={-1}
      onClick={(e) => {
        if (e.target === viewerRef.current) onClose();
      }}
    >
      <div className="image-viewer-container">
        <button
          className="image-viewer-close"
          onClick={onClose}
          aria-label="Cerrar visor de capturas"
        >
          <CloseIcon />
        </button>

        {images.length > 1 && (
          <>
            <button
              className="image-viewer-nav image-viewer-nav-left"
              onClick={goPrevious}
              aria-label="Captura anterior"
            >
              <ChevronLeftIcon />
            </button>
            <button
              className="image-viewer-nav image-viewer-nav-right"
              onClick={goNext}
              aria-label="Captura siguiente"
            >
              <ChevronRightIcon />
            </button>
          </>
        )}

        <div className="image-viewer-image-wrapper">
          <img
            key={attempt}
            ref={imgRef}
            className="image-viewer-image"
            src={imageUrl}
            alt={currentAlt}
            onLoad={handleLoad}
            onError={handleError}
            style={{
              background: projectFallbackGradient,
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 120ms ease',
            }}
          />
        </div>

        {/* Pie del visor: contador + tira de miniaturas para saltar a cualquiera */}
        <div className="image-viewer-footer">
          <span className="image-viewer-counter" aria-live="polite">
            {currentIndex + 1} / {images.length}
          </span>

          {images.length > 1 && (
            <div className="image-viewer-strip" role="tablist" aria-label="Ir a la captura">
              {images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  role="tab"
                  aria-selected={index === currentIndex}
                  aria-label={`Captura ${index + 1}`}
                  className={`image-viewer-thumb ${index === currentIndex ? 'active' : ''}`}
                  style={{ background: projectFallbackGradient }}
                  onClick={() => {
                    setCurrentIndex(index);
                    setAttempt(0);
                    setLoadedAttempt(-1);
                  }}
                >
                  <SmartImage
                    basePath={`/projects/${projectSlug}/screenshots/${image}`}
                    kind="screenshots"
                    className="image-viewer-thumb-img"
                    alt=""
                    draggable={false}
                    fallback={<span className="image-viewer-thumb-fallback" aria-hidden="true" />}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};
