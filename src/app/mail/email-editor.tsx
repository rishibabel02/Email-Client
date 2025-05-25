'use client'
import React from 'react'
import {EditorContent, useEditor} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {Text} from '@tiptap/extension-text'
import { Edit } from 'lucide-react'
import EditorMenuBar from './editor-menubar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import TagInputs from './tag-inputs'
import { Input } from '@/components/ui/input'
import AIComposeButton from './ai-compose-button'
import { marked } from 'marked';


type Props = {
    subject: string
    setSubject: (value : string) => void

    toValues : {label : string, value: string}[]
    setToValues: (value : {label : string, value: string}[]) => void

    ccValues : {label : string, value: string}[]
    setCcValues: (value : {label : string, value: string}[]) => void

    to:string[]

    handleSend: (value : string) => void
    isSending: boolean

    defaultToolBarExpanded?: boolean


}

const EmailEditor = ({subject, setSubject, toValues, setToValues, ccValues, setCcValues, to, handleSend, isSending, defaultToolBarExpanded}: Props) => {
    const [value, setValue] = React.useState<string>('')
    const [expanded, setExpanded] = React.useState<boolean>(defaultToolBarExpanded ?? false)



    const CustomTest = Text.extend({
        addKeyboardShortcuts(){
            return {
                'Meta-j' : () =>{
                    console.log('meta j')
                    return true
                }
            }
        }
    })
    // const editor = useEditor({
    //     autofocus : false,
    //     extensions: [StarterKit,CustomTest],
    //     onUpdate: ({editor}) => {
    //         setValue(editor.getHTML())
    //     },
    // })
    const editor = useEditor({
        autofocus: false,
        extensions: [StarterKit, CustomTest],
        onUpdate: ({ editor }) => {
          setValue(editor.getHTML())
          console.log("Editor updated HTML:", editor.getHTML()) // Log final HTML
        },
      })

    marked.setOptions({
        breaks: false, // Treat single newlines as <br> (optional, adjust based on needs)
        gfm: true, // Use GitHub-flavored markdown
      })

      const onGenerate = (token: string) => {
        // Convert markdown to HTML
        const htmlContent = marked(token)
        console.log("Raw Markdown in EmailEditor:", JSON.stringify(token)) // Log raw markdown
        console.log("HTML Content from marked:", htmlContent) // Log HTML from marked
    
        // Clear the editor to avoid extra wrapping
        editor?.commands?.clearContent()
        // Wrap the content in a div to prevent Tiptap from adding extra <p> tags
        const wrappedContent = `<div>${htmlContent}</div>`
        editor?.commands?.setContent(wrappedContent, false, { preserveWhitespace: true })
        console.log("Editor HTML after setContent:", editor?.getHTML()) // Log Tiptap's HTML
      }

    if(!editor){
        return null
    }

   

  return (
    <div>

        <div className='flex py-2 p-4 border-b'>
         <EditorMenuBar editor={editor}/>
        </div>

        <div className='p-4 pb-0 space-y-2'>
            {expanded && (
                <>
                    <TagInputs  
                        label='To'
                        onChange={setToValues}
                        placeholder='Add Recipients'
                        value={toValues} 
                    />
                    <TagInputs  
                        label='Cc'
                        onChange={setCcValues}
                        placeholder='Add Recipients'
                        value={ccValues} 
                    />
                    <Input id='subject' placeholder='Subject' value={subject} onChange={(e) => setSubject(e.target.value)}/>
                </>
            )}
            
            <div className='flex items-center gap-2 '>
                <div className='cursor-pointer' onClick={()=>setExpanded(!expanded)}>
                    <span className='text-green-600 font-medium'>
                        Draft {" "}
                    </span>
                    <span>
                        to {to.join(', ')}
                    </span>
                </div>
                <AIComposeButton isComposing={defaultToolBarExpanded ?? true} onGenerate={onGenerate}/>

            </div>
            
        </div>

        <div className='email-editor-content w-full px-4'>
        <style jsx>{`
          .email-editor-content p {
            margin-bottom: 2em;
            margin-top: 0;
            line-height: 1.6;
          }
          .email-editor-content p:last-child {
            margin-bottom: 0;
          }
          .email-editor-content div {
            margin-bottom: 0;
          }
        `}</style>
        <EditorContent editor={editor} value={value} />
      </div>

        <Separator/>
        <div className="py-3 px-4 flex items-center justify-between">
                <span className="text-sm">
                    Tip: Press{" "}
                    <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
                        Cmd + J
                    </kbd>{" "}
                    for AI autocomplete
                </span>
                <Button className='cursor-pointer' onClick={async () => 
                    {
                        // editor?.commands?.clearContent()
                       await handleSend(value)

                    }} disabled={isSending}>
                    Send
                </Button>
            </div>
    </div>
  )
}

export default EmailEditor