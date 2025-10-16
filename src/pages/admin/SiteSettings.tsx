import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RefreshCw, Save } from 'lucide-react'

type Settings = {
  id: string
  hero_title: string
  hero_subtitle: string
  event_date: string
  countdown_label: string
}

const SiteSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // helpers to convert between ISO (UTC) and input[type=datetime-local]
  const isoToLocalInput = (iso?: string) => {
    if (!iso) return ''
    const d = new Date(iso)
    const offset = d.getTimezoneOffset()
    const local = new Date(d.getTime() - offset * 60000)
    return local.toISOString().slice(0, 16)
  }

  const localInputToIso = (value: string) => {
    // Treat input as local wall time; convert to the equivalent UTC ISO
    const d = new Date(value)
    const offset = d.getTimezoneOffset()
    const utc = new Date(d.getTime() - offset * 60000)
    return utc.toISOString()
  }

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'main')
        .single()
      if (error) throw error
      setSettings({
        id: data.id,
        hero_title: data.hero_title,
        hero_subtitle: data.hero_subtitle,
        event_date: data.event_date,
        countdown_label: data.countdown_label ?? 'Tournament starts in:',
      })
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const save = async () => {
    if (!settings) return
    try {
      setSaving(true)
      const { error } = await supabase
        .from('site_settings')
        .upsert({ ...settings, id: 'main' })
      if (error) throw error
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Site Settings</CardTitle>
            <Button variant="outline" onClick={load} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-600 mb-4">{error}</p>}
            {!settings ? (
              <p>Loading...</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="hero_title">Hero Title</Label>
                  <Input id="hero_title" value={settings.hero_title} onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
                  <Input id="hero_subtitle" value={settings.hero_subtitle} onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="event_date">Event Date & Time</Label>
                  <Input
                    id="event_date"
                    type="datetime-local"
                    value={isoToLocalInput(settings.event_date)}
                    onChange={(e) => setSettings({ ...settings, event_date: localInputToIso(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="countdown_label">Countdown Label</Label>
                  <Input id="countdown_label" value={settings.countdown_label} onChange={(e) => setSettings({ ...settings, countdown_label: e.target.value })} />
                </div>
                <div className="pt-2">
                  <Button onClick={save} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SiteSettings


