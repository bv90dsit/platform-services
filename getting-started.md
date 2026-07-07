---
layout: default
title: Getting Started
nav_order: 2
---

# Getting Started

This guide walks you through onboarding your team to the platform.

---

## Prerequisites

Before you begin, make sure you have:

- A team or service name registered with the organisation
- An AWS account allocated to your team (request one if you don't have it)
- Access to the organisation's GitHub org

---

## Step 1: Request an environment

Raise a [feature request](https://github.com/bv90dsit/platform-services/issues/new?template=feature-request.yml) specifying:

- Your team/service name
- Which environment(s) you need (dev, staging, production)
- The services you require

We'll provision your environment and grant access within 1 working day.

---

## Step 2: Access your environment

Once provisioned, you'll receive:

- AWS account ID and role ARN for CLI/console access
- A Terraform module repository with your infrastructure-as-code
- Access to shared monitoring dashboards

---

## Step 3: Deploy your first workload

Use the provided Terraform modules to deploy infrastructure:

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

---

## Step 4: Set up CI/CD

We provide pipeline templates for common patterns:

- GitHub Actions workflows for Terraform
- Container build and deploy pipelines
- Lambda deployment automation

See the pipeline templates in your provisioned repository.

---

## Need help?

If you get stuck at any point:

- Check the [FAQ](/platform-services/faq/)
- [Ask a question](https://github.com/bv90dsit/platform-services/issues/new?template=question.yml)
