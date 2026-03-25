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

    const data = await response.json();
    if (data.url) {
        return { url: data.url };
    }
    
    return { error: data.error || "Neural Engine unstable." };
  } catch (error: any) {
    console.error("Fal Client Error:", error);
    return { error: error.message || "Connection interrupted." };
  }
}
