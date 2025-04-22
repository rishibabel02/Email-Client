'use client'

import {Letter} from 'react-letter'
import useThreads from '@/hooks/use-threads'
import { cn } from '@/lib/utils'
import type { RouterOutputs } from '@/trpc/react'
import React, { use } from 'react'
import Avatar from 'boring-avatars'
import { formatDistance, formatDistanceToNow } from 'date-fns'

type Props = {
    email : RouterOutputs['account']['getThreads'][0]['emails'][0]
}

const EmailDisplay = ({email }: Props) => {
    const {account} = useThreads()
    const isMe = account?.emailAddress === email.from?.address //it'll return true
    // I am trying to make a diff layout for my emails
    // and for that I need to know who sent the email and check if the email is from me or not

  return (
    <div className={cn('border rounded-md p-4 transition-all hover:translate-x-2',{
        'border-l-gray-900 border-l-4' : isMe
    })}>
        <div className="flex items-center justify-between gap-2 ">
                <div className="flex items-center justify-between gap-2">
                {!isMe && (
                    <div className="w-[35px] h-[35px] rounded-full overflow-hidden">
                    <Avatar
                        name={email.from?.name ?? email.from.address}
                        size={35}
                    />
                    </div>
                )}
                    <span>
                        {isMe ? 'Me' : email.from?.address}
                    </span>
                </div>
            <p className='text-xs text-muted-foreground'>
                {formatDistanceToNow(email.sentAt ?? new Date(),{
                    addSuffix: true
                })}
            </p>
        </div>
        <div className='h-4'></div>
        <div className="overflow-y-auto max-h-none flex-1">
            <div className="prose max-w-none bg-white rounded-md text-black p-4">
                <Letter html={email?.body ?? ''} />
            </div>
        </div>
    </div> 
  )
}

export default EmailDisplay