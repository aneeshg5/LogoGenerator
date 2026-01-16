# AI Logo Generator

A full-stack AI-powered logo generation platform with advanced editing capabilities, built with Next.js, Modal.com serverless ML, and modern web technologies.

## Features

- **AI Logo Generation**: Generate custom logos using Stable Diffusion XL with LogoRedmond LoRA
- **Semantic Segmentation**: Interactive logo editing with Meta's Segment Anything Model (SAM)
- **Inpainting**: AI-powered logo modifications and refinements
- **User Authentication**: Google OAuth and credential-based authentication
- **Cloud Storage**: Firebase integration for logo storage
- **Database**: PostgreSQL with Prisma ORM for user data and logo versioning
- **Stripe Integration**: Payment processing (ready for monetization)

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18, TypeScript, Tailwind CSS, Radix UI
- **Auth**: NextAuth.js
- **Storage**: Firebase Storage

### Backend
- **API**: Next.js API routes
- **ML Service**: Modal.com serverless GPU infrastructure
- **Models**: SDXL, SAM, LogoRedmond LoRA
- **Database**: PostgreSQL with Prisma ORM

### ML Infrastructure
- **Deployment**: Modal.com (scales to zero, pay-per-second)
- **GPUs**: A10G (generation), T4 (segmentation)
- **Cost**: ~$0.005 per logo generation, $30/month free tier

## Quick Start (10 minutes)

### 1. Install Modal CLI (2 min)

```bash
pip install modal
modal token new
```

This opens your browser to authenticate. Sign up with GitHub (free account).

**Important**: You don't need torch, diffusers, or any ML libraries locally! Everything runs on Modal's cloud.

### 2. Deploy ML Service (3 min)

```bash
cd ml-service
modal deploy -m app.main
```

Save the endpoint URLs from the output:
```
✓ Created web function generate_logo => https://username--logo-generator-ml-generate-logo.modal.run
✓ Created web function segment_image => https://username--logo-generator-ml-segment-image.modal.run
✓ Created web function inpaint_logo => https://username--logo-generator-ml-inpaint-logo.modal.run
```

### 3. Configure Frontend (1 min)

Create `frontend/.env.local`:

```env
# Modal ML Service Endpoints
NEXT_PUBLIC_MODAL_GENERATE_URL="https://username--logo-generator-ml-generate-logo.modal.run"
NEXT_PUBLIC_MODAL_SEGMENT_URL="https://username--logo-generator-ml-segment-image.modal.run"
NEXT_PUBLIC_MODAL_INPAINT_URL="https://username--logo-generator-ml-inpaint-logo.modal.run"

# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."

# Stripe
STRIPE_SECRET_KEY="..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="..."
```

### 4. Setup Database (2 min)

```bash
cd frontend
npm install
npx prisma generate
npx prisma migrate dev
```

### 5. Run Frontend (1 min)

```bash
npm run dev
```

Visit http://localhost:3000/generate

### 6. Generate Your First Logo (1 min)

1. Add at least one logo color
2. Enter description: "coffee cup logo"
3. Click "Generate Logo"
4. Wait 15-20 seconds (first time - cold start)
5. See your AI-generated logo!

**Subsequent generations take 5-10 seconds.**

## Project Structure

```
LogoGenerator/
├── frontend/               # Next.js frontend application
│   ├── app/               # App router pages
│   │   ├── generate/     # Logo generation interface
│   │   ├── library/      # Saved logos gallery
│   │   ├── canvas/       # Logo editor (coming soon)
│   │   ├── account/      # User settings
│   │   └── api/          # API routes
│   ├── components/        # React components
│   ├── lib/              # Utilities and clients
│   ├── prisma/           # Database schema
│   └── firebase/         # Firebase config
│
└── ml-service/            # Modal ML inference service
    ├── app/
    │   ├── main.py       # Modal app + web endpoints
    │   ├── core/         # Configuration
    │   ├── schemas/      # Pydantic models
    │   ├── services/     # ML business logic
    │   ├── utils/        # Helpers
    │   └── routers/      # Modal functions
    └── requirements.txt
```

## Key Features Implemented

### Logo Generation
- Color-aware prompt engineering (hex to color name conversion)
- Style selection (minimal, flat, geometric, abstract, etc.)
- Industry/theme customization
- High guidance scale (12.0) for strict color adherence
- 35 inference steps for quality
- Proper grammar in prompts ("red and blue" vs "red, blue")

### UI/UX
- 3-tab interface (Basic, Colors, Advanced)
- Required description field with validation
- Color picker with add/remove functionality
- Background type selection (solid, gradient, transparent)
- 3D effect toggle
- Additional details textarea for specific requirements

### ML Service
- FastAPI-style organization
- Serverless GPU deployment (scales to zero)
- Comprehensive logging for debugging
- Color conversion with deduplication
- Cost-optimized inference

## Architecture Highlights

### Color Accuracy System
1. **Hex to Color Name Conversion**: Converts `#9257db` → "purple", `#95bbf9` → "light blue"
2. **Deduplication**: Removes duplicate color names
3. **Proper Formatting**: "red and blue" (2 colors), "red, blue, and green" (3+ colors)
4. **Quadruple Emphasis**: Colors mentioned strategically throughout prompt for better adherence

### ML Pipeline
1. **Frontend**: User selects colors/description
2. **API Client**: Sends hex colors + description to Modal
3. **Prompt Engineering**: Converts hex → color names, formats cleanly
4. **SDXL Generation**: High guidance (12.0) for strict adherence
5. **Base64 Response**: Returns generated image + metadata
6. **Firebase Storage**: Saves to cloud storage
7. **Database**: Stores logo record with versioning

### Cost Optimization
- **Scale to Zero**: No cost when idle
- **Pay-per-Second**: Only charged for active GPU time
- **Model Caching**: Modal caches model weights in volumes
- **Efficient Prompts**: Shorter, cleaner prompts = faster inference

## Troubleshooting

### "Failed to generate logo"
Check Modal endpoints:
```bash
curl https://your-modal-url/health
```

Should return: `{"status": "healthy", "service": "logo-generator-ml"}`

### "Please add at least one logo color"
Click the "Add" button under Logo Colors and select a color.

### Generation takes too long
- First generation (cold start): 15-20 seconds
- Subsequent: 5-10 seconds
- Check Modal logs: `modal logs logo-generator-ml`

### Database errors
Development only - reset and re-migrate:
```bash
cd frontend
npx prisma migrate reset
npx prisma migrate dev
```

## Cost Tracking

**Free tier includes:**
- $30/month credit
- ~300 logo generations
- No credit card required

**After free tier:**
- ~$0.005 per logo generation
- A10G: $1.10/hour (only when running)
- Scales to zero when idle

Check usage: https://modal.com/dashboard

## Development

### ML Service
```bash
cd ml-service
modal deploy -m app.main    # Deploy
modal logs logo-generator-ml # View logs
modal run -m app.main::test  # Test locally
```

### Frontend
```bash
cd frontend
npm run dev                  # Development server
npx prisma studio           # Database GUI
npx prisma migrate dev      # Create migration
```

## Contributing

This is a personal project for learning purposes. Feel free to fork and modify for your own use.

## License

MIT License - See LICENSE file for details

## Acknowledgments

- **Stable Diffusion XL**: Stability AI
- **LogoRedmond LoRA**: artificialguybr
- **Segment Anything Model**: Meta AI
- **Modal**: Serverless GPU infrastructure
- **Next.js**: Vercel

---

**Total Setup Time**: ~10 minutes  
**Storage Required**: <1GB  
**Monthly Cost (Testing)**: $0 (covered by free tier)
