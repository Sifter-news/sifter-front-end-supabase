import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { format } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FileText } from 'lucide-react';

const InvestigationCard = ({ investigation, onUpdateInvestigation }) => {
  const [image, setImage] = useState(investigation.image || '/placeholder.svg');

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          setImage(base64String);
          onUpdateInvestigation({ 
            ...investigation, 
            image: base64String 
          });
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  return (
    <Link to={`/project/${investigation.id}`} className="block w-full h-[430px]">
      <Card className="w-full h-full p-4 bg-[#594BFF] shadow-lg relative overflow-hidden rounded-l-[40px] rounded-r-none lg:rounded-r-none">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        ></div>
        <div className="absolute left-4 top-4 bottom-4 w-64 bg-white rounded-[24px] overflow-hidden">
          <div className="absolute top-4 right-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={image} alt={investigation.title} />
              <AvatarFallback><FileText className="h-4 w-4" /></AvatarFallback>
            </Avatar>
          </div>
          <div className="h-[180px] w-full overflow-hidden relative">
            <Avatar className="w-full h-full rounded-none">
              <AvatarImage 
                src={image}
                alt={investigation.title || 'Investigation'}
                className="w-full h-full object-cover"
              />
              <AvatarFallback className="w-full h-full">
                <FileText className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <CardContent className="p-4 h-[calc(100%-180px)] flex flex-col relative z-10">
            <div className="text-xs uppercase text-purple-600 font-semibold tracking-wide mb-2">Investigation</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
              {investigation.title || 'Untitled Investigation'}
            </h3>
            <p className="text-xs text-gray-600 flex-grow overflow-hidden line-clamp-3">
              {investigation.description || 'No description available'}
            </p>
            <div className="mt-4 text-xs text-gray-400 pt-2 border-t border-gray-100">
              {investigation.created_at ? format(new Date(investigation.created_at), 'MMMM dd, yyyy') : 'Date not available'}
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
};

export default InvestigationCard;