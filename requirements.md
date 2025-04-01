# Subcontractor Management System Requirements

## Overview
A feedback-based platform for internal users to evaluate and rate subcontractors. Administrators manage subcontractor profiles, while internal users provide structured feedback through questionnaires and comments, with results aggregated into a centralized view (similar to Yelp).

## Project Documentation
- [In Progress] Maintain up-to-date requirements document
- [In Progress] Update SUMMARY.md after completing each task
- [In Progress] Follow AI_RULES.md guidelines for development

## Functional Requirements

### User Management
- [Done] User registration and authentication
- [Done] Role-based access (Admin, Internal User)
- [Done] Profile management

### Subcontractor Management (Admin Only)
- [Done] Subcontractor profile creation and management
- [Done] Contact information and business details
- [Done] Service categories and specialties
- [Done] Document upload capability (certifications, licenses, etc.)
- [Done] Active/inactive status management

### Review System (Internal Users)
- [Done] Structured questionnaire for rating subcontractors
- [Done] Free-form text fields for detailed feedback
- [Done] Rating system (e.g., 1-5 stars)
- [Done] Ability to upload photos or documentation
- [Done] Edit/update review capabilities

### Feedback Aggregation
- [Done] Main view displaying aggregated ratings and reviews
- [In Progress] Filtering and sorting capabilities
- [Done] Statistical summary of ratings
- [Done] Trending analysis of subcontractor performance
- [Done] Highlight recent or notable reviews
- [Done] Weighted calculation for overall "Subcontractor Score"
- [Done] Letter grade display (A, B, C, D, or F) prominently featured on profile page
- [Done] Configurable weighting formula for administrators

### Reporting
- [To Do] Subcontractor performance dashboards
- [To Do] Review activity reports
- [To Do] Data export capabilities
- [To Do] Custom report generation

## Technical Requirements

### Frontend
- [Done] React-based responsive web application
- [Done] Material UI for consistent design
- [Done] TypeScript for type safety
- [Done] State management using React Context

### Backend
- [Done] Node.js with Express
- [Done] RESTful API architecture
- [Done] PostgreSQL database
- [Done] Sequelize ORM for database interactions
- [Done] JWT authentication

### Security
- [In Progress] Data encryption
- [Done] Secure password handling
- [Done] Role-based access control
- [In Progress] OWASP security best practices

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
- [In Progress] Intuitive user interface
- [Done] Mobile-responsive design
- [To Do] Accessibility compliance
- [To Do] Comprehensive user documentation