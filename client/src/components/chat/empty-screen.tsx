
import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@/components/ui/icons'

const exampleMessages = [
  {
    heading: 'Explain technical concepts',
    message: `What is a "serverless function"?`
  },
  {
    heading: 'Summarize an article',
    message: 'Summarize the following article for a 2nd grader: \n'
  },
  {
    heading: 'Draft an email',
    message: `Draft an email to my boss about the following: \n`
  }
]
// TODO: Update message

export function EmptyScreen({ setInput }: any) { // TODO:  Pick<UseChatHelpers, 'setInput'>
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-white p-8">
        <h1 className="mb-2 text-lg font-semibold">
          Welcome to Chatwith!
        </h1>
        <p className="mb-2 leading-normal text-gray-900">
          Make questions about your file and get exactly what you need{' '}
          .
        </p>

        {/* TODO: I think you need to remove examples */}
        <p className="leading-normal text-gray-900">
          You can start a conversation here or try the following examples:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link-gray"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
            >
              <IconArrowRight className="mr-2 text-gray-900" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
