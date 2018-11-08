FROM node:latest
ADD src /src
WORKDIR /src
RUN npm install
RUN npm run build
RUN mkdir data && npm run generate-data
EXPOSE 3000
CMD npm start