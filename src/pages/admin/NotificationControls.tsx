import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { 
  Bell, 
  Send, 
  Users, 
  Calendar, 
  Trophy, 
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  Eye,
  Trash2,
  Plus,
  RefreshCw
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Notification {
  id: string
  title: string
  message: string
  type: 'general' | 'tournament' | 'registration' | 'urgent'
  target_audience: 'all' | 'registered' | 'pending' | 'verified'
  status: 'draft' | 'scheduled' | 'sent'
  scheduled_at?: string
  created_at: string
  sent_count?: number
}

const NotificationControls = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'general' as const,
    target_audience: 'all' as const,
    scheduled_at: ''
  })

  // Fetch notifications from Supabase
  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching notifications:', error)
        setError('Failed to fetch notifications. Please try again.')
        return
      }

      setNotifications(data || [])
    } catch (error) {
      console.error('Error:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()

    // Realtime updates for notifications
    const channel = supabase
      .channel('notifications-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setNotifications(prev => [payload.new as any, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          const updated = payload.new as any
          setNotifications(prev => prev.map(n => (n.id === updated.id ? { ...n, ...updated } : n)))
        } else if (payload.eventType === 'DELETE') {
          const removed = payload.old as any
          setNotifications(prev => prev.filter(n => n.id !== removed.id))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'urgent':
        return <Badge className="bg-red-500 text-white"><AlertCircle className="h-3 w-3 mr-1" />Urgent</Badge>
      case 'tournament':
        return <Badge className="bg-blue-500 text-white"><Trophy className="h-3 w-3 mr-1" />Tournament</Badge>
      case 'registration':
        return <Badge className="bg-green-500 text-white"><Users className="h-3 w-3 mr-1" />Registration</Badge>
      default:
        return <Badge className="bg-gray-500 text-white"><Bell className="h-3 w-3 mr-1" />General</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-500 text-white"><CheckCircle className="h-3 w-3 mr-1" />Sent</Badge>
      case 'scheduled':
        return <Badge className="bg-yellow-500 text-white"><Clock className="h-3 w-3 mr-1" />Scheduled</Badge>
      default:
        return <Badge className="bg-gray-500 text-white">Draft</Badge>
    }
  }

  const getTargetAudienceLabel = (audience: string) => {
    switch (audience) {
      case 'all': return 'All Users'
      case 'registered': return 'Registered Teams'
      case 'pending': return 'Pending Teams'
      case 'verified': return 'Verified Teams'
      default: return audience
    }
  }

  const handleCreateNotification = async () => {
    try {
      const notificationData = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        target_audience: formData.target_audience,
        status: formData.scheduled_at ? 'scheduled' : 'draft',
        scheduled_at: formData.scheduled_at || null
      }

      const { data, error } = await supabase
        .from('notifications')
        .insert(notificationData)
        .select()
        .single()

      if (error) {
        console.error('Error creating notification:', error)
        setError('Failed to create notification. Please try again.')
        return
      }

      setNotifications(prev => [data, ...prev])
      setShowCreateForm(false)
      setFormData({
        title: '',
        message: '',
        type: 'general',
        target_audience: 'all',
        scheduled_at: ''
      })
    } catch (error) {
      console.error('Error:', error)
      setError('An unexpected error occurred. Please try again.')
    }
  }

  const handleSendNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          status: 'sent', 
          sent_at: new Date().toISOString(),
          sent_count: 156 // This would be calculated based on actual recipients
        })
        .eq('id', id)

      if (error) {
        console.error('Error sending notification:', error)
        return
      }

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { 
            ...notif, 
            status: 'sent', 
            sent_at: new Date().toISOString(),
            sent_count: 156 
          } : notif
        )
      )
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDeleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting notification:', error)
        return
      }

      setNotifications(prev => prev.filter(notif => notif.id !== id))
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const stats = {
    total: notifications.length,
    sent: notifications.filter(n => n.status === 'sent').length,
    scheduled: notifications.filter(n => n.status === 'scheduled').length,
    drafts: notifications.filter(n => n.status === 'draft').length
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Notification Controls</h1>
              <p className="text-muted-foreground">Manage and send notifications to tournament participants</p>
            </div>
            <Button onClick={fetchNotifications} variant="outline" disabled={loading}>
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Notifications</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Bell className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sent</p>
                  <p className="text-2xl font-bold text-green-600">{stats.sent}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.scheduled}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Drafts</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.drafts}</p>
                </div>
                <Settings className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Notification Form */}
        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create New Notification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter notification title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Enter notification message"
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="tournament">Tournament</SelectItem>
                        <SelectItem value="registration">Registration</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="audience">Target Audience</Label>
                    <Select value={formData.target_audience} onValueChange={(value) => setFormData(prev => ({ ...prev, target_audience: value as any }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="registered">Registered Teams</SelectItem>
                        <SelectItem value="pending">Pending Teams</SelectItem>
                        <SelectItem value="verified">Verified Teams</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="schedule">Schedule (Optional)</Label>
                    <Input
                      id="schedule"
                      type="datetime-local"
                      value={formData.scheduled_at}
                      onChange={(e) => setFormData(prev => ({ ...prev, scheduled_at: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleCreateNotification}>
                    <Send className="h-4 w-4 mr-2" />
                    {formData.scheduled_at ? 'Schedule' : 'Save Draft'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Notifications ({notifications.length})</CardTitle>
              <Button onClick={() => setShowCreateForm(!showCreateForm)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Notification
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <Clock className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Loading notifications...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{notification.title}</h3>
                          {getTypeBadge(notification.type)}
                          {getStatusBadge(notification.status)}
                        </div>
                        
                        <p className="text-gray-700 mb-3">{notification.message}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                          <p><strong>Target:</strong> {getTargetAudienceLabel(notification.target_audience)}</p>
                          <p><strong>Created:</strong> {new Date(notification.created_at).toLocaleDateString()}</p>
                          {notification.scheduled_at && (
                            <p><strong>Scheduled:</strong> {new Date(notification.scheduled_at).toLocaleString()}</p>
                          )}
                          {notification.sent_count && (
                            <p><strong>Sent to:</strong> {notification.sent_count} users</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingNotification(notification)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        
                        {notification.status === 'draft' && (
                          <Button
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600"
                            onClick={() => handleSendNotification(notification.id)}
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Send Now
                          </Button>
                        )}
                        
                        {notification.status === 'scheduled' && (
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() => handleSendNotification(notification.id)}
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Send Now
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {notifications.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No notifications found. Create your first notification above.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default NotificationControls
