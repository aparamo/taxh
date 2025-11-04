'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getEducationalContent } from '@/game/data/educationalContent';

interface EducationalTooltipProps {
  children: React.ReactNode;
  title?: string;
  content?: string;
  source?: string;
  eventId?: string; // ID to fetch from educationalContent
}

export function EducationalTooltip({
  children,
  title,
  content,
  source,
  eventId,
}: EducationalTooltipProps) {
  // Fetch educational content if eventId is provided
  const educationalData = eventId ? getEducationalContent(eventId) : null;
  
  const displayTitle = title || educationalData?.title || 'Información';
  const displayContent = content || educationalData?.description || '';
  const displaySource = source || educationalData?.source || '';
  const caseStudy = educationalData?.caseStudy;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="max-w-md bg-game-background-dark border-gray-700">
          <div className="space-y-2">
            <h4 className="font-bold text-white">{displayTitle}</h4>
            {caseStudy && (
              <p className="text-xs text-primary-400 font-semibold">Caso: {caseStudy}</p>
            )}
            <p className="text-sm text-white">{displayContent}</p>
            {displaySource && (
              <div className="mt-2 pt-2 border-t border-gray-700">
                <p className="text-xs text-gray-400">
                  Fuente: <span className="text-white">{displaySource}</span>
                  {educationalData?.sourceUrl && (
                    <a
                      href={educationalData.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-primary-400 hover:text-primary-300 underline"
                    >
                      (ver)
                    </a>
                  )}
                </p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
