"use client";

import { memo } from "react";
import { KeywordInputForm } from "@/components/common/keyword-input-form";
import { PatternSelector } from "@/components/keyword-combiner/pattern-selector";
import { ResultSection } from "@/components/keyword-combiner/result-section";
import TabNavigation from "@/components/navigation/tab-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { useKeywordCombiner } from "@/hooks/useKeywordCombiner";

const KeywordCombinePage = () => {
  const {
    keywords,
    selectedPatterns,
    result,
    addSpaceBetweenKeywords,
    keywordCounts,
    canCombine,
    handleKeyword1Change,
    handleKeyword2Change,
    handleKeyword3Change,
    handleKeyword4Change,
    handlePatternChange,
    handleSelectAll,
    resetResults,
    setAddSpaceBetweenKeywords,
    generateCombinations,
    getExcelData,
    getExcelColumns,
  } = useKeywordCombiner();

  return (
    <main className="min-h-screen">
      <div className="mt-6 flex flex-col gap-4">
        <div className="w-full">
          <div className="w-full overflow-hidden">
            <h1 className="text-navy mb-2 text-2xl font-bold">키워드 조합기</h1>
            <p className="mb-6 text-gray-600">
              여러 키워드를 조합하여 새로운 키워드를 생성할 수 있는 도구입니다.
            </p>

            {/* 탭 네비게이션 컴포넌트 */}
            <TabNavigation />

            {/* 키워드 조합기 UI */}
            <Card className="mt-6 w-full border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col gap-6 md:flex-row">
                  {/* 키워드 입력 영역 */}
                  <div className="flex flex-1 flex-col gap-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {/* 키워드 입력 컴포넌트들 */}
                      <KeywordInputForm
                        title="키워드1"
                        value={keywords.keyword1}
                        keywordCount={keywordCounts["1"]}
                        onChange={handleKeyword1Change}
                        disabled={false}
                        maxKeywords={100}
                      />
                      <KeywordInputForm
                        title="키워드2"
                        value={keywords.keyword2}
                        keywordCount={keywordCounts["2"]}
                        onChange={handleKeyword2Change}
                        disabled={false}
                        maxKeywords={100}
                      />
                      <KeywordInputForm
                        title="키워드3"
                        value={keywords.keyword3}
                        keywordCount={keywordCounts["3"]}
                        onChange={handleKeyword3Change}
                        disabled={false}
                        maxKeywords={100}
                      />
                      <KeywordInputForm
                        title="키워드4"
                        value={keywords.keyword4}
                        keywordCount={keywordCounts["4"]}
                        onChange={handleKeyword4Change}
                        disabled={false}
                        maxKeywords={100}
                      />
                    </div>
                  </div>

                  {/* 조합 설정 및 결과 영역 */}
                  <div className="flex-1">
                    {/* 조합 패턴 선택 컴포넌트 */}
                    <PatternSelector
                      selectedPatterns={selectedPatterns}
                      onPatternChange={handlePatternChange}
                      onSelectAll={handleSelectAll}
                    />

                    {/* 결과 컴포넌트 */}
                    <ResultSection
                      result={result}
                      addSpaceBetweenKeywords={addSpaceBetweenKeywords}
                      canCombine={canCombine}
                      onSpaceChange={setAddSpaceBetweenKeywords}
                      onReset={resetResults}
                      onGenerate={generateCombinations}
                      getExcelData={getExcelData}
                      getExcelColumns={getExcelColumns}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default memo(KeywordCombinePage);
