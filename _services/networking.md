---
layout: default
title: Networking
nav_order: 1
parent: Services
---

# Networking

Managed networking services to connect your workloads securely.

## Available services

| Service | Description | Provisioning time |
|---------|-------------|-------------------|
| VPC | Isolated virtual networks with standard CIDR allocation | ~5 minutes |
| Transit Gateway | Cross-VPC and on-premises connectivity | ~15 minutes |
| Route53 | DNS management (public and private zones) | ~2 minutes |
| CloudFront | CDN for static assets and API acceleration | ~10 minutes |

## What's included

- Pre-configured VPCs with public/private subnet tiers
- Centralised egress via NAT Gateways
- DNS delegation for your service domains
- Network firewall rules aligned to security policy
- VPC flow logs enabled by default

## Guardrails

- CIDR ranges are allocated centrally to avoid conflicts
- Direct internet ingress requires WAF attachment
- Cross-account peering must go through Transit Gateway
- All traffic is logged and retained for 90 days

## How to request

[Request networking services](https://github.com/bv90dsit/platform-services/issues/new?template=feature-request.yml){: .btn .btn-primary }
