'use client'

import React from 'react'
import { ResizableHandle, ResizablePanel,  ResizablePanelGroup} from '@/components/ui/resizable'
import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AccountSwitcher from './account-switcher'

type Props = {
  defaultLayout : number[] | undefined,
  navCollapsedSize : number,
  defaultCollapsed : boolean
}
// 20,,32,48 means the %width of each panel 
const mail = ({defaultLayout = [20,32,48], navCollapsedSize,defaultCollapsed}: Props) => {
    const [isCollapsed, setIsCollapsed] = React.useState(false)
  return (
    <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup direction='horizontal' onLayout={(sizes : number[]) => {
            console.log(sizes)
        }} className='min-h-screen items-stretch h-full'>
            <ResizablePanel defaultSize={defaultLayout[0]} 
            collapsedSize={navCollapsedSize} 
            collapsible={true} 
            minSize={15}
            maxSize={40}
            onCollapse={() => {
                setIsCollapsed(true)
            }}
            onResize={() =>{
                setIsCollapsed(false)
            }}
            className={cn(isCollapsed && 'min-w-[50px] transition-all duration-300 ease-in-out')}>
                <div className='flex flex-col h-full flex-1'>
                    <div className={cn('flex h-[52px] items-center justify-between px-4', isCollapsed && 'h-[52px]')}>
                        {/* Account Swticher */}
                        <AccountSwitcher isCollapsed={isCollapsed}/> 
                    </div>
                    <Separator />
                    {/* Side bar */}
                    SideBar
                    <div className='flex-1'></div>
                    {/* AI */}
                    Ask AI
                </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30} >
            <Tabs defaultValue='inbox'>
            <div className='flex items-center h-[52px] px-4'>
                <h1 className='font-bold text-xl'>Inbox</h1>
                <TabsList className='ml-auto'>
                    <TabsTrigger value='inbox' className='text-xinc-600 dark:text-zinc-200 data-[state=active]:font-bold cursor-pointer'>
                        Inbox
                    </TabsTrigger>  
                    <TabsTrigger value='done' className='text-xinc-600 dark:text-zinc-200 data-[state=active]:font-bold cursor-pointer'>
                        Done
                    </TabsTrigger>  
                </TabsList>
            </div>

            <Separator/>
            {/* Search Bar */}
            Search Bar
            <TabsContent value='inbox'> 
                Inbox
            </TabsContent>
            <TabsContent value='done'> 
                Done 
            </TabsContent>
            </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
            Thread Display
        </ResizablePanel>
        </ResizablePanelGroup>
    </TooltipProvider>
  )
}

export default mail