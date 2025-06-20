const MapLoader = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-70 z-50">
    <svg
      className="animate-spin h-16 w-16 text-green-700 mb-4"
      viewBox="0 0 50 50"
    >
      <circle
        className="opacity-25"
        cx="25"
        cy="25"
        r="20"
        stroke="currentColor"
        strokeWidth="5"
        fill="none"
      />
      <circle
        className="opacity-75"
        cx="25"
        cy="25"
        r="20"
        stroke="currentColor"
        strokeWidth="5"
        strokeDasharray="31.4 31.4"
        fill="none"
      />
    </svg>
    <span className="text-lg font-semibold text-green-800">
      Loading map data...
    </span>
    <span className="text-sm text-green-600 mt-2">
      Please wait while we fetch the latest map data.
    </span>
  </div>
);

export default MapLoader;
