import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download,
  RefreshCw,
  UserCheck,
  UserX,
  Trash2
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Registration {
  id: string
  team_name: string
  college: string
  captain_name: string
  captain_email: string
  captain_phone: string
  team_members: string[]
  status: 'pending' | 'verified' | 'rejected'
  created_at: string
  notes?: string
  college_id_url?: string
}

const RegistrationManagement = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createFormData, setCreateFormData] = useState({
    team_name: '',
    college: '',
    captain_name: '',
    captain_email: '',
    captain_phone: '',
    team_members: ['', '', '', ''],
    notes: ''
  })

  // Fetch registrations from Supabase
  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Fetching registrations from Supabase...')
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching registrations:', error)
        setError('Failed to fetch registrations. Please try again.')
        return
      }

      console.log('Fetched registrations:', data)
      setRegistrations(data || [])
    } catch (error) {
      console.error('Error:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial load
    const timer = setTimeout(() => {
      fetchRegistrations()
    }, 100)

    // Realtime updates
    const channel = supabase
      .channel('registrations-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'registrations' }, (payload) => {
        // Lightweight reconciliation to avoid full refetch
        if (payload.eventType === 'INSERT') {
          setRegistrations(prev => [payload.new as any, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          const updated = payload.new as any
          setRegistrations(prev => prev.map(r => (r.id === updated.id ? { ...r, ...updated } : r)))
        } else if (payload.eventType === 'DELETE') {
          const removed = payload.old as any
          setRegistrations(prev => prev.filter(r => r.id !== removed.id))
        }
      })
      .subscribe()

    return () => {
      clearTimeout(timer)
      supabase.removeChannel(channel)
    }
  }, [])

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = reg.team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.captain_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || reg.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = async (id: string, newStatus: 'verified' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) {
        console.error('Error updating registration status:', error)
        setError('Failed to update registration status. Please try again.')
        return
      }

      // Update local state
      setRegistrations(prev => 
        prev.map(reg => 
          reg.id === id ? { ...reg, status: newStatus } : reg
        )
      )
    } catch (error) {
      console.error('Error:', error)
      setError('An unexpected error occurred. Please try again.')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500 text-white"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>
      case 'rejected':
        return <Badge className="bg-red-500 text-white"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      default:
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>
    }
  }

  const handleCreateRegistration = async () => {
    try {
      const registrationData = {
        team_name: createFormData.team_name,
        college: createFormData.college,
        captain_name: createFormData.captain_name,
        captain_email: createFormData.captain_email,
        captain_phone: createFormData.captain_phone,
        team_members: createFormData.team_members.filter(member => member.trim() !== ''),
        notes: createFormData.notes || null
      }

      const { data, error } = await supabase
        .from('registrations')
        .insert(registrationData)
        .select()
        .single()

      if (error) {
        console.error('Error creating registration:', error)
        setError('Failed to create registration. Please try again.')
        return
      }

      setRegistrations(prev => [data, ...prev])
      setShowCreateForm(false)
      setCreateFormData({
        team_name: '',
        college: '',
        captain_name: '',
        captain_email: '',
        captain_phone: '',
        team_members: ['', '', '', ''],
        notes: ''
      })
    } catch (error) {
      console.error('Error:', error)
      setError('An unexpected error occurred. Please try again.')
    }
  }

  const handleDeleteRegistration = async (id: string) => {
    try {
      const reg = registrations.find(r => r.id === id)
      const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting registration:', error)
        setError('Failed to delete registration. Please try again.')
        return
      }

      setRegistrations(prev => prev.filter(r => r.id !== id))
      if (selectedRegistration?.id === id) setSelectedRegistration(null)

      // Best-effort: delete uploaded College ID from storage if present
      if (reg?.college_id_url) {
        try {
          const objectPath = reg.college_id_url.replace(/^college-ids\//, '')
          await supabase.storage.from('college-ids').remove([objectPath])
        } catch (e) {
          // ignore; not critical for UX
          console.warn('Storage remove failed', e)
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setError('An unexpected error occurred. Please try again.')
    }
  }

  const exportRegistrations = () => {
    const csvContent = [
      ['Team Name', 'College', 'Captain', 'Email', 'Phone', 'Status', 'Date'],
      ...filteredRegistrations.map(reg => [
        reg.team_name,
        reg.college,
        reg.captain_name,
        reg.captain_email,
        reg.captain_phone,
        reg.status,
        new Date(reg.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'registrations.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Registration Management</h1>
              <p className="text-muted-foreground">Manage team registrations and verification status</p>
            </div>
            <Button onClick={() => {
              console.log('Force refreshing registrations...')
              fetchRegistrations()
            }} variant="outline" disabled={loading}>
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
                  <p className="text-sm font-medium text-muted-foreground">Total Teams</p>
                  <p className="text-2xl font-bold">{registrations.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {registrations.filter(r => r.status === 'pending').length}
                  </p>
                </div>
                <RefreshCw className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Verified</p>
                  <p className="text-2xl font-bold text-green-600">
                    {registrations.filter(r => r.status === 'verified').length}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">
                    {registrations.filter(r => r.status === 'rejected').length}
                  </p>
                </div>
                <UserX className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Registration Form */}
        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create New Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="team_name">Team Name</Label>
                  <Input
                    id="team_name"
                    value={createFormData.team_name}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, team_name: e.target.value }))}
                    placeholder="Enter team name"
                  />
                </div>
                <div>
                  <Label htmlFor="college">College</Label>
                  <Input
                    id="college"
                    value={createFormData.college}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, college: e.target.value }))}
                    placeholder="Enter college name"
                  />
                </div>
                <div>
                  <Label htmlFor="captain_name">Captain Name</Label>
                  <Input
                    id="captain_name"
                    value={createFormData.captain_name}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, captain_name: e.target.value }))}
                    placeholder="Enter captain name"
                  />
                </div>
                <div>
                  <Label htmlFor="captain_email">Captain Email</Label>
                  <Input
                    id="captain_email"
                    type="email"
                    value={createFormData.captain_email}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, captain_email: e.target.value }))}
                    placeholder="Enter captain email"
                  />
                </div>
                <div>
                  <Label htmlFor="captain_phone">Captain Phone</Label>
                  <Input
                    id="captain_phone"
                    value={createFormData.captain_phone}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, captain_phone: e.target.value }))}
                    placeholder="Enter captain phone"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    value={createFormData.notes}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Enter any notes"
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label>Team Members</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {createFormData.team_members.map((member, index) => (
                    <Input
                      key={index}
                      value={member}
                      onChange={(e) => {
                        const newMembers = [...createFormData.team_members]
                        newMembers[index] = e.target.value
                        setCreateFormData(prev => ({ ...prev, team_members: newMembers }))
                      }}
                      placeholder={`Team member ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleCreateRegistration}>
                  <Users className="h-4 w-4 mr-2" />
                  Create Registration
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Teams</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by team name, college, or captain..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <Label htmlFor="status">Filter by Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={() => setShowCreateForm(!showCreateForm)} variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  {showCreateForm ? 'Cancel' : 'Add Team'}
                </Button>
                <Button onClick={exportRegistrations} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registrations List */}
        <Card>
          <CardHeader>
            <CardTitle>Team Registrations ({filteredRegistrations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Loading registrations...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRegistrations.map((registration) => (
                  <div key={registration.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="font-semibold text-lg">{registration.team_name}</h3>
                          {getStatusBadge(registration.status)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <p><strong>College:</strong> {registration.college}</p>
                          <p><strong>Captain:</strong> {registration.captain_name}</p>
                          <p><strong>Email:</strong> {registration.captain_email}</p>
                          <p><strong>Phone:</strong> {registration.captain_phone}</p>
                          <p><strong>Registered:</strong> {new Date(registration.created_at).toLocaleDateString()}</p>
                          <p><strong>Team Size:</strong> {registration.team_members.length}/4</p>
                        </div>
                        {registration.notes && (
                          <p className="text-sm text-blue-600 mt-2"><strong>Notes:</strong> {registration.notes}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedRegistration(registration)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        {registration.college_id_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              try {
                                const { data, error } = await supabase.storage
                                  .from('college-ids')
                                  .createSignedUrl(registration.college_id_url!, 60 * 10)
                                if (error) throw error
                                window.open(data.signedUrl, '_blank')
                              } catch (e) {
                                console.error(e)
                                setError('Failed to open College ID. Please try again.')
                              }
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View ID
                          </Button>
                        )}
                        {registration.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600"
                              onClick={() => handleStatusChange(registration.id, 'verified')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Verify
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusChange(registration.id, 'rejected')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                        {(registration.status === 'verified' || registration.status === 'rejected') && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteRegistration(registration.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {filteredRegistrations.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No registrations found matching your criteria.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Details Dialog */}
      <Dialog open={!!selectedRegistration} onOpenChange={(open) => !open && setSelectedRegistration(null)}>
        <DialogContent>
          {selectedRegistration && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedRegistration.team_name}</DialogTitle>
                <DialogDescription>
                  Registered on {new Date(selectedRegistration.created_at).toLocaleString()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2 text-sm">
                <p><strong>College:</strong> {selectedRegistration.college}</p>
                <p><strong>Captain:</strong> {selectedRegistration.captain_name}</p>
                <p><strong>Email:</strong> {selectedRegistration.captain_email}</p>
                <p><strong>Phone:</strong> {selectedRegistration.captain_phone}</p>
                <p><strong>Status:</strong> {selectedRegistration.status}</p>
                <p><strong>Team Members:</strong> {selectedRegistration.team_members.join(', ')}</p>
                {selectedRegistration.notes && (
                  <p><strong>Notes:</strong> {selectedRegistration.notes}</p>
                )}
              </div>

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setSelectedRegistration(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default RegistrationManagement
