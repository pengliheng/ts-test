FROM node

COPY . /root/front-end

WORKDIR /root/front-end

EXPOSE 8080

RUN npm install yarn -g

# RUN yarn

CMD [ "yarn" ,"dev" ]
