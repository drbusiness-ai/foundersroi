
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.jsx';

const FloatingWhatsAppButton = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href="https://wa.me/919999999999?text=Hi!%20I%20want%20to%20know%20more%20about%20FoundersROI"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Chat with us on WhatsApp"
            >
              <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
            </a>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-card text-card-foreground border-border font-medium">
            <p>Chat with us on WhatsApp</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default FloatingWhatsAppButton;
