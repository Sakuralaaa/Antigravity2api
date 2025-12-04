# Use Node.js LTS version
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy client package files and install dependencies
COPY client/package*.json ./client/
RUN npm install --prefix client

# Copy all source files
COPY . .

# Build the frontend
RUN npm run build

# Expose port 7860 (Hugging Face Spaces default)
EXPOSE 7860

# Set environment variable for port
ENV PORT=7860
ENV HOST=0.0.0.0

# Start the application
CMD ["npm", "start"]
