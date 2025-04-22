import { threadIdAtom } from '@/app/mail/threads-list'
import { api } from '@/trpc/react'
import type { set } from 'date-fns'
import { useAtom } from 'jotai'
import React from 'react'
import { useLocalStorage } from 'usehooks-ts'

const useThreads = () => {
  const {data: accounts} = api.account.getAccounts.useQuery()
  const [accountId] = useLocalStorage('accountId', '')
  const [tab] =  useLocalStorage('email-client-tab', 'inbox')
  const [done] = useLocalStorage('email-client-done', false)
  const [threadId, setThreadId]  = useAtom(threadIdAtom)

  const{data : threads, isFetching, refetch} = api.account.getThreads.useQuery({
    accountId,
    tab,
    done
  },{
    enabled: !!accountId && !! tab, placeholderData : e => e, refetchInterval : 5000
  })
  return {
    threads,
    isFetching,
    refetch,
    accountId,
    threadId, 
    setThreadId,
    account : accounts?.find(e => e.id === accountId),
  }
}

export default useThreads