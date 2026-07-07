---
layout: default
title: Storage & Data
nav_order: 3
parent: Services
---

# Storage & Data

Managed storage and database services for your applications.

## Available services

| Service | Description | Provisioning time |
|---------|-------------|-------------------|
| S3 | Object storage with encryption at rest | ~2 minutes |
| RDS | Managed relational databases (PostgreSQL, MySQL) | ~15 minutes |
| DynamoDB | Serverless NoSQL database | ~5 minutes |
| EFS | Shared file system for containers and EC2 | ~5 minutes |

## What's included

- Encryption at rest and in transit by default
- Automated backups with configurable retention
- Multi-AZ deployment for production workloads
- IAM-based access control (no shared credentials)
- Monitoring and alerting on storage capacity and performance

## Guardrails

- S3 buckets are private by default — no public access
- RDS instances must be in private subnets
- Database credentials managed via Secrets Manager
- Backup retention minimum: 7 days (production), 1 day (non-production)
- Cross-region replication available on request

## How to request

[Request storage services](https://github.com/bv90dsit/platform-services/issues/new?template=feature-request.yml){: .btn .btn-primary }
