FROM ubuntu

USER root

# os update & install
RUN apt-get update -qy
RUN apt-get install -y curl tar gzip

# Install NVM && node
ENV NODE_VERSION 20.10.0
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh"  \
    && nvm install ${NODE_VERSION}  \
    && nvm use v${NODE_VERSION}  \
    && nvm alias default v${NODE_VERSION}
ENV PATH "/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version

# app copy
WORKDIR /app
COPY . /app
# app install
RUN npm ci
RUN npm run build

# RUN APP
CMD npm run start:dev