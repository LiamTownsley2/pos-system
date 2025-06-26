import { Button } from '@renderer/components/ui/button'
import { ArrowBigLeftIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFound(): React.JSX.Element {
  return (
    <div className="flex w-full">
      <div className="p-2 mt-4 w-full flex-1 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-light">404 error</h1>
        <p className="pt-3">This page does not exist.</p>
        <p>
          Would you like to{' '}
          <Link
            className="text-blue-400"
            to={'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/404'}
            target="_blank"
          >
            learn more about this error
          </Link>
          ?
        </p>
        <Button className="mt-5 h-10 w-1/4" onClick={() => window.history.back()}>
          <ArrowBigLeftIcon /> Go Back
        </Button>
      </div>
    </div>
  )
}
