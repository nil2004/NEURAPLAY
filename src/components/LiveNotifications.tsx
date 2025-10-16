import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, X, Trophy, Users, Clock, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

type NotificationRow = {
  id: string
  title: string
  message: string
  type: "general" | "tournament" | "registration" | "urgent"
  status: "draft" | "scheduled" | "sent"
  created_at: string
}

const iconByType: Record<string, any> = {
  tournament: Trophy,
  registration: Users,
  urgent: AlertCircle,
  general: Clock,
}

const LiveNotifications = () => {
  const [notifications, setNotifications] = useState<{
    id: string
    title: string
    message: string
    created_at: string
    isRead: boolean
    Icon: any
    color: string
  }[]>([])
  const [loading, setLoading] = useState(false)

  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from<NotificationRow>('notifications')
          .select('id, title, message, type, status, created_at')
          .order('created_at', { ascending: false })
          .limit(10)

        if (error) {
          // Fail silently in UI; keep empty list
          // eslint-disable-next-line no-console
          console.error('LiveNotifications fetch error', error)
          setNotifications([])
          return
        }

        const mapped = (data || []).map((n) => {
          const Icon = iconByType[n.type] || Clock
          const color = n.type === 'urgent' ? 'text-red-600' : n.type === 'tournament' ? 'text-green-600' : n.type === 'registration' ? 'text-blue-600' : 'text-gray-600'
          return {
            id: n.id,
            title: n.title,
            message: n.message,
            created_at: n.created_at,
            isRead: n.status === 'sent',
            Icon,
            color,
          }
        })
        setNotifications(mapped)
      } finally {
        setLoading(false)
      }
    }

    fetchLatest()

    // Realtime notifications for navbar bell
    const channel = supabase
      .channel('live-notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const n: any = payload.new
          const Icon = iconByType[n.type] || Clock
          const color = n.type === 'urgent' ? 'text-red-600' : n.type === 'tournament' ? 'text-green-600' : n.type === 'registration' ? 'text-blue-600' : 'text-gray-600'
          setNotifications(prev => ([{
            id: n.id,
            title: n.title,
            message: n.message,
            created_at: n.created_at,
            isRead: n.status === 'sent',
            Icon,
            color,
          }, ...prev].slice(0, 10)))
        } else if (payload.eventType === 'UPDATE') {
          const n: any = payload.new
          setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, title: n.title, message: n.message, created_at: n.created_at } : item))
        } else if (payload.eventType === 'DELETE') {
          const o: any = payload.old
          setNotifications(prev => prev.filter(item => item.id !== o.id))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 p-0"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-white/90 backdrop-blur-lg border rounded-lg shadow-xl z-50">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => {
                const IconComponent = notification.Icon;
                return (
                  <div
                    key={notification.id}
                    className={`p-4 border-b hover:bg-muted/50 transition-colors ${
                      !notification.isRead ? "bg-blue-50" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <IconComponent className={`h-4 w-4 mt-0.5 ${notification.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold">{notification.title}</h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          <div className="p-4 border-t text-center">
            <Button variant="ghost" size="sm" className="text-xs">
              View all notifications
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveNotifications;
