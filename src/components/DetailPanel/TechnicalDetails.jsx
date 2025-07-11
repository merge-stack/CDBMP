import PropTypes from 'prop-types';
import { TECHNICAL_DETAILS } from '../../constants/details';

const TechnicalDetails = ({ selectedLayer }) => {
  return (
    <div className="bg-[linear-gradient(0deg,_#FFF_0%,_#E3F1E4_29.81%)] rounded-md p-4 mb-6">
      {TECHNICAL_DETAILS.map((detail, index) => (
        <div
          key={detail.id}
          className={`flex items-start py-3 ${
            index < TECHNICAL_DETAILS.length - 1
              ? 'border-b border-gray-200'
              : ''
          }`}
        >
          <div className="p-2 rounded-md mr-3 flex-shrink-0">
            {detail.id === 'pendenza' && (
              <img
                src="/svg/slopeIcon.svg"
                alt="Pendenza"
                className="w-5 h-5"
              />
            )}
            {detail.id === 'trasporto' && (
              <img
                src="/svg/transportIcon.svg"
                alt="Trasporto"
                className="w-5 h-5"
              />
            )}
          </div>
          <div className="flex-1 flex justify-between items-start">
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#202020] mb-0.5">
                {detail.title}
              </p>
              {detail.subTitle && (
                <p className="text-xs text-[#202020]">{detail.subTitle}</p>
              )}
            </div>
            <div className="text-right ml-4">
              <p className="text-sm text-[#202020] whitespace-pre-line">
                {selectedLayer?.[detail.id] || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      ))}
      <button className="text-sm text-[#4F7E53] font-medium underline mt-3 hover:text-[#3d6340] transition-colors">
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

export default TechnicalDetails;
