import PropTypes from 'prop-types';
import { TECHNICAL_DETAILS } from '../../constants/details';
import { formatBudgetRange } from '../../helpers/common';

const TechnicalDetails = ({ selectedLayer }) => {
  return (
    <div className="bg-[#EBF2EB] rounded-md p-2 mb-6">
      {TECHNICAL_DETAILS.map((detail, index) => (
        <div
          key={detail.id}
          className={`flex items-center py-2 ${
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
                className="w-4 h-4"
              />
            )}
            {detail.id === 'trasporto' && (
              <img
                src="/svg/transportIcon.svg"
                alt="Trasporto"
                className="w-4 h-4"
              />
            )}
            {detail.id === 'area_ha' && (
              <img src="/svg/area_dark.svg" alt="Area" className="w-4 h-4" />
            )}
            {detail.id === 'budget' && (
              <img
                src="/svg/budget_dark.svg"
                alt="Budget stimato"
                className="w-4 h-4"
              />
            )}
            {detail.id === 'tipo_intervento' && (
              <img
                src="/svg/tree_dark.svg"
                alt="Intervento forestale"
                className="w-4 h-4"
              />
            )}
          </div>
          <div className="flex-1 flex justify-between items-center">
            <div className="flex-1">
              <p className="text-xs font-semibold text-[#202020] mb-0.5">
                {detail.title}
              </p>
              {detail.subTitle && (
                <p className="text-[10px] text-[#202020]">{detail.subTitle}</p>
              )}
            </div>
            <div className="text-right ml-4">
              <p className="text-xs text-[#202020] whitespace-pre-line">
                {detail.id === 'budget'
                  ? formatBudgetRange(
                      selectedLayer?.budget_min,
                      selectedLayer?.budget_max
                    )
                  : detail.id === 'area_ha'
                  ? `${selectedLayer?.area_ha} ha`
                  : selectedLayer?.[detail.id] || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      ))}
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
