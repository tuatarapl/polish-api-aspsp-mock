FROM node:latest
ADD deploy_rsa  /root/.ssh/id_rsa
RUN ssh -oStrictHostKeyChecking=no git@bitbucket.org -v
ADD src /src
WORKDIR /src
RUN npm install
RUN npm run build
RUN mkdir data && npm run generate-data
EXPOSE 3000
CMD npm start