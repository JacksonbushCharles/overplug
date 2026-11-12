import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export const runtime = 'nodejs'

type Campaign = {
  subject: string
  content: string
}

type SendRequest = {
  campaign?: Campaign
  recipient?: string
  mode?: 'send' | 'test'
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getSmtpConfig() {
  const config = {
    host: process.env.SMTP_HOST || 'smtp.resend.com',
    port: Number(process.env.SMTP_PORT || '465'),
    username: process.env.SMTP_USER || 'resend',
    password: process.env.SMTP_PASS || '',
    fromName: process.env.SMTP_FROM_NAME || 'EchoMail',
    senderEmail: process.env.SMTP_FROM_EMAIL || '',
    replyToEmail: process.env.SMTP_REPLY_TO || '',
  }

  if (!config.password || !config.senderEmail || !config.replyToEmail) {
    throw new Error('Server email configuration is incomplete.')
  }

  return config
}

export async function POST(request: Request) {
  try {
    const { campaign, recipient, mode = 'send' } = await request.json() as SendRequest
    if (!campaign?.subject?.trim() || !campaign.content?.trim()) {
      return NextResponse.json({ success: false, error: 'Subject and content are required.' }, { status: 400 })
    }
    if (mode !== 'send' && mode !== 'test') {
      return NextResponse.json({ success: false, error: 'Invalid send mode.' }, { status: 400 })
    }

    const smtpConfig = getSmtpConfig()
    const recipientAddress = mode === 'test' ? smtpConfig.replyToEmail : recipient
    if (!recipientAddress || !emailPattern.test(recipientAddress)) {
      return NextResponse.json({ success: false, error: 'A valid recipient email is required.' }, { status: 400 })
    }

    const transport = nodemailer.createTransport({
      host: smtpConfig.host,
      port: Number(smtpConfig.port),
      secure: Number(smtpConfig.port) === 465,
      auth: {
        user: smtpConfig.username,
        pass: smtpConfig.password,
      },
    })

    await transport.sendMail({
      from: `${smtpConfig.fromName} <${smtpConfig.senderEmail}>`,
      to: recipientAddress,
      replyTo: smtpConfig.replyToEmail,
      subject: campaign.subject,
      html: campaign.content,
    })

    return NextResponse.json({ success: true, mode })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Email delivery failed.'
    const status = message === 'Server email configuration is incomplete.' ? 503 : 500
    return NextResponse.json({ success: false, error: message }, { status })
  }
}
