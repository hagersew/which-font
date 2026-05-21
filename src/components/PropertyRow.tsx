import {
  Box,
  Icon,
  IconButton,
  Text,
  useToast,
} from '@chakra-ui/react';
import { FiCopy } from 'react-icons/fi';
import { copyText } from '@/lib/clipboard';

interface PropertyRowProps {
  label: string;
  value: string;
  swatch?: string;
}

const copyButtonProps = {
  size: 'xs' as const,
  variant: 'outline' as const,
  borderColor: 'border.subtle',
  bg: 'bg.panel',
  colorScheme: 'brand' as const,
  color: 'brand.600',
  flexShrink: 0,
  minW: '28px',
  h: '28px',
};

export function PropertyRow({ label, value, swatch }: PropertyRowProps) {
  const toast = useToast();

  const handleCopy = async () => {
    const ok = await copyText(value);
    toast({
      title: ok ? 'Copied' : 'Copy failed',
      status: ok ? 'success' : 'error',
      duration: 1500,
      isClosable: true,
      position: 'top',
    });
  };

  return (
    <Box
      display="grid"
      gridTemplateColumns={
        swatch ? '88px 14px minmax(0, 1fr) auto' : '88px minmax(0, 1fr) auto'
      }
      columnGap={2}
      alignItems="center"
      py={1}
      px={2}
      borderRadius="md"
      _hover={{ bg: 'bg.elevated' }}
    >
      <Text fontSize="xs" color="text.muted">
        {label}
      </Text>
      {swatch ? (
        <Box
          w="14px"
          h="14px"
          borderRadius="sm"
          borderWidth="1px"
          borderColor="border.subtle"
          bg={swatch}
        />
      ) : null}
      <Text
        fontSize="xs"
        fontFamily="mono"
        color="text.primary"
        minW={0}
        noOfLines={2}
        title={value}
      >
        {value}
      </Text>
      <IconButton
        {...copyButtonProps}
        aria-label={`Copy ${label}`}
        icon={<Icon as={FiCopy} boxSize={3.5} />}
        _dark={{ color: 'brand.300' }}
        onClick={(e) => {
          e.stopPropagation();
          void handleCopy();
        }}
      />
    </Box>
  );
}
