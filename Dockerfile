FROM node
RUN mkdir /usr/src/app
RUN mkdir /var/upload
WORKDIR /usr/src/app
ADD main.js main.js
ADD package.json package.json
ADD package-lock.json package-lock.json
RUN npm install
EXPOSE 21
ENTRYPOINT ["node","main.js"]
