import { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

import useMapStore from '../../store/useMapStore';
import useUIStore from '../../store/useUIStore';

import ImageCarousel from './ImageCarousel';
import TechnicalDetails from './TechnicalDetails';

import { TECHNICAL_DETAILS } from '../../constants/details';
import StatusTag from '../SidePanel/StatusTag';

const HeaderRow = ({
  currentImage,
  code,
  title,
  coordinates,
  status,
  onClose,
}) => (
  <div className="flex pb-2 gap-2">
    <img
      src={currentImage || '/images/placeholder.jpg'}
      alt={`Anteprima area ${code || title}`}
      className="w-[46px] h-[46px] rounded-full object-cover border-2 border-white shadow mr-1"
      onError={(e) => {
        e.target.src = '/images/placeholder.jpg';
      }}
    />
    <div className="flex-1 min-w-0">
      <h3 className="text-lg font-bold text-gray-900 truncate">
        {code || 'Area 125XXX'}
      </h3>
      <p className="text-xs text-gray-600 truncate">
        {coordinates || '40.4002192° N – 12.302934° O'}
      </p>
    </div>
    <span className="ml-2">
      <StatusTag status={status || 'Da recuperare'} />
    </span>
    <button
      onClick={onClose}
      aria-label="Chiudi pannello dettagli"
      className="ml-2 bg-[#A3A4A3] text-[#FFFFFF] rounded-full w-7 h-7 flex items-center justify-center"
    >
      <X className="w-5 h-5" />
    </button>
  </div>
);

const InfoCards = ({ area, intervent, budget }) => (
  <div className="flex gap-2 mb-4 mt-2">
    <div className="flex flex-auto flex-col items-center bg-[#E3F1E4] rounded-md py-2">
      <div className="flex items-center">
        <img
          src="/public/svg/areaIcon.svg"
          alt="Icona area"
          className="w-4 h-4 mr-1"
        />
        <span className="text-[14px] font-semibold text-[#40523F]">
          {area || '12ha'}
        </span>
      </div>
      <span className="text-[10px] text-[#818181]">Dimensioni</span>
    </div>
    <div className="flex flex-auto flex-col items-center bg-[#E3F1E4] rounded-md py-2">
      <div className="flex items-center">
        <img
          src="/public/svg/treeIcon.svg"
          alt="Icona intervento"
          className="w-4 h-4 mr-1"
        />
        <span className="text-[14px] font-semibold text-[#40523F]">
          {intervent || 'Manutenzione'}
        </span>
      </div>
      <span className="text-[10px] text-[#818181]">Intervento</span>
    </div>
    <div className="flex flex-auto flex-col items-center bg-[#E3F1E4] rounded-md py-2">
      <div className="flex items-center">
        <img
          src="/public/svg/budgetIcon.svg"
          alt="Icona budget"
          className="w-4 h-4 mr-1"
        />
        <span className="text-[14px] font-semibold text-[#40523F]">
          {budget || '€200K'}
        </span>
      </div>
      <span className="text-[10px] text-[#818181]">Budget stimato</span>
    </div>
  </div>
);

const Gallery = ({ images, currentImageIndex, setCurrentImageIndex }) => (
  <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4">
    {images.map((img, idx) => (
      <img
        key={idx}
        src={img}
        alt={`Foto area ${idx + 1}`}
        className={`w-[112px] h-[140px] object-cover rounded-lg flex-shrink-0 border-2 shadow cursor-pointer ${
          idx === currentImageIndex ? 'border-[#426345]' : 'border-white'
        }`}
        onClick={() => setCurrentImageIndex(idx)}
        aria-label={`Seleziona foto ${idx + 1}`}
      />
    ))}
  </div>
);

const DetailPanel = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Store States
  const { selectedLayer, setSelectedLayer } = useMapStore();
  const { showDetailPanel, setShowDetailPanel } = useUIStore();

  // Memoize the image URLs to prevent unnecessary re-renders
  const images = useMemo(() => {
    // Using different images for demo purposes
    return [
      '/images/forest1.jpeg',
      '/images/forest2.jpeg',
      '/images/forest1.jpeg',
      '/images/forest2.jpeg',
      '/images/forest1.jpeg',
    ];
  }, []);

  const currentImage = images[currentImageIndex] || '/images/forest1.jpeg';

  const handleImageSelect = useCallback((index) => {
    setCurrentImageIndex(index);
  }, []);

  const handlePrevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  const handleShare = useCallback(() => {
    try {
      // Implement sharing functionality
      navigator
        .share({
          title: selectedLayer?.code,
          text: `Check out this forest area: ${selectedLayer?.code}`,
          url: window.location.href,
        })
        .catch(() => {
          toast.error('Sharing failed');
        });
    } catch {
      toast.error('Share API not supported');
    }
  }, [selectedLayer?.code]);

  const handleClose = () => {
    setShowDetailPanel(false);
    setSelectedLayer(null);
  };

  // Early return if no selectedLayer
  if (!selectedLayer || !showDetailPanel) return null;

  return (
    <>
      {/* Desktop layout: Right dialog/sidebar */}
      <div className="fixed right-0 h-full w-[500px] bg-white shadow-2xl z-[1000] hidden md:block">
        <div className="h-full flex flex-col">
          {/* Header with image */}
          <div className="relative">
            <div className="relative group">
              <img
                src={currentImage || 'images/placeholder.jpg'}
                alt={`${selectedLayer.code || selectedLayer.title} - Image ${
                  currentImageIndex + 1
                }`}
                className="w-full h-[300px] object-cover"
                onError={(e) => {
                  e.target.src = 'images/placeholder.jpg';
                }}
              />

              {/* Navigation arrows */}
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full transition-colors duration-200 hover:bg-black/60"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full transition-colors duration-200 hover:bg-black/60"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Image carousel */}
              <ImageCarousel
                images={images}
                currentIndex={currentImageIndex}
                onImageSelect={handleImageSelect}
              />
            </div>
            <button
              onClick={handleClose}
              aria-label="close panel"
              className="absolute top-3 left-3 bg-[#E3F1E4] text-[#426345] rounded-full w-10 h-10 flex items-center justify-center"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content area with scroll */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <div className="flex flex-col items-start mb-3 relative w-full">
                <h3 className="text-4xl font-extrabold text-gray-900 mb-1 w-full text-left">
                  {selectedLayer.code}
                </h3>
                <p className="text-base text-gray-600 w-full text-left mb-4">
                  {selectedLayer.coordinates || '40.4002192 N - 12.302934 O'}
                </p>

                {/* Info Blocks */}
                <div className="flex justify-between w-full mb-6 gap-x-4">
                  {/* Area */}
                  <div className="flex flex-col w-[20%] items-center justify-center bg-[#E3F1E4] rounded-lg px-4 py-2 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <img
                        src="/public/svg/areaIcon.svg"
                        alt="Area"
                        className={`w-4 h-4 mr-2`}
                      />

                      <p className="text-lg font-bold text-[#40523F]">
                        {selectedLayer.area || '12ha'}
                      </p>
                    </div>
                    <p className="text-xs text-[#818181]">Dimensioni</p>
                  </div>

                  {/* Intervento */}
                  <div className="flex flex-col w-[50%] items-center justify-center bg-[#E3F1E4] rounded-lg px-4 py-2 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <img
                        src="/public/svg/treeIcon.svg"
                        alt="Area"
                        className={`w-4 h-4 mr-2`}
                      />
                      <p className="text-lg font-bold text-[#40523F]">
                        {selectedLayer.intervent || 'Manutenzione'}
                      </p>
                    </div>
                    <p className="text-xs text-[#818181]">Intervento</p>
                  </div>

                  {/* Budget */}
                  <div className="flex flex-col w-[30%] items-center justify-center bg-[#E3F1E4] rounded-lg px-4 py-2 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <img
                        src="/public/svg/budgetIcon.svg"
                        alt="Area"
                        className={`w-4 h-4 mr-2`}
                      />
                      <p className="text-lg font-bold text-[#40523F]">
                        {selectedLayer.budget_estimated || '€200K'}
                      </p>
                    </div>
                    <p className="text-xs text-[#818181]">Budget stimato</p>
                  </div>
                </div>

                <p className="text-base text-[#484848] leading-relaxed mb-6 text-left w-full">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  diam nonummy nibh euismod tincidunt ut laoreet dolore magna
                  aliquam erat volutpat. Ut wisi enim ad minim veniam, quis
                  nostrud exerci tation ullamcorper suscipit lobortis nisl ut
                  aliquip ex ea commodo consequat. Duis autem vel eum iriure
                  dolor in hendrerit in vulputate velit esse molestie consequat,
                  vel illum dolore eu feugiat nulla facilisis at vero eros et
                  accumsan.
                </p>

                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  Dettagli area
                </h4>

                <div className="mt-2">
                  <TechnicalDetails details={TECHNICAL_DETAILS.primary} />
                </div>
              </div>
              {/* Contact Buttons */}
              <div className="flex gap-3">
                <button className="bg-[#426345] text-white py-3 px-6 rounded-lg flex-1 font-medium">
                  Contattaci
                </button>
                <button
                  onClick={handleShare}
                  className="bg-[#E3F1E4] text-[#426345] p-3 rounded-lg"
                >
                  <img
                    src="/public/svg/shareIcon.svg"
                    alt="Area"
                    className={`w-5 h-5`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile layout: floating card */}
      <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 w-full max-h-[80vh] rounded-t-3xl shadow-xl bg-white p-4 z-[1000] block md:hidden overflow-y-auto">
        <HeaderRow
          currentImage={currentImage}
          code={selectedLayer.code}
          title={selectedLayer.title}
          coordinates={selectedLayer.coordinates}
          status={selectedLayer.status}
          onClose={handleClose}
        />
        <InfoCards
          area={selectedLayer.area}
          intervent={selectedLayer.intervent}
          budget={selectedLayer.budget_estimated}
        />
        {/* Gallery title */}
        <div className="mb-1">
          <h4 className="text-base font-semibold text-[#484848] mb-2">
            Foto e Video
          </h4>
        </div>
        <Gallery
          images={images}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex}
        />
        {/* Details section */}
        <div>
          <h4 className="text-lg font-bold text-gray-900 mb-2">
            Dettagli area
          </h4>
          <TechnicalDetails details={TECHNICAL_DETAILS.primary} />
        </div>
        {/* Contact Buttons */}
        <div className="flex gap-3">
          <button className="bg-[#426345] text-white py-3 px-6 rounded-lg flex-1 font-medium">
            Contattaci
          </button>
          <button
            onClick={handleShare}
            className="bg-[#E3F1E4] text-[#426345] p-4 rounded-lg"
            aria-label="Condividi area"
          >
            <img
              src="/public/svg/shareIcon.svg"
              alt="Condividi"
              className="w-4 h-4"
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default DetailPanel;
