import { useState, useEffect } from 'react';
import { Activity, Brain, Settings, Zap, Server, MemoryStick } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { chatAPI, AdminConfig, AdminStats, FeatureFlags } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export default function Admin() {
  const [config, setConfig] = useState<AdminConfig | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [features, setFeatures] = useState<FeatureFlags>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [configData, statsData, featuresData] = await Promise.all([
        chatAPI.getAdminConfig(),
        chatAPI.getAdminStats(),
        chatAPI.getFeatureFlags(),
      ]);
      
      setConfig(configData);
      setStats(statsData);
      setFeatures(featuresData);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (key: string, value: any) => {
    try {
      await chatAPI.updateAdminConfig(key, value);
      setConfig(prev => prev ? { ...prev, [key]: value } : null);
      
      toast({
        title: "Configuration updated",
        description: `${key} has been updated successfully`,
      });
    } catch (error) {
      console.error('Error updating config:', error);
      toast({
        title: "Error",
        description: "Failed to update configuration",
        variant: "destructive",
      });
    }
  };

  const updateFeature = async (key: string, value: boolean) => {
    try {
      await chatAPI.updateFeatureFlag(key, value);
      setFeatures(prev => ({ ...prev, [key]: value }));
      
      toast({
        title: "Feature updated",
        description: `${key} has been ${value ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      console.error('Error updating feature:', error);
      toast({
        title: "Error",
        description: "Failed to update feature flag",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-glow-pulse">
            <Settings size={48} className="text-primary mx-auto" />
          </div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Monitor and configure your TaporiBrain AGI system
        </p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Environment</CardTitle>
            <Server size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.environment}</div>
            <Badge variant="outline" className="mt-1">
              {stats?.uptime}
            </Badge>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Model</CardTitle>
            <Brain size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.model_info.name}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.model_info.version}
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {stats?.active_sessions}
            </div>
            <p className="text-xs text-muted-foreground">Connected users</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <MemoryStick size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy">
              {stats?.memory_usage || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              CPU: {stats?.cpu_usage || 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings size={20} />
              Configuration
            </CardTitle>
            <CardDescription>
              Adjust system settings and parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {config && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={config.model}
                    onChange={(e) => updateConfig('model', e.target.value)}
                    placeholder="Model name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input
                    id="temperature"
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={config.temperature}
                    onChange={(e) => updateConfig('temperature', parseFloat(e.target.value))}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Streaming</Label>
                    <p className="text-xs text-muted-foreground">
                      Enable real-time message streaming
                    </p>
                  </div>
                  <Switch
                    checked={config.streaming}
                    onCheckedChange={(checked) => updateConfig('streaming', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Agent Switching</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow dynamic agent selection
                    </p>
                  </div>
                  <Switch
                    checked={config.agent_switching}
                    onCheckedChange={(checked) => updateConfig('agent_switching', checked)}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Feature Flags */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap size={20} />
              Feature Flags
            </CardTitle>
            <CardDescription>
              Enable or disable experimental features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(features).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="capitalize">
                    {key.replace(/_/g, ' ')}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {value ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => updateFeature(key, checked)}
                />
              </div>
            ))}

            {Object.keys(features).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No feature flags configured
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>System Actions</CardTitle>
          <CardDescription>
            Perform administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              className="btn-saffron"
              onClick={loadData}
            >
              Refresh Data
            </Button>
            <Button 
              variant="outline" 
              className="btn-glass"
            >
              Export Logs
            </Button>
            <Button 
              variant="outline" 
              className="btn-glass"
            >
              Clear Cache
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}