FROM cypress/base:16.14.2
WORKDIR /e2e
COPY ./package.json ./yarn.lock ./
ENV PATH="$(yarn global bin):$PATH"
RUN yarn install --frozen-lockfile
RUN yarn cypress install
RUN yarn cypress verify