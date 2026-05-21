import { Button, Tooltip } from '@chakra-ui/react';

interface EscapeHintProps {
  visible: boolean;
  onEscape: () => void;
}

export function EscapeHint({ visible, onEscape }: EscapeHintProps) {
  if (!visible) return null;

  return (
    <Tooltip label="Close card or turn off inspection" openDelay={400}>
      <Button
        position="fixed"
        top={3}
        left={3}
        size="sm"
        variant="solid"
        colorScheme="brand"
        pointerEvents="auto"
        zIndex={2147483647}
        boxShadow="md"
        fontFamily="mono"
        fontWeight="semibold"
        aria-label="Close card or turn off inspection"
        onClick={(e) => {
          e.stopPropagation();
          onEscape();
        }}
      >
        Esc
      </Button>
    </Tooltip>
  );
}
