import "./App.css";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { processRagLlm } from "@/apis/rag-llm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LampDemo, { LampContainer } from "./components/ui/lamp";

function App() {
  const [message, setMessage] = useState("");
  const [queryKey, setQueryKey] = useState("");

  const {
    data: response,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["ragLlm", queryKey],
    queryFn: () => processRagLlm(message),
    enabled: !!queryKey,
    staleTime: 1000 * 60 * 5,
  });

  const handleClick = () => {
    setQueryKey(message);
  };

  const formattedResponse = useMemo(() => {
    if (!response) return null;

    const { llmResults, similaritySearchResults } = response;

    return (
      <div>
        <Card className="main-news-card">
          <CardHeader>
            <CardTitle>Main News</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{llmResults[0].message.content}</p>
          </CardContent>
        </Card>
        <h2>Similarity News</h2>
        {similaritySearchResults.map((group: any, groupIndex: number) => (
          <div key={groupIndex} className="similarity-news-group">
            {group.map((item: any, itemIndex: number) => (
              <Card key={itemIndex} className="similarity-news-card">
                <CardContent>
                  <p>{item.pageContent}</p>
                  <a
                    href={item.metadata.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="news-link"
                  >
                    Read more
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>
    );
  }, [response]);

  return (
    <div className="mb-24">
      <LampContainer className="mb-24 h-full">
        <LampDemo />
        <div className="input-container">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message"
            className="input-field text-white"
          />
          <Button onClick={handleClick} className="submit-button">
            Submit
          </Button>
        </div>
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {formattedResponse && (
          <Card className="response-card">
            <CardHeader>
              <CardTitle>Response</CardTitle>
            </CardHeader>
            <CardContent>{formattedResponse}</CardContent>
          </Card>
        )}
      </LampContainer>
    </div>
  );
}

export default App;
