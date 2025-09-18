import { notFound } from 'next/navigation';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getOrderWithDetails } from '@/lib/supabase-helpers';
import { CheckCircle, Clock, AlertCircle, Download, ExternalLink } from 'lucide-react';

interface OrderStatusPageProps {
  params: {
    orderId: string;
  };
}

export default async function OrderStatusPage({ params }: OrderStatusPageProps) {
  const { orderId } = params;

  // Fetch order details
  const { data: order, success } = await getOrderWithDetails(orderId);

  if (!success || !order) {
    notFound();
  }

  const getStatusConfig = (paymentStatus: string, processingStatus: string) => {
    if (paymentStatus === 'pending') {
      return {
        icon: Clock,
        color: 'text-warmGold',
        bgColor: 'bg-warmGold/10',
        borderColor: 'border-warmGold/30',
        message: 'Payment Pending',
        description: 'Waiting for payment confirmation'
      };
    }

    if (paymentStatus === 'failed') {
      return {
        icon: AlertCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        message: 'Payment Failed',
        description: 'Please try again or contact support'
      };
    }

    if (paymentStatus === 'completed' && processingStatus === 'pending') {
      return {
        icon: Clock,
        color: 'text-warmGold',
        bgColor: 'bg-warmGold/10',
        borderColor: 'border-warmGold/30',
        message: 'Payment Received',
        description: 'Your video is queued for processing'
      };
    }

    if (paymentStatus === 'completed' && processingStatus === 'processing') {
      return {
        icon: Clock,
        color: 'text-christmasRed',
        bgColor: 'bg-christmasRed/10',
        borderColor: 'border-christmasRed/30',
        message: 'Creating Your Video',
        description: 'Santa is working his magic on your doorbell footage'
      };
    }

    if (paymentStatus === 'completed' && processingStatus === 'completed') {
      return {
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        message: 'Video Ready!',
        description: 'Your magical Santa video is ready for download'
      };
    }

    if (paymentStatus === 'completed' && processingStatus === 'failed') {
      return {
        icon: AlertCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        message: 'Processing Failed',
        description: 'Something went wrong. We\'ll refund you and investigate'
      };
    }

    return {
      icon: Clock,
      color: 'text-coolGray',
      bgColor: 'bg-coolGray/10',
      borderColor: 'border-coolGray/30',
      message: 'Processing',
      description: 'Working on your order'
    };
  };

  const statusConfig = getStatusConfig(order.payment_status, order.processing_status);
  const StatusIcon = statusConfig.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Navbar />

      <MaxWidthWrapper className="mt-10 flex flex-col items-center justify-center text-center sm:mt-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-charcoal sm:text-5xl">
            Order <span className="text-christmasRed">Status</span>
          </h1>
          <p className="mt-4 text-lg text-charcoal/70 font-body max-w-2xl">
            Track your magical Santa video creation
          </p>
        </div>

        {/* Status Card */}
        <Card className="w-full max-w-2xl p-8 bg-cream border-2 border-warmGold/20 shadow-frost">
          <div className={cn(
            "flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-6",
            statusConfig.bgColor,
            `border-2 ${statusConfig.borderColor}`
          )}>
            <StatusIcon className={cn("w-8 h-8", statusConfig.color)} />
          </div>

          <CardTitle className="text-2xl font-heading text-christmasRed mb-2">
            {statusConfig.message}
          </CardTitle>
          <CardDescription className="text-charcoal/70 font-body mb-6 text-lg">
            {statusConfig.description}
          </CardDescription>

          {/* Order Details */}
          <div className="space-y-4 text-left bg-snowWhite p-6 rounded-lg border border-coolGray/20">
            <div className="flex justify-between items-center">
              <span className="text-charcoal/70 font-body">Order ID:</span>
              <span className="font-mono text-sm text-charcoal bg-coolGray/10 px-2 py-1 rounded">
                {order.id.slice(0, 8)}...
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-charcoal/70 font-body">Email:</span>
              <span className="font-body text-charcoal">{order.customer_email}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-charcoal/70 font-body">Amount:</span>
              <span className="font-heading font-semibold text-christmasRed">
                £{order.amount_paid.toFixed(2)} {order.currency}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-charcoal/70 font-body">Ordered:</span>
              <span className="font-body text-charcoal">{formatDate(order.created_at)}</span>
            </div>

            {order.processing_completed_at && (
              <div className="flex justify-between items-center">
                <span className="text-charcoal/70 font-body">Completed:</span>
                <span className="font-body text-charcoal">{formatDate(order.processing_completed_at)}</span>
              </div>
            )}
          </div>

          {/* Selected Prompt */}
          {order.selected_prompt && (
            <div className="mt-6 text-left bg-frostBlue/10 p-6 rounded-lg border border-frostBlue/20">
              <h3 className="font-heading font-semibold text-charcoal mb-3">Your Selected Scene:</h3>
              {order.selected_prompt.prompt_title && (
                <h4 className="font-heading font-medium text-christmasRed mb-2">
                  {order.selected_prompt.prompt_title}
                </h4>
              )}
              <p className="text-charcoal/80 font-body leading-relaxed">
                {order.selected_prompt.prompt_text}
              </p>
              {order.selected_prompt.confidence_score && (
                <div className="mt-3 flex items-center space-x-2">
                  <span className="text-sm text-charcoal/60">Scene Suitability:</span>
                  <div className="flex-1 bg-coolGray/20 rounded-full h-2">
                    <div
                      className="bg-christmasRed h-2 rounded-full"
                      style={{ width: `${order.selected_prompt.confidence_score * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-charcoal">
                    {Math.round(order.selected_prompt.confidence_score * 100)}%
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Download Section */}
          {order.processed_video_url && order.processing_status === 'completed' && (
            <div className="mt-8 space-y-4">
              <a
                href={order.processed_video_url}
                download
                className={cn(
                  buttonVariants({
                    size: "lg",
                    className: "w-full bg-christmasRed hover:bg-[#A71D23] text-white shadow-glow text-lg py-4"
                  })
                )}
              >
                <Download className="w-5 h-5 mr-2" />
                Download Your Santa Video
              </a>

              <p className="text-xs text-charcoal/60 font-body text-center">
                Your video will be available for download for 30 days
              </p>
            </div>
          )}

          {/* Processing Timeline */}
          {order.payment_status === 'completed' && order.processing_status !== 'completed' && (
            <div className="mt-8 p-6 bg-lightFrost rounded-lg">
              <h3 className="font-heading font-semibold text-charcoal mb-4">Expected Timeline:</h3>
              <div className="space-y-3 text-sm font-body">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-charcoal">Payment received</span>
                </div>
                <div className="flex items-center space-x-3">
                  {order.processing_status === 'processing' ? (
                    <div className="w-4 h-4 border-2 border-christmasRed border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Clock className="w-4 h-4 text-warmGold" />
                  )}
                  <span className="text-charcoal">Creating your magical video (2-5 minutes)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-coolGray" />
                  <span className="text-charcoal/70">Email notification sent</span>
                </div>
              </div>
            </div>
          )}

          {/* Refresh Button */}
          <div className="mt-6">
            <button
              onClick={() => window.location.reload()}
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "border-2 border-coolGray/30 text-charcoal hover:bg-coolGray/10"
                })
              )}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Refresh Status
            </button>
          </div>
        </Card>

        {/* Support Section */}
        <Card className="w-full max-w-2xl mt-8 p-6 bg-snowWhite border-2 border-warmGold/20 shadow-frost text-center">
          <h3 className="font-heading font-semibold text-christmasRed mb-2">Need Help?</h3>
          <p className="text-charcoal/70 font-body text-sm mb-4">
            Questions about your order or experiencing issues?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:support@santadoorbellmagic.com"
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "border-2 border-christmasRed/30 text-christmasRed hover:bg-christmasRed/10"
                })
              )}
            >
              Contact Support
            </a>
            <a
              href="/how-it-works"
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "border-2 border-coolGray/30 text-charcoal hover:bg-coolGray/10"
                })
              )}
            >
              How It Works
            </a>
          </div>
        </Card>
      </MaxWidthWrapper>

      <Footer />
    </>
  );
}