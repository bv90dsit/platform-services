# Platform Services

A GOV.UK-styled GitHub Pages site for platform teams to publish their AWS service catalogue and enable tenants to self-serve.

**Live site:** https://bv90dsit.github.io/platform-services/

## Purpose

This repository provides a template for platform teams to:

- Publish a discoverable catalogue of AWS services they offer
- Document guardrails, SLAs, and onboarding steps
- Give tenants a clear route to ask questions or request features
- Maintain everything as code (Markdown + Jekyll)

## Architecture

The diagram below shows how the platform team collects the information needed to keep this site useful for tenants, and how tenants interact with it.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PLATFORM TEAM INPUTS                                 │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐ │
│  │ Service Owners  │  │ Cloud Architects│  │ Security & Compliance Team  │ │
│  │                 │  │                 │  │                             │ │
│  │ • What services │  │ • Architecture  │  │ • Guardrails & policies     │ │
│  │   are available │  │   decisions     │  │ • Permission boundaries     │ │
│  │ • SLAs & limits │  │ • Terraform     │  │ • Compliance requirements   │ │
│  │ • Provisioning  │  │   module design │  │ • Security SLAs             │ │
│  │   times         │  │ • Best practices│  │                             │ │
│  └────────┬────────┘  └────────┬────────┘  └──────────────┬──────────────┘ │
│           │                    │                           │                │
└───────────┼────────────────────┼───────────────────────────┼────────────────┘
            │                    │                           │
            ▼                    ▼                           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CONTENT PIPELINE                                        │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    GitHub Repository                                  │   │
│  │                                                                      │   │
│  │  _services/          │  getting-started.md  │  faq.md                │   │
│  │   ├── networking.md  │  (onboarding steps)  │  (common questions)    │   │
│  │   ├── compute.md     │                      │                        │   │
│  │   ├── storage.md     │  index.md            │  _config.yml           │   │
│  │   └── security.md    │  (landing page)      │  (site config)         │   │
│  │                      │                      │                        │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    │  git push → GitHub Actions              │
│                                    ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │              Jekyll Build → GitHub Pages (GOV.UK themed)              │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
            │
            │  Published site
            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TENANT INTERACTIONS                                  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    Tenant Teams                                      │    │
│  │                                                                     │    │
│  │  DISCOVER          │  ONBOARD             │  INTERACT               │    │
│  │  • Browse service  │  • Follow getting    │  • Ask a question       │    │
│  │    catalogue       │    started guide     │    (GitHub Issue)       │    │
│  │  • Check what's    │  • Request an        │  • Request new feature  │    │
│  │    available       │    environment       │    (GitHub Issue)       │    │
│  │  • Understand      │  • Deploy first      │  • Report a problem    │    │
│  │    guardrails      │    workload          │    (GitHub Issue)       │    │
│  │                    │                      │                         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    │  Feedback loop                          │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                GitHub Issues (structured templates)                   │    │
│  │                                                                     │    │
│  │  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │    │
│  │  │   question.yml  │  │ feature-request  │  │  Triage & respond │   │    │
│  │  │                 │  │     .yml         │  │  (platform team)  │   │    │
│  │  │  • Service area │  │  • Request type  │  │                   │   │    │
│  │  │  • Question     │  │  • Service area  │  │  Issues feed back │   │    │
│  │  │  • Context      │  │  • Description   │  │  into site content│   │    │
│  │  │                 │  │  • Priority      │  │  updates & new    │   │    │
│  │  │                 │  │  • Alternatives  │  │  services          │   │    │
│  │  └─────────────────┘  └──────────────────┘  └──────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## How to collect information for your catalogue

The platform team needs to gather content from several sources to populate the site:

| Source | What to collect | Where it goes |
|--------|----------------|---------------|
| Service owners | Available services, SLAs, provisioning times, limits | `_services/*.md` |
| Cloud architects | Architecture decisions, Terraform module docs, best practices | `_services/*.md`, `getting-started.md` |
| Security team | Guardrails, permission boundaries, compliance requirements | `_services/*.md` (Guardrails sections) |
| Existing tenants | Common questions, pain points, onboarding friction | `faq.md` |
| GitHub Issues | Feature requests, questions that indicate gaps | New service pages, FAQ updates |

### Recommended approach

1. **Start with a service audit** — list every AWS service your team currently provisions or supports
2. **Interview service owners** — for each service, capture: what it does, what's included, guardrails, and provisioning time
3. **Review past requests** — look at Slack threads, tickets, or emails to identify common questions (these become your FAQ)
4. **Document guardrails with security** — work with your security/compliance team to articulate constraints clearly
5. **Iterate via issues** — once live, let tenant questions and feature requests drive what you add next

## Repository structure

```
.
├── services.json                      # Machine-readable service catalogue (source of truth)
├── mcp-server/                        # MCP server for AI-assisted service discovery
│   ├── src/index.ts                   # Server implementation
│   ├── package.json
│   └── tsconfig.json
├── _config.yml                        # Jekyll configuration
├── _layouts/
│   └── default.html                   # GOV.UK Design System layout
├── _services/                         # Service catalogue pages (one per category)
│   ├── networking.md
│   ├── compute.md
│   ├── storage.md
│   └── security.md
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── question.yml               # Structured question template
│   │   ├── feature-request.yml        # Feature/service request template
│   │   └── config.yml                 # Issue template config
│   └── workflows/
│       └── pages.yml                  # GitHub Actions deployment
├── index.md                           # Landing page
├── getting-started.md                 # Onboarding guide
├── faq.md                             # Frequently asked questions
├── Gemfile                            # Ruby dependencies
└── README.md                          # This file
```

## Running locally

