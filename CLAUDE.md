# CLAUDE.md - SRT Clarity Search Agent Context

**Project**: Perplexity.ai clone with AI-powered search and web scraping, integrated with vLLM inference
**Status**: Production deployed at `https://clarity.lab.hq.solidrust.net`
**Last Updated**: January 3, 2026
**Shaun's Golden Rule**: **No workarounds, no temporary fixes, no disabled functionality. Full solutions only.**

---

## ⚡ AGENT QUICK START

**Your job**: Help with SRT Clarity Search - a Next.js application that provides AI-powered search similar to Perplexity.ai, integrated with the platform's vLLM inference service.

**Shaun's top rule**: No workarounds, no temporary fixes, complete solutions only.

**Where to start**:
1. Read "Project Overview" below
2. Understand vLLM integration (uses internal cluster service)
3. Reference deployment patterns as needed
4. Check srt-hq-k8s CLAUDE.md for platform integration questions

---

## 📚 PLATFORM INTEGRATION

**Related Repositories**:
- **srt-hq-k8s**: `/Users/shaun/repos/srt-hq-k8s/` - Kubernetes platform (12 nodes)
- **srt-hq-vllm**: `/Users/shaun/repos/srt-hq-vllm/` - vLLM inference backend

**Platform Features Used**:
- **vLLM**: `http://vllm.inference.svc.cluster.local:8000/v1` for AI completions
- **Ingress**: nginx-ingress with TLS (cert-manager DNS-01)
- **Replicas**: 2 pods for high availability

**When NOT to Query**:
- ❌ Next.js development (use Next.js docs)
- ❌ Application logic (see README.md)
- ❌ Docker build process (use build-and-push.ps1)
- ❌ OpenAI SDK usage (use OpenAI docs)

---

## 📍 PROJECT OVERVIEW

**Application Type**: AI-powered search engine (Perplexity.ai clone)
**Tech Stack**: Next.js 14 + TypeScript + TailwindCSS
**Build System**: Next.js built-in (webpack under the hood)
**Package Manager**: npm
**Production**: Node.js server (port 3000)

**Key Features**:
- AI-powered web search with contextual answers
- Google search scraping for relevant sources
- Webpage content extraction and parsing
- Streaming AI responses (SSE/streaming API)
- Clean, modern UI with Tabler icons
- Integration with vLLM inference (local, self-hosted)

**How It Works**:
1. User enters search query
2. App scrapes Google for relevant webpages
3. Parses webpages for text content
4. Builds prompt using query + webpage text
5. Calls vLLM API (OpenAI-compatible) for answer generation
6. Streams answer back to user with source citations

---

## 🗂️ LOCATIONS

**Repository**:
- GitHub: `git@github.com:suparious/srt-clarity-search.git`
- Submodule: `/Users/shaun/repos/srt-hq-k8s/manifests/apps/srt-clarity-search/`
- Standalone: `/Users/shaun/repos/srt-clarity-search/`

**Deployment**:
- Dev: `npm run dev` → `http://localhost:3000` (Next.js dev server)
- Docker Test: `docker run -p 3000:3000 suparious/srt-clarity-search:latest` → `http://localhost:3000`
- Production: `https://clarity.lab.hq.solidrust.net` (K8s namespace: `srt-clarity-search`)

**Images**:
- Docker Hub: `suparious/srt-clarity-search:latest`
- Public URL: `https://hub.docker.com/r/suparious/srt-clarity-search`

**vLLM Integration**:
- Internal URL: `http://vllm.inference.svc.cluster.local:8000/v1/chat/completions`
- Public URL: `https://vllm.lab.hq.solidrust.net/v1/chat/completions` (via Artemis proxy)

---

## 🛠️ TECH STACK

### Frontend (Next.js + React)
- **Next.js**: 14.2.26 (full-stack framework)
- **React**: 18.2.0 (UI library)
- **TypeScript**: 4.9.5 (type safety)
- **TailwindCSS**: 3.2.7 (styling)
- **Tabler Icons**: 2.4.0 (UI icons)

