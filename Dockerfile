FROM node:latest as builder
ADD src /src
WORKDIR /src/web
RUN npm install
RUN npm run build
WORKDIR /src
RUN npm install
RUN npm run build
RUN mkdir data && npm run generate-data

FROM node:latest 
COPY --from=builder /src /src
WORKDIR /src
EXPOSE 3000
CMD npm start