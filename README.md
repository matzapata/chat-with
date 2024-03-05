
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
TODO: - make auth modular to switch providers and bring in supabase or firebase, passport. -> POST /user -> creates record in db, error if exists, adds extra data like name and so on we ask after signup. Almost remove auth service, handled with third parties. Do endpoints for password restore and so on and strategies pattern to handle this with providers. You may issue the token or not
 -> change verifyToken in auth service
 -> auth service has resend verification and forgot password? 
 -> Remove signin and signup, or just update them to not handle token logic and require auth
 -> On a separate module you can have a local auth provider to issue tokens, totally independant

TODO: - deployments. server with gcp initially for cost efficient but keep the door open for kubernetes
TODO: - set up one time payments

# Infra

# Client

TODO: Design in figma -> https://www.figma.com/file/QFQqVm9pZ4Row0v81ltTqg/CHAT-WITH?type=design&node-id=14921%3A905&mode=design&t=Md5HYEnJhL8ypU6Y-1
