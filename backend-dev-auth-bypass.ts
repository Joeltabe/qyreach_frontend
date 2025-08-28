// Development Authentication Bypass Middleware
// Add this to your backend Express app for development testing

import { Request, Response, NextFunction } from 'express';

export const devAuthBypass = (req: Request, res: Response, next: NextFunction) => {
  // Only in development mode
  if (process.env.NODE_ENV === 'development') {
    const authHeader = req.headers.authorization;
    const companyId = req.headers['x-company-id'];
    
    // Check for development token
    if (authHeader === 'Bearer dev-test-token-12345' && companyId === 'dev-company-12345') {
      // Mock user for development
      req.user = {
        id: 'dev-user-12345',
        email: 'dev@qyreach.com',
        firstName: 'Development',
        lastName: 'User',
        role: 'admin'
      };
      
      console.log('🚀 Development: Bypassing authentication for dev token');
      return next();
    }
  }
  
  // Continue with normal authentication
  next();
};

// Usage in your Express app:
// Add this before your authMiddleware in your main app.js/server.ts:
// app.use('/api', devAuthBypass, authMiddleware, ...routes);
