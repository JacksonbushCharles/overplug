'use client'

import { useEffect, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import LinkExtension from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

import { Button } from '@/components/ui/button'

type CampaignState = {
  subject: string
  content: string
}

type CampaignFormProps = {
  onCampaignChange: (campaign: CampaignState) => void
}

const starterContent = '<p>Hi there,</p><p>This is a polished bulk email draft that can be sent from the sender address with replies routed to the support inbox.</p><p>Best,<br/>EchoMail Team</p>'

export function CampaignForm({ onCampaignChange }: CampaignFormProps) {
  const [subject, setSubject] = useState('Welcome to EchoMail')
  const [content, setContent] = useState(starterContent)

  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Write your message here...' }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'min-h-[220px] rounded-2xl border border-white/10 bg-background/70 p-4 outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setContent(html)
    },
  })

  useEffect(() => {
    onCampaignChange({ subject, content })
  }, [subject, content, onCampaignChange])

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Campaign</h2>
        <p className="text-sm text-muted-foreground">Compose the subject and body. Replies will use the reply-to address automatically.</p>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="text-muted-foreground">Subject</span>
        <input
          className="w-full rounded-2xl border border-white/10 bg-background/70 px-3 py-2.5 outline-none ring-0"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          placeholder="Subject line"
        />
      </label>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Rich text editor</span>
          <Button variant="outline" size="sm" type="button" onClick={() => editor?.chain().focus().toggleBold().run()}>
            Bold
          </Button>
        </div>
        <EditorContent editor={editor} />
      </div>

      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
        <p className="mb-2 text-sm font-medium text-cyan-300">Live preview</p>
        <div className="prose prose-sm max-w-none text-sm text-foreground" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  )
}
