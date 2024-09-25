import "./App.css";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { processRagLlm } from "@/apis/rag-llm";
import SearchComponent from "@/components/search/search";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LampDemo, { LampContainer } from "@/components/ui/lamp";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TextGenerateEffect } from "./components/ui/text-generate-effect";
import { LinkPreview } from "@/components/ui/link-preview";
import { MultiStepLoaderDemo } from "@/components/loader/multistepLoader";
import AISearchExplainer from "@/components/Instruction/AISearchExplainer";

function App() {
  const [queryKey, setQueryKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: response, error } = useQuery({
    queryKey: ["ragLlm", queryKey],
    queryFn: async () => {
      const response = await processRagLlm(queryKey);
      queryClient.invalidateQueries({ queryKey: ["ragLlm", queryKey] });
      setIsLoading(false);
      return response;
    },
    enabled: !!queryKey,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const handleSearch = (query: string) => {
    setQueryKey(query);
    queryClient.invalidateQueries({ queryKey: ["ragLlm", queryKey] });
    setIsLoading(true);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen overflow-hidden bg-transparent p-2 space-x-3">
      <div className="relative">
        <LampContainer className="absolute inset-0">
          <LampDemo />
          <div className="absolute bottom-2 left-0 right-0">
            <SearchComponent onSearch={handleSearch} />
          </div>
        </LampContainer>
      </div>
      <div className="overflow-auto">
        <ScrollArea className="h-full">
          {error && <p>Error: {error.message}</p>}
          {response ? (
            <Card className="response-card bg-gradient-to-br from-slate-300 to-slate-500">
              <CardHeader>
                <CardTitle>Response</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Card className="main-news-card mb-4">
                    <CardHeader>
                      <CardTitle>Main Result</CardTitle>
                    </CardHeader>
                    <CardContent className="max-w-3xl">
                      <TextGenerateEffect
                        words={response.llmResults[0].message.content}
                        className="text-sm text-slate-700 text-left font-medium"
                      />
                    </CardContent>
                  </Card>
                  <h2 className="text-xl font-semibold mb-2">
                    Similarity Results
                  </h2>
                  {response &&
                    response.similaritySearchResults &&
                    response.similaritySearchResults.map(
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
                              <CardContent className="max-w-3xl">
                                <TextGenerateEffect
                                  words={item.pageContent}
                                  className="text-sm text-slate-700 text-left font-medium"
                                />
                                <LinkPreview url={item.metadata.link}>
                                  Read more
                                </LinkPreview>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )
                    )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <AISearchExplainer />
          )}
        </ScrollArea>
      </div>
      {isLoading && <MultiStepLoaderDemo loading={isLoading} />}
    </div>
  );
}

export default App;
