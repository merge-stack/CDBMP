import PropTypes from 'prop-types';

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
                src={image || 'images/placeholder.png'}
                alt={`Thumbnail ${index + 1}`}
                className="w-12 aspect-square object-cover"
                onError={(e) => {
                  e.target.src = 'images/placeholder.png';
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

export default ImageCarousel;
