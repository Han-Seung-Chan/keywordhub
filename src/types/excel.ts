export interface ExcelColumn {
  key: string; // 데이터의 키 값
  header: string; // 엑셀에 표시될 열 이름
  width?: number; // 열 너비 (선택 사항)
  formatter?: (value: any, rowData?: any) => any; // 값 포맷팅 함수
}
