import { useEffect, useState } from 'react'
import { Badge, Button, Progress } from 'flowbite-react'

function App(): React.JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('update')
  const [version, setVersion] = useState<string | null>(null)

  useEffect(() => {
    window.electron.ipcRenderer.invoke('get-app-version').then((ver) => {
      console.log('Version:', ver)
      setVersion(ver)
    })
  }, [])

  return (
    <>
      <p>test {version}</p>
      <Button color="red">Red</Button>
      <Progress progress={45} />
      <div className="flex flex-wrap gap-2">
        <Badge color="info" size="sm">
          Default
        </Badge>
        <Badge color="gray" size="sm">
          Dark
        </Badge>
        <Badge color="failure" size="sm">
          Failure
        </Badge>
      </div>
    </>
  )
}

export default App
