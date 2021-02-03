FROM node:14.15.4-alpine3.12 AS build_base
RUN apk add curl

COPY /package* /build/
COPY /tsconfig.json /build/
COPY /src /build/src/

WORKDIR /build/

RUN npm i

RUN npm run build

FROM node:14.15.4-alpine3.12 AS app
RUN apk add curl

COPY --from=build_base /build/node_modules /node_modules/
COPY --from=build_base /build/build .

ENTRYPOINT [ "node", "index.js" ]