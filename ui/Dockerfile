FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /home/ui

COPY ./package.json ./package-lock.json /home
RUN  npm install --production

FROM node:20-alpine AS builder
WORKDIR /home/ui
COPY . /home/ui

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build
RUN npm run codegen

FROM node:20-alpine AS runner
WORKDIR /home/ui

# ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --chown=nextjs:nodejs ./.next /home/.next
COPY ./package* /home/

# zshell
RUN apk add zsh curl wget git
RUN sh -c "$(wget https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"
RUN sed -i -e "s/bin\/ash/bin\/zsh/" /etc/passwd

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "run", "dev"]