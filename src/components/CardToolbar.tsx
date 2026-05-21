import { HStack, Icon, IconButton, Tooltip } from '@chakra-ui/react';
import { FiCopy, FiDownload, FiX } from 'react-icons/fi';
import { MdOutlinePushPin, MdPushPin } from 'react-icons/md';

interface CardToolbarProps {
  pinned: boolean;
  onPin: () => void;
  onClose: () => void;
  onCopyAll: () => void;
  onExport: () => void;
}

const toolbarButtonProps = {
  size: 'xs' as const,
  variant: 'outline' as const,
  borderColor: 'border.subtle',
  bg: 'bg.panel',
  flexShrink: 0,
  minW: '28px',
  h: '28px',
};

export function CardToolbar({
  pinned,
  onPin,
  onClose,
  onCopyAll,
  onExport,
}: CardToolbarProps) {
  return (
    <HStack spacing={1} flexShrink={0}>
      <Tooltip label={pinned ? 'Unpin' : 'Pin card'}>
        <IconButton
          {...toolbarButtonProps}
          aria-label={pinned ? 'Unpin' : 'Pin'}
          icon={<Icon as={pinned ? MdOutlinePushPin : MdPushPin} boxSize={3.5} />}
          colorScheme={pinned ? 'brand' : 'gray'}
          color={pinned ? 'brand.600' : 'text.primary'}
          _dark={{ color: pinned ? 'brand.300' : 'text.primary' }}
          onClick={(e) => {
            e.stopPropagation();
            onPin();
          }}
        />
      </Tooltip>
      <Tooltip label="Copy all styles as CSS">
        <IconButton
          {...toolbarButtonProps}
          aria-label="Copy all styles"
          icon={<Icon as={FiCopy} boxSize={3.5} />}
          colorScheme="brand"
          color="brand.600"
          _dark={{ color: 'brand.300' }}
          onClick={(e) => {
            e.stopPropagation();
            onCopyAll();
          }}
        />
      </Tooltip>
      <Tooltip label="Export JSON">
        <IconButton
          {...toolbarButtonProps}
          aria-label="Export"
          icon={<Icon as={FiDownload} boxSize={3.5} />}
          colorScheme="gray"
          color="text.primary"
          _dark={{ color: 'whiteAlpha.900' }}
          onClick={(e) => {
            e.stopPropagation();
            onExport();
          }}
        />
      </Tooltip>
      <Tooltip label="Close">
        <IconButton
          {...toolbarButtonProps}
          aria-label="Close"
          icon={<Icon as={FiX} boxSize={3.5} />}
          colorScheme="gray"
          color="text.primary"
          _dark={{ color: 'whiteAlpha.900' }}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        />
      </Tooltip>
    </HStack>
  );
}
