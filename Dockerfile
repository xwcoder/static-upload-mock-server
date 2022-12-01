FROM node:18.12.1
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml index.js /usr/src/app/
RUN mkdir -p /usr/src/data/static && corepack enable && pnpm install --prod --ignore-scripts
EXPOSE 8082
CMD ["node", "index.js"]
