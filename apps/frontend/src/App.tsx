import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { processRagLlm } from "@/apis/rag-llm";
import SearchComponent from "@/components/search/search";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LampContainer } from "@/components/ui/lamp";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { LinkPreview } from "@/components/ui/link-preview";
import { MultiStepLoaderDemo } from "@/components/loader/multistepLoader";
import AISearchExplainer from "@/components/Instruction/AISearchExplainer";

export default function App() {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-600 to-gray-500 text-white">
      <div className="mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2">
            <LampContainer>
              <div className="text-center mb-8">
                <TextGenerateEffect
                  words="Semantic AI Search"
                  className="text-4xl font-bold mb-4 dark:text-white text-white leading-snug tracking-wide"
                />
                <TextGenerateEffect
                  words="Discover insights with AI-powered search"
                  className="text-lg font-bold mb-4 dark:text-white text-white leading-snug tracking-wide"
                />
              </div>
              <SearchComponent onSearch={handleSearch} />
            </LampContainer>
          </div>
          <div className="w-full lg:w-1/2">
            <ScrollArea className="h-[calc(100vh-4rem)]">
              {error && <p className="text-red-500">Error: {error.message}</p>}
              {response ? (
                <Card className="bg-gradient-to-r from-gray-700 to-gray-600 border-gray-700 w-[88%] md:w-[100%] rounded-xl">
                  <CardHeader>
                    <CardTitle>Response</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Card className="bg-gray-700 mb-4">
                      <CardHeader>
                        <CardTitle>Main Result</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <TextGenerateEffect
                          words={response.llmResults[0].message.content}
                          className="text-sm text-gray-300"
                        />
                      </CardContent>
                    </Card>
                    <h2 className="text-xl font-semibold mb-2">
                      Similarity Results
                    </h2>
                    {response.similaritySearchResults?.map(
                      (group: any, groupIndex: any) => (
                        <div key={groupIndex} className="mb-4">
                          {group.map((item: any, itemIndex: any) => (
                            <Card key={itemIndex} className="bg-gray-700 mb-2">
                              <CardContent>
                                <TextGenerateEffect
                                  words={item.pageContent}
                                  className="text-sm text-gray-300"
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
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center text-gray-400">
                  <AISearchExplainer />
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
      {isLoading && <MultiStepLoaderDemo loading={isLoading} />}
    </div>
  );
}
