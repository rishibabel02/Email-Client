import useThreads from '@/hooks/use-threads'
import { api } from '@/trpc/react'
import  Avatar  from 'boring-avatars'
import React from 'react'
import Select from 'react-select'


type Props = {
    placeholder: string
    label : string

    onChange: (values: {label : string, value: string}[]) => void
    value: {label : string, value: string}[]
}



const TagInputs = ({ placeholder, label, onChange, value}: Props) => {
  const {accountId} = useThreads()
  const {data : suggestions} = api.account.getSuggestions.useQuery({
    accountId
  })
  const options = suggestions?.map(suggestion =>({
    label :(
      <span className='flex items-center gap-2 '>
        <Avatar name={suggestion.address} size={25}/>
          {suggestion.address}
      </span>
    ),
    value : suggestion.address
  }))

  const [inputValue, setInputValue] = React.useState('')

  return (
    <div className='flex border rounded-md items-center '>
        <span className='text-gray-500 ml-3 text-sm '>
            {label}
        </span>
        <Select
            onInputChange={setInputValue}
            value={value}
            // @ts-ignore
            onChange={onChange}
            placeholder={placeholder}
            className='flex-1 w-full'
            // @ts-ignore
            options={ inputValue ? options.concat({
              // @ts-ignore
              label: inputValue,
              
              value: inputValue,
            }): options}
            isMulti
            classNames={{
              control: () => {
                  return '!border-none !outline-none !ring-0 !shadow-none focus:border-none focus:outline-none focus:ring-0 focus:shadow-none dark:bg-transparent'
              },
              multiValue: () => {
                  return 'dark:!bg-gray-700'
              },
              multiValueLabel: () => {
                  return 'dark:text-white dark:bg-gray-700 rounded-md'
              }
          }}
          classNamePrefix="select"
        />
    </div>
  )
}

export default TagInputs