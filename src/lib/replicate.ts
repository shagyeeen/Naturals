import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// The 'Option 1' model is the best for reliable, high-fidelity hair editing (SD 1.5 core)
const HAIR_EDIT_MODEL = "stability-ai/stable-diffusion";

export async function generateReplicateHairChange(base64Image: string, stylePrompt: string) {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      console.error("Replicate API Token missing.");
      return null;
    }

    console.log("SD-Option-1: Starting Neural Hairstyle Development...");

    const output: any = await replicate.run(
      HAIR_EDIT_MODEL,
      {
        input: {
          image: base64Image,
          prompt: stylePrompt,
          negative_prompt: "deformed, messy, low resolution, face-artifacts, mask",
          num_inference_steps: 25,
          guidance_scale: 7.5,
          prompt_strength: 0.8, // Specific for SD 1.5 image-to-image
        }
      }
    );

    if (output && output.length > 0) {
      return output[0];
    }
    
    return null;
  } catch (error) {
    console.error("Replicate Engine Error:", error);
    return null;
  }
}
