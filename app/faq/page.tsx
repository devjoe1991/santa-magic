"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubtleSnow } from "@/components/animated-snow";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Is the payment secure?",
    answer: "Yes, absolutely! We use Stripe for all payments, which is one of the most secure payment processors in the world. Your payment information is encrypted and never stored on our servers. Stripe is trusted by millions of businesses worldwide and is PCI DSS compliant."
  },
  {
    question: "When will I get my video?",
    answer: "After payment is made, our advanced AI systems will automatically create your personalized Santa video. You will receive it via email within minutes of payment completion. Our lightning-fast processing ensures you get your magical Christmas video as quickly as possible."
  },
  {
    question: "What if I'm not happy with my video?",
    answer: "We don't offer refunds, but we'll create your video again free of charge if you're not satisfied with the first result. If you're still not happy after the second attempt, we'll work together to find a solution that makes you happy."
  },
  {
    question: "What types of photos work best?",
    answer: "Our AI works best with clear photos from security cameras, doorbell cameras, or indoor cameras. Photos with good lighting and clear visibility of the doorway or area work best. Avoid blurry or very dark images for optimal results."
  },
  {
    question: "How does the AI technology work?",
    answer: "Our cutting-edge AI analyzes your photo to understand the scene, lighting, and perspective. It then seamlessly overlays a realistic Santa figure that appears to be naturally part of your original footage, creating a magical Christmas moment that looks completely authentic."
  },
  {
    question: "Can I use this for commercial purposes?",
    answer: "Our service is designed for personal use and creating magical Christmas memories for families. Commercial use licensing options are available upon request."
  },
  {
    question: "What file formats do you accept?",
    answer: "We accept common image formats including JPG, JPEG, and PNG. For best results, use high-quality images with good resolution. The AI works best with clear, well-lit photos."
  },
  {
    question: "Is my photo data secure?",
    answer: "Yes, your privacy is important to us. Your photos are processed securely and are not stored permanently on our servers. We only use your images to create your Santa video and then securely delete them from our systems."
  },
  {
    question: "Can I request specific Santa poses or actions?",
    answer: "Our AI automatically selects the most appropriate Santa pose and actions based on your photo's composition and lighting. This ensures the most natural and realistic result. We don't currently offer custom pose requests, but our AI is designed to create the perfect Christmas moment for your specific scene."
  },
  {
    question: "What if I have technical issues?",
    answer: "If you experience any technical issues with uploading, payment, or receiving your video, we'll resolve any problems quickly to ensure you get your magical Christmas video."
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-frostBlue/10 to-cream/30">
      <Navbar />
      <SubtleSnow density="light" />
      
      <div className="pt-16 pb-20">
        <MaxWidthWrapper>
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center space-x-2 mb-6">
              <span className="text-4xl">❓</span>
              <h1 className="font-heading text-4xl font-bold text-charcoal sm:text-5xl md:text-6xl">
                Frequently Asked Questions
              </h1>
            </div>
            <p className="text-lg text-charcoal/70 font-body max-w-3xl mx-auto">
              Everything you need to know about creating your magical Santa video. 
              Can&apos;t find what you&apos;re looking for? We&apos;ve got you covered!
            </p>
          </div>

          {/* FAQ Items */}
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card 
                key={index}
                className="border-2 border-warmGold/20 bg-cream/80 shadow-frost hover:shadow-glow transition-all duration-300"
              >
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => toggleItem(index)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-heading text-lg text-charcoal sm:text-xl">
                      {faq.question}
                    </CardTitle>
                    <div className="ml-4 flex-shrink-0">
                      {openItems.includes(index) ? (
                        <ChevronUp className="w-5 h-5 text-christmasRed" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-christmasRed" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent 
                  className={cn(
                    "transition-all duration-300 overflow-hidden",
                    openItems.includes(index) 
                      ? "max-h-96 opacity-100" 
                      : "max-h-0 opacity-0"
                  )}
                >
                  <CardDescription className="font-body text-charcoal/80 leading-relaxed">
                    {faq.answer}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Final CTA */}
          <div className="mt-16 text-center">
            <Card className="card-modern border-2 border-christmasRed/20 bg-gradient-to-r from-christmasRed/5 to-warmGold/5 p-8 shadow-glow">
              <CardHeader>
                <CardTitle className="font-heading text-2xl text-charcoal mb-4">
                  Ready to create your Christmas magic?
                </CardTitle>
                <CardDescription className="font-body text-lg text-charcoal/70">
                  Everything you need to know is right here - let&apos;s make your Christmas absolutely brilliant!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <div className="flex items-center space-x-2 text-charcoal/80">
                    <span className="text-2xl">🎅</span>
                    <span className="font-body">Create your magical Santa video</span>
                  </div>
                  <div className="flex items-center space-x-2 text-charcoal/80">
                    <span className="text-2xl">⚡</span>
                    <span className="font-body">Lightning fast delivery</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </MaxWidthWrapper>
      </div>

      <Footer />
    </div>
  );
}
