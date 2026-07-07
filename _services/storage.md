---
layout: default
title: Storage & Data
nav_order: 3
---

<h1 class="govuk-heading-xl">Storage & Data</h1>

<p class="govuk-body-l">Managed storage and database services for your applications.</p>

<h2 class="govuk-heading-l">Available services</h2>

| Service | Description | Provisioning time |
|---------|-------------|-------------------|
| S3 | Object storage with encryption at rest | ~2 minutes |
| RDS | Managed relational databases (PostgreSQL, MySQL) | ~15 minutes |
| DynamoDB | Serverless NoSQL database | ~5 minutes |
| EFS | Shared file system for containers and EC2 | ~5 minutes |

<h2 class="govuk-heading-l">What's included</h2>

<ul class="govuk-list govuk-list--bullet">
  <li>Encryption at rest and in transit by default</li>
  <li>Automated backups with configurable retention</li>
  <li>Multi-AZ deployment for production workloads</li>
  <li>IAM-based access control (no shared credentials)</li>
  <li>Monitoring and alerting on storage capacity and performance</li>
</ul>

<h2 class="govuk-heading-l">Guardrails</h2>

<ul class="govuk-list govuk-list--bullet">
  <li>S3 buckets are private by default — no public access</li>
  <li>RDS instances must be in private subnets</li>
  <li>Database credentials managed via Secrets Manager</li>
  <li>Backup retention minimum: 7 days (production), 1 day (non-production)</li>
  <li>Cross-region replication available on request</li>
</ul>

<a href="https://github.com/bv90dsit/platform-services/issues/new?template=feature-request.yml" role="button" draggable="false" class="govuk-button" data-module="govuk-button">Request storage services</a>
