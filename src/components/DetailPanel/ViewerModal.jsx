import { X } from 'lucide-react';

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
  if (!open || !item) return null;
  const fileType = getFileType(item.url);

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative bg-white rounded-lg shadow-lg max-w-full max-h-full p-4 flex flex-col items-center">
        <button
          onClick={onClose}
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
            <iframe
              src={item.url}
              title={item.name || 'Documento'}
              className="w-[70vw] h-[70vh] border rounded-md"
            />
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
