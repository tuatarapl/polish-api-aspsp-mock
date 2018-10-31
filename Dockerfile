FROM node:latest
ADD src /src
WORKDIR /src
RUN npm install && npm run build
EXPOSE 3000
CMD npm start