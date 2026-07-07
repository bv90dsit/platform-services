---
layout: default
title: FAQ
nav_order: 3
---

# Frequently Asked Questions

---

## General

### Who can use the platform?

Any team within the organisation that needs AWS infrastructure. You'll need an allocated AWS account — if you don't have one, raise a feature request.

### How long does it take to get set up?

Most environments are provisioned within 1 working day. Individual services within an existing environment are typically available in minutes.

### Is there a cost to using the platform?

You pay for the AWS resources you consume. The platform tooling and support is provided centrally at no additional charge to your team.

---

## Technical

### Can I use services not listed in the catalogue?

Yes — raise a feature request. We'll assess whether we can support it within our guardrails. If it's a common ask, we may add it to the catalogue.

### Can I bring my own Terraform?

We recommend using our modules as they include security and compliance controls. If you need something custom, talk to us first so we can ensure it meets organisational standards.

### How do I get console access?

Use AWS SSO via the organisation's identity provider. Role access is scoped to your team's account(s) with least-privilege permissions.

### What monitoring is available?

All environments come with:
- CloudWatch metrics and alarms
- Centralised logging (CloudWatch Logs)
- Dashboards in Grafana (shared instance)
- Alerting via PagerDuty or Slack (configurable)

---

## Support

### How do I report an incident?

For production incidents, use your team's incident process. If it's a platform issue (networking, shared services down), contact us via Slack in #platform-support.

### What's the SLA for platform support?

- Critical (production down): 1 hour response
- High (degraded service): 4 hour response
- Normal (questions, feature requests): 1 working day

### Can I request a service outside working hours?

Self-service provisioning works 24/7. For requests requiring manual intervention, our support hours are Mon–Fri, 09:00–17:00 GMT.
