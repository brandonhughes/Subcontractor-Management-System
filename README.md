# Subcontractor Management System

A feedback-based platform for internal users to evaluate and rate subcontractors. This system enables administrators to manage subcontractor profiles, while internal users provide structured feedback through questionnaires and comments.

## Key Features

- **User Management**: Role-based access for administrators and internal users
- **Subcontractor Profiles**: Comprehensive profiles with contact information and service details
- **Review System**: Structured questionnaires and free-form feedback options
- **Scoring System**: Weighted calculations resulting in letter grades (A-F) for subcontractors
- **Feedback Aggregation**: Centralized view of ratings, reviews, and performance trends

## Technology Stack

- **Frontend**: React, TypeScript, Material UI
- **Backend**: Node.js, Express, Sequelize ORM
- **Database**: PostgreSQL
- **Authentication**: JWT

## Project Setup

### Prerequisites

- Node.js (v16 or later)
- PostgreSQL (v12 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/brandonhughes/Subcontractor-Management-System.git
   ```

2. Install dependencies for both frontend and backend:
   ```
   npm run install:all
   ```

3. Set up environment variables:
   - Create a `.env` file in the backend directory using `.env.example` as a template
   - Set the database connection details

4. Create the database:
   ```
   psql -U postgres -c "CREATE DATABASE subcontractor_management"
   ```

5. Run database migrations:
   ```
   cd backend && npm run migrate
   ```

6. Seed the database (optional):
   ```
   cd backend && npm run seed
   ```

### Running the Application

#### Development Mode

1. Start the backend server:
   ```
   npm run dev:backend
   ```

2. In a separate terminal, start the frontend:
   ```
   npm run dev:frontend
   ```

3. Access the application at:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5001`

### Deployment

This project is configured for deployment to Render using the `render.yaml` file in the root directory.

## Documentation

See the following documents for detailed information:
- [Requirements Document](requirements.md)
- [Project Summary](SUMMARY.md)
- [AI_RULES](AI_RULES.md)

## License

This project is proprietary and confidential.