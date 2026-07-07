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
├── _config.yml                        # Jekyll configuration
├── _layouts/
│   └── default.html                   # GOV.UK Design System layout
├── _services/                         # Service catalogue (one file per category)
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

An MCP (Model Context Protocol) server is included so AI assistants can query the service catalogue programmatically.

### Available tools

| Tool | Description |
|------|-------------|
| `list_services` | List all services, optionally filtered by category |
| `get_service_details` | Get details on a specific service (guardrails, provisioning time) |
| `get_guardrails` | List all guardrails/constraints, optionally by category |
| `how_to_request` | Get instructions for requesting a service or asking a question |
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

### Data source

The MCP server reads from `services.json` at the repository root. Update that file to change what the server exposes — no code changes needed for content updates.

## Contributing

Content changes are made via pull request. Edit the relevant Markdown file, push a branch, and open a PR. The site rebuilds automatically on merge to `main`.
