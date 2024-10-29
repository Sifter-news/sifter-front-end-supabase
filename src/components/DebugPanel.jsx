import React from 'react';
import { useDebug } from '@/contexts/DebugContext';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/components/AuthProvider';
import { useInvestigations } from '@/integrations/supabase/hooks/useInvestigations';

const DebugPanel = () => {
  const { isDebugOpen, setIsDebugOpen, debugData, showNodeDebug, setShowNodeDebug } = useDebug();
  const { user } = useAuth();
  const { data: investigations } = useInvestigations({ 
    filter: user ? `owner_id.eq.${user?.id}` : undefined 
  });

  if (!isDebugOpen) return null;

  return (
    <div className="fixed top-4 right-4 w-96 bg-black/90 text-white rounded-lg shadow-xl z-[9999] backdrop-blur-sm">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold">Debug Panel</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Switch
              checked={showNodeDebug}
              onCheckedChange={setShowNodeDebug}
              className="data-[state=checked]:bg-green-500"
            />
            <span className="text-sm">Show Node Debug</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDebugOpen(false)}
            className="text-white hover:text-white/80"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-[500px] p-4">
        <div className="space-y-4">
          {/* Authentication Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white/80">Authentication</h3>
            <div className="bg-black/50 p-2 rounded">
              <p className="text-xs">Logged in: {user ? 'Yes' : 'No'}</p>
              {user && (
                <>
                  <p className="text-xs">User ID: {user.id}</p>
                  <p className="text-xs">Email: {user.email}</p>
                </>
              )}
            </div>
          </div>

          {/* Projects Section */}
          {user && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-white/80">Projects</h3>
              <div className="bg-black/50 p-2 rounded">
                {investigations?.length > 0 ? (
                  <ul className="space-y-1">
                    {investigations.map((investigation) => (
                      <li key={investigation.id} className="text-xs">
                        {investigation.title} (ID: {investigation.id})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs">No projects found</p>
                )}
              </div>
            </div>
          )}

          {/* Debug Data Section */}
          {Object.entries(debugData).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <h3 className="text-sm font-medium text-white/80">{key}</h3>
              <pre className="bg-black/50 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(value, null, 2)}
              </pre>
            </div>
          ))}
          {Object.keys(debugData).length === 0 && (
            <p className="text-white/60 text-sm">No debug data available</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DebugPanel;