import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { TECHNICAL_DETAILS } from '../constants/details';
import { toast } from 'react-toastify';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const ImageCarousel = ({ images, currentIndex, onImageSelect }) => {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
      <div className="bg-[#D9D9D9] bg-opacity-50 backdrop-blur-sm rounded-2xl p-2">
        <div className="flex gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(index)}
              className={`relative overflow-hidden rounded-lg transition-all duration-200 ${
                index === currentIndex
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent scale-105'
                  : 'hover:scale-105'
              }`}
            >
              <img
                src={image || '/placeholder.svg'}
                alt={`Thumbnail ${index + 1}`}
                className="w-12 aspect-square object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder.jpg';
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

ImageCarousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentIndex: PropTypes.number.isRequired,
  onImageSelect: PropTypes.func.isRequired,
};

const TechnicalDetails = ({ details }) => {
  return (
    <div className="bg-[#E3F1E4] rounded-lg p-4 mb-6">
      {details.map((detail, index) => (
        <div
          key={detail.id}
          className={`flex items-start py-3 ${
            index < details.length - 1 ? 'border-b border-gray-200' : ''
          }`}
        >
          <div className="p-2 rounded-md mr-3 flex-shrink-0">
            {detail.id === 'slope' && (
              <img
                src="/svg/slopeIcon.svg"
                alt="Pendenza"
                className="w-5 h-5"
              />
            )}
            {detail.id === 'transport' && (
              <img
                src="/svg/transportIcon.svg"
                alt="Trasporto"
                className="w-5 h-5"
              />
            )}
          </div>
          <div className="flex-1 flex justify-between items-start">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 mb-0.5">
                {detail.title}
              </p>
              {detail.subTitle && (
                <p className="text-xs text-gray-600">{detail.subTitle}</p>
              )}
            </div>
            <div className="text-right ml-4">
              <p className="text-sm font-semibold text-gray-900 whitespace-pre-line">
                {detail.formatter(detail.value)}
              </p>
            </div>
          </div>
        </div>
      ))}
      <button className="text-sm text-[#4F7E53] font-semibold underline mt-3 hover:text-[#3d6340] transition-colors">
        Carica altre
      </button>
    </div>
  );
};

TechnicalDetails.propTypes = {
  details: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
      formatter: PropTypes.func.isRequired,
      subTitle: PropTypes.string,
    })
  ).isRequired,
};

function DetailPanel({ layer, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Memoize the image URLs to prevent unnecessary re-renders
  const images = useMemo(() => {
    // Using different images for demo purposes
    return [
      '/public/images/forest1.jpeg',
      '/public/images/forest2.jpeg',
      '/public/images/forest1.jpeg',
      '/public/images/forest2.jpeg',
      '/public/images/forest1.jpeg',
    ];
  }, []);

  const currentImage =
    images[currentImageIndex] || '/public/images/forest1.jpeg';

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
          title: layer?.code,
          text: `Check out this forest area: ${layer?.code}`,
          url: window.location.href,
        })
        .catch(() => {
          toast.error('Sharing failed');
        });
    } catch {
      toast.error('Share API not supported');
    }
  }, [layer?.code]);

  // Early return if no layer
  if (!layer) return null;

  return (
    <div className="absolute top-[180px] right-5 w-[500px] max-h-[calc(100vh-200px)] overflow-y-auto bg-white rounded-xl shadow-lg z-[1000]">
      <div className="relative">
        <div className="relative group">
          <img
            src={currentImage || '/placeholder.svg'}
            alt={`${layer.code || layer.title} - Image ${
              currentImageIndex + 1
            }`}
            className="w-full h-[300px] object-cover"
            onError={(e) => {
              e.target.src = '/placeholder.jpg';
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
          onClick={onClose}
          aria-label="close panel"
          className="absolute top-3 left-3 bg-[#E3F1E4] text-[#426345] rounded-full w-10 h-10 flex items-center justify-center"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Image thumbnails (old, will be removed if carousel is fully implemented here) */}
        {/* <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 bg-white/50 p-1 rounded-lg backdrop-blur-sm">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-16 h-16 rounded-lg overflow-hidden border-2 border-white shadow-md"
            >
              <img
                src="/public/images/forest1.jpeg" // Replace with dynamic image source
                alt="Thumbnail"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div> */}
      </div>

      <div className="p-6">
        <div className="flex flex-col items-start mb-3 relative w-full">
          <h3 className="text-4xl font-extrabold text-gray-900 mb-1 w-full text-left">
            {layer.code}
          </h3>
          <p className="text-base text-gray-600 w-full text-left mb-4">
            {layer.coordinates || '40.4002192 N - 12.302934 O'}
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
                  {layer.area || '12ha'}
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
                  {layer.intervent || 'Manutenzione'}
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
                  {layer.budget_estimated || '€200K'}
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
}

DetailPanel.propTypes = {
  layer: PropTypes.shape({
    id: PropTypes.number.isRequired,
    code: PropTypes.string.isRequired,
    municipality: PropTypes.string,
    description: PropTypes.string,
    coordinates: PropTypes.string,
    area: PropTypes.string,
    intervent: PropTypes.string,
    budget_estimated: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default DetailPanel;
