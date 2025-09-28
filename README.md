# CARE Demo Platform

A comprehensive web platform for analyzing and simulating community acceptance of policy interventions, built with React, NestJS, and PostgreSQL.

## 🎯 Overview

The CARE (Community Acceptance Research and Evaluation) Demo Platform is an interactive web application that enables policy makers to:

- **Analyze** current community acceptance levels using quantitative metrics
- **Simulate** the impact of policy interventions on community sentiment
- **Visualize** changes in community concerns across 5 key categories
- **Evaluate** policy effectiveness through structured feedback
- **Generate** comprehensive reports for stakeholder communication

### Demo Scenario: Wind Farm Development in Travis County, Texas

The platform demonstrates its capabilities through a realistic scenario: analyzing community acceptance for a proposed wind farm development in Travis County, Texas. Users can explore baseline community sentiment, test various policy interventions, and see how different approaches affect community acceptance.

## 🏗️ Architecture

### Technology Stack

- **Frontend**: React 18 + TypeScript + Next.js 14
- **Backend**: NestJS + TypeScript + Node.js 18
- **Database**: PostgreSQL 15 + PostGIS
- **Maps**: Mapbox GL JS
- **Charts**: Chart.js / D3.js
- **Styling**: Tailwind CSS
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions

### System Architecture

The platform follows a **decoupled monolith** architecture with four core modules:

- **Auth Module**: User authentication and role management
- **Policy Module**: Policy definition and parameter management
- **Simulation Module**: CAI calculation and policy impact simulation
- **Community Module**: Feedback collection and discussion management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Git

### Local Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/entelecheia/care-demo.git
   cd care-demo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development environment**

   ```bash
   # Start all services with Docker Compose
   docker-compose up -d

   # Start development servers
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/api/docs

## 📋 Project Management

The CARE demo platform uses GitHub Projects for comprehensive project management:

### 🚀 Quick Setup
```bash
# Run the automated setup script
./.github/scripts/setup-project.sh
```

### 📊 Project Views
- **Milestone Overview**: High-level progress tracking
- **Milestone-specific Views**: Detailed progress by development phase
- **Priority Views**: High-priority issues and assignee tracking
- **Label-based Views**: Issues organized by type and category

### 🤖 Automation
- **Auto-assignment**: Milestone, priority, and type based on issue number
- **Status Updates**: Automatic status changes based on assignee and PR events
- **Notifications**: Team notifications for high-priority issues

### 📝 Issue Templates
- **Bug Reports**: Standardized bug reporting
- **Feature Requests**: Structured feature proposals
- **Development Tasks**: Detailed task specifications

See [Project Setup Guide](.github/projects/PROJECT_SETUP_GUIDE.md) for detailed instructions.

## 📞 Support

- **Documentation**: [docs.care-demo.com](https://docs.care-demo.com)
- **Issues**: [GitHub Issues](https://github.com/entelecheia/care-demo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/entelecheia/care-demo/discussions)
- **Project Management**: [GitHub Project](https://github.com/entelecheia/care-demo/projects)
- **Email**: support@care-demo.com

---

**Built with ❤️ for better policy making through community engagement**