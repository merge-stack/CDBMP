import { useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

import useMapStore from '../../store/useMapStore';
import useUIStore from '../../store/useUIStore';

import ImageCarousel from './ImageCarousel';
import TechnicalDetails from './TechnicalDetails';

import StatusTag from '../SidePanel/StatusTag';
import { formatBudgetRange, formatNumericValue } from '../../helpers/common';
import { useParams, useNavigate } from 'react-router-dom';

const HeaderRow = ({ currentImage, id, status, onClose }) => (
  <div className="flex pb-2 gap-2 items-center">
    <img
      src={currentImage || `${window.location.origin}/images/placeholder.png`}
      alt={`Anteprima area ${id}`}
      className="w-[46px] h-[46px] rounded-full object-cover border-2 border-white shadow mr-1"
      onError={(e) => {
        e.target.src = `${window.location.origin}/images/placeholder.png`;
      }}
    />
    <div className="flex-1 min-w-0">
      <h3 className="text-lg font-bold text-gray-900 truncate">
        {id ? `Area ${id}` : 'N/A'}
      </h3>
    </div>
    <span className="ml-2">
      <StatusTag status={status || 'N/A'} />
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
          src="/svg/areaIcon.svg"
          alt="Icona area"
          className="w-3 h-3 mr-1"
        />
        <span className="text-[10px] font-semibold text-[#40523F]">
          {area || 'N/A'}
        </span>
      </div>
      <span className="text-[8px] text-[#818181]">Dimensioni</span>
    </div>
    <div className="flex flex-auto flex-col items-center bg-[#E3F1E4] rounded-md py-2">
      <div className="flex items-center">
        <img
          src="/svg/treeIcon.svg"
          alt="Icona intervento"
          className="w-3 h-3 mr-1"
        />
        <span className="text-[10px] font-semibold text-[#40523F]">
          {intervent || 'N/A'}
        </span>
      </div>
      <span className="text-[8px] text-[#818181]">Intervento</span>
    </div>
    <div className="flex flex-auto flex-col items-center bg-[#E3F1E4] rounded-md py-2">
      <div className="flex items-center">
        <img
          src="/svg/budgetIcon.svg"
          alt="Icona budget"
          className="w-3 h-3 mr-1"
        />
        <span className="text-[10px] font-semibold text-[#40523F]">
          {budget || 'N/A'}
        </span>
      </div>
      <span className="text-[8px] text-[#818181]">Budget stimato</span>
    </div>
  </div>
);

const DetailPanel = () => {
  // Store States
  const { id } = useParams();
  const navigate = useNavigate();
  const { geoJsonData, selectedLayer, setSelectedLayer } = useMapStore();
  const { showDetailPanel, setShowDetailPanel } = useUIStore();

  // Find and set the selected layer by ID from params
  useEffect(() => {
    if (!id || !geoJsonData?.default?.features) return;
    const found = geoJsonData.default.features.find(
      (f) => String(f.properties.id) === String(id)
    );
    if (found) {
      setSelectedLayer(found.properties);
      setShowDetailPanel(true);
    } else {
      setShowDetailPanel(false);
      setSelectedLayer(null);
    }
  }, [id, geoJsonData?.default]);

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
    navigate('/');
  };

  // Early return if no selectedLayer or detail panel not shown
  if (!selectedLayer || !showDetailPanel) return null;

  return (
    <>
      {/* Desktop layout: Right dialog/sidebar */}
      <div className="fixed right-0 top-[163px] py-[20px] px-[15px] h-[calc(100vh-163px)] overflow-auto w-[500px] bg-white shadow-2xl z-[1000] hidden md:block">
        <div className="flex flex-col">
          {/* Header with image */}
          <div className="sticky top-0 z-50">
            <div className="relative group">
              <img
                src={
                  selectedLayer.immagine ||
                  `${window.location.origin}/images/placeholder.png`
                }
                alt={`${selectedLayer?.code}`}
                className="w-full h-[300px] rounded-lg object-cover mx-auto mb-4"
                onError={(e) => {
                  e.target.src = `${window.location.origin}/images/placeholder.png`;
                }}
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
          <div className="flex-1">
            <div className="">
              <div className="flex flex-col items-start mb-3 w-full">
                <h3 className="text-xl font-semibold text-[#202020] mb-1 w-full text-left">
                  {selectedLayer.id ? `Area ${selectedLayer.id}` : 'N/A'}
                </h3>

                {/* Info Blocks */}
                <div className="flex justify-between w-full mb-6 gap-2">
                  {/* Area */}
                  <div className="flex flex-col w-[20%] items-center justify-center bg-[#E3F1E4] rounded-md p-2 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <img
                        src="/svg/areaIcon.svg"
                        alt="Area"
                        className={`w-4 h-4 mr-2`}
                      />

                      <p className="text-sm font-bold text-[#40523F]">
                        {`${formatNumericValue(selectedLayer.area_ha, 2)} ha`}
                      </p>
                    </div>
                    <p className="text-xs text-[#818181]">Dimensioni</p>
                  </div>

                  {/* Intervento */}
                  <div className="flex flex-col w-[50%] items-center justify-center bg-[#E3F1E4] rounded-md p-2 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <img
                        src="/svg/treeIcon.svg"
                        alt="Area"
                        className={`w-4 h-4 mr-2`}
                      />
                      <p className="text-sm font-bold text-[#40523F]">
                        {selectedLayer.tipo_intervento || 'N/A'}
                      </p>
                    </div>
                    <p className="text-xs text-[#818181]">Intervento</p>
                  </div>

                  {/* Budget */}
                  <div className="flex flex-col w-[30%] items-center justify-center bg-[#E3F1E4] rounded-md p-2 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <img
                        src="/svg/budgetIcon.svg"
                        alt="Area"
                        className={`w-4 h-4 mr-2`}
                      />
                      <p className="text-sm font-bold text-[#40523F]">
                        {formatBudgetRange(
                          selectedLayer.budget_min,
                          selectedLayer.budget_max
                        )}
                      </p>
                    </div>
                    <p className="text-xs text-[#818181]">Budget stimato</p>
                  </div>
                </div>

                {selectedLayer?.descrizione && (
                  <>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">
                      Dettagli intervento
                    </h4>

                    <p className="text-base text-[#484848] leading-relaxed mb-6 text-left w-full">
                      {selectedLayer.descrizione}
                    </p>
                  </>
                )}

                <h4 className="text-xl font-bold text-[#202020] mb-4">
                  Dettagli area
                </h4>

                <div className="mt-2 w-full">
                  <TechnicalDetails selectedLayer={selectedLayer} />
                </div>
              </div>
              {/* Contact Buttons */}
              <div className="flex gap-3">
                <button className="bg-[#426345] text-white py-3 px-6 rounded-md flex-1 font-medium transition-all duration-200 hover:bg-[#2f4e30]">
                  Contattaci
                </button>
                <button
                  onClick={handleShare}
                  className="bg-[#E3F1E4] text-[#426345] p-3 rounded-md transition-all duration-200 hover:bg-[#cde6cf] hover:shadow-sm"
                >
                  <img
                    src="/svg/shareIcon.svg"
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
      <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 w-full rounded-t-3xl shadow-xl bg-white p-4 pr-0 z-[1000] block md:hidden">
        <div className="sticky top-0 pr-4">
          <HeaderRow
            currentImage={selectedLayer.immagine}
            id={selectedLayer.id}
            status={selectedLayer.stato_area || 'N/A'}
            onClose={handleClose}
          />
        </div>
        <div className="overflow-auto max-h-[65vh] h-full pr-4">
          <InfoCards
            area={`${formatNumericValue(selectedLayer.area_ha, 2)} ha`}
            intervent={selectedLayer.tipo_intervento}
            budget={formatBudgetRange(
              selectedLayer.budget_min,
              selectedLayer.budget_max
            )}
          />

          {selectedLayer?.descrizione && (
            <>
              <h4 className="text-base font-bold text-gray-900 mb-4">
                Dettagli intervento
              </h4>

              <p className="text-[14px] text-[#484848] leading-relaxed mb-6 text-left w-full">
                {selectedLayer.descrizione}
              </p>
            </>
          )}

          {/* Details section */}
          <div>
            <h4 className="text-base font-bold text-[#202020] mb-2">
              Dettagli area
            </h4>
            <TechnicalDetails selectedLayer={selectedLayer} />
          </div>
          {/* Contact Buttons */}
          <div className="flex gap-3">
            <button className="bg-[#426345] text-white py-3 px-6 rounded-md flex-1 font-medium transition-all duration-200 hover:bg-[#2f4e30]">
              Contattaci
            </button>
            <button
              onClick={handleShare}
              className="bg-[#E3F1E4] text-[#426345] p-4 rounded-md transition-all duration-200 hover:bg-[#cde6cf] hover:shadow-sm"
              aria-label="Condividi area"
            >
              <img
                src="/svg/shareIcon.svg"
                alt="Condividi"
                className="w-4 h-4"
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailPanel;
