# CARE Demo Platform - GitHub Project Management

This directory contains configuration files and templates for managing the CARE demo platform development using GitHub Projects.

## Project Structure

### 📋 Project Configuration
- **`care-demo-project.yml`** - Main project configuration file defining views, fields, automation, and workflows

### 🎯 Issue Templates
- **`bug_report.md`** - Template for reporting bugs
- **`feature_request.md`** - Template for requesting new features  
- **`development_task.md`** - Template for development tasks

### 🔄 Pull Request Template
- **`PULL_REQUEST_TEMPLATE.md`** - Standard template for pull requests

## Project Views

The GitHub project includes the following views:

### 📊 Milestone Views
- **Milestone Overview** - High-level view of all milestones
- **Milestone 0: Foundation** - Project foundation and DevOps
- **Milestone 1: MVP Core** - Core simulation functionality
- **Milestone 2: Feature Expansion** - User features and geographic selection
- **Milestone 3: Complete Flow** - User feedback and reporting
- **Milestone 4: Polish** - Security, accessibility, and production

### 🔍 Specialized Views
- **High Priority Issues** - All high priority issues across milestones
- **Assignee View** - Issues organized by assignee
- **By Labels** - Issues organized by labels

## Project Fields

### 📝 Custom Fields
- **Priority** - Critical, High, Medium, Low
- **Effort** - Estimated hours of work
- **Milestone** - 0-4 milestone phases
- **Status** - Backlog, In Progress, Review, Done, Blocked
- **Type** - Infrastructure, Backend, Frontend, Testing, Documentation, Security

## Automation Rules

### 🤖 Automated Workflows
- **Auto-assign milestone** based on issue number
- **Auto-assign priority** based on issue number
- **Auto-assign type** based on labels
- **Status updates** based on assignee and PR events

## Usage Instructions

### 🚀 Setting Up the Project

1. **Create GitHub Project**
   ```bash
   # Use GitHub CLI to create project from configuration
   gh project create --title "CARE Demo Platform Development" --body "Community Acceptance Research and Evaluation Demo Platform" --public
   ```

2. **Import Issues**
   ```bash
   # Import all issues from the issues directory
   for file in .github/issues/*.md; do
     gh issue create --title "$(head -1 "$file" | sed 's/# Issue #//')" --body-file "$file"
   done
   ```

3. **Configure Project Views**
   - Go to the GitHub project
   - Add the custom fields defined in the configuration
   - Create the views as specified
   - Set up automation rules

### 📋 Creating Issues

Use the issue templates for different types of work:

```bash
# Bug report
gh issue create --template bug_report.md

# Feature request  
gh issue create --template feature_request.md

# Development task
gh issue create --template development_task.md
```

### 🔄 Workflow

1. **Create Issue** using appropriate template
2. **Assign to Milestone** (automated based on issue number)
3. **Assign to Team Member** (triggers "In Progress" status)
4. **Create Branch** and implement changes
5. **Create Pull Request** (triggers "Review" status)
6. **Merge PR** (triggers "Done" status)

## Project Management Best Practices

### 📊 Tracking Progress
- Use the milestone views to track progress by phase
- Monitor high priority issues in the dedicated view
- Check assignee view for workload distribution

### 🏷️ Labeling Strategy
- Use consistent labels for filtering and automation
- Priority labels: `priority:critical`, `priority:high`, `priority:medium`, `priority:low`
- Type labels: `infrastructure`, `backend`, `frontend`, `testing`, `documentation`, `security`

### 🔄 Status Management
- **Backlog** - New issues not yet started
- **In Progress** - Currently being worked on
- **Review** - Ready for code review
- **Done** - Completed and merged
- **Blocked** - Waiting on dependencies

### 📈 Reporting
- Use project insights to track velocity
- Monitor milestone completion rates
- Identify bottlenecks and blockers

## Integration with Development Workflow

### 🔗 GitHub Actions
The project integrates with GitHub Actions for:
- Automated testing on PR creation
- Status updates on PR events
- Deployment automation

### 📱 Notifications
- Slack integration for project updates
- Email notifications for milestone completions
- Team notifications for high priority issues

## Maintenance

### 🔄 Regular Updates
- Review and update project configuration monthly
- Update issue templates as needed
- Refine automation rules based on team feedback

### 📊 Metrics Tracking
- Track issue completion rates
- Monitor time estimates vs actual effort
- Identify process improvements

## Support

For questions about project management:
- Check the [project documentation](../README.md)
- Review the [issue organization guide](../ISSUE_ORGANIZATION.md)
- Contact the project maintainers

---

**Note**: This project configuration is designed to work with GitHub Projects (beta) and may require adjustments based on your organization's GitHub plan and permissions.
