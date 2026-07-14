import { create } from "zustand";
import type { StylistAnalysis } from "@/components/tryon/StylistPanel";
import type { OutfitScores } from "@/components/tryon/OutfitScorePanel";

export interface TryOnResult {
  id: string;
  url: string;
  modelImagePreview: string;
  garmentImagePreview: string;
  timestamp: number;
  isFavorite: boolean;
}

interface TryOnSettings {
  garmentPhotoType: string;
  category: string;
  mode: string;
  segmentationFree: boolean;
  seed: number;
  numSamples: number;
  modelVersion: string;
}

interface LoadingStage {
  label: string;
  icon: string;
  completed: boolean;
}

interface TryOnState {
  // Images
  modelImageFile: File | null;
  modelImagePreview: string | null;
  garmentImageFile: File | null;
  garmentImagePreview: string | null;

  // Settings
  settings: TryOnSettings;

  // Results
  results: TryOnResult[];
  currentResultIndex: number;
  isLoading: boolean;
  error: string | null;

  // AI Analysis
  stylistAnalysis: StylistAnalysis | null;
  outfitScores: OutfitScores | null;
  isAnalyzing: boolean;

  // Loading experience
  loadingStages: LoadingStage[];
  currentLoadingStage: number;

  // API Key
  apiKey: string;

  // Modal states
  isResultsModalOpen: boolean;

  // Actions
  setModelImage: (file: File | null, preview: string | null) => void;
  setGarmentImage: (file: File | null, preview: string | null) => void;
  updateSettings: (settings: Partial<TryOnSettings>) => void;
  setResults: (results: TryOnResult[]) => void;
  setCurrentResultIndex: (index: number) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setApiKey: (key: string) => void;
  setIsResultsModalOpen: (open: boolean) => void;
  setStylistAnalysis: (analysis: StylistAnalysis | null) => void;
  setOutfitScores: (scores: OutfitScores | null) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  advanceLoadingStage: () => void;
  resetLoadingStages: () => void;
  toggleFavorite: (id: string) => void;
  reset: () => void;
}

const defaultLoadingStages: LoadingStage[] = [
  { label: "Analyzing human pose...", icon: "🧍", completed: false },
  { label: "Detecting body landmarks...", icon: "📍", completed: false },
  { label: "Segmenting garment...", icon: "👕", completed: false },
  { label: "Estimating fit...", icon: "📐", completed: false },
  { label: "Applying textures...", icon: "🎨", completed: false },
  { label: "Generating realistic shadows...", icon: "🌓", completed: false },
  { label: "Rendering final image...", icon: "✨", completed: false },
  { label: "Almost done...", icon: "🚀", completed: false },
];

const defaultSettings: TryOnSettings = {
  garmentPhotoType: "Auto",
  category: "Auto",
  mode: "Balanced",
  segmentationFree: true,
  seed: Math.floor(Math.random() * 1000000),
  numSamples: 1,
  modelVersion: "tryon-v1.6",
};

export const useTryOnStore = create<TryOnState>((set) => ({
  modelImageFile: null,
  modelImagePreview: null,
  garmentImageFile: null,
  garmentImagePreview: null,
  settings: { ...defaultSettings },
  results: [],
  currentResultIndex: 0,
  isLoading: false,
  error: null,
  stylistAnalysis: null,
  outfitScores: null,
  isAnalyzing: false,
  loadingStages: defaultLoadingStages.map((s) => ({ ...s })),
  currentLoadingStage: 0,
  apiKey: typeof window !== "undefined" ? localStorage.getItem("fashn_api_key") || "" : "",
  isResultsModalOpen: false,

  setModelImage: (file, preview) =>
    set({ modelImageFile: file, modelImagePreview: preview, error: null }),
  setGarmentImage: (file, preview) =>
    set({ garmentImageFile: file, garmentImagePreview: preview, error: null }),
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),
  setResults: (results) => set({ results }),
  setCurrentResultIndex: (index) => set({ currentResultIndex: index }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setApiKey: (key) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("fashn_api_key", key);
    }
    set({ apiKey: key });
  },
  setIsResultsModalOpen: (open) => set({ isResultsModalOpen: open }),
  setStylistAnalysis: (analysis) => set({ stylistAnalysis: analysis }),
  setOutfitScores: (scores) => set({ outfitScores: scores }),
  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
  advanceLoadingStage: () =>
    set((state) => {
      const stages = state.loadingStages.map((s, i) => ({
        ...s,
        completed: i <= state.currentLoadingStage,
      }));
      return {
        loadingStages: stages,
        currentLoadingStage: Math.min(
          state.currentLoadingStage + 1,
          state.loadingStages.length - 1
        ),
      };
    }),
  resetLoadingStages: () =>
    set({
      loadingStages: defaultLoadingStages.map((s) => ({ ...s })),
      currentLoadingStage: 0,
    }),
  toggleFavorite: (id) =>
    set((state) => ({
      results: state.results.map((r) =>
        r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
      ),
    })),
  reset: () =>
    set({
      modelImageFile: null,
      modelImagePreview: null,
      garmentImageFile: null,
      garmentImagePreview: null,
      settings: { ...defaultSettings, seed: Math.floor(Math.random() * 1000000) },
      results: [],
      currentResultIndex: 0,
      isLoading: false,
      error: null,
      stylistAnalysis: null,
      outfitScores: null,
      isAnalyzing: false,
      loadingStages: defaultLoadingStages.map((s) => ({ ...s })),
      currentLoadingStage: 0,
    }),
}));
