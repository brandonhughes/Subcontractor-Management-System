# Subcontractor Management System - Architecture

## System Architecture

The Subcontractor Management System follows a modern three-tier architecture:

1. **Frontend** - Client-side React application
2. **Backend** - Node.js/Express RESTful API server
3. **Database** - PostgreSQL relational database

## Database Schema

### Core Entities

1. **Users**
   - id (PK)
   - username
   - email
   - password (hashed)
   - role (admin, internal)
   - status (active, inactive)
   - created_at
   - updated_at

2. **Subcontractors**
   - id (PK)
   - name
   - contact_name
   - email
   - phone
   - address
   - specialties (JSON array)
   - description
   - status (active, inactive)
   - created_at
   - updated_at

3. **Documents**
   - id (PK)
   - subcontractor_id (FK)
   - name
   - file_path
   - file_type
   - upload_date
   - uploader_id (FK to users)
   - created_at
   - updated_at

4. **Reviews**
   - id (PK)
   - subcontractor_id (FK)
   - reviewer_id (FK to users)
   - overall_rating (1-5)
   - comments
   - has_attachments (boolean)
   - created_at
   - updated_at

5. **ReviewAttachments**
   - id (PK)
   - review_id (FK)
   - file_path
   - file_type
   - created_at

6. **QuestionCategories**
   - id (PK)
   - name
   - description
   - weight (for scoring algorithm)
   - created_at
   - updated_at

7. **Questions**
   - id (PK)
   - category_id (FK to question_categories)
   - text
   - weight (for scoring algorithm)
   - created_at
   - updated_at

8. **ReviewResponses**
   - id (PK)
   - review_id (FK)
   - question_id (FK)
   - score (1-5)
   - created_at
   - updated_at

## API Structure

### Authentication Endpoints
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- POST /api/auth/logout

### User Endpoints
- GET /api/users
- GET /api/users/:id
- PUT /api/users/:id
- DELETE /api/users/:id

### Subcontractor Endpoints
- GET /api/subcontractors
- POST /api/subcontractors
- GET /api/subcontractors/:id
- PUT /api/subcontractors/:id
- DELETE /api/subcontractors/:id
- GET /api/subcontractors/:id/documents
- POST /api/subcontractors/:id/documents

### Review Endpoints
- GET /api/reviews
- POST /api/reviews
- GET /api/reviews/:id
- PUT /api/reviews/:id
- DELETE /api/reviews/:id
- GET /api/subcontractors/:id/reviews
- POST /api/reviews/:id/attachments

### Questions Endpoints
- GET /api/questions
- POST /api/questions
- GET /api/questions/:id
- PUT /api/questions/:id
- DELETE /api/questions/:id
- GET /api/question-categories
- POST /api/question-categories

### Reporting Endpoints
- GET /api/reports/subcontractor-performance
- GET /api/reports/review-activity
- GET /api/reports/custom

## Frontend Structure

```
/src
  /assets
  /components
    /common
    /layout
    /admin
    /internal
  /context
  /hooks
  /pages
    /admin
    /internal
    /auth
  /services
  /utils
```

## Scoring Algorithm

The scoring algorithm calculates a letter grade (A-F) based on:

1. Question responses, weighted by:
   - Individual question weight
   - Question category weight

2. Formula:
   - Calculate weighted average of all responses
   - Map to letter grade:
     - A: 90-100%
     - B: 80-89%
     - C: 70-79% 
     - D: 60-69%
     - F: Below 60%

3. Admins can configure:
   - Question weights
   - Category weights
   - Letter grade thresholds

## Authentication Flow

1. User registration with email verification
2. JWT-based authentication
3. Token refresh mechanism
4. Role-based access control

## Development Workflow

1. Initialize project structure
2. Set up development environment
3. Create database migrations
4. Implement authentication
5. Build core API endpoints
6. Develop frontend components
7. Implement scoring algorithm
8. Add reporting functionality
9. Testing and QA
10. Deployment