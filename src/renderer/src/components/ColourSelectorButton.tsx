import ColourPicker from './ColourPicker'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

export default function ColourSelectorButton({
  value,
  onChange
}: {
  value: string
  onChange: React.Dispatch<React.SetStateAction<string>>
}): React.JSX.Element {
  return (
    <Popover>
      <PopoverTrigger>
        <span className="block rounded-md w-10 h-10 border" style={{ backgroundColor: value }} />
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <ColourPicker value={value} onChange={onChange} />
      </PopoverContent>
    </Popover>
  )
}
