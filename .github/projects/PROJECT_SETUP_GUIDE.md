# GitHub Project Setup Guide

This guide will help you set up a GitHub project to manage the CARE demo platform development.

## Prerequisites

### 1. GitHub CLI Installation

Install the GitHub CLI tool:

```bash
# macOS
brew install gh

# Linux (Ubuntu/Debian)
sudo apt install gh

# Windows
winget install GitHub.cli
```

### 2. GitHub Authentication

Authenticate with GitHub:

```bash
gh auth login
```

Follow the prompts to authenticate with your GitHub account.

## Automated Setup

### Quick Setup Script

Run the automated setup script:

```bash
# Make the script executable (if not already)
chmod +x .github/scripts/setup-project.sh

# Run the setup script
./.github/scripts/setup-project.sh
```

This script will:

- ✅ Check prerequisites
- ✅ Create the GitHub project
- ✅ Import all 21 issues from the issues directory
- ✅ Provide instructions for manual setup steps

## Manual Setup Steps

After running the automated script, you'll need to complete these steps manually through the GitHub UI:

### 1. Set Up Custom Fields

Go to your project and add these custom fields:

#### Priority Field

- **Type**: Single select
- **Options**:
  - 🔴 Critical
  - 🟠 High
  - 🟡 Medium
  - 🟢 Low

#### Effort Field

- **Type**: Number
- **Description**: Estimated hours of work

#### Milestone Field

- **Type**: Single select
- **Options**:
  - 0 - Foundation
  - 1 - MVP Core
  - 2 - Feature Expansion
  - 3 - Complete Flow
  - 4 - Polish

#### Status Field

- **Type**: Single select
- **Options**:
  - 📋 Backlog
  - 🔄 In Progress
  - 👀 Review
  - ✅ Done
  - ⏸️ Blocked

#### Type Field

- **Type**: Single select
- **Options**:
  - 🏗️ Infrastructure
  - ⚙️ Backend
  - 🎨 Frontend
  - 🧪 Testing
  - 📚 Documentation
  - 🔒 Security

### 2. Create Project Views

Create these views in your project:

#### Milestone Views

1. **📋 Milestone Overview**
   - Layout: Board
   - Group by: Milestone
   - Sort by: Priority
   - Filter: `is:open`

2. **🚀 Milestone 0: Foundation**
   - Layout: Board
   - Group by: Status
   - Sort by: Priority
   - Filter: `milestone:0 is:open`

3. **⚡ Milestone 1: MVP Core**
   - Layout: Board
   - Group by: Status
   - Sort by: Priority
   - Filter: `milestone:1 is:open`

4. **🔧 Milestone 2: Feature Expansion**
   - Layout: Board
   - Group by: Status
   - Sort by: Priority
   - Filter: `milestone:2 is:open`

5. **📊 Milestone 3: Complete Flow**
   - Layout: Board
   - Group by: Status
   - Sort by: Priority
   - Filter: `milestone:3 is:open`

6. **✨ Milestone 4: Polish**
   - Layout: Board
   - Group by: Status
   - Sort by: Priority
   - Filter: `milestone:4 is:open`

#### Specialized Views

7. **🔥 High Priority Issues**
   - Layout: Table
   - Group by: None
   - Sort by: Created
   - Filter: `label:priority:high is:open`

8. **👥 Assignee View**
   - Layout: Board
   - Group by: Assignee
   - Sort by: Priority
   - Filter: `is:open`

9. **🏷️ By Labels**
   - Layout: Board
   - Group by: Labels
   - Sort by: Priority
   - Filter: `is:open`

### 3. Set Up Automation Rules

Add these automation rules in your project settings:

#### Auto-assign Milestone

- **Trigger**: Issue opened
- **Action**: Set field "Milestone"
- **Value**: Based on issue number
  - Issues 1-4: "0 - Foundation"
  - Issues 5-8: "1 - MVP Core"
  - Issues 9-12: "2 - Feature Expansion"
  - Issues 13-16: "3 - Complete Flow"
  - Issues 17-21: "4 - Polish"

