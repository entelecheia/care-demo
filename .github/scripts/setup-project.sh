#!/bin/bash

# CARE Demo Platform - GitHub Project Setup Script
# This script helps set up the GitHub project for the CARE demo platform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if GitHub CLI is installed
check_gh_cli() {
    if ! command -v gh &> /dev/null; then
        print_error "GitHub CLI (gh) is not installed. Please install it first:"
        echo "  macOS: brew install gh"
        echo "  Linux: sudo apt install gh"
        echo "  Windows: winget install GitHub.cli"
        exit 1
    fi
    print_success "GitHub CLI is installed"
}

# Check if user is authenticated
check_gh_auth() {
    if ! gh auth status &> /dev/null; then
        print_error "Not authenticated with GitHub. Please run: gh auth login"
        exit 1
    fi
    
    # Check if token has required scopes
    if ! gh auth status | grep -q "project\|read:project"; then
        print_warning "GitHub token missing required scopes for project management"
        print_warning "Please run: gh auth refresh -s project,read:project"
        print_warning "Or create the project manually through GitHub UI"
        print_warning "Continuing with issue import only..."
        return 1
    fi
    
    print_success "GitHub authentication verified"
    return 0
}

# Create GitHub project
create_project() {
    print_status "Creating GitHub project..."
    
    PROJECT_TITLE="CARE Demo Platform Development"
    PROJECT_DESCRIPTION="Community Acceptance Research and Evaluation (CARE) Demo Platform - A comprehensive web platform for analyzing and simulating community acceptance of policy interventions"
    
    # Create the project
    PROJECT_ID=$(gh project create --title "$PROJECT_TITLE" --owner "@me" --format json | jq -r '.id')
    
    if [ "$PROJECT_ID" != "null" ] && [ "$PROJECT_ID" != "" ]; then
        print_success "Project created with ID: $PROJECT_ID"
        echo "PROJECT_ID=$PROJECT_ID" > .github/project-id.txt
    else
        print_error "Failed to create project"
        exit 1
    fi
}

# Import issues from the issues directory
import_issues() {
    print_status "Importing issues from .github/issues/ directory..."
    
    if [ ! -d ".github/issues" ]; then
        print_error ".github/issues directory not found"
        exit 1
    fi
    
    local count=0
    for file in .github/issues/*.md; do
        if [ -f "$file" ]; then
            # Extract issue number and title from filename and content
            filename=$(basename "$file")
            issue_number=$(echo "$filename" | grep -o '^[0-9]*')
            title=$(head -1 "$file" | sed 's/# Issue #[0-9]*: //')
            
            if [ -n "$issue_number" ] && [ -n "$title" ]; then
                print_status "Creating issue #$issue_number: $title"
                
                # Create issue without labels (labels can be added later)
                gh issue create \
                    --title "$title" \
                    --body-file "$file" || print_warning "Failed to create issue #$issue_number"
                
                ((count++))
            fi
        fi
    done
    
    print_success "Imported $count issues"
}

# Set up project fields
setup_project_fields() {
    print_status "Setting up project fields..."
    
    if [ ! -f ".github/project-id.txt" ]; then
        print_error "Project ID file not found. Please create the project first."
        exit 1
    fi
    
    PROJECT_ID=$(cat .github/project-id.txt | cut -d'=' -f2)
    
    # Note: GitHub CLI doesn't support setting custom fields yet
    # This would need to be done manually through the GitHub UI
    print_warning "Project fields need to be set up manually through GitHub UI:"
    echo "  1. Go to your project: https://github.com/users/$(gh api user --jq .login)/projects/$PROJECT_ID"
    echo "  2. Add the following custom fields:"
    echo "     - Priority (single select): 🔴 Critical, 🟠 High, 🟡 Medium, 🟢 Low"
    echo "     - Effort (number): Estimated hours"
    echo "     - Milestone (single select): 0-Foundation, 1-MVP Core, 2-Feature Expansion, 3-Complete Flow, 4-Polish"
    echo "     - Status (single select): 📋 Backlog, 🔄 In Progress, 👀 Review, ✅ Done, ⏸️ Blocked"
    echo "     - Type (single select): 🏗️ Infrastructure, ⚙️ Backend, 🎨 Frontend, 🧪 Testing, 📚 Documentation, 🔒 Security"
}

# Set up project views
setup_project_views() {
    print_status "Setting up project views..."
    
    print_warning "Project views need to be set up manually through GitHub UI:"
    echo "  1. Go to your project"
    echo "  2. Create the following views:"
    echo "     - 📋 Milestone Overview (board, grouped by milestone)"
    echo "     - 🚀 Milestone 0: Foundation (board, filtered by milestone:0)"
    echo "     - ⚡ Milestone 1: MVP Core (board, filtered by milestone:1)"
    echo "     - 🔧 Milestone 2: Feature Expansion (board, filtered by milestone:2)"
    echo "     - 📊 Milestone 3: Complete Flow (board, filtered by milestone:3)"
    echo "     - ✨ Milestone 4: Polish (board, filtered by milestone:4)"
    echo "     - 🔥 High Priority Issues (table, filtered by priority:high)"
    echo "     - 👥 Assignee View (board, grouped by assignee)"
    echo "     - 🏷️ By Labels (board, grouped by labels)"
}

# Set up automation rules
setup_automation() {
    print_status "Setting up automation rules..."
    
    print_warning "Automation rules need to be set up manually through GitHub UI:"
    echo "  1. Go to your project settings"
    echo "  2. Add the following automation rules:"
    echo "     - Auto-assign milestone based on issue number"
    echo "     - Auto-assign priority based on issue number"
    echo "     - Auto-assign type based on labels"
    echo "     - Move to In Progress when assigned"
    echo "     - Move to Review when PR created"
    echo "     - Move to Done when PR merged"
}

# Main setup function
main() {
    echo "🚀 Setting up CARE Demo Platform GitHub Project"
    echo "================================================"
    
    # Check prerequisites
    check_gh_cli
    
    # Check authentication and create project if possible
    if check_gh_auth; then
        create_project
    else
        print_warning "Skipping project creation due to missing scopes"
        print_warning "You can create the project manually at: https://github.com/users/$(gh api user --jq .login)/projects/new"
    fi
    
    # Import issues
    import_issues
    
    # Set up project configuration
    setup_project_fields
    setup_project_views
    setup_automation
    
    echo ""
    print_success "GitHub project setup completed!"
    echo ""
    echo "Next steps:"
    echo "1. Go to your project: https://github.com/users/$(gh api user --jq .login)/projects/$(cat .github/project-id.txt | cut -d'=' -f2)"
    echo "2. Set up the custom fields manually"
    echo "3. Create the project views"
    echo "4. Configure automation rules"
    echo "5. Start working on the issues!"
    echo ""
    echo "For detailed instructions, see: .github/projects/README.md"
}

# Run main function
main "$@"
