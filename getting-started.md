---
layout: default
title: Getting Started
---

<h1 class="govuk-heading-xl">Getting started</h1>

<p class="govuk-body-l">This guide walks you through onboarding your team to the platform.</p>

<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

<h2 class="govuk-heading-l">Prerequisites</h2>

<p class="govuk-body">Before you begin, make sure you have:</p>

<ul class="govuk-list govuk-list--bullet">
  <li>A team or service name registered with the organisation</li>
  <li>An AWS account allocated to your team (request one if you don't have it)</li>
  <li>Access to the organisation's GitHub org</li>
</ul>

<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

<h2 class="govuk-heading-l">Step 1: Request an environment</h2>

<p class="govuk-body">Raise a <a href="https://github.com/bv90dsit/platform-services/issues/new?template=feature-request.yml" class="govuk-link">feature request</a> specifying:</p>

<ul class="govuk-list govuk-list--bullet">
  <li>Your team/service name</li>
  <li>Which environment(s) you need (dev, staging, production)</li>
  <li>The services you require</li>
</ul>

<p class="govuk-body">We'll provision your environment and grant access within 1 working day.</p>

<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

<h2 class="govuk-heading-l">Step 2: Access your environment</h2>

<p class="govuk-body">Once provisioned, you'll receive:</p>

<ul class="govuk-list govuk-list--bullet">
  <li>AWS account ID and role ARN for CLI/console access</li>
  <li>A Terraform module repository with your infrastructure-as-code</li>
  <li>Access to shared monitoring dashboards</li>
</ul>

<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

<h2 class="govuk-heading-l">Step 3: Deploy your first workload</h2>

<p class="govuk-body">Use the provided Terraform modules to deploy infrastructure:</p>

```bash
# Clone your team's infrastructure repo
git clone https://github.com/bv90dsit/platform-infra-<your-team>.git

# Initialise Terraform
cd platform-infra-<your-team>
terraform init

# Plan and apply
terraform plan
terraform apply
```

<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

<h2 class="govuk-heading-l">Step 4: Set up CI/CD</h2>

<p class="govuk-body">We provide pipeline templates for common patterns:</p>

<ul class="govuk-list govuk-list--bullet">
  <li>GitHub Actions workflows for Terraform</li>
  <li>Container build and deploy pipelines</li>
  <li>Lambda deployment automation</li>
</ul>

<p class="govuk-body">See the pipeline templates in your provisioned repository.</p>

<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

<h2 class="govuk-heading-l">Need help?</h2>

<p class="govuk-body">If you get stuck at any point:</p>

<ul class="govuk-list govuk-list--bullet">
  <li>Check the <a href="{{ site.baseurl }}/faq/" class="govuk-link">FAQ</a></li>
  <li><a href="https://github.com/bv90dsit/platform-services/issues/new?template=question.yml" class="govuk-link">Ask a question</a></li>
</ul>
