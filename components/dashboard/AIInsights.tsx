"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import MDEditor from "@uiw/react-md-editor";

interface AIInsightsProps {
  date: string;
}

export function AIInsights({ date }: AIInsightsProps) {
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInsights = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/summary/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      });

      if (response.ok) {
        const data = await response.json();
        setInsights(data.insights);
      } else {
        setError("Failed to generate insights");
      }
    } catch (err) {
      console.error("Error generating insights:", err);
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-6 h-full flex flex-col">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-200 rounded-lg">
            <Sparkles className="text-gray-600" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">AI Insights</h3>
            <p className="text-sm text-gray-500">Powered by Google Gemini</p>
          </div>
        </div>

        {/* Show Generate button only if no insights yet */}
        {!insights && !loading && (
          <Button
            onClick={generateInsights}
            disabled={loading}
            variant="default"
            size="sm"
            className="hover:cursor-pointer"
          >
            <TrendingUp className="mr-2" size={16} />
            Generate Insights
          </Button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4 shrink-0">
          {error}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="flex flex-col items-center justify-center text-gray-500 flex-1">
          <Loader2 className="animate-spin mb-2" size={24} />
          <p className="text-sm">Analyzing your data...</p>
        </div>
      )}

      {/* Insights Display Area - Takes remaining height and scrolls */}
      {insights && !loading && (
        <div className="flex flex-col bg-white rounded-lg p-4 shadow-inner border border-gray-100 flex-1 min-h-0">
          {/* Markdown Content - Scrollable */}
          <div className="prose prose-sm max-w-none overflow-y-auto flex-1 mb-4">
            <div data-color-mode="light">
              <MDEditor.Markdown
                source={insights}
                style={{ background: "transparent", padding: "0.5rem" }}
              />
            </div>
          </div>
          {/* Regenerate Button */}
          <div className="pt-4 border-t border-gray-200 shrink-0">
            <Button
              onClick={generateInsights}
              variant="outline"
              size="sm"
              disabled={loading}
              className="hover:cursor-pointer"
            >
              <Sparkles className="mr-2" size={14} />
              Regenerate
            </Button>
          </div>
        </div>
      )}

      {/* Initial Placeholder */}
      {!insights && !loading && !error && (
        <div className="flex flex-1 flex-col items-center justify-center text-center text-gray-500">
          <Sparkles className="mx-auto mb-3 text-gray-400" size={32} />
          <p className="text-sm max-w-xs">
            Click &quot;Generate Insights&quot; to get an AI-powered analysis of
            your productivity for {date}.
          </p>
        </div>
      )}
    </div>
  );
}
