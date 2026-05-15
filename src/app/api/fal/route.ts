import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        const cleanPrompt = prompt.replace(/[^\w\s,]/gi, "").substring(0, 200);
        const fullPrompt = `photorealistic portrait of a person with ${cleanPrompt}, highly detailed hair texture, sharp focus, 4k, studio lighting, cinematic`;

        // ── POLLINATIONS IMAGE API ────────────────────────────────────────────
        // Correct endpoint: image.pollinations.ai/prompt/{prompt}
        // NOT pollinations.ai/p/ (that's the website, returns HTML)
        const seed = Math.floor(Math.random() * 1_000_000);
        const polUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=768&height=768&model=flux&seed=${seed}&nologo=true&enhance=true`;

        console.log("[Pollinations] Requesting image from image.pollinations.ai...");

        const polRes = await fetch(polUrl, {
            signal: AbortSignal.timeout(45_000), // 45s — flux can be slow on first gen
        });

        console.log(`[Pollinations] status: ${polRes.status}, content-type: ${polRes.headers.get("content-type")}`);

        if (!polRes.ok) {
            throw new Error(`Pollinations returned HTTP ${polRes.status}`);
        }

        const contentType = polRes.headers.get("content-type") ?? "";

        // Safety check — if we somehow got HTML instead of an image, fail loudly
        if (contentType.includes("text/html") || contentType.includes("json")) {
            const body = await polRes.text();
            console.error("[Pollinations] Got non-image response:", body.substring(0, 200));
            throw new Error("Pollinations returned non-image content");
        }

        const blob = await polRes.blob();
        const imageType = contentType.startsWith("image/") ? contentType : "image/jpeg";

        console.log(`[Pollinations] ✅ Success — ${blob.size} bytes, type: ${imageType}`);

        return new Response(blob, {
            headers: { "Content-Type": imageType },
        });

    } catch (error: any) {
        console.error("[Neural Synthesis] Failed:", error.message);
        return NextResponse.json(
            { error: "Synthesis engine busy. Please retry in a moment." },
            { status: 503 }
        );
    }
}
