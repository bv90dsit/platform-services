---
layout: default
title: FAQ
---

<h1 class="govuk-heading-xl">Frequently asked questions</h1>

<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

<h2 class="govuk-heading-l">General</h2>

<h3 class="govuk-heading-m">Who can use the platform?</h3>

<p class="govuk-body">Any team within the organisation that needs AWS infrastructure. You'll need an allocated AWS account — if you don't have one, raise a feature request.</p>

<h3 class="govuk-heading-m">How long does it take to get set up?</h3>

<p class="govuk-body">Most environments are provisioned within 1 working day. Individual services within an existing environment are typically available in minutes.</p>

<h3 class="govuk-heading-m">Is there a cost to using the platform?</h3>

<p class="govuk-body">You pay for the AWS resources you consume. The platform tooling and support is provided centrally at no additional charge to your team.</p>

<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

<h2 class="govuk-heading-l">Technical</h2>

<h3 class="govuk-heading-m">Can I use services not listed in the catalogue?</h3>

<p class="govuk-body">Yes — raise a feature request. We'll assess whether we can support it within our guardrails. If it's a common ask, we may add it to the catalogue.</p>

<h3 class="govuk-heading-m">Can I bring my own Terraform?</h3>

<p class="govuk-body">We recommend using our modules as they include security and compliance controls. If you need something custom, talk to us first so we can ensure it meets organisational standards.</p>

<h3 class="govuk-heading-m">How do I get console access?</h3>

<p class="govuk-body">Use AWS SSO via the organisation's identity provider. Role access is scoped to your team's account(s) with least-privilege permissions.</p>

<h3 class="govuk-heading-m">What monitoring is available?</h3>

<p class="govuk-body">All environments come with:</p>

<ul class="govuk-list govuk-list--bullet">
  <li>CloudWatch metrics and alarms</li>
  <li>Centralised logging (CloudWatch Logs)</li>
  <li>Dashboards in Grafana (shared instance)</li>
  <li>Alerting via PagerDuty or Slack (configurable)</li>
</ul>

<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

<h2 class="govuk-heading-l">Support</h2>

<h3 class="govuk-heading-m">How do I report an incident?</h3>

<p class="govuk-body">For production incidents, use your team's incident process. If it's a platform issue (networking, shared services down), contact us via Slack in #platform-support.</p>

<h3 class="govuk-heading-m">What's the SLA for platform support?</h3>

<ul class="govuk-list govuk-list--bullet">
  <li>Critical (production down): 1 hour response</li>
  <li>High (degraded service): 4 hour response</li>
  <li>Normal (questions, feature requests): 1 working day</li>
</ul>

<h3 class="govuk-heading-m">Can I request a service outside working hours?</h3>

<p class="govuk-body">Self-service provisioning works 24/7. For requests requiring manual intervention, our support hours are Mon–Fri, 09:00–17:00 GMT.</p>
