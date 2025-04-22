'use client'
import React from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { Nav } from './nav'
import { File, Inbox, Send } from 'lucide-react'
import { api } from '@/trpc/react'

type Props = {
    isCollapsed: boolean,
}

const Sidebar = ({isCollapsed}: Props) => {
    const [accountId] = useLocalStorage('accountId','')
    const [tab, setTab] = useLocalStorage<'inbox' | 'draft' |'sent'>('emailclient-tab','inbox')

    const {data : inboxThreads} = api.account.getNumThreads.useQuery({
        accountId,
        tab : 'inbox'
    })
    const {data : draftThreads} = api.account.getNumThreads.useQuery({
        accountId,
        tab : 'draft'
    })
    const {data : sentThreads} = api.account.getNumThreads.useQuery({
        accountId,
        tab : 'sent'
    })


  return (
    <Nav isCollapsed={isCollapsed} 
    links = {[
        {
            title : "Inbox",
            label : inboxThreads?.toString() || '0',
            icon : Inbox,
            variant : tab === 'inbox' ? 'default' : 'ghost',
            onClick: () => setTab('inbox')
        },{
            title : "Draft",
            label : draftThreads?.toString() || '0',
            icon : File,
            variant : tab === 'draft' ? 'default' : 'ghost',
            onClick: () => setTab('draft')
        },{
            title : "Sent",
            label : sentThreads?.toString() || '0',
            icon : Send,
            variant : tab === 'sent' ? 'default' : 'ghost',
            onClick: () => setTab('sent')
        }
    ]}>

    </Nav>
  )
}

export default Sidebar