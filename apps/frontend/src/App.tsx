import "./App.css";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { processRagLlm } from "@/apis/rag-llm";
import SearchComponent from "@/components/search/search";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LampDemo, { LampContainer } from "./components/ui/lamp";
import { ScrollArea } from "@/components/ui/scroll-area";

function App() {
  const [queryKey, setQueryKey] = useState("");

  const {
    data: response,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["ragLlm", queryKey],
    queryFn: () => processRagLlm(queryKey),
    enabled: !!queryKey,
    staleTime: 1000 * 60 * 5,
  });

  const handleSearch = (query: string) => {
    setQueryKey(query);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen overflow-hidden bg-transparent">
      <div className="relative">
        <LampContainer className="absolute inset-0">
          <LampDemo />
          <div className="absolute bottom-2 left-0 right-0">
            <SearchComponent onSearch={handleSearch} />
          </div>
        </LampContainer>
      </div>
      <div className="p-4 overflow-auto">
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {response && (
          <ScrollArea className="h-full">
            <Card className="response-card bg-gradient-to-br from-slate-300 to-slate-500 py-4">
              <CardHeader>
                <CardTitle>Response</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Card className="main-news-card mb-4">
                    <CardHeader>
                      <CardTitle>Main News</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg text-slate-700 text-left font-medium">
                        {response.llmResults[0].message.content}
                      </p>
                    </CardContent>
                  </Card>
                  <h2 className="text-xl font-semibold mb-2">
                    Similarity News
                  </h2>
                  {response.similaritySearchResults.map(
                    (group: any, groupIndex: number) => (
                      <div
                        key={groupIndex}
                        className="similarity-news-group mb-4"
                      >
                        {group.map((item: any, itemIndex: number) => (
                          <Card
                            key={itemIndex}
                            className="similarity-news-card mb-2 py-4"
                          >
                            <CardContent>
                              <p className="text-sm text-slate-700 text-left font-medium">
                                {item.pageContent}
                              </p>
                              <a
                                href={item.metadata.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="news-link text-blue-500 hover:underline"
                              >
                                Read more
                              </a>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}

export default App;
