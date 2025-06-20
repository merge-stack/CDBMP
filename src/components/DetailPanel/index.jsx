import { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

import useMapStore from '../../store/useMapStore';
import useUIStore from '../../store/useUIStore';

import ImageCarousel from './ImageCarousel';
import TechnicalDetails from './TechnicalDetails';

import { TECHNICAL_DETAILS } from '../../constants/details';

const DetailPanel = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Store States
  const { selectedLayer, setSelectedLayer } = useMapStore();
  const { setShowDetailPanel } = useUIStore();

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
  if (!selectedLayer) return null;

  return (
    <div className="absolute top-[180px] right-5 w-[500px] max-h-[calc(100vh-200px)] overflow-y-auto bg-white rounded-xl shadow-lg z-[1000]">
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam
            nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
            volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
            ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo
            consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate
            velit esse molestie consequat, vel illum dolore eu feugiat nulla
            facilisis at vero eros et accumsan.
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
  );
};

export default DetailPanel;