### Backend (Next.js API Routes)
- **Runtime**: Node.js 24 Alpine
- **API Framework**: Next.js API routes (Edge runtime)
- **Web Scraping**: Cheerio 1.0.0-rc.12 + JSDOM 21.1.0
- **Text Extraction**: @mozilla/readability 0.6.0
- **AI Integration**: OpenAI SDK 4.51.0 (configured for vLLM)
- **Streaming**: eventsource-parser 0.1.0

### Production (Docker + Kubernetes)
- **Base Image**: node:24-alpine (multi-stage)
- **Runtime**: Node.js (Next.js production server)
- **Port**: 3000
- **Orchestration**: Kubernetes 1.34+
- **Ingress**: nginx-ingress with Let's Encrypt DNS-01

---

## 📁 PROJECT STRUCTURE

```
srt-clarity-search/
├── components/               # React components
│   ├── Answer.tsx           # AI answer display
│   ├── Search.tsx           # Search input
│   └── Sources.tsx          # Source citations
├── pages/                   # Next.js pages
│   ├── api/                 # API routes
│   │   ├── answer.ts        # AI answer generation (Edge runtime)
│   │   └── sources.ts       # Web scraping and source fetching
│   ├── _app.tsx             # App wrapper
│   ├── _document.tsx        # HTML document
│   └── index.tsx            # Main page
├── utils/                   # Utility functions
│   └── answer.ts            # OpenAI streaming logic
├── types/                   # TypeScript types
│   └── index.ts             # Type definitions (OpenAIModel, Source, etc.)
├── styles/                  # Global styles
│   └── globals.css          # Tailwind + custom CSS
├── public/                  # Static assets
│   └── screenshot.png       # App screenshot
├── k8s/                     # Kubernetes manifests (K8s deployment only)
│   ├── 01-namespace.yaml
│   ├── 02-configmap.yaml    # vLLM endpoints configuration
│   ├── 03-deployment.yaml
│   ├── 04-service.yaml
│   └── 05-ingress.yaml
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies
├── Dockerfile               # Multi-stage build (K8s deployment only)
├── .dockerignore            # Docker ignore patterns (K8s deployment only)
├── build-and-push.ps1       # Docker build script (K8s deployment only)
├── deploy.ps1               # Kubernetes deployment (K8s deployment only)
├── CLAUDE.md                # This file (K8s deployment only)
├── README-K8S.md            # Deployment guide (K8s deployment only)
└── README.md                # Original project documentation
```

**Note**: Files marked "K8s deployment only" are in the submodule but NOT in the standalone repository.

---

## 🚀 DEVELOPMENT WORKFLOW

### Local Development

```bash
# Install dependencies
npm install

# Start dev server (HMR enabled)
npm run dev
# Access: http://localhost:3000

# Build for production
npm run build

# Start production server
npm start
# Access: http://localhost:3000
```

**Note**: In local development, you'll need to configure the inference URL in `types/index.ts`:
- Use `INFERENCE_URL = "http://localhost:5000/v1/chat/completions"` for local vLLM
- Or use the public URL: `https://vllm.lab.hq.solidrust.net/v1/chat/completions`

### Docker Testing

```bash
# Build image locally
.\build-and-push.ps1

# Test image
docker run --rm -p 3000:3000 suparious/srt-clarity-search:latest
# Access: http://localhost:3000
```

### Production Deployment

```bash
# Build and push to Docker Hub
.\build-and-push.ps1 -Login -Push

# Deploy to Kubernetes
.\deploy.ps1

# Or build + push + deploy in one command
.\deploy.ps1 -Build -Push
```

---

## 📋 DEPLOYMENT

### Quick Deploy (Recommended)

```powershell
# Full deployment (build, push, deploy)
.\deploy.ps1 -Build -Push

# Deploy only (uses existing Docker Hub image)
.\deploy.ps1

# Uninstall
.\deploy.ps1 -Uninstall
```

### Manual Deployment

```bash
# Build and push Docker image
docker build -t suparious/srt-clarity-search:latest .
docker push suparious/srt-clarity-search:latest

# Deploy to cluster
kubectl apply -f k8s/

# Verify deployment
kubectl get all -n srt-clarity-search
kubectl get certificate -n srt-clarity-search
kubectl get ingress -n srt-clarity-search
```

