import { Icon, IconButton, Tooltip } from '@chakra-ui/react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { setColorMode as persistColorMode } from '@/lib/storage';

interface ThemeToggleButtonProps {
  visible: boolean;
  colorMode: 'light' | 'dark';
  onChange: (mode: 'light' | 'dark') => void;
}

export function ThemeToggleButton({
  visible,
  colorMode,
  onChange,
}: ThemeToggleButtonProps) {
  if (!visible) return null;

  const isDark = colorMode === 'dark';

  const handleToggle = () => {
    const next = isDark ? 'light' : 'dark';
    onChange(next);
    void persistColorMode(next);
  };

  return (
    <Tooltip label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton
        position="fixed"
        top={3}
        left={3}
        size="sm"
        variant="solid"
        colorScheme="brand"
        pointerEvents="auto"
        zIndex={2147483647}
        boxShadow="md"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        icon={<Icon as={isDark ? FiSun : FiMoon} boxSize={4} />}
        onClick={(e) => {
          e.stopPropagation();
          handleToggle();
        }}
      />
    </Tooltip>
  );
}
