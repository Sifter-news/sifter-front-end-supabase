import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle, Layout, Type, Trash2, Pencil } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const TooltipButtons = ({ 
  styles, 
  nodeTypes, 
  handleStyleChange, 
  handleTypeChange, 
  onAIConversation, 
  onDelete, 
  node, 
  onEdit 
}) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="text-white hover:bg-gray-800"
        onClick={() => onEdit(node)}
      >
        <Pencil className="h-4 w-4 mr-2" />
        Edit
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
            <Layout className="h-4 w-4 mr-2" />
            Style
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-32">
          <div className="flex flex-col space-y-1">
            {Object.entries(styles).map(([value, label]) => (
              <Button
                key={value}
                variant="ghost"
                size="sm"
                onClick={() => handleStyleChange(value)}
              >
                {label}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
            <Type className="h-4 w-4 mr-2" />
            Type
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40">
          <div className="flex flex-col space-y-1">
            {Object.entries(nodeTypes).map(([value, label]) => (
              <Button
                key={value}
                variant="ghost"
                size="sm"
                onClick={() => handleTypeChange(value)}
              >
                {label}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        size="sm"
        className="text-white hover:bg-purple-700 bg-purple-600"
        onClick={() => onAIConversation(node)}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        AI
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="text-white hover:bg-red-700"
        onClick={() => onDelete(node.id)}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  );
};

export default TooltipButtons;