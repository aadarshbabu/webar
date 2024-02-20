# Use an official Node.js runtime as a base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .


# Expose the port your app will run on
EXPOSE 3000

# Define the command to run your app
CMD ["npm", "start"]
