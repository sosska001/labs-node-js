FROM node:latest

RUN mkdir -p /usr/src/my_app/
WORKDIR /usr/src/my_app/

COPY . /usr/src/my_app/
RUN npm install

EXPOSE 3000

CMD ["node", "app.js"]