---

## 🔧 COMMON TASKS

### View Logs

```bash
# All pods
kubectl logs -n srt-clarity-search -l app=srt-clarity-search -f

# Specific pod
kubectl logs -n srt-clarity-search <pod-name> -f
```

### Update Deployment

```bash
# Restart pods (pull latest image)
kubectl rollout restart deployment/srt-clarity-search -n srt-clarity-search

# Watch rollout status
kubectl rollout status deployment/srt-clarity-search -n srt-clarity-search
```

### Update vLLM Configuration

```bash
# Edit ConfigMap
kubectl edit configmap srt-clarity-search-config -n srt-clarity-search

# Restart deployment to pick up changes
kubectl rollout restart deployment/srt-clarity-search -n srt-clarity-search
```

### Troubleshooting

```bash
# Check pod status
kubectl get pods -n srt-clarity-search

# Describe pod (events and errors)
kubectl describe pod -n srt-clarity-search <pod-name>

# Check certificate status
kubectl describe certificate -n srt-clarity-search srt-clarity-search-tls

# Check ingress
kubectl describe ingress -n srt-clarity-search srt-clarity-search

# Test vLLM connectivity from pod
kubectl exec -it -n srt-clarity-search <pod-name> -- wget -O- http://vllm.inference.svc.cluster.local:8000/v1/models
```

---

## 🎯 USER PREFERENCES (CRITICAL)

### Solutions
- ✅ **Complete, working solutions** - Every change must be immediately deployable
- ✅ **Direct execution** - Use available tools, verify in real-time
- ✅ **No back-and-forth** - Show results, iterate to solution
- ❌ **NO workarounds** - If symptoms remain, keep digging for root cause
- ❌ **NO temporary files** - All code is production code
- ❌ **NO disabled functionality** - Don't hack around errors, fix them
- ✅ **Git as source of truth** - All changes in code, nothing manual

### Code Quality
- Full files, never patch fragments (unless part of strategy)
- Scripts work on first run (no retry logic needed)
- Documentation before infrastructure
- Reproducibility via automation

---

## 🏗️ BUILD PROCESS

### Multi-Stage Docker Build

**Stage 1: Dependencies** (node:24-alpine)
1. Copy package files
2. Install production dependencies with `npm ci`

**Stage 2: Builder** (node:24-alpine)
1. Copy dependencies from stage 1
2. Copy application source
3. Build Next.js app with `npm run build`

**Stage 3: Production** (node:24-alpine)
1. Copy built application from builder
2. Create non-root user (nextjs:1001)
3. Configure environment variables
4. Expose port 3000
5. Run Next.js production server

**Build Time**: ~3-7 minutes
**Image Size**: ~200-300 MB (Node.js + Next.js app)

---

## 🌐 NETWORKING

**Ingress Configuration**:
- Host: `clarity.lab.hq.solidrust.net`
- TLS: Let's Encrypt DNS-01 (automatic via cert-manager)
- Certificate Secret: `srt-clarity-search-tls`
- Ingress Class: `nginx`
- SSL Redirect: Enabled
- Proxy Timeouts: 300s (for streaming responses)

**Service**:
- Type: ClusterIP
- Port: 80 (HTTP)
- Target Port: 3000 (Next.js container)

**vLLM Integration**:
- Internal Service: `vllm.inference.svc.cluster.local:8000`
- API Endpoint: `/v1/chat/completions` (OpenAI-compatible)
- Authentication: Bearer token (passed from client)
- Model: Configured in vLLM deployment (typically Meta-Llama or similar)

**Access**:
- Production: `https://clarity.lab.hq.solidrust.net`
- Redirects HTTP → HTTPS automatically

---

## 📊 RESOURCE ALLOCATION

**Deployment**:
- Replicas: 2 (high availability)
- Strategy: RollingUpdate

**Container Resources**:
- **Requests**: 200m CPU, 256Mi memory
- **Limits**: 1000m CPU, 512Mi memory

**Probes**:
- **Liveness**: HTTP GET / every 30s (after 15s initial delay)
- **Readiness**: HTTP GET / every 10s (after 10s initial delay)

