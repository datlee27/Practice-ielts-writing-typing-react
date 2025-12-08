interface VirtualKeyboardProps {
  pressedKey: string;
}

const keyboardLayout = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Alt', 'Space', 'Alt', 'Ctrl']
];

export function VirtualKeyboard({ pressedKey }: VirtualKeyboardProps) {
  const getKeyClass = (key: string) => {
    const baseClass = 'rounded-md transition-all duration-100 flex items-center justify-center text-sm font-mono';
    const isPressed = key.toLowerCase() === pressedKey.toLowerCase() || 
                     (key === 'Space' && pressedKey === 'Space');
    
    let sizeClass = 'h-12 px-3';
    if (key === 'Backspace') sizeClass = 'h-12 px-6';
    if (key === 'Tab') sizeClass = 'h-12 px-5';
    if (key === 'Caps') sizeClass = 'h-12 px-6';
    if (key === 'Enter') sizeClass = 'h-12 px-6';
    if (key === 'Shift') sizeClass = 'h-12 px-8';
    if (key === 'Space') sizeClass = 'h-12 flex-1';
    if (key === 'Ctrl' || key === 'Alt') sizeClass = 'h-12 px-5';
    
    const colorClass = isPressed 
      ? 'bg-teal-500 text-white shadow-lg' 
      : 'bg-slate-800 text-slate-400 hover:bg-slate-700';
    
    return `${baseClass} ${sizeClass} ${colorClass}`;
  };

  return (
    <div className="w-full space-y-2 opacity-60 hover:opacity-100 transition-opacity">
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2 justify-center">
          {row.map((key, keyIndex) => (
            <div key={keyIndex} className={getKeyClass(key)}>
              {key === 'Space' ? '' : key}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
