# Meal Calorie Count Generator Assignment

This document outlines an assignment designed to evaluate both **Backend** and **Frontend** development skills [1].

**Important Notes:**

- Attention to detail is crucial [1].
- Careful reading and understanding of the submission instructions are required [1].

## I. Backend Assignment: Meal Calorie Count Generator

### Objective

The objective is to **create a backend service** that enables users to input a dish name and number of servings, then returns the total calorie count using the **free USDA FoodData Central API** [2].

### Functional Requirements

- **Dish Search**: Users input a dish name (e.g., 'pasta alfredo'), and the system searches for it using the USDA API [2].
- **Serving Count**: Users specify the number of servings [2].
- **Calorie Calculation**: The system calculates total calories based on retrieved nutrition data and the number of servings [3].
- **API Response**: Returns structured JSON containing total calories, calories per serving, and ingredient breakdown (if available) [3].

### Tech Stack

| Component     | Technology                                                                                                                         |
| :------------ | :--------------------------------------------------------------------------------------------------------------------------------- |
| Language      | **Node.js (Express) or Python (FastAPI)** [3]                                                                                      |
| External API  | **USDA FoodData Central API** [3]                                                                                                  |
| Hosting       | Render, Railway, Vercel, or local server (Optional) [3]                                                                            |
| Rate Limiting | Optional: Middleware like `express-rate-limit` or FastAPI dependencies to rate-limit beyond 15 rapid requests from the same IP [3] |

### API Endpoints

**POST `/get-calories`** [4]

- **Parameters**:

  - `dish_name`: `string` - Name of the food/dish [4]
  - `servings`: `number` - Number of servings [4]

- **Sample Request Body**:

  ```json
  {
    "dish_name": "chicken biryani",
    "servings": 2
  }
  ```

  [4]

- **Sample Response**:
  ```json
  {
    "dish_name": "chicken biryani",
    "servings": 2,
    "calories_per_serving": 280,
    "total_calories": 560,
    "source": "USDA FoodData Central"
  }
  ```
  [4]

**Integration with USDA API**:

- **API Endpoint**: `https://api.nal.usda.gov/fdc/v1/foods/search` [4]
- **Method**: `GET` [4]
- **Params**: `query`, `api_key`, `pageSize` [5]
- **API Key**: Obtain from `https://fdc.nal.usda.gov/api-key-signup.html` [5]

### Implementation Notes

- **Fuzzy matching** should be used to select the best-matching food item from USDA API results [5].
- Fetch calories **per 100g or per serving** depending on availability [5].
- **Multiply calories by the number of servings** [5].
- **Cache frequent queries** for performance (optional) [5].
- **Implement authentication**:
  - User to input first name, last name, email, and password [5].
  - Persist authentication data in **encrypted format** along with best practices for validation of email and password and security protocols [6].
  - **Choice of Database**: MongoDB or Postgres [6].
- **Authentication should be implemented using the following nested routes only**:
  - `/auth/register` - for new user sign-ups [6]
  - `/auth/login` - for logins [6]

### Testing

- Test with common dishes: 'macaroni and cheese', 'grilled salmon', 'paneer butter masala' [6].
- Include tests for:
  - Non-existent dishes [6]
  - Zero or negative servings [6]
  - Multiple similar matches [6]

### Security & Limits

- **Store API key securely** (e.g., in `.env`) [7].
- **Rate-limit API** to prevent abuse [7].
- Return **friendly errors** (e.g., 'Dish not found', 'Invalid servings') [7].

### Extension Ideas (Optional)

- Add macronutrients (carbs, fat, protein) to output [7].
- Support partial matching and user feedback for food selection [7].
- Add a front-end interface (React or simple HTML form) [7].
- Add a meal log or nutrition tracker feature [7].

### Grading Criteria

Your submission will be graded on the following criteria [7]:

- OOP Practices [7]
- Code Modularity [7]
- API Accuracy [7]
- Algorithmic Sophistication – Data Processing Logic; Performance Optimizations, etc. [8]

### .env Variables

Don’t forget to include an **`.env.example` file** with relevant placeholders for `.env` variables referenced in your codebase [8].

## II. Frontend Assignment: Meal Calorie Count Generator – Web App

### Objective

The objective is to **build a fully responsive, production-ready front-end interface** for the Meal Calorie Count Generator backend [8]. The UI should allow users to **register, login, input dish details, and view calorie data** returned by the backend API [9].

The frontend must reflect thoughtful **UX, state management, component structure, and SSR-friendly rendering** [9].

### Tech Stack Requirements

