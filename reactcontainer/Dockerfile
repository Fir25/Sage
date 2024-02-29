FROM  node:15.13-alpine
WORKDIR /reactcontainer
ENV PATH /reactcontainer/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
# RUN npm install --f 
COPY . .
RUN  npm run build 
