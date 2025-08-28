// Development utility to detect and configure backend API
// This helps developers connect to the correct backend server

interface BackendInfo {
  url: string;
  status: 'connected' | 'disconnected' | 'error';
  message: string;
}

const COMMON_BACKEND_PORTS = [3000, 3001, 5000, 8000, 8080, 4000];

export const detectBackend = async (): Promise<BackendInfo> => {
  // First try the configured API base URL
  const configuredUrl = import.meta.env.VITE_API_BASE_URL || '/api';
  
  try {
    // Try to make a simple health check request
    const response = await fetch(`${configuredUrl}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      return {
        url: configuredUrl,
        status: 'connected',
        message: 'Backend connected successfully'
      };
    }
  } catch (error) {
    console.log('Configured backend URL failed:', error);
  }

  // If configured URL fails, try common ports
  for (const port of COMMON_BACKEND_PORTS) {
    try {
      const testUrl = `http://localhost:${port}`;
      const response = await fetch(`${testUrl}/api/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        return {
          url: `http://localhost:${port}/api`,
          status: 'connected',
          message: `Backend found on port ${port}`
        };
      }
    } catch (error) {
      // Continue to next port
      continue;
    }
  }

  return {
    url: configuredUrl,
    status: 'disconnected',
    message: 'No backend server found. Please start your backend server.'
  };
};

export const getBackendStatus = async (): Promise<BackendInfo> => {
  if (import.meta.env.PROD) {
    // In production, always use configured URL
    return {
      url: import.meta.env.VITE_API_BASE_URL || '/api',
      status: 'connected',
      message: 'Production backend'
    };
  }

  // In development, detect backend
  return await detectBackend();
};

export const logBackendInfo = async (): Promise<void> => {
  const info = await getBackendStatus();
  console.log('🔗 Backend Status:', info);
  
  if (info.status === 'disconnected') {
    console.warn('⚠️ Backend server not found. Please start your backend server on one of these ports:', COMMON_BACKEND_PORTS);
    console.warn('💡 Or set VITE_API_BASE_URL environment variable to your backend URL');
  }
};

// Auto-detect backend on module load in development
if (import.meta.env.DEV) {
  logBackendInfo();
}
