import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'

export function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Page</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Profile page coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
