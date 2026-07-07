# Platform Services

A GOV.UK-styled GitHub Pages site and multi-MCP server setup for platform teams offering AWS services.

**Live site:** https://bv90dsit.github.io/platform-services/

## What this is

- A service catalogue website for tenants to discover AWS services
- Three MCP servers demonstrating the **multi-MCP pattern** — independent servers that an AI assistant orchestrates together

## Multi-MCP Pattern

Each MCP server has a single responsibility. The AI client (Claude Code, Copilot, etc.) orchestrates across them — no server knows about the others.

```
┌──────────────────────────────────────────────────────────┐
│  AI Assistant (the orchestrator)                         │
│                                                          │
│  Decides which servers to call and in what order         │
└───────┬──────────────────┬──────────────────┬────────────┘
        │                  │                  │
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  Catalogue    │  │  Provisioner  │  │  Notifier     │
│  (mcp-server) │  │  (mcp-        │  │  (mcp-        │
│               │  │  provisioner) │  │  notifier)    │
│  • Discovery  │  │  • Provision  │  │  • Slack msg  │
│  • Guardrails │  │  • Status     │  │  • DM user    │
│  • Requests   │  │  • Inventory  │  │  • Audit log  │
└───────────────┘  └───────────────┘  └───────────────┘
        │                  │                  │
        ▼                  ▼                  ▼
   services.json     Terraform/AWS       Slack/Teams
   GitHub Issues     (simulated)         (simulated)
```

**Why this pattern (not server-to-server)?**

- The AI client maintains visibility and consent over every action
- Servers stay simple, testable, and reusable independently
- You can swap or add servers without changing existing ones
- Each server can have different auth/permissions scopes

### End-to-end example: "I need an S3 bucket"

```
Developer: "I need an S3 bucket for PDF receipts in production"

┌─ Step 1: Discovery (platform-catalogue) ─────────────────┐
│  AI calls: check_service_compatibility("s3", "PDF store") │
│  Response: S3 available, private by default ✓, no conflicts│
└───────────────────────────────────────────────────────────┘

┌─ Step 2: Provision (platform-provisioner) ────────────────┐
│  AI calls: provision_resource("s3", "payments", "prod",   │
│            {"versioning": "enabled"})                      │
│  Response: arn:aws:s3:::payments-prod-a1b2c3d4            │
│            endpoint: https://payments-prod.s3...           │
└───────────────────────────────────────────────────────────┘

┌─ Step 3: Notify (platform-notifier) ─────────────────────┐
│  AI calls: notify_channel("#platform-support",            │
│            "S3 bucket provisioned for payments (prod)")    │
│  AI calls: notify_user("developer@example.gov.uk",        │
│            "Your S3 bucket is ready: arn:aws:s3:::...")    │
└───────────────────────────────────────────────────────────┘

Developer gets: resource ARN, endpoint, and a confirmation message
Platform team gets: notification in their support channel
```

The AI decided the order. If step 1 found a guardrail conflict, it would stop and tell the developer — step 2 never runs. Each server is ignorant of the others.

## The three servers

### 1. Catalogue (`mcp-server/`)

The service catalogue — discovery, guardrail checks, and issue creation.

| Tool | Description |
|------|-------------|
| `list_services` | Browse services by category |
| `get_service_details` | Service info, guardrails, provisioning time |
| `check_service_compatibility` | Pre-flight guardrail check |
| `request_service` | Submit provisioning request (GitHub Issue) |
| `request_new_service` | Propose a service not in catalogue |
| `get_guardrails` | All constraints in one view |
| `get_team_contacts` | Contact info |

### 2. Provisioner (`mcp-provisioner/`)

Provisions infrastructure. Currently simulated — in production this would wrap Terraform Cloud or AWS SDK.

| Tool | Description |
|------|-------------|
| `provision_resource` | Create a resource (returns ARN, endpoint) |
| `get_provisioning_status` | Check resource status |
| `list_team_resources` | Inventory for a team |

### 3. Notifier (`mcp-notifier/`)

Sends notifications. Currently simulated — in production this would call Slack/Teams API.

| Tool | Description |
|------|-------------|
| `notify_channel` | Post to a channel |
| `notify_user` | DM a user |
| `get_notification_log` | View sent notifications |

## Setup

```bash
# Build all three servers
cd mcp-server && npm install && npm run build && cd ..
cd mcp-provisioner && npm install && npm run build && cd ..
cd mcp-notifier && npm install && npm run build && cd ..
```

Add to `.claude/settings.json`:

```json
{
  "mcpServers": {
    "platform-catalogue": {
      "command": "node",
      "args": ["/path/to/platform-services/mcp-server/dist/index.js"]
    },
    "platform-provisioner": {
      "command": "node",
      "args": ["/path/to/platform-services/mcp-provisioner/dist/index.js"]
    },
    "platform-notifier": {
      "command": "node",
      "args": ["/path/to/platform-services/mcp-notifier/dist/index.js"]
    }
  }
}
```

## Repository structure

```
.
├── services.json              # Service catalogue (source of truth)
├── mcp-server/                # Catalogue MCP — discovery & requests
├── mcp-provisioner/           # Provisioner MCP — infra creation
├── mcp-notifier/              # Notifier MCP — Slack/Teams messages
├── _services/                 # Jekyll service pages
├── _layouts/default.html      # GOV.UK layout
├── .github/
│   ├── ISSUE_TEMPLATE/        # Question + feature request forms
│   └── workflows/pages.yml    # GitHub Pages deployment
├── index.md                   # Landing page
├── getting-started.md         # Onboarding guide
└── faq.md                     # FAQ
```

## Running the site locally

```bash
bundle install
bundle exec jekyll serve
```

Visit http://localhost:4000/platform-services/

## Contributing

Edit Markdown files, push a branch, open a PR. Site rebuilds on merge to `main`.
