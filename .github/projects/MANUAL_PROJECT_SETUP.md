# CARE Demo Platform - Manual GitHub Project Setup Guide

This comprehensive guide will walk you through manually setting up a GitHub project for the CARE demo platform development, including all custom fields, views, automation rules, and workflows.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Creating the GitHub Project](#creating-the-github-project)
3. [Setting Up Custom Fields](#setting-up-custom-fields)
4. [Creating Project Views](#creating-project-views)
5. [Configuring Automation Rules](#configuring-automation-rules)
6. [Setting Up Issue Templates](#setting-up-issue-templates)
7. [Configuring GitHub Actions](#configuring-github-actions)
8. [Project Workflow Setup](#project-workflow-setup)
9. [Team Collaboration Setup](#team-collaboration-setup)
10. [Monitoring and Reporting](#monitoring-and-reporting)
11. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools

- GitHub account with project management permissions
- GitHub CLI (optional but recommended)
- Access to the CARE demo repository

### Required Permissions

- Repository admin or maintainer access
- Organization project creation permissions (if applicable)
- GitHub Actions permissions

## Creating the GitHub Project

### Step 1: Create New Project

1. Navigate to your GitHub repository: `https://github.com/[username]/care-demo`
2. Click on the **Projects** tab
3. Click **New project**
4. Select **Table** or **Board** layout (we'll create multiple views later)
5. Enter project details:
   - **Name**: `CARE Demo Platform Development`
   - **Description**: `Community Acceptance Research and Evaluation (CARE) Demo Platform - A comprehensive web platform for analyzing and simulating community acceptance of policy interventions`
   - **Visibility**: Public (or Private based on your needs)

### Step 2: Save Project ID

After creating the project, note the project ID from the URL:

```
https://github.com/users/[username]/projects/[PROJECT_ID]
```

Create a file `.github/project-id.txt` with:

```
PROJECT_ID=[your-project-id]
```

## Setting Up Custom Fields

### Priority Field

1. Go to your project settings
2. Click **Add field** → **Single select**
3. Configure:
   - **Field name**: `Priority`
   - **Options**:
     - `🔴 Critical` (Blocking other work or critical path)
     - `🟠 High` (Important for milestone completion)
     - `🟡 Medium` (Important but not blocking)
     - `🟢 Low` (Nice to have)
   - **Required**: Yes

### Effort Field

1. Click **Add field** → **Number**
2. Configure:
   - **Field name**: `Effort`
   - **Description**: `Estimated hours of work`
   - **Required**: No

### Milestone Field

1. Click **Add field** → **Single select**
2. Configure:
   - **Field name**: `Milestone`
   - **Options**:
     - `0 - Foundation` (Project foundation and DevOps)
     - `1 - MVP Core` (Core simulation functionality)
     - `2 - Feature Expansion` (User features and geographic selection)
     - `3 - Complete Flow` (User feedback and reporting)
     - `4 - Polish` (Security, accessibility, and production)
   - **Required**: Yes

### Status Field

1. Click **Add field** → **Single select**
2. Configure:
   - **Field name**: `Status`
   - **Options**:
     - `📋 Backlog` (Not started)
     - `🔄 In Progress` (Currently being worked on)
     - `👀 Review` (Ready for review)
     - `✅ Done` (Completed)
     - `⏸️ Blocked` (Blocked by dependencies)
   - **Required**: Yes

### Type Field

1. Click **Add field** → **Single select**
2. Configure:
   - **Field name**: `Type`
   - **Options**:
     - `🏗️ Infrastructure` (DevOps, CI/CD, deployment)
     - `⚙️ Backend` (API, database, business logic)
     - `🎨 Frontend` (UI components, user experience)
     - `🧪 Testing` (Unit, integration, e2e tests)
     - `📚 Documentation` (User guides, technical docs)
     - `🔒 Security` (Security, accessibility, compliance)
   - **Required**: Yes

## Creating Project Views

### 1. Milestone Overview View

1. Click **+ Add view** → **Board**
2. Configure:
   - **Name**: `📋 Milestone Overview`
   - **Description**: `High-level view of all milestones and their progress`
   - **Group by**: `Milestone`
   - **Sort by**: `Priority`
   - **Filter**: `is:open`

### 2. Milestone 0: Foundation View

1. Click **+ Add view** → **Board**
2. Configure:
   - **Name**: `🚀 Milestone 0: Foundation`
   - **Description**: `Project foundation and DevOps setup`
   - **Group by**: `Status`
   - **Sort by**: `Priority`
   - **Filter**: `milestone:0 is:open`

### 3. Milestone 1: MVP Core View

1. Click **+ Add view** → \*\*Board`
2. Configure:
   - **Name**: `⚡ Milestone 1: MVP Core`
   - **Description**: `Core simulation and visualization functionality`
   - **Group by**: `Status`
   - **Sort by**: `Priority`
   - **Filter**: `milestone:1 is:open`

### 4. Milestone 2: Feature Expansion View

1. Click **+ Add view** → \*\*Board`
2. Configure:
   - **Name**: `🔧 Milestone 2: Feature Expansion`
   - **Description**: `User features and geographic selection`
   - **Group by**: `Status`
   - **Sort by**: `Priority`
   - **Filter**: `milestone:2 is:open`

### 5. Milestone 3: Complete Flow View

1. Click **+ Add view** → \*\*Board`
2. Configure:
   - **Name**: `📊 Milestone 3: Complete Flow`
   - **Description**: `User feedback and reporting`
   - **Group by**: `Status`
   - **Sort by**: `Priority`
   - **Filter**: `milestone:3 is:open`

### 6. Milestone 4: Polish View

1. Click **+ Add view** → \*\*Board`
2. Configure:
   - **Name**: `✨ Milestone 4: Polish`
   - **Description**: `Security, accessibility, and production readiness`
   - **Group by**: `Status`
   - **Sort by**: `Priority`
   - **Filter**: `milestone:4 is:open`

### 7. High Priority Issues View

1. Click **+ Add view** → \*\*Table`
2. Configure:
   - **Name**: `🔥 High Priority Issues`
   - **Description**: `All high priority issues across milestones`
   - **Group by**: `None`
   - **Sort by**: `Created`
   - **Filter**: `label:priority:high is:open`

### 8. Assignee View

1. Click **+ Add view** → \*\*Board`
2. Configure:
   - **Name**: `👥 Assignee View`
   - **Description**: `Issues organized by assignee`
   - **Group by**: `Assignee`
   - **Sort by**: `Priority`
   - **Filter**: `is:open`

### 9. By Labels View

1. Click **+ Add view** → \*\*Board`
2. Configure:
   - **Name**: `🏷️ By Labels`
   - **Description**: `Issues organized by labels`
   - **Group by**: `Labels`
   - **Sort by**: `Priority`
   - **Filter**: `is:open`

## Configuring Automation Rules

### Auto-assign Milestone Rule

1. Go to project settings → **Automation**
2. Click **Add rule**
3. Configure:
   - **Trigger**: `Issue opened`
   - **Action**: `Set field`
   - **Field**: `Milestone`
   - **Value**: Based on issue number:
     - Issues 1-4: `0 - Foundation`
     - Issues 5-8: `1 - MVP Core`
     - Issues 9-12: `2 - Feature Expansion`
     - Issues 13-16: `3 - Complete Flow`
     - Issues 17-21: `4 - Polish`

### Auto-assign Priority Rule

1. Click **Add rule**
2. Configure:
   - **Trigger**: `Issue opened`
   - **Action**: `Set field`
   - **Field**: `Priority`
   - **Value**: Based on issue number:
     - High priority: Issues 1,2,3,4,5,6,9,10,13,17,19,20
     - Medium priority: Issues 7,11,12,15,16
     - Low priority: All others

### Auto-assign Type Rule

1. Click \*\*Add rule`
2. Configure:
   - **Trigger**: `Issue labeled`
   - **Action**: `Set field`
   - **Field**: `Type`
   - **Value**: Based on labels:
     - `infrastructure` → `🏗️ Infrastructure`
     - `backend` → `⚙️ Backend`
     - `frontend` → `🎨 Frontend`
     - `testing` → `🧪 Testing`
     - `documentation` → `📚 Documentation`
     - `security` → `🔒 Security`

### Status Update Rules

#### Move to In Progress

1. Click \*\*Add rule`
2. Configure:
   - **Trigger**: `Issue assigned`
   - **Action**: `Set field`
   - **Field**: `Status`
   - **Value**: `🔄 In Progress`

#### Move to Review

1. Click \*\*Add rule`
2. Configure:
   - **Trigger**: `Pull request opened`
   - **Action**: `Set field`
   - **Field**: `Status`
   - **Value**: `👀 Review`

#### Move to Done

1. Click \*\*Add rule`
2. Configure:
   - **Trigger**: `Pull request merged`
   - **Action**: `Set field`
   - **Field**: `Status`
   - **Value**: `✅ Done`

## Setting Up Issue Templates

### Bug Report Template

Create `.github/ISSUE_TEMPLATE/bug_report.md`:

```markdown
---
name: Bug Report
about: Create a report to help us improve
title: "[BUG] "
labels: ["bug", "priority:medium"]
assignees: ""
---

## Bug Description

A clear and concise description of what the bug is.

## Steps to Reproduce

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior

A clear and concise description of what you expected to happen.

## Actual Behavior

A clear and concise description of what actually happened.

## Screenshots

If applicable, add screenshots to help explain your problem.

## Environment

- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 1.0.0]

## Additional Context

Add any other context about the problem here.
```

### Feature Request Template

Create `.github/ISSUE_TEMPLATE/feature_request.md`:

```markdown
---
name: Feature Request
about: Suggest an idea for this project
title: "[FEATURE] "
labels: ["enhancement", "priority:low"]
assignees: ""
---

## Feature Description

A clear and concise description of the feature you'd like to see implemented.

## Problem Statement

Is your feature request related to a problem? Please describe.
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

## Proposed Solution

Describe the solution you'd like to see implemented.

## Alternatives Considered

Describe any alternative solutions or features you've considered.

## Additional Context

Add any other context or screenshots about the feature request here.
```

### Development Task Template

Create `.github/ISSUE_TEMPLATE/development_task.md`:

```markdown
---
name: Development Task
about: Template for development tasks
title: "[TASK] "
labels: ["task", "priority:medium"]
assignees: ""
---

## Task Description

A clear and concise description of the task to be completed.

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Technical Requirements

- Requirement 1
- Requirement 2
- Requirement 3

## Implementation Details

Describe the implementation approach and any technical considerations.

## Definition of Done

- [ ] Code is implemented and tested
- [ ] Documentation is updated
- [ ] Tests are written and passing
- [ ] Code review is completed

## Additional Context

Add any other context about the task here.
```

## Configuring GitHub Actions

### Project Management Workflow

Create `.github/workflows/project-management.yml`:

```yaml
name: Project Management

on:
  issues:
    types: [opened, closed, labeled, unlabeled, assigned, unassigned]
  pull_request:
    types: [opened, closed, merged, assigned, unassigned]

jobs:
  update-project:
    runs-on: ubuntu-latest
    steps:
      - name: Update project
        uses: actions/github-script@v6
        with:
          script: |
            const { data: project } = await github.rest.projects.get({
              owner: context.repo.owner,
              project_id: process.env.PROJECT_ID,
            });

            // Add issue to project if opened
            if (context.eventName === 'issues' && context.payload.action === 'opened') {
              await github.rest.projects.addCollaborator({
                project_id: process.env.PROJECT_ID,
                username: context.payload.issue.user.login,
              });
            }
```

### Automated Testing Workflow

Create `.github/workflows/test.yml`:

```yaml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Run linting
        run: npm run lint
```

## Project Workflow Setup

### Development Workflow

1. **Create Issue**: Use appropriate template
2. **Assign to Milestone**: Based on issue number (automated)
3. **Assign to Team Member**: Triggers "In Progress" status
4. **Create Branch**: `git checkout -b feature/issue-{number}-{description}`
5. **Implement Changes**: Follow coding standards
6. **Create Pull Request**: Links to issue automatically
7. **Code Review**: Triggers "Review" status
8. **Merge PR**: Triggers "Done" status

### Branch Naming Convention

- `feature/issue-{number}-{description}` - New features
- `bugfix/issue-{number}-{description}` - Bug fixes
- `hotfix/issue-{number}-{description}` - Critical fixes
- `chore/issue-{number}-{description}` - Maintenance tasks

### Commit Message Convention

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Team Collaboration Setup

### Team Roles and Permissions

1. **Project Admin**: Full project management access
2. **Maintainer**: Can manage issues and PRs
3. **Developer**: Can create issues and PRs
4. **Reviewer**: Can review PRs

### Communication Channels

1. **GitHub Issues**: Technical discussions
2. **GitHub Discussions**: General project discussions
3. **Slack/Teams**: Real-time communication
4. **Email**: Formal notifications

### Meeting Cadence

- **Daily Standups**: 15 minutes, progress updates
- **Sprint Planning**: Every 2 weeks, milestone planning
- **Retrospectives**: End of each milestone
- **Code Reviews**: As needed, within 24 hours

## Monitoring and Reporting

### Key Metrics to Track

1. **Velocity**: Issues completed per sprint
2. **Cycle Time**: Time from issue creation to completion
3. **Lead Time**: Time from issue creation to start
4. **Burndown**: Remaining work over time
5. **Quality Metrics**: Bug rate, test coverage

### Reporting Dashboard

Create a project insights view:

1. Go to project → **Insights**
2. Configure metrics:
   - Issues by status
   - Issues by milestone
   - Issues by assignee
   - Burndown chart
   - Cycle time analysis

### Weekly Reports

Generate weekly reports including:

- Completed issues
- In-progress issues
- Blocked issues
- Upcoming milestones
- Team velocity
- Risk assessment

## Troubleshooting

### Common Issues

#### Project Not Appearing

- Check repository permissions
- Verify project visibility settings
- Ensure you're in the correct organization

#### Automation Rules Not Working

- Verify rule configuration
- Check field names match exactly
- Ensure triggers are properly set
- Test with a sample issue

#### Views Not Updating

- Refresh the page
- Check filter syntax
- Verify field values
- Clear browser cache

#### GitHub Actions Failing

- Check workflow syntax
- Verify repository secrets
- Review action permissions
- Check GitHub API rate limits

### Getting Help

1. Check GitHub documentation
2. Review project settings
3. Contact GitHub support
4. Ask team members
5. Check community forums

## Next Steps

After completing the manual setup:

1. **Test the Setup**: Create a test issue to verify automation
2. **Train the Team**: Walk through the workflow with team members
3. **Customize Views**: Adjust views based on team preferences
4. **Set Up Notifications**: Configure email/Slack notifications
5. **Monitor Performance**: Track metrics and adjust as needed

## Maintenance

### Regular Tasks

- **Weekly**: Review project metrics and adjust automation
- **Monthly**: Update issue templates and workflows
- **Quarterly**: Review and optimize project structure
- **Annually**: Evaluate project management tools and processes

### Updates and Improvements

- Monitor GitHub feature updates
- Gather team feedback on workflow
- Implement process improvements
- Share best practices with other teams

---

**Note**: This manual setup guide provides comprehensive instructions for setting up a GitHub project. Some features may vary based on your GitHub plan and organization settings. Always test configurations in a development environment before applying to production projects.
