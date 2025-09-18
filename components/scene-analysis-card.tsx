'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { SceneAnalysis } from '@/types/scene-analysis';
import { cn } from '@/lib/utils';

interface SceneAnalysisCardProps {
  analysis: SceneAnalysis;
  onReanalyze: () => void;
  isAnalyzing: boolean;
}

interface ElementSectionProps {
  title: string;
  icon: string;
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  defaultOpen?: boolean;
}

function ElementSection({ title, icon, items, renderItem, defaultOpen = false }: ElementSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (!items || items.length === 0) return null;

  return (
    <div className="border border-warmGold/20 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 bg-cream/50 hover:bg-cream/80 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg">{icon}</span>
          <span className="font-heading font-semibold text-charcoal">{title}</span>
          <span className="bg-warmGold/20 text-charcoal text-xs px-2 py-1 rounded-full">
            {items.length}
          </span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-charcoal/60" />
        ) : (
          <ChevronRight className="w-4 h-4 text-charcoal/60" />
        )}
      </button>

      {isOpen && (
        <div className="p-3 space-y-2 bg-snowWhite/30">
          {items.map((item, index) => renderItem(item, index))}
        </div>
      )}
    </div>
  );
}

export default function SceneAnalysisCard({ analysis, onReanalyze, isAnalyzing }: SceneAnalysisCardProps) {
  const renderDoor = (door: any, index: number) => (
    <div key={index} className="flex items-center justify-between p-2 bg-snowWhite rounded border border-warmGold/10">
      <div>
        <span className="font-body font-medium text-charcoal capitalize">{door.type}</span>
        <span className="text-charcoal/60 text-sm ml-2">({door.position})</span>
      </div>
      <div className="text-xs text-charcoal/70">
        {door.material && <span className="bg-lightFrost px-2 py-1 rounded">{door.material}</span>}
      </div>
    </div>
  );

  const renderWindow = (window: any, index: number) => (
    <div key={index} className="flex items-center justify-between p-2 bg-snowWhite rounded border border-warmGold/10">
      <div>
        <span className="font-body font-medium text-charcoal capitalize">{window.position} window</span>
      </div>
      <div className="text-xs text-charcoal/70">
        {window.size && <span className="bg-lightFrost px-2 py-1 rounded">{window.size}</span>}
      </div>
    </div>
  );

  const renderDecoration = (item: string, index: number) => (
    <div key={index} className="inline-flex items-center bg-christmasRed/10 text-christmasRed px-2 py-1 rounded text-sm font-body">
      {item}
    </div>
  );

  const renderFurnitureOrPlant = (item: string, index: number) => (
    <div key={index} className="inline-flex items-center bg-evergreen/10 text-evergreen px-2 py-1 rounded text-sm font-body">
      {item}
    </div>
  );

  return (
    <Card variant="chunky" decorations className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-4xl font-heading font-bold text-christmasRed">
              🎄 Scene Analysis Results
            </CardTitle>
            <p className="text-charcoal/70 font-body mt-2">
              AI analysis of your doorbell photo for optimal Santa magic
            </p>
          </div>
          <Button
            onClick={onReanalyze}
            disabled={isAnalyzing}
            variant="electric"
            size="sm"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isAnalyzing && "animate-spin")} />
            {isAnalyzing ? "Analysing..." : "Analyse Again"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Layout Info */}
        <div className="p-4 bg-frostBlue/10 rounded-lg border border-frostBlue/20">
          <h3 className="font-heading font-semibold text-evergreen mb-2 flex items-center">
            🏠 Scene Layout
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-body">
            <div>
              <span className="text-charcoal/60">Entry Type:</span>
              <span className="ml-2 capitalize font-medium text-charcoal">{analysis.layout.entryType}</span>
            </div>
            <div>
              <span className="text-charcoal/60">Lighting:</span>
              <span className={cn(
                "ml-2 capitalize font-medium",
                analysis.layout.lighting === 'bright' ? 'text-green-600' :
                analysis.layout.lighting === 'dim' ? 'text-orange-500' :
                'text-red-500'
              )}>
                {analysis.layout.lighting}
              </span>
            </div>
            <div>
              <span className="text-charcoal/60">Visibility:</span>
              <span className={cn(
                "ml-2 capitalize font-medium",
                analysis.layout.visibility === 'clear' ? 'text-green-600' :
                analysis.layout.visibility === 'partially obscured' ? 'text-orange-500' :
                'text-red-500'
              )}>
                {analysis.layout.visibility}
              </span>
            </div>
          </div>
          <p className="text-charcoal/70 text-sm mt-2">{analysis.layout.description}</p>
        </div>

        {/* Detected Elements */}
        <div className="space-y-3">
          <h3 className="font-heading font-semibold text-evergreen text-lg">
            Detected Elements
          </h3>

          <ElementSection
            title="Doors & Entrances"
            icon="🚪"
            items={analysis.doors}
            renderItem={renderDoor}
            defaultOpen={true}
          />

          <ElementSection
            title="Windows"
            icon="🪟"
            items={analysis.windows}
            renderItem={renderWindow}
          />

          {analysis.decorations.items.length > 0 && (
            <ElementSection
              title="Decorations"
              icon={analysis.decorations.christmas ? "🎄" : "🎨"}
              items={analysis.decorations.items}
              renderItem={renderDecoration}
            />
          )}

          <ElementSection
            title="Furniture"
            icon="🪑"
            items={analysis.furniture}
            renderItem={renderFurnitureOrPlant}
          />

          <ElementSection
            title="Plants & Landscaping"
            icon="🪴"
            items={analysis.plants}
            renderItem={renderFurnitureOrPlant}
          />
        </div>

        {/* Recommendations */}
        {analysis.recommendations && analysis.recommendations.length > 0 && (
          <div className="p-4 bg-warmGold/10 rounded-lg border border-warmGold/20">
            <h3 className="font-heading font-semibold text-christmasRed mb-3 flex items-center">
              💡 Recommendations
            </h3>
            <ul className="space-y-2">
              {analysis.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm font-body text-charcoal">
                  <span className="text-warmGold text-xs mt-1">•</span>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Christmas Magic Detection */}
        {analysis.decorations.christmas && (
          <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
            <div className="flex items-center space-x-2 text-green-800">
              <span className="text-2xl">🎄</span>
              <div>
                <h3 className="font-heading font-semibold">Christmas Magic Detected!</h3>
                <p className="text-sm font-body">
                  Perfect timing! Your scene already has Christmas decorations which will enhance the Santa magic.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}