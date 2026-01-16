# Changelog

All notable changes and improvements to the AI Logo Generator project.

## [2026-01-16] - Latest Updates

### Color System Overhaul
- **Fixed duplicate color names**: `#9257db` and `#95bbf9` were both mapping to "blue"
- **Improved hex to color name conversion**: 
  - Purple detection (`#9257db` → "purple")
  - Light blue vs blue vs navy distinction
  - Grayscale detection (light gray, gray, dark gray)
  - Pink, cyan, teal, orange proper identification
- **Removed prompt redundancy**: Colors mentioned once instead of 5 times (30% shorter prompts)
- **Better grammar**: "red and blue" (2 colors), "red, blue, and green" (3+ colors with Oxford comma)
- **Added deduplication**: Removes duplicate color names automatically

### Prompt Engineering Improvements
- **Increased guidance scale**: 7.5 → 12.0 for stricter prompt adherence
- **More inference steps**: 30 → 35 for better quality
- **Simplified prompt structure**: Removed redundant color mentions
- **Enhanced negative prompt**: Added "wrong colors, off-brand colors, different colors, muted colors"
- **Duplicate description check**: Removes `additional_details` if it matches `description`

### Logging Enhancements
- **Full prompt logging**: No more truncation in browser console
- **Backend logging**: Modal dashboard shows complete prompts
- **Color conversion debugging**: Shows hex → color name conversions
- **Clear delimiters**: Easy-to-read log formatting

### Frontend Simplifications
- **Removed Text tab**: Simplified to 3 tabs (Basic, Colors, Advanced)
- **Description field required**: Moved to top of Basic tab, minimum 3 characters
- **Removed duplicate Background Type**: Now only in Colors tab
- **Enhanced Additional Details**: Larger textarea with better placeholder text
- **Cleaned up state management**: Removed unused text layer state

### Bug Fixes
- Fixed Modal API deprecations (`Stub` → `App`, `container_idle_timeout` → `scaledown_window`)
- Fixed FastAPI image caching issue (explicit `.pip_install("fastapi[standard]")`)
- Fixed missing system packages (`git`, `curl` added via `.apt_install()`)
- Fixed CORS errors (added explicit headers to JSONResponse)
- Fixed 303 redirects (changed `.remote()` to `.local()` for internal calls)
- Fixed import errors during deployment (lazy imports for heavy ML libraries)

---

## [2026-01-12] - Initial Modal Integration

### ML Infrastructure Migration
- **Migrated to Modal.com**: Serverless GPU infrastructure
- **Removed local ML setup**: No more 50GB model downloads
- **FastAPI-style organization**: 
  - `core/` - Configuration
  - `schemas/` - Pydantic models
  - `services/` - Business logic
  - `utils/` - Helpers
  - `routers/` - Modal functions
  - `main.py` - Web endpoints

### Models Integrated
- **SDXL**: Stable Diffusion XL base model
- **LogoRedmond LoRA**: Logo-specific fine-tuning
- **SAM**: Segment Anything Model for segmentation
- **SDXL Inpainting**: For logo editing

### Cost Optimization
- **Scale to zero**: No cost when idle
- **Pay-per-second**: Only charged for active GPU time
- **Model caching**: Modal volumes cache model weights
- **Free tier**: $30/month credit (~300 logos)

---

## [2026-01-11] - Frontend Enhancements

### UI/UX Improvements
- Set default logo size to 1024x1024
- Added inline SVG icons for background types (solid, gradient, transparent)
- Logo colors start empty (no default colors)
- Font selection with datalist for custom fonts + "AI Decide" option
- Position dropdowns with 9 kebab-case options
- Removed email marketing toggles from account settings

### Library Page
- Removed "Eye" preview button
- Removed view mode toggle (permanent grid view)
- Simplified card hover interactions

### GitHub OAuth Removal
- Removed GitHub OAuth provider
- Updated schema and components
- Cleaned up authentication flows

