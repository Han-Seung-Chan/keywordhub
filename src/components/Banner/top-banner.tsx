export default function TopBanner() {
  return (
    <div className="w-full h-24 bg-gray-800 rounded-md overflow-hidden relative">
      <div className="absolute inset-0 flex items-center px-8">
        <div className="text-white">
          <div className="text-orange-400 font-semibold">스토어 상위노출</div>
          <div className="text-orange-400 font-semibold">플레이스 상위노출</div>
        </div>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-2">
              <span className="text-xs">✦</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
