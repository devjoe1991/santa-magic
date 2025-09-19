/**
 * Email Service for Santa Magic Video Notifications
 *
 * This service handles email notifications for video processing
 * Can be extended to use Resend, SendGrid, or other email providers
 */

import { getOrderProcessingStatus } from './supabase-helpers';

export interface EmailNotificationData {
  orderId: string;
  customerEmail: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  errorMessage?: string;
  processingDuration?: number;
}

export interface EmailTemplate {
  subject: string;
  htmlBody: string;
  textBody: string;
}

/**
 * Send video ready notification email
 */
export async function sendVideoReadyEmail(orderId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    console.log(`Preparing video ready email for order: ${orderId}`);

    // Get order details
    const { success, data: order, error } = await getOrderProcessingStatus(orderId);

    if (!success || !order) {
      console.error('Failed to get order details for email:', error);
      return { success: false, error: error || 'Order not found' };
    }

    if (!order.customer_email) {
      return { success: false, error: 'No customer email found' };
    }

    if (!order.processed_video_url) {
      return { success: false, error: 'No video URL available' };
    }

    // Prepare email data
    const emailData: EmailNotificationData = {
      orderId,
      customerEmail: order.customer_email,
      videoUrl: order.processed_video_url,
      thumbnailUrl: order.freepik_thumbnail_url,
      processingDuration: order.processing_duration_seconds
    };

    // Generate email template
    const template = generateVideoReadyTemplate(emailData);

    // Send email (placeholder for actual implementation)
    const result = await sendEmail({
      to: emailData.customerEmail,
      subject: template.subject,
      htmlBody: template.htmlBody,
      textBody: template.textBody
    });

    console.log(`Video ready email sent successfully for order: ${orderId}`);
    return { success: true };

  } catch (error) {
    console.error(`Failed to send video ready email for order ${orderId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Email sending failed'
    };
  }
}

/**
 * Send video processing failure notification email
 */
export async function sendVideoFailureEmail(
  orderId: string,
  errorMessage: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    console.log(`Preparing failure email for order: ${orderId}`);

    // Get order details
    const { success, data: order, error } = await getOrderProcessingStatus(orderId);

    if (!success || !order) {
      console.error('Failed to get order details for failure email:', error);
      return { success: false, error: error || 'Order not found' };
    }

    if (!order.customer_email) {
      return { success: false, error: 'No customer email found' };
    }

    // Prepare email data
    const emailData: EmailNotificationData = {
      orderId,
      customerEmail: order.customer_email,
      errorMessage,
      processingDuration: order.processing_duration_seconds
    };

    // Generate email template
    const template = generateVideoFailureTemplate(emailData);

    // Send email (placeholder for actual implementation)
    const result = await sendEmail({
      to: emailData.customerEmail,
      subject: template.subject,
      htmlBody: template.htmlBody,
      textBody: template.textBody
    });

    console.log(`Failure email sent successfully for order: ${orderId}`);
    return { success: true };

  } catch (error) {
    console.error(`Failed to send failure email for order ${orderId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Email sending failed'
    };
  }
}

/**
 * Generate video ready email template
 */
