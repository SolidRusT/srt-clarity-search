# Use an official Node.js runtime as a parent image, using the Alpine version for a smaller footprint
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock if using Yarn)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Next.js starts by default on port 3000, expose this port
EXPOSE 3000

# Command to run the Next.js application
CMD ["npm", "start"]
