
# Intro

Chat with any file. Leverage langchain and lemonsqueezy to create a saas with authentication, file storage, email notifications, etc. Uses nestjs, typescript, postgress and more.

- Run dev with `docker-compose up --build`

# Server

TODO: - Update pricing
TODO: - Set domain, mailbox and resender
TODO: - env checking in client
TODO: - fix local development with docker-compose
TODO: - add summarization feature
TODO: - Add example questions
TODO: - Streaming
TODO: - lemonsquezzy live (enable coupons) lower price to 5 bucks

# Deployment

1. `cd client && npm run deploy`
2. `cd server && npm run deploy`

Setup pgvector extension in postgress db
1. Connect with psql
2. `CREATE EXTENSION IF NOT EXISTS vector;`

# Domains ideas

get-chatwith.com

