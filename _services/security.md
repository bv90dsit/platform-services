---
layout: default
title: Security
nav_order: 4
---

<h1 class="govuk-heading-xl">Security</h1>

<p class="govuk-body-l">Security services to protect your workloads and meet compliance requirements.</p>

<h2 class="govuk-heading-l">Available services</h2>

| Service | Description | Provisioning time |
|---------|-------------|-------------------|
| IAM | Role-based access control and service accounts | ~5 minutes |
| GuardDuty | Threat detection and continuous monitoring | Enabled by default |
| WAF | Web application firewall for public-facing services | ~10 minutes |
| Secrets Manager | Secure storage for credentials and API keys | ~2 minutes |

<h2 class="govuk-heading-l">What's included</h2>

<ul class="govuk-list govuk-list--bullet">
  <li>Least-privilege IAM roles scoped to your workload</li>
  <li>Centralised threat detection across all accounts</li>
  <li>WAF rule sets aligned to OWASP Top 10</li>
  <li>Automatic secret rotation where supported</li>
  <li>Security Hub findings surfaced to your team</li>
</ul>

<h2 class="govuk-heading-l">Guardrails</h2>

<ul class="govuk-list govuk-list--bullet">
  <li>IAM policies are reviewed and constrained by permission boundaries</li>
  <li>Root account access is prohibited</li>
  <li>All secrets must be stored in Secrets Manager (no hardcoded credentials)</li>
  <li>WAF is mandatory for any internet-facing endpoint</li>
  <li>Security findings must be triaged within SLA (Critical: 24h, High: 72h)</li>
</ul>

<a href="https://github.com/bv90dsit/platform-services/issues/new?template=feature-request.yml" role="button" draggable="false" class="govuk-button" data-module="govuk-button">Request security services</a>
