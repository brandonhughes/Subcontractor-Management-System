# Development Environment Setup

## Backend

- Environment Configuration:
  ```
  cd "/Users/brandonhughes/Subcontractor Management System/backend" && npm install
  ```

- Run Backend Server:
  ```
  cd "/Users/brandonhughes/Subcontractor Management System/backend" && npm run dev
  ```

## Frontend

- Environment Configuration:
  ```
  cd "/Users/brandonhughes/Subcontractor Management System/frontend" && npm install --legacy-peer-deps
  ```

- Run Frontend Server:
  ```
  cd "/Users/brandonhughes/Subcontractor Management System/frontend" && npm start
  ```

## PostgreSQL Database Configuration

- Current Configuration:
  - Host: localhost
  - Port: 5432
  - Database: subcontractor_management
  - Username: brandonhughes
  - Password: (none required)
  
- Status: Database connected successfully
  - Database created
  - Migrations completed
  - Seed data added (admin user, 3 subcontractors, question categories)
  
- PostgreSQL Location:
  - Postgres.app: /Applications/Postgres.app
  - Binary Directory: /Applications/Postgres.app/Contents/Versions/17/bin
  
- Demo Data:
  - Admin User: admin@example.com / password
  - Regular User: user1@example.com / password
  - Sample Subcontractors: ABC Electrical, XYZ Plumbing, Acme Construction
  - Question Categories: Quality of Work, Timeliness, Communication, Cost Management

## Access URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001/api

## Next Steps
1. Complete frontend feature development:
   - Implement subcontractor list and details views
   - Add review submission forms with dynamic questionnaires
   - Create user profile management
   - Implement admin dashboard
2. Add additional backend features:
   - Implement search and filtering endpoints
   - Add validation to API routes
   - Implement reporting endpoints
3. Testing and deployment:
   - Add unit and integration tests
   - Set up CI/CD pipeline
   - Configure production environment

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user and get token
- `GET /api/auth/me` - Get current authenticated user

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `PUT /api/users/me/password` - Change password
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `POST /api/users` - Create new user (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Subcontractors
- `GET /api/subcontractors` - Get all subcontractors
- `GET /api/subcontractors/:id` - Get subcontractor by ID
- `POST /api/subcontractors` - Create subcontractor (admin only)
- `PUT /api/subcontractors/:id` - Update subcontractor (admin only)
- `DELETE /api/subcontractors/:id` - Delete subcontractor (admin only)
- `POST /api/subcontractors/:id/documents` - Upload document (admin only)
- `DELETE /api/subcontractors/:id/documents/:documentId` - Delete document (admin only)

### Reviews
- `GET /api/reviews/subcontractor/:subcontractorId` - Get reviews by subcontractor ID
- `POST /api/reviews` - Create review (authenticated users)
- `PUT /api/reviews/:id` - Update review (owner or admin)
- `DELETE /api/reviews/:id` - Delete review (admin only)
- `POST /api/reviews/:id/attachments` - Upload attachment to review
- `DELETE /api/reviews/:id/attachments/:attachmentId` - Delete attachment

### Questions
- `GET /api/questions` - Get all questions
- `GET /api/questions/categories` - Get all categories
- `GET /api/questions/categories/:id` - Get questions by category
- `POST /api/questions/categories` - Create category (admin only)
- `PUT /api/questions/categories/:id` - Update category (admin only)
- `DELETE /api/questions/categories/:id` - Delete category (admin only)
- `POST /api/questions` - Create question (admin only)
- `PUT /api/questions/:id` - Update question (admin only)
- `DELETE /api/questions/:id` - Delete question (admin only)