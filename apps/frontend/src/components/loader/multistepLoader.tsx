import { MultiStepLoader as Loader } from "../ui/multi-step-loader";

const loadingStates = [
  {
    text: "Searching for relevant information...",
  },
  {
    text: "Analyzing data...",
  },
  {
    text: "Generating response...",
  },
  {
    text: "Embedding response...",
  },
  {
    text: "Getting Similarity Results...",
  },
  {
    text: "Preparing response...",
  },
];

export function MultiStepLoaderDemo({ loading }: { loading: boolean }) {
  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
      <Loader loadingStates={loadingStates} loading={loading} duration={2000} />
    </div>
  );
}
