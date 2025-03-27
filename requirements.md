# Subcontractor Management System Requirements

## Overview
A feedback-based platform for internal users to evaluate and rate subcontractors. Administrators manage subcontractor profiles, while internal users provide structured feedback through questionnaires and comments, with results aggregated into a centralized view (similar to Yelp).

## Project Documentation
- [In Progress] Maintain up-to-date requirements document
- [In Progress] Update SUMMARY.md after completing each task
- [In Progress] Follow AI_RULES.md guidelines for development

## Functional Requirements

### User Management
- [To Do] User registration and authentication
- [To Do] Role-based access (Admin, Internal User)
- [To Do] Profile management

### Subcontractor Management (Admin Only)
- [To Do] Subcontractor profile creation and management
- [To Do] Contact information and business details
- [To Do] Service categories and specialties
- [To Do] Document upload capability (certifications, licenses, etc.)
- [To Do] Active/inactive status management

### Review System (Internal Users)
- [To Do] Structured questionnaire for rating subcontractors
- [To Do] Free-form text fields for detailed feedback
- [To Do] Rating system (e.g., 1-5 stars)
- [To Do] Ability to upload photos or documentation
- [To Do] Edit/update review capabilities

### Feedback Aggregation
- [To Do] Main view displaying aggregated ratings and reviews
- [To Do] Filtering and sorting capabilities
- [To Do] Statistical summary of ratings
- [To Do] Trending analysis of subcontractor performance
- [To Do] Highlight recent or notable reviews
- [To Do] Weighted calculation for overall "Subcontractor Score"
- [To Do] Letter grade display (A, B, C, D, or F) prominently featured on profile page
- [To Do] Configurable weighting formula for administrators

### Reporting
- [To Do] Subcontractor performance dashboards
- [To Do] Review activity reports
- [To Do] Data export capabilities
- [To Do] Custom report generation

## Technical Requirements

### Frontend
- [In Progress] React-based responsive web application
- [In Progress] Material UI for consistent design
- [In Progress] TypeScript for type safety
- [In Progress] State management using React Context or Redux

### Backend
- [In Progress] Node.js with Express
- [In Progress] RESTful API architecture
- [In Progress] PostgreSQL database
- [In Progress] Sequelize ORM for database interactions
- [In Progress] JWT authentication

### Security
- [To Do] Data encryption
- [To Do] Secure password handling
- [To Do] Role-based access control
- [To Do] OWASP security best practices

## Non-Functional Requirements

### Performance
- [To Do] Page load time under 2 seconds
- [To Do] Support for concurrent users
- [To Do] Database query optimization

### Scalability
- [To Do] Horizontal scaling capability
- [To Do] Cloud-ready architecture

### Reliability
- [To Do] 99.9% uptime
- [To Do] Automated backups
- [To Do] Error logging and monitoring

### Usability
- [To Do] Intuitive user interface
- [To Do] Mobile-responsive design
- [To Do] Accessibility compliance
- [To Do] Comprehensive user documentation