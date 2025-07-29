import { X } from 'lucide-react';
import { useState } from 'react';

// Helper to detect file type from url
const getFileType = (url) => {
  if (!url) return 'unknown';
  const ext = url.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext))
    return 'image';
  if (['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'].includes(ext)) return 'video';
  if (ext === 'pdf') return 'pdf';
  return 'doc';
};

const ViewerModal = ({ open, onClose, item }) => {
  const [pdfError, setPdfError] = useState(false);

  if (!open || !item) return null;

  const fileType = item ? getFileType(item?.url || '') : 'unknown';

  const handlePdfError = () => {
    setPdfError(true);
  };

  const handleClose = () => {
    setPdfError(false);
    onClose();
  };

  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'documento.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative bg-white rounded-lg shadow-lg max-w-full max-h-full p-4 flex flex-col items-center">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 bg-[#E3F1E4] text-[#426345] rounded-full w-8 h-8 flex items-center justify-center"
          aria-label="Chiudi viewer"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center justify-center max-w-[80vw] max-h-[80vh]">
          <span className="mb-2 text-sm font-semibold text-[#484848] truncate max-w-[60vw]">
            {item.name || ''}
          </span>
          {fileType === 'image' ? (
            <img
              src={item.url}
              alt={item.name || 'Immagine'}
              className="max-w-[70vw] max-h-[70vh] rounded-md border"
              onError={(e) => {
                e.target.src = `${window.location.origin}/images/placeholder.png`;
              }}
            />
          ) : fileType === 'video' ? (
            <video
              src={item.url}
              controls
              className="max-w-[70vw] max-h-[70vh] rounded-md border"
            >
              Your browser does not support the video tag.
            </video>
          ) : fileType === 'pdf' ? (
            pdfError ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="text-gray-500 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto mb-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-lg font-medium mb-2">
                    PDF non può essere visualizzato
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Il server non supporta la visualizzazione diretta di questo
                    PDF. Prova ad aprirlo in una nuova finestra o scaricalo.
                  </p>
                </div>
                <div className="flex gap-3">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#426345] text-white px-6 py-2 rounded-md hover:bg-[#2f4e30] transition-colors"
                  >
                    Apri in nuova finestra
                  </a>
                  <button
                    onClick={() =>
                      handleDownload(item.url, item.name || 'documento.pdf')
                    }
                    className="bg-[#E3F1E4] text-[#426345] px-6 py-2 rounded-md hover:bg-[#cde6cf] transition-colors"
                  >
                    Scarica PDF
                  </button>
                </div>
              </div>
            ) : (
              <iframe
                src={item.url}
                title={item.name || 'Documento'}
                className="w-[70vw] h-[70vh] border rounded-md"
                onError={handlePdfError}
                onLoad={() => setPdfError(false)}
              />
            )
          ) : (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-lg mt-4"
            >
              Visualizza o scarica documento
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewerModal;