#### Auto-assign Priority

- **Trigger**: Issue opened
- **Action**: Set field "Priority"
- **Value**: Based on issue number
  - High priority: Issues 1,2,3,4,5,6,9,10,13,17,19,20
  - Medium priority: Issues 7,11,12,15,16
  - Low priority: All others

#### Auto-assign Type

- **Trigger**: Issue labeled
- **Action**: Set field "Type"
- **Value**: Based on labels
  - Infrastructure: `infrastructure` label
  - Backend: `backend` label
  - Frontend: `frontend` label
  - Testing: `testing` label
  - Documentation: `documentation` label
  - Security: `security` label

#### Status Updates

- **Trigger**: Issue assigned
- **Action**: Set field "Status" to "🔄 In Progress"

- **Trigger**: Pull request opened
- **Action**: Set field "Status" to "👀 Review"

- **Trigger**: Pull request merged
- **Action**: Set field "Status" to "✅ Done"

## Project Workflow

### 1. Creating Issues

Use the issue templates for different types of work:

```bash
# Bug report
gh issue create --template bug_report.md

# Feature request
gh issue create --template feature_request.md

# Development task
gh issue create --template development_task.md
```

### 2. Development Workflow

1. **Create Issue** using appropriate template
2. **Assign to Milestone** (automated)
3. **Assign to Team Member** (triggers "In Progress")
4. **Create Branch** and implement changes
5. **Create Pull Request** (triggers "Review")
6. **Merge PR** (triggers "Done")

### 3. Tracking Progress

- Use milestone views to track progress by phase
- Monitor high priority issues in the dedicated view
- Check assignee view for workload distribution

## Project Management Best Practices

### Labeling Strategy

Use consistent labels for filtering and automation:

- **Priority**: `priority:critical`, `priority:high`, `priority:medium`, `priority:low`
- **Type**: `infrastructure`, `backend`, `frontend`, `testing`, `documentation`, `security`
- **Status**: `status:backlog`, `status:in-progress`, `status:review`, `status:done`, `status:blocked`

### Status Management

- **📋 Backlog**: New issues not yet started
- **🔄 In Progress**: Currently being worked on
- **👀 Review**: Ready for code review
- **✅ Done**: Completed and merged
- **⏸️ Blocked**: Waiting on dependencies

### Reporting

- Use project insights to track velocity
- Monitor milestone completion rates
- Identify bottlenecks and blockers

## Integration with Development Workflow

### GitHub Actions

The project integrates with GitHub Actions for:

- Automated testing on PR creation
- Status updates on PR events
- Deployment automation

### Notifications

- Slack integration for project updates
- Email notifications for milestone completions
- Team notifications for high priority issues

## Troubleshooting

### Common Issues

#### Project Creation Fails

- Ensure you have the necessary permissions
- Check if you're authenticated with GitHub CLI
- Verify your GitHub plan supports projects

#### Issues Not Importing

- Check that the issues directory exists
- Verify issue files are properly formatted
- Ensure you have write permissions to the repository

#### Automation Not Working

- Verify automation rules are properly configured
- Check that field names match exactly
- Ensure triggers are set up correctly

### Getting Help

- Check the [project documentation](../README.md)
- Review the [issue organization guide](../ISSUE_ORGANIZATION.md)
- Contact the project maintainers

## Next Steps

After setting up the project:

1. **Review the Issues**: Go through all 21 issues and verify they're properly configured
2. **Assign Team Members**: Assign issues to team members based on expertise
3. **Set Up Notifications**: Configure Slack or email notifications
4. **Start Development**: Begin working on Milestone 0 issues
5. **Monitor Progress**: Use the project views to track progress

---

**Note**: This setup guide is designed for GitHub Projects (beta). Some features may vary based on your GitHub plan and organization settings.
