FROM node:18.17.0
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Accept a build-time argument for MODE
ARG MODE
ARG SLAVE_ID

# Set an environment variable based on the build-time argument
ENV NEXT_PUBLIC_MODE=$MODE
ENV NEXT_PUBLIC_REACT_APP_SLAVE_ID=$SLAVE_ID

EXPOSE 3000
CMD ["npm", "run", "dev"]
