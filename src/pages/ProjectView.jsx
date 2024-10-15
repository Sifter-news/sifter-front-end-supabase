import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import ProjectEditModal from '../components/ProjectEditModal';
import ArticleModal from '../components/ArticleModal';
import { Button } from "@/components/ui/button";
import { PlusIcon, Brain, FileText, Clock, Map } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MindMapView from '../components/MindMapView';
import TextView from '../components/TextView';
import TimeView from '../components/TimeView';
import MapView from '../components/MapView';

const ProjectView = () => {
  const { id } = useParams();
  const location = useLocation();
  const user = {
    name: 'User-Name',
    avatar: '/placeholder.svg',
    email: 'user@example.com',
  };

  const [project, setProject] = useState(location.state?.project || {
    id,
    title: `Project ${id}`,
    description: 'This is a sample project description.',
    reports: []
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewArticleModalOpen, setIsNewArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [focusedDocument, setFocusedDocument] = useState(null);
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    // Load nodes from localStorage or API
    const savedNodes = localStorage.getItem(`project_${id}_nodes`);
    if (savedNodes) {
      setNodes(JSON.parse(savedNodes));
    }
  }, [id]);

  useEffect(() => {
    // Save nodes to localStorage whenever they change
    localStorage.setItem(`project_${id}_nodes`, JSON.stringify(nodes));
  }, [id, nodes]);

  const handleProjectClick = () => {
    setIsEditModalOpen(true);
  };

  const handleProjectUpdate = (updatedProject) => {
    setProject(updatedProject);
    setIsEditModalOpen(false);
  };

  const handleNewArticle = () => {
    setEditingArticle(null);
    setIsNewArticleModalOpen(true);
  };

  const handleSaveArticle = (article) => {
    if (editingArticle) {
      const updatedReports = project.reports.map(report =>
        report.id === editingArticle.id ? { ...article, id: report.id } : report
      );
      setProject({ ...project, reports: updatedReports });
    } else {
      const updatedReports = [...project.reports, { ...article, id: Date.now() }];
      setProject({ ...project, reports: updatedReports });
    }
    setIsNewArticleModalOpen(false);
    setEditingArticle(null);
  };

  const handleEditArticle = (article) => {
    setEditingArticle(article);
    setIsNewArticleModalOpen(true);
  };

  const handleAddNode = (newNode) => {
    setNodes(prevNodes => [...prevNodes, newNode]);
  };

  const handleUpdateNode = (updatedNode) => {
    setNodes(prevNodes => prevNodes.map(node => 
      node.id === updatedNode.id ? updatedNode : node
    ));
  };

  const handleDeleteNode = (nodeId) => {
    setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeId));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header user={user} projectName={project.title} onProjectClick={handleProjectClick} />
      <Tabs defaultValue="mind" className="w-full flex flex-col flex-grow">
        <TabsList className="max-w-[280px] mx-auto justify-center fixed top-16 left-0 right-0 bg-white bg-opacity-80 backdrop-blur-md z-10 inline-flex">
          <TabsTrigger value="mind" className="flex items-center">
            <Brain className="w-4 h-4 mr-2" />
            Mind
          </TabsTrigger>
          <TabsTrigger value="text" className="flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Text
          </TabsTrigger>
          <TabsTrigger value="time" className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Time
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center">
            <Map className="w-4 h-4 mr-2" />
            Map
          </TabsTrigger>
        </TabsList>
        <div className="flex-grow mt-12">
          <TabsContent value="mind" className="h-full">
            <MindMapView 
              project={project} 
              nodes={nodes}
              onAddNode={handleAddNode}
              onUpdateNode={handleUpdateNode}
              onDeleteNode={handleDeleteNode}
            />
          </TabsContent>
          <TabsContent value="text" className="h-full">
            <TextView 
              project={project} 
              nodes={nodes}
              onAddNode={handleAddNode}
              onUpdateNode={handleUpdateNode}
              onDeleteNode={handleDeleteNode}
            />
          </TabsContent>
          <TabsContent value="time" className="h-full">
            <TimeView 
              project={project} 
              nodes={nodes}
              onAddNode={handleAddNode}
              onUpdateNode={handleUpdateNode}
              onDeleteNode={handleDeleteNode}
            />
          </TabsContent>
          <TabsContent value="map" className="h-full">
            <MapView 
              project={project} 
              nodes={nodes}
              onAddNode={handleAddNode}
              onUpdateNode={handleUpdateNode}
              onDeleteNode={handleDeleteNode}
            />
          </TabsContent>
        </div>
      </Tabs>
      <ProjectEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={project}
        onUpdate={handleProjectUpdate}
      />
      <ArticleModal
        isOpen={isNewArticleModalOpen}
        onClose={() => setIsNewArticleModalOpen(false)}
        article={editingArticle || { title: '', content: '' }}
        onUpdate={handleSaveArticle}
      />
      <div className="fixed bottom-4 right-4 flex flex-col items-end space-y-2 z-10">
        {project.reports.slice(0, 4).reverse().map((report, index) => (
          <TooltipProvider key={report.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar 
                  className={`w-12 h-12 cursor-pointer ${index > 0 ? '-mb-6' : ''}`}
                  onClick={() => handleEditArticle(report)}
                >
                  <AvatarImage src={report.image || '/placeholder.svg'} alt={report.title} />
                  <AvatarFallback>{report.title.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-bold">{report.title}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
        <Button
          size="icon"
          className="rounded-full w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
          onClick={handleNewArticle}
        >
          <PlusIcon className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default ProjectView;