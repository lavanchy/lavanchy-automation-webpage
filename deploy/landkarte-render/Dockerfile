FROM node:22-bookworm-slim
WORKDIR /app
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
COPY package.json ./
RUN npm install --omit=dev && npx playwright install --with-deps --only-shell chromium && rm -rf /var/lib/apt/lists/* /root/.npm
COPY server.mjs ./
USER node
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.mjs"]
