# Use Node.js LTS version
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files for server
COPY package*.json ./

# Install server dependencies
RUN npm install --production

# Copy client directory
COPY client ./client

# Install client dependencies and build frontend
RUN cd client && npm install && npm run build

# Copy remaining source files
COPY src ./src
COPY config.json ./
COPY public ./public
COPY scripts ./scripts

# Create necessary directories
RUN mkdir -p data uploads

# Expose port 7860 (Hugging Face Spaces default)
EXPOSE 7860

# Set environment variables for Hugging Face Spaces
ENV PORT=7860
ENV HOST=0.0.0.0
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
