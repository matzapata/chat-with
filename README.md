
# Intro

Chat with any file. Leverage langchain and lemonsqueezy to create a saas with authentication, file storage, email notifications, etc. Uses nestjs, typescript, postgress and more.

- Run dev with `skaffold dev`
- Create secrets with: `kubectl create secret generic cookie-secret --from-literal=COOKIE_SECRET=secret`
- Add `127.0.0.1       chatwith-dev.io` to `/etc/hosts`

# Server

TODO: - subscription guard
TODO: - tests
TODO: - resend email strategy
TODO: - cleanup payments implementation
TODO: - make auth modular to switch providers and bring in supabase or firebase, passport
TODO: - deploy server with gcp initially for cost efficient but keep the door open for kubernetes

# Infra

# Client

TODO: Design in figma -> https://www.figma.com/file/QFQqVm9pZ4Row0v81ltTqg/CHAT-WITH?type=design&node-id=14921%3A905&mode=design&t=Md5HYEnJhL8ypU6Y-1
