import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import SupabaseConnectionTest from "@/components/SupabaseConnectionTest";
import { 
  Users, 
  Bell, 
  UserCheck,
  UserX,
  RefreshCw,
  CheckCircle,
  Clock,
  Settings,
  ArrowRight
} from "lucide-react";

const Dashboard = () => {
  const [registrationStats, setRegistrationStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    rejected: 0
  })
  
  const [notificationStats, setNotificationStats] = useState({
    total: 0,
    sent: 0,
    scheduled: 0,
    drafts: 0
  })
  
  const [recentRegistrations, setRecentRegistrations] = useState([])
  const [recentNotifications, setRecentNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch dashboard data from Supabase
  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch registration stats
      console.log('Fetching registration stats from Supabase...')
      const { data: registrations, error: regError } = await supabase
        .from('registrations')
        .select('status')

      if (regError) {
        console.error('Error fetching registrations:', regError)
      } else {
        console.log('Fetched registrations for stats:', registrations)
        const stats = {
          total: registrations?.length || 0,
          pending: registrations?.filter(r => r.status === 'pending').length || 0,
          verified: registrations?.filter(r => r.status === 'verified').length || 0,
          rejected: registrations?.filter(r => r.status === 'rejected').length || 0
        }
        console.log('Registration stats:', stats)
        setRegistrationStats(stats)
      }

      // Fetch notification stats
      const { data: notifications, error: notifError } = await supabase
        .from('notifications')
        .select('status')

      if (notifError) {
        console.error('Error fetching notifications:', notifError)
      } else {
        const stats = {
          total: notifications?.length || 0,
          sent: notifications?.filter(n => n.status === 'sent').length || 0,
          scheduled: notifications?.filter(n => n.status === 'scheduled').length || 0,
          drafts: notifications?.filter(n => n.status === 'draft').length || 0
        }
        setNotificationStats(stats)
      }

      // Fetch recent registrations
      const { data: recentRegs, error: recentRegError } = await supabase
        .from('registrations')
        .select('id, team_name, college, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5)

      if (recentRegError) {
        console.error('Error fetching recent registrations:', recentRegError)
      } else {
        setRecentRegistrations(recentRegs || [])
      }

      // Fetch recent notifications
      const { data: recentNotifs, error: recentNotifError } = await supabase
        .from('notifications')
        .select('id, title, type, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5)

      if (recentNotifError) {
        console.error('Error fetching recent notifications:', recentNotifError)
      } else {
        setRecentNotifications(recentNotifs || [])
      }

    } catch (error) {
      console.error('Error:', error)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Add a small delay to ensure Supabase connection is ready
    const timer = setTimeout(() => {
      fetchDashboardData()
    }, 100)

    // Realtime subscriptions to keep stats fresh
    const regChannel = supabase
      .channel('dashboard-registrations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'registrations' }, () => {
        fetchDashboardData()
      })
      .subscribe()

    const notifChannel = supabase
      .channel('dashboard-notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
        fetchDashboardData()
      })
      .subscribe()

    return () => {
      clearTimeout(timer)
      supabase.removeChannel(regChannel)
      supabase.removeChannel(notifChannel)
    }
  }, [])

  // Registration stats configuration
  const registrationStatsConfig = [
    { 
      title: "Total Teams", 
      value: registrationStats.total.toString(), 
      icon: Users, 
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    { 
      title: "Pending Review", 
      value: registrationStats.pending.toString(), 
      icon: RefreshCw, 
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    { 
      title: "Verified Teams", 
      value: registrationStats.verified.toString(), 
      icon: UserCheck, 
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    { 
      title: "Rejected Teams", 
      value: registrationStats.rejected.toString(), 
      icon: UserX, 
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
  ];

  // Notification stats configuration
  const notificationStatsConfig = [
    { 
      title: "Total Notifications", 
      value: notificationStats.total.toString(), 
      icon: Bell, 
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    { 
      title: "Sent", 
      value: notificationStats.sent.toString(), 
      icon: CheckCircle, 
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    { 
      title: "Scheduled", 
      value: notificationStats.scheduled.toString(), 
      icon: Clock, 
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    { 
      title: "Drafts", 
      value: notificationStats.drafts.toString(), 
      icon: Settings, 
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200"
    },
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage registrations and notifications for your tournament.</p>
            </div>
            <Button onClick={fetchDashboardData} variant="outline" disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setError(null)}
                className="ml-2 text-red-600 hover:text-red-800"
              >
                ×
              </Button>
            </div>
          )}
        </div>

        {/* Registration Stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Registration Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {registrationStatsConfig.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className={`${stat.bgColor} ${stat.borderColor} border-2`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.bgColor}`}>
                        <IconComponent className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Notification Stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Notification Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {notificationStatsConfig.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className={`${stat.bgColor} ${stat.borderColor} border-2`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.bgColor}`}>
                        <IconComponent className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Registrations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <UserCheck className="h-5 w-5 mr-2" />
                  Recent Team Registrations
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/admin/registrations">
                    <ArrowRight className="h-4 w-4 mr-1" />
                    Manage
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentRegistrations.map((registration) => (
                    <div key={registration.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold">{registration.team_name}</p>
                        <p className="text-sm text-muted-foreground">{registration.college}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(registration.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge 
                        variant={registration.status === "verified" ? "default" : "secondary"}
                        className={registration.status === "verified" ? "bg-green-500" : "bg-yellow-500"}
                      >
                        {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Recent Notifications
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/admin/notifications">
                    <ArrowRight className="h-4 w-4 mr-1" />
                    Manage
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentNotifications.map((notification) => (
                    <div key={notification.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">{notification.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge 
                        variant={notification.status === "sent" ? "default" : notification.status === "scheduled" ? "secondary" : "outline"}
                        className={notification.status === "sent" ? "bg-green-500" : notification.status === "scheduled" ? "bg-yellow-500" : ""}
                      >
                        {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Supabase Connection Test */}
        <div className="mt-8">
          <SupabaseConnectionTest />
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button asChild className="flex items-center justify-center h-20 flex-col space-y-2" variant="outline">
                <Link to="/admin/registrations">
                  <Users className="h-6 w-6" />
                  <span>Manage Registrations</span>
                </Link>
              </Button>
              <Button asChild className="flex items-center justify-center h-20 flex-col space-y-2" variant="outline">
                <Link to="/admin/notifications">
                  <Bell className="h-6 w-6" />
                  <span>Manage Notifications</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
