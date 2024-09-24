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
    <div className="h-full flex flex-col md:flex-row">
      <div className="md:w-1/2 p-4">
        <LampContainer className="relative flex min-h-screen h-min flex-col items-center justify-center bg-slate-950 w-full rounded-md z-0">
          <LampDemo />
          <SearchComponent onSearch={handleSearch} />
        </LampContainer>
      </div>
      <div className="md:w-1/2 p-4">
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {response && (
          <ScrollArea className="h-[calc(100vh-2rem)]">
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
