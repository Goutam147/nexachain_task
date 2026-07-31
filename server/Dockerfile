# Use the official lightweight Node.js image
FROM node:22-alpine

# Set working directory inside the container
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy server code
COPY . .

# Expose the port that the application runs on
EXPOSE 8080

# Start the application
CMD ["node", "index.js"]
