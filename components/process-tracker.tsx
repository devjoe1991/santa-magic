'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Upload, Sparkles, CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'active' | 'completed';
}

interface ProcessTrackerProps {
  currentStep: 'upload' | 'analyze' | 'prompts' | 'payment';
  hasAnalyzed: boolean;
  hasSelectedPrompt: boolean;
  isAnalyzing: boolean;
  isGeneratingPrompts: boolean;
}

export default function ProcessTracker({
  currentStep,
  hasAnalyzed,
  hasSelectedPrompt,
  isAnalyzing,
  isGeneratingPrompts
}: ProcessTrackerProps) {
  const [steps, setSteps] = useState<ProcessStep[]>([]);

  useEffect(() => {
    const updatedSteps: ProcessStep[] = [
      {
        id: 'upload',
        title: 'Upload & Analyze',
        description: 'Upload your doorbell photo and analyze the scene',
        icon: <Upload className="w-5 h-5" />,
        status: hasAnalyzed ? 'completed' : (currentStep === 'upload' || currentStep === 'analyze' || isAnalyzing) ? 'active' : 'pending'
      },
      {
        id: 'prompts',
        title: 'Choose Scene',
        description: 'Select your perfect Santa video moment',
        icon: <Sparkles className="w-5 h-5" />,
        status: hasSelectedPrompt ? 'completed' : (hasAnalyzed && (currentStep === 'prompts' || isGeneratingPrompts)) ? 'active' : 'pending'
      },
      {
        id: 'payment',
        title: 'Payment',
        description: 'Complete your magical video order',
        icon: <CreditCard className="w-5 h-5" />,
        status: currentStep === 'payment' ? 'active' : 'pending'
      }
    ];

    setSteps(updatedSteps);
  }, [currentStep, hasAnalyzed, hasSelectedPrompt, isAnalyzing, isGeneratingPrompts]);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
        <Card className="h-full bg-gradient-to-b from-cream via-frostBlue/5 to-cream border-2 border-warmGold/20 shadow-frost">
          <CardContent className="p-6">
            <div className="mb-8">
              <h3 className="font-heading font-bold text-2xl text-christmasRed mb-2 flex items-center">
                <span className="text-3xl mr-2">🎅</span>
                Your Journey
              </h3>
              <p className="text-charcoal/60 font-body text-sm">
                Follow along as we create your magical Santa video
              </p>
            </div>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={step.id} className="relative">
                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "absolute left-6 top-12 w-0.5 h-16 transition-colors duration-500",
                      step.status === 'completed' ? 'bg-evergreen' : 'bg-coolGray/20'
                    )} />
                  )}

                  <div className="flex items-start space-x-4">
                    {/* Step Icon */}
                    <div className={cn(
                      "relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300",
                      step.status === 'completed'
                        ? 'bg-evergreen border-evergreen text-white shadow-glow'
                        : step.status === 'active'
                        ? 'bg-christmasRed border-christmasRed text-white shadow-glow animate-pulse'
                        : 'bg-snowWhite border-coolGray/30 text-coolGray/60'
                    )}>
                      {step.status === 'completed' ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        step.icon
                      )}

                      {/* Sparkle Animation for Active Step */}
                      {step.status === 'active' && (
                        <div className="absolute -inset-2 pointer-events-none">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute text-warmGold text-xs animate-ping opacity-75"
                              style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${i * 300}ms`
                              }}
                            >
                              ✨
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className={cn(
                        "font-heading font-semibold transition-colors",
                        step.status === 'completed'
                          ? 'text-evergreen'
                          : step.status === 'active'
                          ? 'text-christmasRed'
                          : 'text-coolGray/60'
                      )}>
                        {step.title}
                      </h4>
                      <p className={cn(
                        "text-xs font-body mt-1 transition-colors",
                        step.status === 'completed' || step.status === 'active'
                          ? 'text-charcoal/70'
                          : 'text-coolGray/50'
                      )}>
                        {step.description}
                      </p>

                      {/* Progress Indicators */}
                      {step.id === 'upload' && isAnalyzing && (
                        <div className="mt-2 text-xs text-christmasRed font-body flex items-center">
                          <div className="animate-spin rounded-full h-3 w-3 border border-christmasRed border-t-transparent mr-2"></div>
                          Analyzing scene...
                        </div>
                      )}

                      {step.id === 'prompts' && isGeneratingPrompts && (
                        <div className="mt-2 text-xs text-christmasRed font-body flex items-center">
                          <div className="animate-spin rounded-full h-3 w-3 border border-christmasRed border-t-transparent mr-2"></div>
                          Generating prompts...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Festive Footer */}
            <div className="mt-8 p-4 bg-warmGold/10 rounded-lg border border-warmGold/20">
              <div className="text-center">
                <div className="text-2xl mb-2">🎄</div>
                <p className="text-xs font-body text-charcoal/60">
                  Creating Christmas magic with AI
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Progress Bar */}
      <div className="lg:hidden mb-6">
        <Card className="bg-cream border-2 border-warmGold/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg text-christmasRed">
                Progress
              </h3>
              <span className="text-sm font-body text-charcoal/60">
                Step {steps.findIndex(s => s.status === 'active') + 1} of {steps.length}
              </span>
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300",
                    step.status === 'completed'
                      ? 'bg-evergreen border-evergreen text-white'
                      : step.status === 'active'
                      ? 'bg-christmasRed border-christmasRed text-white'
                      : 'bg-snowWhite border-coolGray/30 text-coolGray/60'
                  )}>
                    {step.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-bold">{index + 1}</span>
                    )}
                  </div>

                  {index < steps.length - 1 && (
                    <div className={cn(
                      "w-8 h-0.5 mx-2 transition-colors duration-300",
                      step.status === 'completed' ? 'bg-evergreen' : 'bg-coolGray/20'
                    )} />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-3">
              <p className="text-sm font-body text-charcoal/70">
                {steps.find(s => s.status === 'active')?.description || 'Ready to begin!'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}