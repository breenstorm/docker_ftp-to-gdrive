FROM node
RUN mkdir /usr/src/app
RUN mkdir /usr/src/app/storage
WORKDIR /usr/src/app
ADD main.js main.js
ADD package.json package.json
ADD package-lock.json package-lock.json
RUN npm install
EXPOSE 21
ENTRYPOINT ["node","main.js"]
