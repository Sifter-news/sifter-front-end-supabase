import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusIcon, Circle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ArticleModal from './ArticleModal';

const ReportList = ({ reports = [], onAddReport, onEditReport, onDeleteReport }) => {
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

  const handleSaveArticle = (article) => {
    if (typeof onAddReport === 'function') {
      // Create a serializable object with primitive values only
      const newArticle = {
        id: Date.now().toString(), // Convert to string to ensure serializability
        title: article.title || '',
        content: article.content || '',
        image: '/default-image.png'
      };
      
      onAddReport(newArticle);
      setIsArticleModalOpen(false);
    }
  };

  const handleEditReport = (report) => {
    if (typeof onEditReport === 'function') {
      // Create a serializable copy with primitive values only
      const serializableReport = {
        id: report.id.toString(), // Convert to string to ensure serializability
        title: report.title || '',
        content: report.content || '',
        image: report.image || '/default-image.png'
      };
      onEditReport(serializableReport);
    }
  };

  return (
    <div className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-full">
      <div className="flex flex-col items-center">
        {reports?.length > 0 && (
          <div className="w-[30%] mb-4 flex flex-wrap justify-center gap-2">
            {reports.map((report) => (
              <TooltipProvider key={report.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center text-white cursor-pointer"
                      onClick={() => handleEditReport(report)}
                    >
                      <Circle className="w-6 h-6" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-bold">{report.title || 'Untitled'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="rounded-full w-12 h-12 bg-black hover:bg-gray-800 text-white shadow-lg"
                onClick={() => setIsArticleModalOpen(true)}
              >
                <PlusIcon className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add New Report</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <ArticleModal
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
        article={null}
        onSave={handleSaveArticle}
      />
    </div>
  );
};

export default ReportList;