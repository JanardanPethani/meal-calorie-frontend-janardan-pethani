FROM node:22.14.0-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=development

# Start the development server
CMD ["npm", "run", "dev"] 