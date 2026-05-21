import { Box, Collapse, Text, useDisclosure, HStack, Icon } from '@chakra-ui/react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { PropertyRow } from './PropertyRow';

interface Row {
  label: string;
  value: string;
  swatch?: string;
}

interface PropertySectionProps {
  title: string;
  rows: Row[];
  defaultOpen?: boolean;
  collapsible?: boolean;
}

export function PropertySection({
  title,
  rows,
  defaultOpen = true,
  collapsible = false,
}: PropertySectionProps) {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: defaultOpen });

  return (
    <Box mb={2}>
      <HStack
        spacing={1}
        mb={1}
        px={2}
        cursor={collapsible ? 'pointer' : 'default'}
        onClick={collapsible ? onToggle : undefined}
        userSelect="none"
      >
        {collapsible && (
          <Icon as={isOpen ? FiChevronDown : FiChevronRight} boxSize={3} color="text.muted" />
        )}
        <Text
          fontSize="10px"
          fontWeight="semibold"
          letterSpacing="wider"
          textTransform="uppercase"
          color="text.muted"
        >
          {title}
        </Text>
      </HStack>
      <Collapse in={collapsible ? isOpen : true} animateOpacity>
        {rows.map((row) => (
          <PropertyRow key={row.label} {...row} />
        ))}
      </Collapse>
    </Box>
  );
}
