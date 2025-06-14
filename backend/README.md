# Meal Calorie Count Generator API

This is a RESTful API that allows users to input a dish name and number of servings and returns the total calorie count using the USDA FoodData Central API.

## Features

- User authentication (register, login)
- Dish calorie lookup
- Serving size calculation
- Rate limiting to prevent API abuse

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- USDA FoodData Central API

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` and fill in your details:

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/calorie-count
   JWT_SECRET=your_jwt_secret_key_here
   USDA_API_KEY=your_usda_api_key_here
   NODE_ENV=development
   ```

   Get your USDA API key from: https://fdc.nal.usda.gov/api-key-signup.html

4. Start the server:
   - For development: `npm run dev`
   - For production: `npm start`

## API Endpoints

### Authentication

- **POST /auth/register** - Register a new user

  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```

- **POST /auth/login** - Login a user
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```

### Calorie Calculation

- **POST /get-calories** - Get calorie information for a dish (requires authentication)
  ```json
  {
    "dish_name": "chicken biryani",
    "servings": 2
  }
  ```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 400: Bad Request (invalid input)
- 401: Unauthorized (authentication failed)
- 404: Not Found (dish not found)
- 429: Too Many Requests (rate limit exceeded)
- 500: Internal Server Error

## Security

- Passwords are hashed using bcrypt
- Authentication is handled using JWT tokens
- API rate limiting is implemented to prevent abuse
