# Platform Services

A GOV.UK-styled GitHub Pages site for platform teams to publish their AWS service catalogue and enable tenants to self-serve.

**Live site:** https://bv90dsit.github.io/platform-services/

## Purpose

This repository provides:

- A discoverable catalogue of AWS services with guardrails and SLAs
- GitHub Issue templates for tenants to ask questions or request services
- An MCP server so AI assistants can query and request services programmatically

## MCP Server

The MCP server gives AI assistants (Claude Code, Copilot, etc.) access to the service catalogue. Three use cases:

| Need | Tool | What happens |
|------|------|-------------|
| "Does X exist?" | `list_services` / `get_service_details` | Queries the catalogue |
| "Provision X for me" | `check_service_compatibility` → `request_service` | Checks guardrails, creates a GitHub Issue |
| "I need something new" | `request_new_service` | Creates issue with `new-service-proposal` label for architecture review |

Both `request_service` and `request_new_service` produce issues matching the same format as the web form — the platform team sees one queue regardless of entry point.

### Example: "I need an S3 bucket"

```
Developer: "I need an S3 bucket for storing PDF receipts in production"

AI: Checking... S3 is available. Buckets are private by default ✓
    No guardrail conflicts. Shall I submit the request?

Developer: "Yes"

AI: Done. Issue created: github.com/.../issues/5
    Expected provisioning time: ~2 minutes once approved.
```

### Setup

```bash
cd mcp-server
npm install
npm run build
```

Add to `.claude/settings.json`:

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

Requires `gh` CLI authenticated with write access to this repo for issue creation. Falls back to providing the manual URL if `gh` is unavailable.

### Data source

The MCP server reads from `services.json` at the repo root. Update that file to change what's exposed — no code changes needed.

## Repository structure

```
.
├── services.json              # Machine-readable service catalogue (source of truth)
├── mcp-server/                # MCP server for AI-assisted access
│   └── src/index.ts
├── _services/                 # Service pages (networking, compute, storage, security)
├── _layouts/default.html      # GOV.UK Design System layout
├── .github/
│   ├── ISSUE_TEMPLATE/        # Question + feature request forms
│   └── workflows/pages.yml    # GitHub Actions deployment
├── index.md                   # Landing page
├── getting-started.md         # Onboarding guide
└── faq.md                     # FAQ
```

## Running locally

```bash
bundle install
bundle exec jekyll serve
```

Visit http://localhost:4000/platform-services/

## Customising

1. Edit `services.json` to reflect your actual offerings (drives both the MCP server and can drive the site)
2. Update `_services/*.md` with your service descriptions and guardrails
3. Edit `index.md` contact section with your team details
4. Adjust `.github/ISSUE_TEMPLATE/` dropdowns to match your service areas

## Contributing

Edit the relevant Markdown file, push a branch, open a PR. The site rebuilds on merge to `main`.
