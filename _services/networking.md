---
layout: default
title: Networking
nav_order: 1
---

<h1 class="govuk-heading-xl">Networking</h1>

<p class="govuk-body-l">Managed networking services to connect your workloads securely.</p>

<h2 class="govuk-heading-l">Available services</h2>

| Service | Description | Provisioning time |
|---------|-------------|-------------------|
| VPC | Isolated virtual networks with standard CIDR allocation | ~5 minutes |
| Transit Gateway | Cross-VPC and on-premises connectivity | ~15 minutes |
| Route53 | DNS management (public and private zones) | ~2 minutes |
| CloudFront | CDN for static assets and API acceleration | ~10 minutes |

<h2 class="govuk-heading-l">What's included</h2>

<ul class="govuk-list govuk-list--bullet">
  <li>Pre-configured VPCs with public/private subnet tiers</li>
  <li>Centralised egress via NAT Gateways</li>
  <li>DNS delegation for your service domains</li>
  <li>Network firewall rules aligned to security policy</li>
  <li>VPC flow logs enabled by default</li>
</ul>

<h2 class="govuk-heading-l">Guardrails</h2>

<ul class="govuk-list govuk-list--bullet">
  <li>CIDR ranges are allocated centrally to avoid conflicts</li>
  <li>Direct internet ingress requires WAF attachment</li>
  <li>Cross-account peering must go through Transit Gateway</li>
  <li>All traffic is logged and retained for 90 days</li>
</ul>

<a href="https://github.com/bv90dsit/platform-services/issues/new?template=feature-request.yml" role="button" draggable="false" class="govuk-button" data-module="govuk-button">Request networking services</a>
