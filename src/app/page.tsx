import KeywordResults from "@/components/keyword-results";
import KeywordSearch from "@/components/keyword-search";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="py-8">
        <div className="flex flex-col gap-4 mt-6">
          <div className="w-full">
            <KeywordSearch />
            <KeywordResults />
          </div>
        </div>
      </div>
    </main>
  );
}