---

## [2026-01-10] - Database Schema Updates

### Logo Versioning System
- **Added `LogoVersion` model**: Track edits and iterations
- **Fields**: 
  - `versionNumber`: Incremental version tracking
  - `imageUrl`: Firebase Storage URL for each version
  - `prompt`: Prompt used for this version
  - `seed`: Seed for reproducibility
  - `editInstruction`: What changed in this version
  - `maskUrl`: Mask image for inpainting edits
- **API Route**: `/api/logos/[id]/edit` for saving new versions
- **Firebase Integration**: Base64 → Firebase upload utility

### Save Logo API Enhancement
- Upload base64 images directly to Firebase
- Create Logo record with first LogoVersion
- Return latest version URL
- Comprehensive error handling

---

## [2025-12] - Initial Development

### Core Features
- **Frontend**: Next.js 14 with App Router
- **UI Framework**: React 18, TypeScript, Tailwind CSS, Radix UI
- **Authentication**: NextAuth.js (Google OAuth, Credentials)
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: Firebase Storage for logo files
- **Payments**: Stripe integration

### Pages Implemented
- `/generate` - Logo generation interface
- `/library` - Saved logos gallery
- `/canvas` - Logo editor (placeholder)
- `/account` - User settings
- `/auth/login` - Authentication

### Components
- Navigation with dark mode support
- Color picker with add/remove functionality
- Icon picker for decorative elements
- Download modal with format options
- Save modal with metadata
- AI chat interface (placeholder)

---

## Technical Debt & Future Work

### High Priority
- [ ] Implement canvas editing with SAM segmentation
- [ ] Add real-time logo editing preview
- [ ] Batch logo generation (multiple variants)
- [ ] Logo export in multiple formats (SVG, PNG, PDF)

### Medium Priority
- [ ] User dashboard with analytics
- [ ] Logo sharing and collaboration
- [ ] Template system for quick starts
- [ ] Brand kit management (save color palettes, styles)

### Low Priority
- [ ] Social features (likes, comments)
- [ ] Public logo gallery
- [ ] API for third-party integrations
- [ ] Mobile app

### Optimizations
- [ ] Implement caching for identical prompts
- [ ] Add CDN for faster logo delivery
- [ ] Optimize database queries
- [ ] Add rate limiting
- [ ] Implement usage analytics

---

## Breaking Changes

### 2026-01-16
- **Color format**: Now uses proper color names instead of redundant hex mentions
- **Prompt structure**: Simplified (30% shorter)
- **Text tab removed**: Users specify text in Additional Details field

### 2026-01-12
- **ML infrastructure**: Migrated from local to Modal (requires new setup)
- **Environment variables**: New Modal endpoint URLs required
- **Deployment process**: Changed from Docker to Modal CLI

---

## Performance Improvements

### Generation Speed
- **Before**: 30-60 seconds per logo
- **After**: 5-10 seconds (warm), 15-20 seconds (cold start)

### Prompt Length
- **Before**: 242 characters (with redundancy)
- **After**: 170 characters (30% reduction)

### Cost Per Logo
- **Before**: N/A (local, but required expensive GPU)
- **After**: ~$0.005 per logo (~300 logos free per month)

### Storage Requirements
- **Before**: 50GB+ for model weights
- **After**: <1GB (only code, no models)

---

## Known Issues

### Modal Deprecation Warnings
- `@modal.web_endpoint` → `@modal.fastapi_endpoint` (functional, just warnings)
- Will update in next major release

### Color Accuracy
- Still relies on text prompts (no direct color control)
- ~80-90% accuracy with new system
- Future: ControlNet integration for 100% accuracy

### Canvas Editor
- Not yet implemented (placeholder only)
- Planned for next major release
- SAM integration ready, UI pending

---

## Contributors

- Aneesh Ganti - Initial development and all features

---

**Version**: 1.0.0  
**Last Updated**: 2026-01-16
