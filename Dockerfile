# ===== Client =====
FROM node:20 AS client-build
WORKDIR /client
COPY client/package.json client/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY client .
RUN yarn build

# ===== Server =====
FROM node:20 AS server-build
WORKDIR /server
COPY server/package.json server/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY server .
COPY --from=client-build /client/dist ./public
RUN yarn build

# ===== Final =====
FROM node:20-alpine
WORKDIR /
COPY --from=server-build /server/dist ./dist
COPY --from=server-build /server/node_modules ./node_modules
COPY --from=server-build /server/package.json .
COPY --from=client-build /client/dist ./public

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main.js"]