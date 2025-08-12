# Tourify Backend

## Overview

The Tourify Backend is a Node.js-based RESTful API built with Express.js and MongoDB. It powers the Tourify application, providing endpoints to manage tourist spots and country data for a travel planning platform. The backend handles CRUD operations for tourist spots, retrieves country information, and supports user-specific spot management.

## Features

- **Country Data Management**: Stores and retrieves information about countries, including names, images, and descriptions.
- **Tourist Spot Management**: Allows users to add, update, delete, and retrieve tourist spots.
- **User-Specific Spots**: Fetches tourist spots associated with a user's email.
- **Top Tourist Spots**: Retrieves the top 6 tourist spots based on annual visitor count.
- **MongoDB Integration**: Connects to a MongoDB Atlas cluster for persistent data storage.
- **CORS and JSON Support**: Enables cross-origin requests and JSON data handling.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm (Node Package Manager)

## Installation

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd tourify-backend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**: Create a `.env` file in the root directory and add the following:

   ```bash
   PORT=3000
   MONGODB_USERNAME=<your-mongodb-username>
   MONGODB_PASS=<your-mongodb-password>
   MONGODB_CLUSTER=<your-mongodb-cluster-name>
   ```

4. **Run the Application**:

   ```bash
   npm start
   ```

   The server will start on the specified port (default: 3000).

## Project Structure

```
tourify-backend/
├── index.js          # Main application file
├── package.json      # Project metadata and dependencies
├── README.md         # Project documentation
└── node_modules/     # Installed dependencies
```

## API Endpoints

### Countries

- **GET /countries**: Retrieves a list of all countries.
  - Response: Array of country objects (`country_Name`, `imageURL`, `description`).

### Tourist Spots

- **GET /all-tourist-spots**: Retrieves all tourist spots.
  - Response: Array of tourist spot objects.
- **GET /all-tourist-spots/top**: Retrieves the top 6 tourist spots sorted by `totalVisitorsPerYear` (descending).
  - Response: Array of up to 6 tourist spot objects.
- **GET /tourist-spot/:id**: Retrieves a specific tourist spot by ID.
  - Parameters: `id` (MongoDB ObjectId)
  - Response: Single tourist spot object or null if not found.
- **POST /spots-by-country**: Retrieves tourist spots for a specific country.
  - Body: `{ country_Name: string }`
  - Response: Array of tourist spot objects.
- **POST /my-spots**: Retrieves tourist spots associated with a user's email.
  - Body: `{ email: string }`
  - Response: Array of tourist spot objects.
- **POST /add-tourist-spot**: Adds a new tourist spot.
  - Body: Tourist spot data (e.g., `{ countryName, spotName, totalVisitorsPerYear, userEmail, ... }`)
  - Response: Result of the insert operation.
- **PUT /update-tourist-spot/:id**: Updates an existing tourist spot by ID.
  - Parameters: `id` (MongoDB ObjectId)
  - Body: Updated tourist spot data (excluding `_id`)
  - Response: Result of the update operation.
- **DELETE /my-spots/:id**: Deletes a tourist spot by ID.
  - Parameters: `id` (MongoDB ObjectId)
  - Response: Result of the delete operation.

### Health Check

- **GET /**: Returns a message indicating the server is running.
  - Response: `"Tourify server is running"`

## Dependencies

- **express**: Web framework for Node.js.
- **mongodb**: MongoDB driver for Node.js.
- **cors**: Middleware for enabling CORS.
- **dotenv**: Loads environment variables from a `.env` file.

## Contribution
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a clear description of your changes.

## Contact
Created by **Utso Mondal**  
Email: [utsomondal2025@gmail.com](mailto:utsomondal2025@gmail.com)