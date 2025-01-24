# Use the official Node.js image for building your application
FROM node:20 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Copy the .env file to the working directory
# COPY .env.local .env

# Build the Next.js application
RUN npm run build
RUN npm run sitemap
# Use a smaller Node.js image for serving the application
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the built application from the previous stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
# COPY --from=build /app/.env ./.env

# Install only production dependencies
RUN npm install --only=production

# Set a different port, e.g., 4000
ENV PORT 5000

# Expose the new port
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]