function generateVideoReadyTemplate(data: EmailNotificationData): EmailTemplate {
  const subject = '🎅 Your Santa Magic Video is Ready! 🎄';

  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Santa Magic Video is Ready!</title>
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #FFF9F0;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(193, 39, 45, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #C1272D, #1B4D3E);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            font-family: 'Playfair Display', serif;
            font-size: 28px;
            margin: 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .content {
            padding: 30px;
        }
        .video-container {
            text-align: center;
            margin: 30px 0;
            background: linear-gradient(135deg, #A9D6E5, #FFD700);
            border-radius: 12px;
            padding: 20px;
        }
        .video-button {
            display: inline-block;
            background-color: #C1272D;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 18px;
            margin: 10px 0;
            box-shadow: 0 4px 15px rgba(193, 39, 45, 0.3);
            transition: transform 0.2s;
        }
        .video-button:hover {
            transform: translateY(-2px);
        }
        .processing-info {
            background-color: #F0F8FF;
            border-left: 4px solid #FFD700;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .footer {
            background-color: #1B4D3E;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 12px;
        }
        .christmas-emoji {
            font-size: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎅 Santa Magic is Complete! 🎄</h1>
            <p>Your personalized Santa video is ready to spread holiday joy!</p>
        </div>

        <div class="content">
            <p>Dear Valued Customer,</p>

            <p>Ho ho ho! <span class="christmas-emoji">🎅</span> We're excited to let you know that your magical Santa video has been created and is ready for viewing!</p>

            <div class="video-container">
                <h3 style="color: #C1272D; margin-top: 0;">🎬 Your Santa Magic Video</h3>
                <p>Click the button below to download your personalized Santa video:</p>
                <a href="${data.videoUrl}" class="video-button">
                    🎥 Download Your Video
                </a>
                ${data.thumbnailUrl ? `
                <p style="margin-top: 15px; font-size: 12px; color: #666;">
                    <a href="${data.thumbnailUrl}" style="color: #C1272D;">View Thumbnail</a>
                </p>
                ` : ''}
            </div>

            <div class="processing-info">
                <h4 style="color: #C1272D; margin-top: 0;">✨ Video Details</h4>
                <ul>
                    <li><strong>Order ID:</strong> ${data.orderId}</li>
                    ${data.processingDuration ? `<li><strong>Processing Time:</strong> ${Math.round(data.processingDuration / 60)} minutes</li>` : ''}
                    <li><strong>Video Quality:</strong> High Definition (HD)</li>
                    <li><strong>Duration:</strong> 5-10 seconds of pure Christmas magic</li>
                </ul>
            </div>

            <p><strong>🎄 Sharing Your Video:</strong></p>
            <p>Your video is perfect for sharing with family and friends! Upload it to social media, send it via messaging apps, or keep it as a special Christmas memory.</p>

            <p><strong>📱 Technical Tips:</strong></p>
            <ul>
                <li>The video works on all devices and platforms</li>
                <li>Best viewed in HD quality</li>
                <li>File size is optimized for easy sharing</li>
            </ul>

            <p>Thank you for choosing Santa Magic! We hope this video brings joy and wonder to your holiday season. <span class="christmas-emoji">🎁✨</span></p>

            <p>Wishing you and your family a magical Christmas!</p>

            <p>Ho ho ho,<br>
            <strong>The Santa Magic Team</strong> 🎅</p>
        </div>

        <div class="footer">
            <p>© 2024 Santa Magic | Bringing Christmas Wonder to Your Doorstep</p>
            <p>If you have any questions, please contact our support elves!</p>
        </div>
    </div>
</body>
</html>
  `;

  const textBody = `
🎅 Your Santa Magic Video is Ready! 🎄

Dear Valued Customer,

Ho ho ho! We're excited to let you know that your magical Santa video has been created and is ready for viewing!

🎬 Download Your Video:
${data.videoUrl}

✨ Video Details:
- Order ID: ${data.orderId}
${data.processingDuration ? `- Processing Time: ${Math.round(data.processingDuration / 60)} minutes\n` : ''}- Video Quality: High Definition (HD)
- Duration: 5-10 seconds of pure Christmas magic

🎄 Your video is perfect for sharing with family and friends! Upload it to social media, send it via messaging apps, or keep it as a special Christmas memory.

📱 Technical Tips:
- The video works on all devices and platforms
- Best viewed in HD quality
- File size is optimized for easy sharing

Thank you for choosing Santa Magic! We hope this video brings joy and wonder to your holiday season. 🎁✨

Wishing you and your family a magical Christmas!

Ho ho ho,
The Santa Magic Team 🎅

© 2024 Santa Magic | Bringing Christmas Wonder to Your Doorstep
  `;

  return { subject, htmlBody, textBody };
}

/**
 * Generate video failure email template
 */
function generateVideoFailureTemplate(data: EmailNotificationData): EmailTemplate {
  const subject = '🎅 Update on Your Santa Magic Video Order';

  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Update on Your Santa Magic Video</title>
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #FFF9F0;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(193, 39, 45, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #C1272D, #1B4D3E);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            font-family: 'Playfair Display', serif;
            font-size: 24px;
            margin: 0;
        }
        .content {
            padding: 30px;
        }
        .support-container {
            background-color: #F8F9FA;
            border: 2px solid #FFD700;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        .support-button {
            display: inline-block;
            background-color: #C1272D;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 10px 0;
        }
        .footer {
            background-color: #1B4D3E;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 12px;
        }
        .order-info {
            background-color: #F0F8FF;
            border-left: 4px solid #C1272D;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎅 Update on Your Santa Magic Video</h1>
        </div>

        <div class="content">
            <p>Dear Valued Customer,</p>

            <p>We hope this message finds you well. We're writing to update you on your recent Santa Magic video order.</p>

            <div class="order-info">
                <h4 style="color: #C1272D; margin-top: 0;">📋 Order Information</h4>
                <p><strong>Order ID:</strong> ${data.orderId}</p>
                <p><strong>Status:</strong> Processing Issue Encountered</p>
            </div>

            <p><strong>What Happened:</strong></p>
            <p>Unfortunately, we encountered a technical issue while creating your personalized Santa video. Our team is aware of this issue and is working to resolve it.</p>

            <p><strong>Next Steps:</strong></p>
            <p>Don't worry! We're committed to delivering your magical Santa video. Here's what we're doing:</p>
            <ul>
                <li>🔧 Our technical elves are investigating the issue</li>
                <li>🔄 We'll automatically retry processing your video</li>
                <li>📧 You'll receive an update within 24 hours</li>
                <li>🎁 Your video will be delivered as soon as possible</li>
            </ul>

            <div class="support-container">
                <h4 style="color: #C1272D; margin-top: 0;">🎁 Need Immediate Assistance?</h4>
                <p>Our customer support team is here to help! If you have any questions or concerns, please don't hesitate to reach out.</p>
                <p><strong>Order Reference:</strong> ${data.orderId}</p>
                <p>Email us with your order ID for the fastest assistance.</p>
            </div>

            <p><strong>Our Commitment:</strong></p>
            <p>At Santa Magic, we're dedicated to bringing joy and wonder to your holiday season. We sincerely apologize for any inconvenience and appreciate your patience as we work to resolve this issue.</p>

            <p>We'll have your magical Santa video ready very soon! 🎅✨</p>

            <p>Thank you for choosing Santa Magic.</p>

            <p>Warm regards,<br>
            <strong>The Santa Magic Team</strong></p>
        </div>

        <div class="footer">
            <p>© 2024 Santa Magic | Bringing Christmas Wonder to Your Doorstep</p>
            <p>We're working hard to get your video ready for the holidays!</p>
        </div>
    </div>
</body>
</html>
  `;

  const textBody = `
🎅 Update on Your Santa Magic Video

Dear Valued Customer,

We hope this message finds you well. We're writing to update you on your recent Santa Magic video order.

📋 Order Information:
- Order ID: ${data.orderId}
- Status: Processing Issue Encountered

What Happened:
Unfortunately, we encountered a technical issue while creating your personalized Santa video. Our team is aware of this issue and is working to resolve it.

Next Steps:
Don't worry! We're committed to delivering your magical Santa video. Here's what we're doing:

🔧 Our technical elves are investigating the issue
🔄 We'll automatically retry processing your video
📧 You'll receive an update within 24 hours
🎁 Your video will be delivered as soon as possible

🎁 Need Immediate Assistance?
Our customer support team is here to help! If you have any questions or concerns, please don't hesitate to reach out.

Order Reference: ${data.orderId}
Email us with your order ID for the fastest assistance.

Our Commitment:
At Santa Magic, we're dedicated to bringing joy and wonder to your holiday season. We sincerely apologize for any inconvenience and appreciate your patience as we work to resolve this issue.

We'll have your magical Santa video ready very soon! 🎅✨

Thank you for choosing Santa Magic.

Warm regards,
The Santa Magic Team

© 2024 Santa Magic | Bringing Christmas Wonder to Your Doorstep
  `;

  return { subject, htmlBody, textBody };
}

/**
 * Send email using configured email provider
 * This is a placeholder - implement with your preferred email service
 */
async function sendEmail(params: {
  to: string;
  subject: string;
  htmlBody: string;
  textBody: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`Sending email to: ${params.to}`);
    console.log(`Subject: ${params.subject}`);

    // TODO: Implement actual email sending
    // Example implementations:

    // Option 1: Resend
    /*
    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: 'Santa Magic <noreply@santamagic.co.uk>',
      to: params.to,
      subject: params.subject,
      html: params.htmlBody,
      text: params.textBody,
    });
    */

    // Option 2: SendGrid
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: params.to,
      from: 'noreply@santamagic.co.uk',
      subject: params.subject,
      text: params.textBody,
      html: params.htmlBody,
    };
    await sgMail.send(msg);
    */

    // Option 3: Nodemailer (SMTP)
    /*
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransporter({
      // Your SMTP configuration
    });
    await transporter.sendMail({
      from: '"Santa Magic" <noreply@santamagic.co.uk>',
      to: params.to,
      subject: params.subject,
      text: params.textBody,
      html: params.htmlBody,
    });
    */

    // For now, just log the email (development mode)
    console.log('📧 Email sent successfully (development mode)');
    console.log('--- EMAIL CONTENT ---');
    console.log('HTML Body Length:', params.htmlBody.length);
    console.log('Text Body:', params.textBody.substring(0, 200) + '...');
    console.log('--------------------');

    return { success: true };

  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
}

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Get email template for preview (useful for testing)
 */
export function getEmailPreview(
  type: 'success' | 'failure',
  data: EmailNotificationData
): EmailTemplate {
  return type === 'success'
    ? generateVideoReadyTemplate(data)
    : generateVideoFailureTemplate(data);
}