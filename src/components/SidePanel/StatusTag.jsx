import PropTypes from 'prop-types';

const StatusTag = ({ status, selected = false }) => {
  const statusConfig = {
    Recuperata: {
      bgColor: selected ? 'bg-[#BFFFB3]' : 'bg-[rgba(191,255,179,0.5)]',
      textColor: 'text-[#484747]',
      borderColor: 'border-[#92C68A]',
    },
    'In corso': {
      bgColor: selected ? 'bg-[#F6FFB3]' : 'bg-[rgba(246,255,179,0.5)]',
      textColor: 'text-[#484747]',
      borderColor: 'border-[#C0C68A]',
    },
    'Da recuperare': {
      bgColor: selected ? 'bg-[#FFB3B3]' : 'bg-[rgba(255,179,179,0.5)]',
      textColor: 'text-[#484747]',
      borderColor: 'border-[#C68A8A]',
    },
  };
  const { bgColor, textColor, borderColor } = statusConfig[status] || {
    bgColor: selected ? 'bg-gray-300' : 'bg-gray-200',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-200',
  };
  return (
    <span
      className={`max-w-28 px-2 py-1 rounded-md text-xs font-normal border-2 whitespace-nowrap ${bgColor} ${textColor} ${borderColor}`}
    >
      {status}
    </span>
  );
};

StatusTag.propTypes = {
  status: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
};

export default StatusTag;
