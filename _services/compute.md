---
layout: default
title: Compute
nav_order: 2
parent: Services
---

# Compute

Managed compute services to run your applications at scale.

## Available services

| Service | Description | Provisioning time |
|---------|-------------|-------------------|
| ECS (Fargate) | Serverless containers — no infrastructure to manage | ~5 minutes |
| EKS | Managed Kubernetes clusters | ~20 minutes |
| Lambda | Event-driven serverless functions | ~2 minutes |
| EC2 | Virtual machines (for workloads that need them) | ~10 minutes |

## What's included

- Pre-hardened AMIs and container base images
- Auto-scaling configured by default
- Integration with centralised logging and monitoring
- CI/CD pipeline templates for each compute type
- Cost allocation tags applied automatically

## Guardrails

- EC2 instances must use approved AMIs
- Containers run as non-root by default
- Lambda functions have a 15-minute timeout maximum
- Instance types are limited to approved families (cost control)
- All compute must reside in private subnets

## How to request

[Request compute services](https://github.com/bv90dsit/platform-services/issues/new?template=feature-request.yml){: .btn .btn-primary }
