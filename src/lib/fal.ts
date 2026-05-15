import { fal } from "@fal-ai/client";

// This is the model recommended for real hair transformation:
const HAIRSTYLE_MODEL = "fal-ai/image-editing/hair-change";

export async function generateHairstyleChange(base64Image: string, stylePrompt: string): Promise<{ url?: string; error?: string; isFallback?: boolean }> {
  try {
    const response = await fetch("/api/fal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: base64Image, prompt: stylePrompt }),
    });

    // HuggingFace returns binary image blob, NOT JSON
    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("json")) {
        // Model still loading or returned an error
        const err = await response.json();
        console.warn("HuggingFace returned JSON (model loading?):", err);
        return { error: err.error || "Model is loading, please retry in a moment." };
    }

    if (!response.ok) {
        return { error: `Image generation failed (HTTP ${response.status})` };
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    return { url };
  } catch (error: any) {
    console.error("Fal Client Error:", error);
    return { error: error.message || "Connection interrupted." };
  }
}
