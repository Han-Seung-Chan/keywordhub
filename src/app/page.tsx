import KeywordResults from "@/components/keyword-results";
import KeywordSearch from "@/components/keyword-search";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="mt-6 flex flex-col gap-4">
        <div className="w-full">
          <KeywordSearch />
          <KeywordResults />
        </div>
      </div>
    </main>
  );
}
