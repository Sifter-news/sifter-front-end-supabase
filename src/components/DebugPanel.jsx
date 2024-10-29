import React, { useState } from 'react';
import { useDebug } from '@/contexts/DebugContext';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/components/AuthProvider';
import { useInvestigations } from '@/integrations/supabase/hooks/useInvestigations';
import { useLocation } from 'react-router-dom';
import { Rnd } from 'react-rnd';

const DebugPanel = () => {
  const { isDebugOpen, setIsDebugOpen, debugData } = useDebug();
  const { user } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showGuides, setShowGuides] = useState(true);
  const { data: investigations } = useInvestigations({ 
    filter: user ? `owner_id.eq.${user?.id}` : undefined 
  });

  if (!isDebugOpen) return null;

  const getCurrentView = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/project/')) return 'Project View';
    if (path === '/projects') return 'Projects List';
    return path;
  };

  const currentProjectId = location.pathname.split('/project/')[1];
  const currentProject = investigations?.find(inv => inv.id === currentProjectId);

  const getToolDescription = (tool) => {
    switch (tool) {
      case 'pan':
        return 'Pans view in X/Y axes (hold Space)';
      case 'select':
        return 'Select and move nodes';
      default:
        return 'No tool selected';
    }
  };

  const colorizeValue = (value, axis) => {
    const color = axis === 'x' ? 'text-red-500' : axis === 'y' ? 'text-green-500' : 'text-blue-500';
    return <span className={color}>{value}</span>;
  };

  const panelContent = isCollapsed ? (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsCollapsed(false)}
      className="text-white hover:text-white/80 p-2"
    >
      <Maximize2 className="h-4 w-4" />
    </Button>
  ) : (
    <>
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold">Debug Panel</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(true)}
            className="text-white hover:text-white/80"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
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
          {/* View and Tool Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white/80">Current State</h3>
            <div className="bg-black/50 p-2 rounded space-y-2">
              <p className="text-xs">View: {debugData?.currentView || 'mind'}</p>
              <p className="text-xs">Active Tool: {debugData?.activeTool || 'select'}</p>
              <p className="text-xs text-gray-400">{getToolDescription(debugData?.activeTool)}</p>
            </div>
          </div>

          {/* Position Section with Colored Values */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white/80">Position</h3>
            <div className="bg-black/50 p-2 rounded">
              <p className="text-xs">Position: (
                {colorizeValue(debugData?.position?.x || '0', 'x')}, 
                {colorizeValue(debugData?.position?.y || '0', 'y')}, 
                {colorizeValue(debugData?.position?.z || '0', 'z')})
              </p>
            </div>
          </div>

          {/* Guide Controls */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white/80">View Options</h3>
            <div className="bg-black/50 p-2 rounded flex items-center justify-between">
              <span className="text-xs">Show Guide Lines</span>
              <Switch
                checked={showGuides}
                onCheckedChange={setShowGuides}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          </div>

          {/* Current View Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white/80">Current View</h3>
            <div className="bg-black/50 p-2 rounded">
              <p className="text-xs">Page: {getCurrentView()}</p>
              {currentProject && (
                <>
                  <p className="text-xs mt-1">Project: {currentProject.title}</p>
                  <p className="text-xs">Project ID: {currentProject.id}</p>
                  <div className="mt-2">
                    <p className="text-xs font-medium">Reports ({currentProject.reports?.length || 0}):</p>
                    <ul className="pl-2">
                      {currentProject.reports?.map(report => (
                        <li key={report.id} className="text-xs text-gray-400">
                          • {report.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs font-medium">Nodes ({debugData.nodes?.count || 0}):</p>
                    <ul className="pl-2">
                      {debugData.nodes?.list?.map(node => (
                        <li key={node.id} className="text-xs text-gray-400">
                          • {node.type}: {node.id}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

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
    </>
  );

  return (
    <Rnd
      default={{
        x: window.innerWidth - 400,
        y: 16,
        width: isCollapsed ? 40 : 384,
        height: isCollapsed ? 40 : 'auto',
      }}
      minWidth={isCollapsed ? 40 : 384}
      minHeight={isCollapsed ? 40 : 200}
      bounds="window"
      enableResizing={!isCollapsed}
      style={{ zIndex: 99999 }}
    >
      <div className={`bg-black/90 text-white rounded-lg shadow-xl backdrop-blur-sm border border-white/20 ${
        isCollapsed ? 'w-10 h-10' : 'w-full h-full'
      }`}>
        {panelContent}
      </div>
    </Rnd>
  );
};

export default DebugPanel;