```bash
bundle install
bundle exec jekyll serve
```

Then visit http://localhost:4000/platform-services/

## Customising for your team

1. **Update `_config.yml`** — change the title, description, and URL to match your org
2. **Replace service pages** — edit files in `_services/` to reflect your actual offerings
3. **Update contacts** — edit the contact section in `index.md`
4. **Customise issue templates** — adjust the dropdowns in `.github/ISSUE_TEMPLATE/` to match your service areas
5. **Add your branding** — the layout uses the GOV.UK Design System CSS; adjust colours or add your department's logo in `_layouts/default.html`

## MCP Server

An MCP (Model Context Protocol) server is included so AI assistants can query the service catalogue, check guardrails, and submit provisioning requests — all without leaving the IDE.

### Use case: "I need an S3 bucket"

A developer on the Payments team needs an S3 bucket for storing transaction receipts. Here's what happens when they ask their AI assistant:

```
Developer: "I need an S3 bucket for my team to store PDF receipts. 
            It needs to be in production with versioning."

AI Assistant: [calls check_service_compatibility]
              → Checks guardrails: "S3 buckets are private by default — no public access" ✓
              → No conflicts with your requirements
              → Notes: encryption at rest enabled by default, bucket policy scoped to your team

AI Assistant: "S3 is available and your requirements are compatible with platform 
              guardrails. Provisioning takes ~2 minutes. Shall I submit the request?"

Developer: "Yes, go ahead."

AI Assistant: [calls request_service]
              → Creates GitHub Issue: "[Request]: S3 for payments-team (production)"
              → Issue includes: service details, guardrails, team, environment, description

AI Assistant: "Done. Request submitted: https://github.com/.../issues/4
              The platform team will provision it — expected time ~2 minutes once approved."
```

**Without MCP**, that same developer would need to:
1. Open the platform services website
2. Find the storage page, read about S3
3. Check guardrails manually
4. Navigate to GitHub Issues
5. Fill in the form template from scratch
6. Wait and hope they didn't miss a constraint

**With MCP**, the AI assistant handles discovery, compliance checking, and request submission in one conversation. The developer never leaves their terminal.

### How it works

```
┌─────────────────────────────────────────────────────────────┐
│  Developer's IDE / Terminal                                  │
│                                                             │
│  "I need an S3 bucket for storing receipts"                 │
│       │                                                     │
│       ▼                                                     │
│  ┌─────────────────────────────────────┐                    │
│  │  AI Assistant (Claude Code, etc.)   │                    │
│  │                                     │                    │
│  │  1. check_service_compatibility     │◄──┐               │
│  │     → "Are there guardrail issues?" │   │               │
│  │                                     │   │  MCP Protocol  │
│  │  2. request_service                 │   │  (stdio)       │
│  │     → "Submit the request"          │───┘               │
│  └─────────────────────────────────────┘                    │
│                                                             │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  MCP Server (platform-services-mcp)                         │
│                                                             │
│  ┌───────────────┐  ┌─────────────────┐  ┌──────────────┐  │
│  │ services.json │  │ Guardrail logic │  │ gh CLI       │  │
│  │ (catalogue)   │──│ (compatibility  │──│ (issue       │  │
│  │               │  │  checking)      │  │  creation)   │  │
│  └───────────────┘  └─────────────────┘  └──────┬───────┘  │
│                                                  │          │
└──────────────────────────────────────────────────┼──────────┘
                                                   │
                                                   ▼
┌─────────────────────────────────────────────────────────────┐
│  GitHub                                                     │
│                                                             │
│  Issue #4: "[Request]: S3 for payments-team (production)"   │
│  Labels: enhancement                                        │
│  Body: service details, guardrails, description             │
│                                                             │
│       │                                                     │
│       ▼                                                     │
│  Platform team triages → provisions → notifies developer    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Available tools

| Tool | Description |
|------|-------------|
| `list_services` | List all services, optionally filtered by category |
| `get_service_details` | Get details on a specific service (guardrails, provisioning time) |
| `get_guardrails` | List all guardrails/constraints, optionally by category |
| `check_service_compatibility` | Check if requirements conflict with guardrails before requesting |
| `request_service` | Submit a provisioning request (creates a GitHub Issue via `gh` CLI) |
| `how_to_request` | Get instructions for manual requests |
| `get_team_contacts` | Get platform team contact information |

### Setup

```bash
cd mcp-server
npm install
npm run build
```

### Add to Claude Code

Add to your `.claude/settings.json` or project settings:

```json
{
  "mcpServers": {
    "platform-services": {
      "command": "node",
      "args": ["/path/to/platform-services/mcp-server/dist/index.js"]
    }
  }
}
```

### Prerequisites for `request_service`

The `request_service` tool uses the GitHub CLI (`gh`) to create issues. The machine running the MCP server needs:
- `gh` installed and authenticated (`gh auth login`)
- Write access to the `bv90dsit/platform-services` repository

If `gh` is not available, the tool gracefully falls back to providing the manual request URL and pre-filled details.

### Data source

The MCP server reads from `services.json` at the repository root. To add or update services, edit that file — no code changes needed. The structure is:

```json
{
  "categories": [
    {
      "id": "storage",
      "name": "Storage & Data",
      "services": [
        {
          "id": "s3",
          "name": "S3",
          "description": "Object storage with encryption at rest",
          "status": "available",
          "provisioning_time": "2 minutes",
          "guardrails": ["S3 buckets are private by default — no public access"]
        }
      ]
    }
  ]
}
```

## Contributing

Content changes are made via pull request. Edit the relevant Markdown file, push a branch, and open a PR. The site rebuilds automatically on merge to `main`.
