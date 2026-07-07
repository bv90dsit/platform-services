---
layout: default
title: Compute
nav_order: 2
---

<h1 class="govuk-heading-xl">Compute</h1>

<p class="govuk-body-l">Managed compute services to run your applications at scale.</p>

<h2 class="govuk-heading-l">Available services</h2>

| Service | Description | Provisioning time |
|---------|-------------|-------------------|
| ECS (Fargate) | Serverless containers — no infrastructure to manage | ~5 minutes |
| EKS | Managed Kubernetes clusters | ~20 minutes |
| Lambda | Event-driven serverless functions | ~2 minutes |
| EC2 | Virtual machines (for workloads that need them) | ~10 minutes |

<h2 class="govuk-heading-l">What's included</h2>

<ul class="govuk-list govuk-list--bullet">
  <li>Pre-hardened AMIs and container base images</li>
  <li>Auto-scaling configured by default</li>
  <li>Integration with centralised logging and monitoring</li>
  <li>CI/CD pipeline templates for each compute type</li>
  <li>Cost allocation tags applied automatically</li>
</ul>

<h2 class="govuk-heading-l">Guardrails</h2>

<ul class="govuk-list govuk-list--bullet">
  <li>EC2 instances must use approved AMIs</li>
  <li>Containers run as non-root by default</li>
  <li>Lambda functions have a 15-minute timeout maximum</li>
  <li>Instance types are limited to approved families (cost control)</li>
  <li>All compute must reside in private subnets</li>
</ul>

<a href="https://github.com/bv90dsit/platform-services/issues/new?template=feature-request.yml" role="button" draggable="false" class="govuk-button" data-module="govuk-button">Request compute services</a>
