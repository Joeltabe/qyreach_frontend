// import { useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import { api } from '@/lib/api'

// export function TestConnection() {
//   const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
//   const [message, setMessage] = useState('')

//   const testConnection = async () => {
//     setStatus('loading')
//     setMessage('')

//     try {
//       // Test basic connection
//       const response = await api.get('/api/health')
//       setStatus('success')
//       setMessage(`Connection successful! Backend responded: ${JSON.stringify(response.data)}`)
//     } catch (error: any) {
//       setStatus('error')
//       setMessage(`Connection failed: ${error.message || 'Unknown error'}`)
//     }
//   }

//   const testAuth = async () => {
//     setStatus('loading')
//     setMessage('')

//     try {
//       // Test authentication
//       const loginData = {
//         email: 'test@example.com',
//         password: 'password123'
//       }
      
//       const response = await api.post('/api/auth/login', loginData)
//       setStatus('success')
//       setMessage(`Authentication test successful! Response: ${JSON.stringify(response.data)}`)
//     } catch (error: any) {
//       setStatus('error')
//       setMessage(`Authentication test failed: ${error.message || 'Unknown error'}`)
//     }
//   }

//   return (
//     <Card className="w-full max-w-md mx-auto">
//       <CardHeader>
//         <CardTitle>Connection Test</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="space-y-2">
//           <Button 
//             onClick={testConnection} 
//             disabled={status === 'loading'}
//             className="w-full"
//           >
//             {status === 'loading' ? 'Testing...' : 'Test Basic Connection'}
//           </Button>
          
//           <Button 
//             onClick={testAuth} 
//             disabled={status === 'loading'}
//             variant="outline"
//             className="w-full"
//           >
//             {status === 'loading' ? 'Testing...' : 'Test Authentication'}
//           </Button>
//         </div>

//         {message && (
//           <Alert variant={status === 'error' ? 'destructive' : 'default'}>
//             <AlertDescription className="text-sm break-words">
//               {message}
//             </AlertDescription>
//           </Alert>
//         )}
//       </CardContent>
//     </Card>
//   )
// }
