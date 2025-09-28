# Issue #019: API Rate Limiting and Security Middleware

## Description

Implement comprehensive rate limiting and security middleware to protect the API from abuse, ensure fair usage, and maintain system stability.

## Acceptance Criteria

- [ ] Implement rate limiting middleware for all API endpoints
- [ ] Add specific rate limits for simulation endpoints
- [ ] Create authentication rate limiting
- [ ] Implement security headers and CORS configuration
- [ ] Add request size limiting and validation
- [ ] Create rate limit monitoring and alerting
- [ ] Implement rate limit bypass for authenticated users

## Technical Requirements

- **Rate Limiting**: express-rate-limit or similar
- **Security Headers**: helmet.js for security headers
- **CORS**: Cross-origin resource sharing configuration
- **Request Validation**: Input size and format validation
- **Monitoring**: Rate limit metrics and alerting
- **Redis**: Rate limit storage backend

## Implementation Details

### Rate Limiting Configuration

```typescript
// rate-limit.config.ts
import rateLimit from "express-rate-limit";

// General API rate limiting
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Simulation-specific rate limiting
export const simulationRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Limit each IP to 10 simulation requests per 5 minutes
  message: {
    error: "Too many simulation requests, please wait before trying again.",
    retryAfter: "5 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Authentication rate limiting
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per 15 minutes
  message: {
    error: "Too many authentication attempts, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
```

### Security Middleware

```typescript
// security.middleware.ts
import helmet from "helmet";
import cors from "cors";

export const securityMiddleware = [
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }),

  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),

  // Request size limiting
  express.json({ limit: "10mb" }),
  express.urlencoded({ limit: "10mb", extended: true }),
];
```

### Rate Limit Monitoring

```typescript
// rate-limit.monitor.ts
import { Injectable } from "@nestjs/common";
import { InjectRedis } from "@nestjs-modules/ioredis";
import Redis from "ioredis";

@Injectable()
export class RateLimitMonitor {
  constructor(@InjectRedis() private redis: Redis) {}

  async trackRateLimitHit(key: string, limit: number) {
    const hits = await this.redis.incr(key);

    if (hits === 1) {
      await this.redis.expire(key, 900); // 15 minutes
    }

    if (hits > limit * 0.8) {
      // Alert when approaching limit
      await this.sendAlert(key, hits, limit);
    }
  }

  private async sendAlert(key: string, hits: number, limit: number) {
    // Send alert to monitoring system
    console.warn(`Rate limit approaching for ${key}: ${hits}/${limit}`);
  }
}
```

### Custom Rate Limiting Logic

```typescript
// custom-rate-limit.middleware.ts
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class CustomRateLimitMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    const userId = req.user?.id;
    const endpoint = req.path;

    // Different limits for different endpoints
    const limits = {
      "/api/v1/simulations": { max: 10, window: 300000 }, // 5 minutes
      "/api/v1/auth/login": { max: 5, window: 900000 }, // 15 minutes
      "/api/v1/reports": { max: 20, window: 600000 }, // 10 minutes
    };

    const limit = limits[endpoint] || { max: 100, window: 900000 };

    // Apply rate limiting logic
    this.checkRateLimit(ip, userId, endpoint, limit)
      .then((allowed) => {
        if (allowed) {
          next();
        } else {
          res.status(429).json({
            error: "Rate limit exceeded",
            retryAfter: Math.ceil(limit.window / 1000),
          });
        }
      })
      .catch(next);
  }

  private async checkRateLimit(
    ip: string,
    userId: string,
    endpoint: string,
    limit: any,
  ): Promise<boolean> {
    // Implementation of rate limiting logic
    // Check against Redis or in-memory store
    return true; // Placeholder
  }
}
```

## Rate Limiting Strategies

### Tiered Rate Limiting

- **Anonymous Users**: Lower limits (10 requests/5min)
- **Authenticated Users**: Higher limits (50 requests/5min)
- **Premium Users**: Highest limits (100 requests/5min)

### Endpoint-Specific Limits

- **Simulation Endpoints**: 10 requests/5min (resource intensive)
- **Data Endpoints**: 100 requests/15min (lightweight)
- **Auth Endpoints**: 5 requests/15min (security critical)

### Geographic Rate Limiting

- **High-Risk Regions**: Stricter limits
- **Trusted Regions**: Standard limits
- **VPN Detection**: Additional restrictions

## Security Features

### Request Validation

- **Input Sanitization**: Clean and validate all inputs
- **Size Limits**: Prevent large payload attacks
- **Content Type Validation**: Ensure proper content types
- **SQL Injection Prevention**: Parameterized queries

### Authentication Security

- **JWT Token Validation**: Secure token verification
- **Session Management**: Proper session handling
- **Password Security**: Strong password requirements
- **Account Lockout**: Prevent brute force attacks

## Monitoring and Alerting

- **Rate Limit Metrics**: Track hits, blocks, and patterns
- **Anomaly Detection**: Identify unusual traffic patterns
- **Alert System**: Notify administrators of issues
- **Dashboard**: Real-time monitoring interface

## Definition of Done

- [ ] Rate limiting middleware is implemented for all endpoints
- [ ] Simulation endpoints have appropriate rate limits
- [ ] Authentication rate limiting prevents brute force attacks
- [ ] Security headers are properly configured
- [ ] CORS is configured for production environment
- [ ] Request size limiting prevents abuse
- [ ] Rate limit monitoring and alerting is working

## Priority: High

## Estimated Effort: 6-8 hours

## Labels: security, middleware, rate-limiting
