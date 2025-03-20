"use client";

import { memo } from "react";
import { useKeywordCombiner } from "@/hooks/useKeywordCombiner";
import { PatternSelector } from "@/components/keyword-combiner/pattern-selector";
import { ResultSection } from "@/components/keyword-combiner/result-section";
import { ErrorMessage, KeywordInputForm } from "@/components/common";

const KeywordCombiner = () => {
  const {
    keywords,
    selectedPatterns,
    result,
    addSpaceBetweenKeywords,
    keywordCounts,
    canCombine,
    error,
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
    <div className="flex flex-col gap-6 md:flex-row">
      {/* 키워드 입력 영역 */}
      <section
        className="flex flex-1 flex-col gap-4"
        aria-labelledby="keyword-input-section"
      >
        <h2 id="keyword-input-section" className="sr-only">
          키워드 입력
        </h2>
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
        <ErrorMessage message={error} />
      </section>

      {/* 조합 설정 및 결과 영역 */}
      <section className="flex-1" aria-labelledby="combination-section">
        <h2 id="combination-section" className="sr-only">
          조합 설정 및 결과
        </h2>
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
      </section>
    </div>
  );
};

export default memo(KeywordCombiner);
