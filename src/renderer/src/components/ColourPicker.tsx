import { HexColorPicker } from 'react-colorful'

export default function ColourPicker({
  value,
  onChange
}: {
  value: string
  onChange: React.Dispatch<React.SetStateAction<string>>
}): React.JSX.Element {
  return <HexColorPicker color={value} onChange={onChange} />
}
