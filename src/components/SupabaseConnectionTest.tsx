import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';

const SupabaseConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dataCount, setDataCount] = useState<{registrations: number, notifications: number} | null>(null);

  const testConnection = async () => {
    try {
      setConnectionStatus('loading');
      setErrorMessage(null);
      
      console.log('Testing Supabase connection...');
      
      // Test registrations table
      const { data: registrations, error: regError } = await supabase
        .from('registrations')
        .select('id')
        .limit(1);
      
      if (regError) {
        console.error('Registrations error:', regError);
        setConnectionStatus('error');
        setErrorMessage(`Registrations table error: ${regError.message}`);
        return;
      }
      
      // Test notifications table
      const { data: notifications, error: notifError } = await supabase
        .from('notifications')
        .select('id')
        .limit(1);
      
      if (notifError) {
        console.error('Notifications error:', notifError);
        setConnectionStatus('error');
        setErrorMessage(`Notifications table error: ${notifError.message}`);
        return;
      }
      
      // Get actual counts
      const { count: regCount } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true });
        
      const { count: notifCount } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true });
      
      console.log('Connection successful!');
      console.log('Registrations count:', regCount);
      console.log('Notifications count:', notifCount);
      
      setConnectionStatus('connected');
      setDataCount({
        registrations: regCount || 0,
        notifications: notifCount || 0
      });
      
    } catch (err: any) {
      console.error('Connection test error:', err);
      setConnectionStatus('error');
      setErrorMessage(err.message);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          {connectionStatus === 'loading' && <Loader2 className="h-5 w-5 mr-2 animate-spin text-blue-500" />}
          {connectionStatus === 'connected' && <CheckCircle className="h-5 w-5 mr-2 text-green-500" />}
          {connectionStatus === 'error' && <XCircle className="h-5 w-5 mr-2 text-red-500" />}
          Supabase Connection Test
        </CardTitle>
      </CardHeader>
      <CardContent>
        {connectionStatus === 'loading' && <p className="text-blue-500">Testing connection...</p>}
        
        {connectionStatus === 'connected' && (
          <div>
            <p className="text-green-600 font-medium mb-2">✅ Connected to Supabase!</p>
            <div className="text-sm text-gray-600">
              <p>Registrations: {dataCount?.registrations || 0}</p>
              <p>Notifications: {dataCount?.notifications || 0}</p>
            </div>
          </div>
        )}
        
        {connectionStatus === 'error' && (
          <div>
            <p className="text-red-600 font-medium">❌ Connection Error:</p>
            <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
          </div>
        )}
        
        <div className="mt-4">
          <Button onClick={testConnection} variant="outline" size="sm" className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Test Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupabaseConnectionTest;
