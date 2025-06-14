# Meal Calorie Count Application

A full-stack application that allows users to input a dish name and number of servings and returns the total calorie count using the USDA FoodData Central API.

## Features

- User authentication (register, login)
- Dish calorie lookup
- Serving size calculation
- Meal history tracking
- Responsive design

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- USDA FoodData Central API

### Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand for state management
- Zod for validation

## Setup

### Docker Setup (Recommended)

The easiest way to run the application is using Docker:

1. Make sure you have Docker and Docker Compose installed on your system.

2. Clone the repository:

   ```
   git clone <repository-url>
   cd meal-calorie-count
   ```

3. Run the start script:

   ```
   ./start-docker.sh
   ```

   This will create a `.env` file if it doesn't exist. Update the `.env` file with your USDA API key.

4. Run the script again to start the containers:

   ```
   ./start-docker.sh
   ```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Manual Setup

#### Backend

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file with the following variables:

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/calorie-count
   JWT_SECRET=your_jwt_secret_key_here
   USDA_API_KEY=your_usda_api_key_here
   NODE_ENV=development
   ```

   Get your USDA API key from: https://fdc.nal.usda.gov/api-key-signup.html

4. Start the backend server:
   ```
   npm run dev
   ```

#### Frontend

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env.local` file with the following variables:

   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
   ```

4. Start the frontend development server:

   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Testing

### Backend Tests

To run the backend tests:

```
cd backend
npm test
```

This will run the test suite that includes:

- Tests for common dishes like 'macaroni and cheese', 'grilled salmon', and 'paneer butter masala'
- Tests for non-existent dishes
- Tests for invalid servings (zero or negative)
- Tests for search history functionality

### Frontend Tests

To run the frontend component tests:

```
cd frontend
npm test
```

To run the frontend tests in watch mode:

```
cd frontend
npm run test:watch
```

To run end-to-end tests with Playwright:

```
cd frontend
npm run test:e2e
```

## API Endpoints

### Authentication

- **POST /auth/register** - Register a new user
- **POST /auth/login** - Login a user
- **GET /auth/profile** - Get user profile (protected)

### Calorie Calculation

- **POST /get-calories** - Get calorie information for a dish (protected)
- **GET /search-history** - Get user's search history (protected)
- **DELETE /search-history** - Clear user's search history (protected)

## USDA API Notes

[API Doc](https://app.swaggerhub.com/apis-docs/fdcnal/food-data_central_api/1.0.1)

#### Rate limit

- FoodData Central currently limits the number of API requests to a default rate of 1,000 requests per hour per IP address.
- Exceeding this limit will cause the API key to be temporarily blocked for 1 hour.

## Calorie Calculation

```math
Total Calories = (Protein × 4) + (Carbohydrates × 4) + (Fat × 9)
```

Where:

- Protein: 4 calories per gram
- Carbohydrates: 4 calories per gram
- Fat: 9 calories per gram

This formula is based on the standard Atwater factors, which are the most widely used energy conversion factors for calculating the energy content of foods.
