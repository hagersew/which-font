import { Box } from '@chakra-ui/react';

interface HighlightOverlayProps {
  rect: DOMRect | null;
  visible: boolean;
}

export function HighlightOverlay({ rect, visible }: HighlightOverlayProps) {
  if (!visible || !rect) return null;

  return (
    <Box
      position="fixed"
      pointerEvents="none"
      zIndex={2147483646}
      left={`${rect.x}px`}
      top={`${rect.y}px`}
      width={`${rect.width}px`}
      height={`${rect.height}px`}
      borderWidth="2px"
      borderColor="highlight.ring"
      borderRadius="2px"
      bg="highlight.fill"
      transition="all 0.12s ease-out"
      boxShadow="0 0 0 1px rgba(99, 102, 241, 0.25)"
    />
  );
}
