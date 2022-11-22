FROM node:16-alpine

# set working directory
WORKDIR /app

# add `node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

RUN CI=true

# install and cache app dependencies
COPY . . 
RUN npm install
RUN npm run build

EXPOSE 3000

# start app
CMD [ "npm", "start" ]
