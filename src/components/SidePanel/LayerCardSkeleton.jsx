const LayerCardSkeleton = () => (
  <div className="flex p-4 mb-4 bg-white rounded-2xl shadow-md">
    <div className="w-24 h-24 bg-gray-200 rounded-2xl mr-4 animate-pulse" />
    <div className="flex-1 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="h-6 bg-gray-200 rounded w-3/5 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded-md w-1/3 animate-pulse" />
      </div>
      <div className="flex justify-between items-end mt-2">
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse ml-4" />
      </div>
    </div>
  </div>
);

export default LayerCardSkeleton;
