
# DevPulse Backend

## Introduction

DevPulse is an innovative platform designed to handle ratings for companies in the **Ed-tech** industry, with its first paying customer being **Andela**. It is currently under development using modern web technologies that prioritize speed and security. This repository contains the codebase for the backend part of the platform, which utilizes **GraphQL, Apollo, and MongoDB**.

## Table of Contents

- [Hosted Link](#hosted-link)
- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [Contact](#contact)

## Hosted Link

The backend is currently hosted at: [https://atlp-devpulse-bn.onrender.com/](https://atlp-devpulse-bn.onrender.com/)

## Features

- Real-time performance metrics tracking
- Advanced attendance management
- Dynamic application cycle overview
- Secure authentication and authorization
- Scalable GraphQL API

## Technologies

To successfully navigate and contribute to the codebase, you should have an understanding of the following technologies:

- [GraphQL](https://graphql.org/): A query language for APIs
- [TypeScript](https://www.typescriptlang.org/): A typed superset of JavaScript
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/): A GraphQL server
- [MongoDB](https://www.mongodb.com/): A NoSQL database
- [Node.js](https://nodejs.org/): A JavaScript runtime
- [Express](https://expressjs.com/): A web application framework for Node.js

## Getting Started

### Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or later)
- [Git](https://git-scm.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) (local installation or a cloud-hosted instance)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/atlp-rwanda/atlp-devpulse-bn.git
   ```

2. Navigate to the project directory:
   ```bash
   cd atlp-devpulse-bn
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   - Copy the `.env.example` file to `.env`
   - Fill in the required environment variables

5. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

### Available Scripts

- `npm run dev`: Starts the development server using nodemon
- `npm start`: Starts the production server
- `npm test`: Runs the test suite using Jest
- `npm run build`: Builds the production-ready version of the project using TypeScript compiler
- `npm run seed`: Runs the database seeding script

## API Documentation

For detailed information about the API endpoints and how to use them, please refer to our [API Documentation](https://atlp-devpulse-bn.onrender.com/graphql).

## Contributing

We welcome contributions to the DevPulse project! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

Please make sure to update tests as appropriate and adhere to the [Contributor Covenant](https://www.contributor-covenant.org/) code of conduct.


## Contact

DevPulse Team - [devpulsedev@gmail.com](mailto:devpulsedev@gmail.com)

Project Links: 
- [https://github.com/atlp-rwanda/atlp-devpulse-bn](https://github.com/atlp-rwanda/atlp-devpulse-bn)
- https://atlp-devpulse-bn.onrender.com/
