FROM node

COPY . /root/server

WORKDIR /root/server

EXPOSE 3000

RUN npm install yarn ts-node-dev -g

# RUN yarn

CMD [ "yarn" ,"dev:server" ]
