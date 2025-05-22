# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install node modules
RUN npm install

# Copy source code
COPY . .

# Expose the port
EXPOSE 8000

# Start the app
CMD ["node", "src/index.js"]