| Layer                             | Tooling/Framework                                        |
| :-------------------------------- | :------------------------------------------------------- |
| Framework                         | **Next.js (App Router) or React 18 + Vite with SSR** [9] |
| Styling                           | **Tailwind CSS + shadcn/ui** [9]                         |
| State                             | **Zustand** [9]                                          |
| Validation                        | Zod (optional: react-hook-form) [9]                      |
| Language                          | **TypeScript only** [9]                                  |
| Testing (Optional but encouraged) | Vitest / Playwright [9]                                  |
| Package Manager                   | pnpm or npm [9]                                          |

### Required Features

- **User Registration**: Auth form (First Name, Last Name, Email, Password). Calls `/auth/register` endpoint [9].
- **User Login**: Auth form (Email + Password). Stores token securely (localStorage or HTTP-only cookie preferred) [10].
- **Calorie Lookup Form**: Form to input dish name & servings. Sends data to `/get-calories` and renders the calorie breakdown [10].
- **Calorie Results Card**: Shows: dish name, servings, calories per serving, total calories, and data source [10].
- **User Feedback**: Show loading spinner, success alert, error alerts (dish not found, invalid servings, etc.) [10].
- **Responsive Layout**: Mobile-first layout that also looks great on desktop [10].
- **State Management**: Use **Zustand to persist auth token, user info, and optionally previous meals** [11].
- **Dark/Light Mode**: Use shadcn's theme toggle for styling consistency [11].

### Sample API Contracts (Backend Application)

- **Register a User** -> `POST /register`:

  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "secure123"
  }
  ```

  [11]

- **Login** -> Log the user in and get the necessary authorization payload | `POST /login`:

  ```json
  {
    "email": "john@example.com",
    "password": "secure123"
  }
  ```

  [11, 12]

- **Get Calories** -> The main functionality of the application | `POST /get-calories`:
  ```json
  {
    "dish_name": "chicken biryani",
    "servings": 2
  }
  ```
  [12]
  - **Sample Response**:
    ```json
    {
      "dish_name": "chicken biryani",
      "servings": 2,
      "calories_per_serving": 280,
      "total_calories": 560,
      "source": "USDA FoodData Central"
    }
    ```
    [12]

### Bonus Features (Optional)

These are not required, but completing them will give extra credit [12]:

- **Meal History Log**: Display a table of past calorie searches (in memory or persisted via backend if extended) [12, 13].
- **Dockerized Dev Environment**: Wrap your frontend in a Dockerfile + docker-compose config [13].
- **SEO + Meta Tags**: Add `<Head>` metadata for calorie lookup page [13].
- **Basic Testing**: Write 2–3 test cases for form and result display using Vitest or Testing Library [13].
- **Guarded Routes**: Prevent unauthenticated users from accessing the dashboard or calorie form [13].

### Suggested Folder Structure (Next.js App Router)

```bash
/src
├── /app
│   ├── /login
│   ├── /register
│   ├── /dashboard
│   └── /calories
├── /components
│   ├── AuthForm.tsx
│   ├── MealForm.tsx
│   └── ResultCard.tsx
├── /lib
│   ├── api.ts
│   └── auth.ts
├── /stores
│   ├── authStore.ts
│   └── mealStore.ts
├── /types
└── /styles
.env.example
README.md
If using Vite, structure under src/pages, src/components, src/lib, etc., and implement SSR using Vite SSR adapter.
Authentication Flow
•
Use Zustand to manage and persist authStore with the JWT token.
•
After login or registration, redirect the user to /dashboard.
•
For protected pages (like dashboard), use a useAuthGuard() hook to redirect unauthenticated users.
Testing Expectations (Optional)
Scope
Tool
Description
Component
Vitest + React Testing Library
Test MealForm logic
Integration
Playwright
Test full login → search → result rendering
Submission Instructions
1.
Create a GitHub repository: meal-calorie-frontend-{your-name}.
2.
Include: a.  README.md with: i.  Setup instructions ii. Any decisions or trade-offs iii. Screenshot(s) iv. Hosted link (if deployed) b.  .env.example with: i.  NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
3.
Push your code and share the repo link.
4.
Deploy on Vercel (or something like that) and share app URL.
Evaluation Criteria
Area
Weight
Code Quality (TS, folder structure, modularity)
25%
API Integration Accuracy
20%
UX, UI, Responsiveness
20%
Zustand Implementation
15%
Error Handling & Validation
10%
(Bonus) Testing & Extras
10%
Deadline
Submit within 72 hours of receiving the assignment. If extra time is needed, communicate early.
Questions?
Feel free to ask for clarifications before you start.
Happy building!
```
