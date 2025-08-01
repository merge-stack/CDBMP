import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

import useMapStore from '../../store/useMapStore';
import useUIStore from '../../store/useUIStore';

import TechnicalDetails from './TechnicalDetails';

import StatusTag from '../SidePanel/StatusTag';

import { useParams, useNavigate } from 'react-router-dom';
import ViewerModal from './ViewerModal.jsx';

const HeaderRow = ({
  currentImage,
  id,
  municipality,
  status,
  onClose,
  onImageClick,
}) => (
  <div className="flex pb-2 gap-2 items-center mb-3">
    <img
      src={currentImage || `${window.location.origin}/images/placeholder.png`}
      alt={`Anteprima area ${id}`}
      className="w-[46px] h-[46px] rounded-full object-cover border-2 border-white shadow mr-1 cursor-pointer"
      onError={(e) => {
        e.target.src = `${window.location.origin}/images/placeholder.png`;
      }}
      onClick={onImageClick}
    />
    <div className="min-w-0">
      <h3 className="text-lg font-bold text-gray-900 truncate">
        {id ? `Area ${id}` : 'N/A'}
      </h3>
      <span className="text-[#202020] text-xs">{municipality || 'N/A'}</span>
    </div>
    <span className="ml-2 self-start">
      <StatusTag status={status || 'N/A'} />
    </span>
    <button
      onClick={onClose}
      aria-label="Chiudi pannello dettagli"
      className="ml-auto bg-[#DEE8DC] text-[#FFFFFF] rounded-full w-10 h-10 flex items-center justify-center"
    >
      <X className="w-4 h-4 text-[#426345]" />
    </button>
  </div>
);

