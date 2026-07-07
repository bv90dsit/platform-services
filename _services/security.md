---
layout: default
title: Security
nav_order: 4
parent: Services
---

# Security

Security services to protect your workloads and meet compliance requirements.

## Available services

| Service | Description | Provisioning time |
|---------|-------------|-------------------|
| IAM | Role-based access control and service accounts | ~5 minutes |
| GuardDuty | Threat detection and continuous monitoring | Enabled by default |
| WAF | Web application firewall for public-facing services | ~10 minutes |
| Secrets Manager | Secure storage for credentials and API keys | ~2 minutes |

## What's included

- Least-privilege IAM roles scoped to your workload
- Centralised threat detection across all accounts
- WAF rule sets aligned to OWASP Top 10
- Automatic secret rotation where supported
- Security Hub findings surfaced to your team

## Guardrails

- IAM policies are reviewed and constrained by permission boundaries
- Root account access is prohibited
- All secrets must be stored in Secrets Manager (no hardcoded credentials)
- WAF is mandatory for any internet-facing endpoint
- Security findings must be triaged within SLA (Critical: 24h, High: 72h)

## How to request

[Request security services](https://github.com/bv90dsit/platform-services/issues/new?template=feature-request.yml){: .btn .btn-primary }
