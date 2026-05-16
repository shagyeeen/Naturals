# Technical Specification: Naturals AI Beauty Intelligence Platform

## 1. System Overview
Naturals AI is a multi-tenant salon management ecosystem utilizing Edge AI, Vision Models, and Automated Workflow engines to optimize operational efficiency and customer experience.

## 2. Artificial Intelligence Stack

### 2.1 CCTV & SOP Surveillance (Vision-as-a-Service)
*   **Engine**: Groq Inference API.
*   **Model**: `llama-3.2-11b-vision-preview`.
*   **Capabilities**:
    *   **Contextual Analysis**: Distinguishes between active salon operations and dormant/night status.
    *   **Occupancy Detection**: Real-time count of staff and customers within the camera frame.
    *   **Protocol Enforcement**: Automated detection of SOP compliance (e.g., cleanliness, staff positioning).
*   **Frequency**: Polled at variable intervals or event-triggered via dashboard monitoring.

### 2.2 Beauty Diagnostics & Try-On
*   **Analysis**: Gemini 1.5 Flash / Groq Llama 3.1.
*   **Generation**: Replicate (Identity-preserved hairstyle generation).
*   **Face Tracking**: MediaPipe/TensorFlow.js for real-time AR overlays.

## 3. Communication & Messaging Infrastructure

### 3.1 Automated Email System
*   **Provider**: Resend.
*   **Triggers**:
    *   `POST /api/send-email`: Endpoint for transactional notifications.
    *   **Booking Confirmations**: Sent immediately upon successful appointment creation.
    *   **Staff Briefings**: Triggered from the SOP Dashboard to send daily appointment summaries.
*   **Error Handling**: Detailed status logging in `/api/send-email/route.ts` for tracking delivery latency and success rates.

## 4. Retail Architecture (Bae Store)

### 4.1 UI/UX Design
*   **Theme**: Minimalist Luxury (White background, deep-grape accents).
*   **Component**: `BaeStorePage` at `/dashboard/bae`.
*   **Navigation**: Custom image-icon integration in `DashboardLayout`.
*   **Features**:
    *   Catalog-only mode (No Add-to-Cart logic, optimized for showrooming).
    *   Curated product arrays with 20 real-world brands (Plix, Maybelline, Lakme, Mars).
    *   Responsive Grid: Framer Motion-enhanced product cards.

## 5. Database & Schema (Supabase)

### 5.1 Core Tables
*   **Services**: Stores duration, price tiers, and local image paths.
*   **Appointments**: Relational table linking `customers`, `stylists`, and `services`.
*   **Stylists**: Branch-mapped staff roster with availability logic.
*   **Customer Profiles**: Beautifully mapped identities with 'Beauty Passport' IDs.

### 5.2 Performance Optimization
*   **Image Serving**: Optimized local asset pipeline in `public/Services/`.
*   **Path Safety Filters**: Automatic string replacement for `/services/` vs `/Services/` to handle Vercel's case-sensitive Linux filesystem.

## 6. Environment & Deployment
*   **Host**: Vercel.
*   **Runtime**: Next.js Node.js Runtime.
*   **CI/CD**: Automatic branch deployments with Git integration.
*   **Critical Env Vars**:
    *   `RESEND_API_KEY`: Required for automated emailing.
    *   `GROQ_API_KEY`: Required for vision analysis.
    *   `NEXT_PUBLIC_SUPABASE_URL/KEY`: Database access.

---
**Naturals AI • Technical Blueprint • May 2026**