const DetailPanel = () => {
  // Store States
  const { id } = useParams();
  const navigate = useNavigate();
  const { geoJsonData, selectedLayer, setSelectedLayer, restored_areas } =
    useMapStore();
  const { showDetailPanel, setShowDetailPanel, setSelectedMobileMenu } =
    useUIStore();

  // Viewer state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerItem, setViewerItem] = useState(null); // { url, name }

  const openViewer = (item) => {
    setViewerItem(item);
    setViewerOpen(true);
  };
  const closeViewer = () => {
    setViewerOpen(false);
    setViewerItem(null);
  };

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

  // Switch to map menu when detail panel is opened
  useEffect(() => {
    if (showDetailPanel) {
      setSelectedMobileMenu({
        id: 'map',
        label: 'Map',
        src: '/svg/mapIcon.svg',
      });
    }
  }, [showDetailPanel, setSelectedMobileMenu]);

  const handleShare = useCallback(() => {
    try {
      // Implement sharing functionality
      navigator
        .share({
          title: `Area ${selectedLayer?.id}`,
          text: "Dai un occhio a quest'area sul Monte Pisano",
          url: window.location.href,
        })
        .catch(() => {
          toast.error('Condivisione fallita"');
        });
    } catch {
      toast.error('API di condivisione non supportata');
    }
  }, [selectedLayer?.id]);

  const handleClose = () => {
    setShowDetailPanel(false);
    setSelectedLayer(null);
    navigate('/');
  };

  // Handle navigation to restored area
  const handleRestoredAreaClick = (restoredArea) => {
    navigate(`/area/${encodeURIComponent(restoredArea.id)}`);
  };

  // Early return if no selectedLayer or detail panel not shown
  if (!selectedLayer || !showDetailPanel) return null;

  // Check if current area is not restored
  const isNotRestored = selectedLayer.isRestored === false;

  return (
    <>
      <ViewerModal open={viewerOpen} onClose={closeViewer} item={viewerItem} />
      {/* Desktop layout: Right dialog/sidebar */}
      <div className="fixed right-0 top-[163px] pb-[20px] px-[15px] h-[calc(100vh-163px)] overflow-auto w-[400px] bg-white shadow-2xl z-[1000] hidden lg:block">
        <div className="flex flex-col">
          {/* Header with image */}
          <div className="sticky top-0 z-50 bg-white pt-[20px]">
            <div className="relative w-full">
              <img
                src={
                  selectedLayer.immagine?.[0]?.url ||
                  `${window.location.origin}/images/placeholder.png`
                }
                alt={`${selectedLayer?.code}`}
                className="w-full h-[250px] rounded-lg object-cover mx-auto mb-4 shadow-xl"
                onError={(e) => {
                  e.target.src = `${window.location.origin}/images/placeholder.png`;
                }}
                style={{
                  cursor: selectedLayer.immagine?.[0]?.url
                    ? 'pointer'
                    : 'default',
                }}
                onClick={() =>
                  selectedLayer.immagine?.[0]?.url &&
                  openViewer(selectedLayer.immagine[0])
                }
              />
              <div className="absolute bottom-[16px] w-[90%] left-[14px] flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="text-xl font-semibold text-[#F4F4F4] w-full text-left">
                    {selectedLayer.id ? `Area ${selectedLayer.id}` : 'N/A'}
                  </h3>
                  <span className="text-[#D0D0D0] font-semibold text-[12px]">
                    {selectedLayer.municipality || 'N/A'}
                  </span>
                </div>

                <StatusTag
                  status={selectedLayer.stato_area || 'N/A'}
                  selected={true}
                />
              </div>
            </div>
            <button
              onClick={handleClose}
              aria-label="close panel"
              className="absolute top-7 left-3 bg-[#E3F1E4] text-[#426345] rounded-full w-10 h-10 flex items-center justify-center"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content area with scroll */}
          <div className="flex-1">
            <div className="">
              <div className="flex flex-col items-start mb-3 w-full">
                {/* Sponsors */}
                {selectedLayer.sponsors?.length > 0 && (
                  <>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">
                      Finanziatatori
                    </h4>

                    <div className="flex justify-between w-full mb-6 gap-7 overflow-auto hide-scrollbar">
                      {selectedLayer.sponsors?.map((sponsor) => (
                        <div className="flex gap-2 items-center flex-shrink-0">
                          <img
                            className="w-9"
                            src={sponsor.url}
                            alt={sponsor.name}
                            onError={(e) => {
                              e.target.src = `${window.location.origin}/images/placeholder.png`;
                            }}
                          />
                          <div className="flex flex-col">
                            <span className="text-[#484848] text-sm font-bold">
                              {sponsor.name || 'N/A'}
                            </span>
                            <span className="text-[#484848] text-xs">
                              {sponsor.place || 'N/A'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

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

                {selectedLayer.servizi_ecosistemici?.length > 0 && (
                  <>
                    <h4 className="text-xl font-bold text-[#202020] mb-4">
                      Servizi ecosistemici generati:
                    </h4>

                    <div className="flex items-center gap-2 mb-6">
                      {selectedLayer.servizi_ecosistemici?.map((service) => (
                        <span className="px-2 py-1 rounded-md text-xs font-normal border whitespace-nowrap bg-[#B8D9B960] text-[#484747] border-[#BBDDBD]">
                          {service}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                <h4 className="text-xl font-bold text-[#202020] mb-4">
                  Informazioni tecniche
                </h4>

                <div className="mt-2 w-full">
                  <TechnicalDetails selectedLayer={selectedLayer} />
                </div>

                {/* Show restored areas section if current area is not restored */}
                {isNotRestored && restored_areas?.features?.length > 0 && (
                  <>
                    <h4 className="text-xl font-bold text-[#202020] mb-4">
                      Le aree già ripristinate
                    </h4>

                    <div className="w-full overflow-x-auto mb-4 hide-scrollbar">
                      <div className="flex gap-[6px] w-max">
                        {restored_areas.features.map((restoredArea, idx) => (
                          <div
                            className="relative w-24 cursor-pointer"
                            key={restoredArea.properties.id + idx}
                            onClick={() =>
                              handleRestoredAreaClick(restoredArea.properties)
                            }
                          >
                            <img
                              className="h-28 w-full rounded-md object-cover"
                              src={
                                restoredArea.properties.immagine?.[0]?.url ||
                                `${window.location.origin}/images/placeholder.png`
                              }
                              onError={(e) => {
                                e.target.src = `${window.location.origin}/images/placeholder.png`;
                              }}
                            />
                            <span className="absolute text-[#EDEDED] font-semibold text-[10px] left-[6px] bottom-[10px] max-w-[15ch] truncate">
                              {restoredArea.properties.immagine?.[0]?.name ||
                                restoredArea.properties.id}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Show foto and documents sections only if area is restored */}
                {!isNotRestored && selectedLayer.immagine?.length > 0 && (
                  <>
                    <h4 className="text-xl font-bold text-[#202020] mb-4">
                      Foto e Video
                    </h4>

                    <div className="w-full overflow-x-auto mb-4 hide-scrollbar">
                      <div className="flex gap-[6px] w-max">
                        {selectedLayer.immagine?.map((image, idx) => (
                          <div className="relative w-24" key={image.url + idx}>
                            <img
                              className="h-28 w-full rounded-md cursor-pointer object-cover"
                              src={image.url}
                              onError={(e) => {
                                e.target.src = `${window.location.origin}/images/placeholder.png`;
                              }}
                              onClick={() => openViewer(image)}
                            />
                            <span className="absolute text-[#EDEDED] font-semibold text-[10px] left-[6px] bottom-[10px] max-w-[15ch] truncate">
                              {image.name || ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {!isNotRestored && selectedLayer.docs?.length > 0 && (
                  <>
                    <h4 className="text-xl font-bold text-[#202020] mb-4">
                      Press e Documentazione
                    </h4>

                    <div className="w-full overflow-x-auto mb-4 hide-scrollbar">
                      <div className="flex gap-[6px] w-max">
                        {selectedLayer.docs?.map((doc, idx) => (
                          <div className="relative w-24" key={doc.url + idx}>
                            <img
                              className="h-28 w-full rounded-md cursor-pointer object-cover"
                              src={doc.thumb || doc.url}
                              onError={(e) => {
                                e.target.src = `${window.location.origin}/images/placeholder.png`;
                              }}
                              onClick={() => openViewer(doc)}
                            />
                            <span className="absolute text-[#EDEDED] font-semibold text-[10px] left-[6px] bottom-[10px] max-w-[15ch] truncate">
                              {doc.name || ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
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
      <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 w-full rounded-t-3xl shadow-xl bg-white p-4 pr-0 z-[1000] block lg:hidden">
        <div className="sticky top-0 pr-4">
          <HeaderRow
            currentImage={selectedLayer.immagine?.[0]?.url}
            id={selectedLayer.id}
            municipality={selectedLayer.municipality}
            status={selectedLayer.stato_area || 'N/A'}
            onClose={handleClose}
            onImageClick={() =>
              selectedLayer.immagine?.[0]?.url &&
              openViewer(selectedLayer.immagine[0])
            }
          />
        </div>

        <div className="overflow-auto max-h-[65vh] h-full pr-4">
          {/* Sponsors */}
          {selectedLayer.sponsors?.length > 0 && (
            <>
              <h4 className="text-base font-bold text-[#202020] mb-4">
                Finanziatatori
              </h4>

              <div className="flex justify-between w-full mb-6 gap-7 overflow-auto hide-scrollbar">
                {selectedLayer.sponsors?.map((sponsor) => (
                  <div className="flex gap-2 items-center flex-shrink-0">
                    <img
                      className="w-9"
                      src={sponsor.url}
                      alt={sponsor.name}
                      onError={(e) => {
                        e.target.src = `${window.location.origin}/images/placeholder.png`;
                      }}
                    />
                    <div className="flex flex-col">
                      <span className="text-[#484848] text-xs font-bold">
                        {sponsor.name || 'N/A'}
                      </span>
                      <span className="text-[#484848] text-[10px]">
                        {sponsor.place || 'N/A'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {selectedLayer?.descrizione && (
            <>
              <h4 className="text-base font-bold text-[#202020] mb-4">
                Dettagli intervento
              </h4>

              <p className="text-[14px] text-[#484848] leading-relaxed mb-6 text-left w-full">
                {selectedLayer.descrizione}
              </p>
            </>
          )}

          {selectedLayer.servizi_ecosistemici?.length > 0 && (
            <>
              <h4 className="text-base font-bold text-[#202020] mb-4">
                Servizi ecosistemici generati:
              </h4>

              <div className="flex items-center gap-2 mb-6">
                {selectedLayer.servizi_ecosistemici?.map((service) => (
                  <span className="px-2 py-1 rounded-md text-xs font-normal border whitespace-nowrap bg-[#B8D9B960] text-[#484747] border-[#BBDDBD]">
                    {service}
                  </span>
                ))}
              </div>
            </>
          )}

          {/* Details section */}
          <div>
            <h4 className="text-base font-bold text-[#202020] mb-2">
              Dettagli area
            </h4>
            <TechnicalDetails selectedLayer={selectedLayer} />
          </div>

          {/* Show restored areas section if current area is not restored */}
          {isNotRestored && restored_areas?.features?.length > 0 && (
            <>
              <h4 className="text-base font-bold text-[#202020] mb-4">
                Le aree già ripristinate
              </h4>

              <div className="w-full overflow-x-auto mb-4 hide-scrollbar">
                <div className="flex gap-[6px] w-max">
                  {restored_areas.features.map((restoredArea, idx) => (
                    <div
                      className="relative w-36 cursor-pointer"
                      key={restoredArea.properties.id + idx}
                      onClick={() =>
                        handleRestoredAreaClick(restoredArea.properties)
                      }
                    >
                      <img
                        className="h-[168px] w-full rounded-md object-cover"
                        src={
                          restoredArea.properties.immagine?.[0]?.url ||
                          `${window.location.origin}/images/placeholder.png`
                        }
                        onError={(e) => {
                          e.target.src = `${window.location.origin}/images/placeholder.png`;
                        }}
                      />
                      <span className="absolute text-[#EDEDED] font-semibold text-xs left-[6px] bottom-[10px] max-w-[15ch] truncate">
                        {restoredArea.properties.immagine?.[0]?.name ||
                          `Area ${restoredArea.properties.id}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Show foto and documents sections only if area is restored */}
          {!isNotRestored && selectedLayer.immagine?.length > 0 && (
            <>
              <h4 className="text-base font-bold text-[#202020] mb-4">
                Foto e Video
              </h4>

              <div className="w-full overflow-x-auto mb-4 hide-scrollbar">
                <div className="flex gap-[6px] w-max">
                  {selectedLayer.immagine?.map((image, idx) => (
                    <div className="relative w-36" key={image.url + idx}>
                      <img
                        className="h-[168px] w-full rounded-md cursor-pointer object-cover"
                        src={image.url}
                        onError={(e) => {
                          e.target.src = `${window.location.origin}/images/placeholder.png`;
                        }}
                        onClick={() => openViewer(image)}
                      />
                      <span className="absolute text-[#EDEDED] font-semibold text-xs left-[6px] bottom-[10px] max-w-[15ch] truncate">
                        {image.name || ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {!isNotRestored && selectedLayer.docs?.length > 0 && (
            <>
              <h4 className="text-base font-bold text-[#202020] mb-4">
                Press e Documentazione
              </h4>

              <div className="w-full overflow-x-auto mb-4 hide-scrollbar">
                <div className="flex gap-[6px] w-max">
                  {selectedLayer.docs?.map((doc, idx) => (
                    <div className="relative w-36" key={doc.url + idx}>
                      <img
                        className="h-[168px] w-full rounded-md cursor-pointer object-cover"
                        src={doc.thumb || doc.url}
                        onClick={() => openViewer(doc)}
                      />
                      <span className="absolute text-[#EDEDED] font-semibold text-xs left-[6px] bottom-[10px] max-w-[15ch] truncate">
                        {doc.name || ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

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
