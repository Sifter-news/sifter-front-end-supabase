import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FileText } from 'lucide-react';
import { cn } from "@/lib/utils";

const DEFAULT_IMAGE = '/default-image.png';

const textSizeClasses = {
  small: "text-sm",
  medium: "text-base",
  large: "text-lg",
  huge: "text-xl"
};

const NodeContent = ({ 
  style, 
  isEditing, 
  node, 
  localTitle, 
  localDescription, 
  handleBlur, 
  setLocalTitle, 
  setLocalDescription, 
  isFocused,
  textSize = "medium",
  textAlign = "left",
  color = "white"
}) => {
  const focusClasses = isFocused ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-[1.02]' : '';
  const colorClasses = {
    white: "bg-white",
    yellow: "bg-yellow-100",
    green: "bg-green-100",
    blue: "bg-blue-100"
  };

  const baseClasses = cn(
    textSizeClasses[textSize],
    colorClasses[color],
    `text-${textAlign}`,
    "transition-all duration-200",
    focusClasses
  );

  const renderNode = () => {
    switch (style) {
      case 'compact':
        return (
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", baseClasses)}>
            <Avatar className="h-10 w-10">
              <AvatarImage src={node.avatar || DEFAULT_IMAGE} alt={node.title} />
              <AvatarFallback><FileText className="h-4 w-4" /></AvatarFallback>
            </Avatar>
          </div>
        );
      case 'postit':
        return (
          <div className={cn("w-[256px] h-[256px] p-4 rotate-1", baseClasses)}>
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={node.avatar || DEFAULT_IMAGE} alt={node.title} />
                <AvatarFallback><FileText className="h-4 w-4" /></AvatarFallback>
              </Avatar>
              {isEditing ? (
                <Input
                  value={localTitle}
                  onChange={(e) => setLocalTitle(e.target.value)}
                  onBlur={handleBlur}
                  className="bg-transparent border-none flex-1"
                  placeholder="Title"
                  autoFocus
                />
              ) : (
                <div className="font-medium flex-1">{node.title}</div>
              )}
            </div>
            {isEditing ? (
              <Textarea
                value={localDescription}
                onChange={(e) => setLocalDescription(e.target.value)}
                onBlur={handleBlur}
                className="bg-transparent border-none resize-none text-sm h-[calc(100%-40px)]"
                placeholder="Write your note here..."
              />
            ) : (
              <div className="text-sm text-gray-600 mt-2">{node.description}</div>
            )}
          </div>
        );
      default:
        return (
          <div className={cn("min-w-[40px] h-[128px] p-3", baseClasses)}>
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={node.avatar || DEFAULT_IMAGE} alt={node.title} />
                <AvatarFallback><FileText className="h-4 w-4" /></AvatarFallback>
              </Avatar>
              {isEditing ? (
                <Input
                  value={localTitle}
                  onChange={(e) => setLocalTitle(e.target.value)}
                  onBlur={handleBlur}
                  className="bg-transparent border-none flex-1"
                  autoFocus
                />
              ) : (
                <div className="font-medium flex-1">{node.title}</div>
              )}
            </div>
            {isEditing ? (
              <Textarea
                value={localDescription}
                onChange={(e) => setLocalDescription(e.target.value)}
                onBlur={handleBlur}
                className="bg-transparent border-none resize-none mt-2"
              />
            ) : (
              <div className="text-sm text-gray-600 mt-2">{node.description}</div>
            )}
          </div>
        );
    }
  };

  return renderNode();
};

export default NodeContent;