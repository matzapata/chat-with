
# Intro

Chat with any file. Leverage langchain and lemonsqueezy to create a saas with authentication, file storage, email notifications, and more. 
Tech stack using nestjs, nextjs, typescript, prisma, langchain and more! 

- Run dev with `docker-compose up --build`

# Deployment

Setup env variables
- resend
- gcp storage
- openai
- postgress db with vercel
- domain


1. `cd client && npm run deploy`
2. `cd server && npm run deploy`

Setup pgvector extension in postgress db
1. Connect with psql
2. `CREATE EXTENSION IF NOT EXISTS vector;`

Find it at `get-chatwith.com`

