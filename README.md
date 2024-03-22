
# Intro

Chat with any file. Leverage langchain and lemonsqueezy to create a saas with authentication, file storage, email notifications, etc. Uses nestjs, typescript, postgress and more.

- Run dev with `docker-compose up --build`

# Server

TODO: - Logging https://www.tomray.dev/nestjs-logging
TODO: - Update texts landing
TODO: - deployments. (docker, cloud run, for dbs supabase) (use github actions) https://www.tomray.dev/deploy-nestjs-cloud-run (blocked - card issue)
TODO: - include references in response
TODO: - finally add prettier and eslint


# Deployment

1. `cd server && docker build -t matzapata/chatwith-server .`
2. `cd nginx && docker build -t matzapata/chatwith-nginx .`
3. `cd client && docker build -t matzapata/chatwith-client .`
4. 


# Domains ideas

get-chatwith.com

