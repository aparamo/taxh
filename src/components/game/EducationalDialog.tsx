'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { EducationalContent, SourceCredibility } from '@/game/data/educationalContent';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EducationalDialogProps {
  content: EducationalContent;
  isOpen: boolean;
  onClose: () => void;
}

const credibilityColors: Record<SourceCredibility, string> = {
  'A+': 'bg-green-500/20 text-green-400 border-green-500/30',
  'A': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'B': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

export function EducationalDialog({ content, isOpen, onClose }: EducationalDialogProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const dialogRef = useRef<HTMLDivElement>(null);

  // Always center dialog when opened (user requirement: appear in center when clicking "?")
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const defaultWidth = 500;
      const defaultHeight = 400;
      // Always center on open - user can drag it but it resets to center on next open
      setPosition({ 
        x: (window.innerWidth / 2 - defaultWidth / 2),
        y: (window.innerHeight / 2 - defaultHeight / 2)
      });
    }
  }, [isOpen]);

  // Save position to localStorage (for current session only - resets to center on next open)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const savePosition = (_x: number, _y: number) => {
    // Don't save to localStorage - always center on open per user requirement
    // Position is only maintained during drag
  };

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only allow dragging from header area
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return; // Don't drag if clicking on buttons/links
    }

    if (dialogRef.current) {
      const rect = dialogRef.current.getBoundingClientRect();
      setIsDragging(true);
      // Calculate offset from mouse click to dialog's top-left corner
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // Handle drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dialogRef.current) {
        // Calculate new position: mouse position minus offset
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        
        // Constrain to viewport
        const dialogWidth = dialogRef.current.offsetWidth || 400;
        const dialogHeight = dialogRef.current.offsetHeight || 300;
        const maxX = typeof window !== 'undefined' ? window.innerWidth - dialogWidth : 0;
        const maxY = typeof window !== 'undefined' ? window.innerHeight - dialogHeight : 0;
        
        const constrainedX = Math.max(0, Math.min(newX, maxX));
        const constrainedY = Math.max(0, Math.min(newY, maxY));
        
        setPosition({ x: constrainedX, y: constrainedY });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        // Save current position
        if (dialogRef.current) {
          savePosition(position.x, position.y);
        }
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, position]);

  if (!isOpen) return null;

  const displayDescription = content.shortDescription || content.description;
  const fullDescription = content.fullDescription || content.description;
  const hasMoreContent = content.fullDescription && content.fullDescription !== content.description;
  const sources = content.sources || (content.source ? [{ 
    name: content.source, 
    url: content.sourceUrl || '', 
    credibility: 'A' as SourceCredibility 
  }] : []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dialogRef}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed z-[100] w-full max-w-md"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        >
          <div className="bg-game-background-dark border-2 border-primary-500/50 rounded-lg shadow-2xl overflow-hidden">
            {/* Header - Draggable area */}
            <div 
              className={cn(
                "bg-game-background-darker px-4 py-3 border-b border-gray-700 flex items-center justify-between",
                isDragging ? "cursor-grabbing" : "cursor-grab",
                "select-none"
              )}
              onMouseDown={handleMouseDown}
            >
              <h3 className="font-bold text-white text-lg">{content.title}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
                aria-label="Cerrar"
              >
                <X size={16} />
              </Button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Description */}
              <div className="text-gray-300 text-sm">
                {isExpanded ? fullDescription : displayDescription}
              </div>

              {/* Expand/Collapse Button */}
              {hasMoreContent && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-full text-gay-800 border-gray-600 hover:bg-gray-700 hover:text-white"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp size={16} className="mr-2" />
                      Mostrar menos
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} className="mr-2" />
                      Expandir
                    </>
                  )}
                </Button>
              )}

              {/* Real Case Info */}
              {content.realCase && (
                <div className="bg-primary-500/10 border border-primary-500/30 rounded p-3">
                  <h4 className="font-semibold text-white mb-2 text-sm">Caso Real</h4>
                  <div className="text-xs text-white space-y-1">
                    <div><strong className="text-gray-300">Nombre:</strong> <span className="text-white">{content.realCase.name}</span></div>
                    {content.realCase.year && <div><strong className="text-gray-300">Año:</strong> <span className="text-white">{content.realCase.year}</span></div>}
                    {content.realCase.amount && <div><strong className="text-gray-300">Monto:</strong> <span className="text-white">{content.realCase.amount}</span></div>}
                    <div><strong className="text-gray-300">Resultado:</strong> <span className="text-white">{content.realCase.outcome}</span></div>
                  </div>
                </div>
              )}

              {/* Key Figures */}
              {content.keyFigures && content.keyFigures.length > 0 && (
                <div>
                  <h4 className="font-semibold text-white mb-2 text-sm">Figuras Clave</h4>
                  <div className="flex flex-wrap gap-2">
                    {content.keyFigures.map((figure, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs text-white border-gray-600">
                        {figure}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline */}
              {content.timeline && content.timeline.length > 0 && (
                <div>
                  <h4 className="font-semibold text-white mb-2 text-sm flex items-center gap-2">
                    <Clock size={14} />
                    Cronología
                  </h4>
                  <div className="space-y-2">
                    {content.timeline.map((item, idx) => (
                      <div key={idx} className="flex gap-3 text-xs">
                        <div className="font-bold text-gray-300 min-w-[50px]">{item.year}</div>
                        <div className="text-gray-100">{item.event}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Consequences */}
              {content.consequences && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3">
                  <h4 className="font-semibold text-yellow-400 mb-2 text-sm">Consecuencias</h4>
                  <p className="text-xs text-white">{content.consequences}</p>
                </div>
              )}

              {/* Sources */}
              {sources.length > 0 && (
                <div>
                  <h4 className="font-semibold text-white mb-2 text-sm">Fuentes</h4>
                  <div className="space-y-2">
                    {sources.map((source, idx) => (
                      <a
                        key={idx}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 bg-game-background-darker rounded border border-gray-700 hover:border-primary-500/50 transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={cn('text-xs', credibilityColors[source.credibility])}
                          >
                            {source.credibility}
                          </Badge>
                          <span className="text-sm text-white group-hover:text-primary-400">
                            {source.name}
                          </span>
                        </div>
                        <ExternalLink size={14} className="text-gray-500 group-hover:text-primary-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Case Study Reference */}
              {content.caseStudy && (
                <div className="text-xs text-gray-300 italic">
                  Referencia: <span className="text-white">{content.caseStudy}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
