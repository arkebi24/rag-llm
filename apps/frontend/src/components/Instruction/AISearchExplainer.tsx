import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { IconSearch, IconBrain, IconList } from "@tabler/icons-react";

const steps = [
  {
    icon: IconSearch,
    title: "Input Query",
    description:
      "Enter your search query in the search bar. Ex: Latest news on AI",
  },
  {
    icon: IconBrain,
    title: "AI Processing",
    description:
      "Our AI analyzes your query and searches for relevant information.",
  },
  {
    icon: IconList,
    title: "Results",
    description:
      "View a list of relevant results and similar information to your query.",
  },
];

const AISearchExplainer: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <h2 className="text-3xl font-bold mb-8 text-center">
        How AI Search Works
      </h2>
      <div className="space-y-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="flex items-center p-6">
                <div className="mr-4">
                  <step.icon className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AISearchExplainer;
