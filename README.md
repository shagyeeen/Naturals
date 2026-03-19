# Naturals AI Beauty Intelligence Platform 🛡️💎

The **Naturals AI Beauty Intelligence Platform** is a high-end, autonomous enterprise SaaS designed to synchronize salon operations and customer personalization through advanced intelligence. It transforms the beauty journey into a data-driven, premium experience.

## 🏺 Elite Core Modules

### 1. Beauty Passport & Identity Sync 🛡️
A digital diagnostic vault for every customer. 
- **Passport Sync**: Bridges physical identity with secure digital accounts using brand-aligned IDs (`NAT-SHA-2026-XXXX`).
- **Identity Recovery**: Intelligent "Claim Passport" flow to link existing beauty registries with new secure credentials.

### 2. Autonomous Booking Command Center ⚔️
A real-time resource allocation engine.
- **Dynamic Roster**: Pulls the elite specialist registry (e.g., Suresh Kumar, Tharikasini) and service catalogs directly from the **Supabase Vault**.
- **Bandwidth Engine**: Intelligently identifies available time slots (`get_available_slots`) to optimize analyst bandwidth and ensure zero-friction booking.

### 3. Stylist Copilot & Duty Roster ✂️
Empowering personnel with AI-guided proficiency.
- **Duty Roster**: Real-time operational stream mapping upcoming procedures (Keratin, Coloring, etc.) directly to the specialist's dashboard.
- **Synthesis Assistant**: Precision chemical formulation and protocol guidance (Level 3-5 damage diagnostics).

### 4. AI SOP Engine & Trend Intelligence 🧪
- **Autonomous Audit**: Live protocol enforcement through action recognition.
- **Predictive Trends**: Regional predictive analytics combining social listening with local inventory data.

## 🗺️ System Architecture

```mermaid
graph TD
    A[Elite Salon Network] --> B[AI SOP Engine]
    A --> C[Passport Identity Sync]
    B --> D[Central Intelligence Hub]
    C --> D
    D --> E[Bandwidth Engine]
    D --> F[Beauty Passport Vault]
    E --> G[Duty Roster (Stylist Dashboard)]
    F --> H[Personalized Experience]
```

## 🏺 Technology Stack

- **Core Framework**: Next.js 15+ (App Router)
- **Security & Data**: Supabase (Auth, RLS, Real-time)
- **Elite Aesthetic**: Tailwind CSS & Framer Motion
- **Diagnostics**: MediaPipe & AI Visual Recognition
- **Branding**: Premium Light Theme with Naturals Purple

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Registry Hub Configuration**:
   Create a `.env.local` with your **Supabase** credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

3. **Digital Roster Activation**:
   Run the registry pulse in your Supabase SQL Editor to unlock the styling roster and bandwidth engine (see `docs/sql` for scripts).

4. **Initialize Execution**:
   ```bash
   npm run dev
   ```

---
**Precision Beauty Intelligence • Powered by Naturals AI** 🛡️✨🏛️
