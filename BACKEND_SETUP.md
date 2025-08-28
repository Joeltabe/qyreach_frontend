# Backend Setup Guide

This frontend application requires a backend server with campaigns API endpoints. Here's how to set it up:

## Quick Start

1. **Check if your backend is running:**
   ```bash
   curl http://localhost:3000/api/health
   ```

2. **If using a different port, update the environment:**
   ```bash
   # Create or update .env file
   echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env
   ```

## Required API Endpoints

Your backend needs to implement these campaigns endpoints:

### GET /api/campaigns
```json
{
  "success": true,
  "data": {
    "campaigns": [
      {
        "id": "1",
        "name": "Welcome Series - Week 1",
        "subject": "Welcome to Qyreach!",
        "content": "Email content...",
        "status": "sent",
        "recipients": 1284,
        "recipientList": ["email1@example.com"],
        "openRate": 28.4,
        "clickRate": 6.7,
        "sentAt": "2024-08-24T10:30:00Z",
        "createdAt": "2024-08-23T15:20:00Z",
        "updatedAt": "2024-08-24T10:30:00Z"
      }
    ],
    "total": 1
  }
}
```

### POST /api/campaigns
```json
{
  "name": "Campaign Name",
  "subject": "Email Subject",
  "content": "Email content",
  "recipients": ["email@example.com"],
  "scheduledAt": "2024-08-26T09:00:00Z" // optional
}
```

### PUT /api/campaigns/:id
```json
{
  "name": "Updated Campaign Name",
  "status": "scheduled"
}
```

### DELETE /api/campaigns/:id
Returns: `{ "success": true }`

### POST /api/campaigns/:id/send
Returns: `{ "success": true, "data": { "jobId": "job123" } }`

### POST /api/campaigns/:id/schedule
```json
{
  "scheduledAt": "2024-08-26T09:00:00Z"
}
```

## Common Issues

### 1. "Request failed with status code 400"
- Your backend is running but doesn't have campaigns endpoints
- Implement the required endpoints above

### 2. "Backend server is not available"
- Backend is not running
- Backend is running on a different port
- Update VITE_API_BASE_URL environment variable

### 3. "Network Error" or "ECONNREFUSED"
- Backend server is completely down
- Start your backend server

## Backend Implementation Examples

### Express.js Example
```javascript
app.get('/api/campaigns', (req, res) => {
  res.json({
    success: true,
    data: {
      campaigns: [],
      total: 0
    }
  });
});

app.post('/api/campaigns', (req, res) => {
  const { name, subject, content, recipients, scheduledAt } = req.body;
  // Save to database
  res.json({
    success: true,
    data: {
      campaign: {
        id: Date.now().toString(),
        name,
        subject,
        content,
        status: scheduledAt ? 'scheduled' : 'draft',
        recipients: recipients.length,
        recipientList: recipients,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  });
});
```

### FastAPI Example
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

@app.get("/api/campaigns")
def get_campaigns():
    return {
        "success": True,
        "data": {
            "campaigns": [],
            "total": 0
        }
    }
```

## Testing Your Backend

Use these curl commands to test your endpoints:

```bash
# Test campaigns list
curl http://localhost:3000/api/campaigns

# Test campaign creation
curl -X POST http://localhost:3000/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Campaign","subject":"Test","content":"Test content","recipients":["test@example.com"]}'
```

## Environment Variables

Create a `.env` file in your project root:

```env
# Backend API URL (update port as needed)
VITE_API_BASE_URL=http://localhost:3000/api

# Optional: Enable fallback API for development
VITE_ENABLE_FALLBACK_API=false
```

## Troubleshooting

1. **Check browser console** for detailed error messages
2. **Check backend logs** for server-side errors
3. **Verify port numbers** match between frontend proxy and backend
4. **Test endpoints directly** with curl or Postman
5. **Check CORS settings** if running backend on different domain

The frontend will show an empty state with helpful error messages until the backend is properly configured.
