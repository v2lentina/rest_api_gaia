# REST API GAIA — Learning Project

A clean REST API built with Express, TypeScript, SQLite, and LLM integration.

## 🎯 Goal

This API:

- Calls two public APIs (API keys are kept server-side)
- Merges the data
- Sends the combined data to an LLM for a readable summary
- Caches results in SQLite (with TTL)
- Returns clean JSON responses to the frontend

## 📁 Project Structure

```
src/
├── server.ts              # Express setup & startup
├── routes/                # Route definitions
│   └── summary.routes.ts
├── controllers/           # HTTP request/response handling
│   └── summary.controller.ts
├── services/              # Business logic
│   ├── summary.service.ts
│   └── cache.service.ts
├── adapters/              # External API clients
│   ├── publicApi1.adapter.ts
│   ├── publicApi2.adapter.ts
│   └── llm.adapter.ts
├── database/              # Database layer
│   ├── db.ts
│   └── models/
│       └── cache.model.ts
├── types/                 # TypeScript interfaces
│   └── index.ts
├── config/                # Configuration
│   └── index.ts
└── utils/                 # Utilities
    └── middleware.ts
```

## 🚀 Quick Start

### 1. Environment setup

```bash
# create .env (copy from example)
cp .env.example .env
```

Fill in the API keys in the `.env` file:

- `PUBLIC_API_1_KEY` and `PUBLIC_API_1_URL`
- `PUBLIC_API_2_KEY` and `PUBLIC_API_2_URL`
- `LLM_API_KEY` and `LLM_API_URL`

### 2. Development

```bash
# Run in development (with ts-node)
npm run dev
```

### 3. Production

```bash
# Build TypeScript
npm run build

# Run compiled code
npm start
```

## 🔌 API Endpoints

### GET /api/summary?q=...

Returns a summary for the given query:

- Checks the cache first
- On cache miss: calls both public APIs, combines the data, sends it to the LLM
- Caches the result
- Returns JSON

Example:

```bash
curl "http://localhost:8000/api/summary?q=typescript"
```

Example response:

```json
{
  "success": true,
  "data": {
    "query": "typescript",
    "summary": "TypeScript is...",
    "fromCache": false,
    "timestamp": "2026-02-08T10:30:00.000Z"
  },
  "timestamp": "2026-02-08T10:30:00.000Z"
}
```

### DELETE /api/summary/cache?q=...

Deletes a specific cache entry.

### POST /api/summary/cache/cleanup

Removes all expired cache entries.

### GET /health

Health-check endpoint.

## 🏗️ Architecture Principles

### Why this separation?

**Routes** → Only URL mapping

- No business logic
- Connects URLs to controller methods

**Controllers** → HTTP-specific

- Parse requests
- Format responses
- Validate input
- No business logic

**Services** → Business logic

- Orchestrate the workflow
- Call adapters
- Combine data
- Manage cache

**Adapters** → External APIs

- Encapsulate API calls
- Transform external responses
- Handle API-specific errors
- Easy to swap out

**Database** → Persistence

- SQL queries
- No business logic
- Simple CRUD operations

**Types** → Shared interfaces

- Type safety
- Documentation
- Contracts between layers

### Benefits

✅ Testable: each layer is easily mockable  
✅ Maintainable: changes isolated  
✅ Readable: clear responsibilities  
✅ Extensible: add new APIs via new adapters  
✅ Type-safe: TypeScript everywhere

## 📝 Next Steps

1. **Adapt the adapters**:

   - `src/adapters/publicApi1.adapter.ts` → your first public API
   - `src/adapters/publicApi2.adapter.ts` → your second public API
   - `src/adapters/llm.adapter.ts` → your LLM integration (OpenAI, Anthropic, etc.)

2. **Adjust types**:

   - `src/types/index.ts` → API response structures

3. **Fill config**:

   - Add real API keys to `.env`

4. **Test**:

```bash
npm run dev
curl "http://localhost:8000/api/summary?q=test"
```

## 🔐 Security (for later)

Planned improvements:

- Authentication (JWT)
- Rate limiting
- API key management
- Input sanitization

## 📚 Learning Goals Achieved

✅ Clean architecture and separation of concerns  
✅ TypeScript strict mode  
✅ Dependency injection (via constructors)  
✅ Error handling with custom error classes  
✅ Middleware pattern  
✅ Database layer (SQLite)  
✅ Cache with TTL  
✅ External API integration  
✅ Environment configuration

## 📦 Dependencies

- `express` - web framework
- `typescript` - type safety
- `better-sqlite3` - SQLite driver
- `dotenv` - environment variables
- `ts-node` - TypeScript execution

---

Happy coding! 🚀
\*\*\* End Patch
