export default function TopBanner() {
  return (
    <div className="relative h-24 w-full overflow-hidden rounded-md bg-gray-800">
      <div className="absolute inset-0 flex items-center px-8">
        <div className="text-white">
          <div className="font-semibold text-orange-400">스토어 상위노출</div>
          <div className="font-semibold text-orange-400">플레이스 상위노출</div>
        </div>
        <div className="absolute top-1/2 right-4 -translate-y-1/2 transform">
          <div className="flex items-center">
            <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full">
              <span className="text-xs">✦</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