**Rationale**: Next.js with API routes needs more resources than static SPA, but still modest for a web app

---

## 🔍 VALIDATION

### After Deployment

```bash
# 1. Check pods are running
kubectl get pods -n srt-clarity-search
# Expected: 2/2 pods Running

# 2. Check service
kubectl get svc -n srt-clarity-search
# Expected: ClusterIP service on port 80

# 3. Check ingress
kubectl get ingress -n srt-clarity-search
# Expected: clarity.lab.hq.solidrust.net with ADDRESS

# 4. Check certificate
kubectl get certificate -n srt-clarity-search
# Expected: READY=True

# 5. Check ConfigMap
kubectl get configmap -n srt-clarity-search
# Expected: srt-clarity-search-config with vLLM URLs

# 6. Test application
curl -k https://clarity.lab.hq.solidrust.net
# Expected: HTML response with search interface

# 7. Test vLLM connectivity (from pod)
kubectl exec -it -n srt-clarity-search <pod-name> -- \
  wget -O- http://vllm.inference.svc.cluster.local:8000/v1/models
# Expected: JSON response with available models

# 8. Browser test
# Open https://clarity.lab.hq.solidrust.net
# Expected: Green padlock, app loads, search works with AI responses
```

---

## 💡 KEY DECISIONS

### Why Next.js (not pure React)?
- Need server-side API routes for web scraping
- Better SEO capabilities (if needed in future)
- Built-in API route handling
- Streaming support for AI responses

### Why Node.js runtime (not static export)?
- Application uses API routes (`/api/answer`, `/api/sources`)
- Web scraping requires server-side execution
- Streaming responses need server runtime
- Cannot be compiled to static HTML

### Why vLLM integration?
- Self-hosted inference = $0 per token (vs $0.01-0.05 per 1K tokens)
- Platform already has vLLM deployed with GPU acceleration
- OpenAI-compatible API = minimal code changes
- Complete control over models and performance

### Why ConfigMap for vLLM URLs?
- Easy to update without rebuilding images
- Different URLs for internal vs external access
- Flexibility to switch endpoints if needed
- Following platform patterns

### Why 2 replicas?
- High availability
- Zero-downtime deployments
- Load distribution
- Better than 1 (no HA) or 3+ (overkill for this workload)

### Why ClusterIP service?
- No external LoadBalancer needed
- Traffic comes through Ingress only
- Standard pattern for web apps on this platform

---

## 🎓 AGENT SUCCESS CRITERIA

You're doing well if:

✅ You understand this is a Next.js full-stack application (not static SPA)
✅ You know the app integrates with vLLM for AI inference
✅ You know vLLM is accessed via internal cluster service
✅ You check srt-hq-k8s CLAUDE.md for platform integration questions
✅ You provide complete solutions (never workarounds)
✅ You use PowerShell scripts for deployment
✅ You validate changes work end-to-end
✅ You understand web scraping is part of the core functionality
✅ You check package.json for available npm scripts
✅ You respect Shaun's "no workarounds" philosophy
✅ You understand this is a Perplexity.ai clone (AI-powered search)

---

## 📅 CHANGE HISTORY

| Date | Change | Impact |
|------|--------|--------|
| 2025-11-13 | Initial onboarding | Project added to SRT-HQ K8s platform |
| 2025-11-13 | Created Dockerfile | Multi-stage build optimized for Next.js |
| 2025-11-13 | Created K8s manifests | Deployment, Service, Ingress, ConfigMap configured |
| 2025-11-13 | vLLM integration | Configured to use platform vLLM service |
| 2025-11-13 | Created PowerShell scripts | build-and-push.ps1, deploy.ps1 |
| 2025-11-13 | Added as git submodule | Integrated into srt-hq-k8s repo |

---

**Last Updated**: January 3, 2026
**Status**: Production Ready
**Platform**: SRT-HQ Kubernetes
**Access**: https://clarity.lab.hq.solidrust.net
**vLLM**: http://vllm.inference.svc.cluster.local:8000

---

*Attach this file to SRT Clarity Search conversations for complete context.*
