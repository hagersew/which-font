import { Button, Icon } from '@chakra-ui/react';
import { FiXCircle } from 'react-icons/fi';

interface ClearSelectionButtonProps {
  visible: boolean;
  onClear: () => void;
}

export function ClearSelectionButton({ visible, onClear }: ClearSelectionButtonProps) {
  if (!visible) return null;

  return (
    <Button
      position="fixed"
      top={3}
      right={3}
      size="sm"
      variant="solid"
      colorScheme="brand"
      pointerEvents="auto"
      zIndex={2147483647}
      boxShadow="md"
      leftIcon={<Icon as={FiXCircle} boxSize={4} />}
      onClick={(e) => {
        e.stopPropagation();
        onClear();
      }}
    >
      Clear selection
    </Button>
  );
}
