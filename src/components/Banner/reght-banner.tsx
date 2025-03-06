export default function RightBanner() {
  return (
    <div className="w-full bg-green-500 rounded-md p-4 text-white">
      <div className="text-right mb-2">
        <span className="bg-white text-green-500 px-2 py-1 rounded-md text-xs font-bold">
          WILL MADE
        </span>
      </div>

      <div className="text-center font-bold text-xl mb-4">
        플레이스
        <br />
        클릭비딩
        <br />
        실시간배포
      </div>

      <div className="bg-white text-green-600 font-bold text-center py-2 rounded-md mb-2">
        점수당일 100명
      </div>

      <div className="bg-blue-100 text-blue-800 font-bold text-center py-2 rounded-md mb-2">
        하루 매출 40배 증가
      </div>

      <div className="bg-yellow-100 text-yellow-800 font-bold text-center py-2 rounded-md mb-2">
        17일만에 1등 등극
      </div>

      <div className="bg-orange-500 text-white font-bold text-center py-2 rounded-md mb-2">
        3,200개 리뷰보고가기
      </div>

      <div className="mt-4 text-center">
        <div className="inline-block bg-white text-black rounded-full p-2">
          <span className="text-sm">CLICK</span>
          <span className="inline-block ml-1">👆</span>
        </div>
      </div>
    </div>
  );
}
