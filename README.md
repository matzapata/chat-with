
# Intro

Chat with any file. Leverage langchain and lemonsqueezy to create a saas with authentication, file storage, email notifications, etc. Uses nestjs, typescript, postgress and more.

- Run dev with `skaffold dev`
- Create secrets with: `kubectl create secret generic cookie-secret --from-literal=COOKIE_SECRET=secret`
- Add `127.0.0.1       chatwith-dev.io` to `/etc/hosts`

# Server

TODO: - Contact us page
TODO: - Figure out way to easily set token in all requests without manually doing it, from middleware
TODO: - Rate limit endpoints.
TODO: - deployments. (docker, cloud run? + vercel and serverless services? do kubernettes and etc to keep it local and potenrtially later depoy that way but much more expensive) server with gcp initially for cost efficient but keep the door open for kubernetes
TODO: - tests
TODO: - Update texts landing
TODO: - ensure easy way to switch theme for other company. Create logo with ai

# Infra



