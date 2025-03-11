export default function UsageGuide() {
  return (
    <div className="border-t border-gray-200 p-6">
      <h3 className="mb-4 text-lg font-bold">이용안내</h3>
      <ol className="list-decimal space-y-2 pl-5">
        <li>원하는 키워드를 넣어주세요</li>
        <li>[입력값 지우기]클릭시 입력한 모든 키워드가 삭제됩니다.</li>
        <li>
          [다운로드]를 누르시면 조회 결과를 엑셀파일로 내려받을 수
          있습니다.(*CSV파일로 제공됩니다.)
        </li>
      </ol>

      <div className="mt-4 text-sm text-gray-600">
        <p>-원하는 키워드만 선택하여 다운로드도 가능</p>
        <p>-키워드 및 조회수에 따라 오름/내림차순으로 정렬가능</p>
      </div>
    </div>
  );
}
