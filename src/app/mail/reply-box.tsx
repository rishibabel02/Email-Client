'use client'
import React from 'react'
import EmailEditor from './email-editor'
import { api, type RouterOutputs } from '@/trpc/react'
import useThreads from '@/hooks/use-threads'
// import TestOpenAIButton from './test-openai'
import TestGeminiButton from './test-gemini'

const ReplyBox = () => {
  const {threadId, accountId} = useThreads()
  const {data : replyDetails} = api.account.getReplyDetails.useQuery({
    threadId : threadId ?? "",
    accountId
  })
  if(!replyDetails){
    return null
  }
  return <Component replyDetails={replyDetails}/>
}

const Component = ({replyDetails} : {replyDetails : RouterOutputs['account']['getReplyDetails']}) =>{

  const {threadId, accountId} = useThreads()
  const [subject, setSubject] = React.useState(replyDetails.subject.startsWith('Re:') ? replyDetails.subject : `Re: ${replyDetails.subject}`);

  const [toValues, setToValues] = React.useState<{ label: string, value: string }[]>(replyDetails.to.map(to => ({ label: to.address ?? to.name, value: to.address })) || [])

  const [ccValues, setCcValues] = React.useState<{ label: string, value: string }[]>(replyDetails.cc.map(cc => ({ label: cc.address ?? cc.name, value: cc.address })) || [])

  // const sendEmail = api.mail.sendEmail.useMutation()

  React.useEffect(() => {
      if (!replyDetails || !threadId) return;

      if (!replyDetails.subject.startsWith('Re:')) {
          setSubject(`Re: ${replyDetails.subject}`)
      }
      setToValues(replyDetails.to.map(to => ({ label: to.address ?? to.name, value: to.address })))
      setCcValues(replyDetails.cc.map(cc => ({ label: cc.address ?? cc.name, value: cc.address })))

  }, [replyDetails, threadId])

  const handleSend = async (value: string) => {
    console.log(value)
  }


  return (
    <div>
      <EmailEditor
            toValues={toValues}
            setToValues={setToValues}

            subject={subject}
            setSubject={setSubject}

            ccValues={ccValues}
            setCcValues={setCcValues}

           
            to={replyDetails.to.map(to => to.address)}
            handleSend={handleSend}
            isSending={false}
            />
            
            {/* <TestGeminiButton/> */}
    </div>
    
  )
}

export default ReplyBox