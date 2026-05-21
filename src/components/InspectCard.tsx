import {
  Box,
  Button,
  HStack,
  ScaleFade,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useCallback } from 'react';
import { FiCopy, FiDownload } from 'react-icons/fi';
import type { InspectCardState } from '@/types/inspection';
import { CARD_MAX_HEIGHT, CARD_WIDTH } from '@/lib/constants';
import { copyText } from '@/lib/clipboard';
import { snapshotToCss, downloadJson } from '@/lib/export';
import { useDraggable } from '@/hooks/useDraggable';
import { CardToolbar } from './CardToolbar';
import { PropertySection } from './PropertySection';

interface InspectCardProps {
  card: InspectCardState;
  onClose: (id: string) => void;
  onPin: (id: string, pinned: boolean) => void;
  onPositionChange: (id: string, pos: { x: number; y: number }) => void;
}

export function InspectCard({
  card,
  onClose,
  onPin,
  onPositionChange,
}: InspectCardProps) {
  const toast = useToast();
  const { snapshot, pinned, id } = card;

  const { position, onPointerDown, onPointerMove, onPointerUp } = useDraggable(
    card.position,
  );

  const handleMoveEnd = useCallback(() => {
    onPositionChange(id, position);
    onPointerUp();
  }, [id, onPositionChange, onPointerUp, position]);

  const handleCopyAll = async () => {
    const ok = await copyText(snapshotToCss(snapshot));
    toast({
      title: ok ? 'Styles copied' : 'Copy failed',
      status: ok ? 'success' : 'error',
      duration: 1500,
    });
  };

  const handleExport = () => {
    downloadJson(`which-font-${snapshot.meta.tagName}.json`, snapshot);
    toast({ title: 'Exported', status: 'success', duration: 1500 });
  };

  const { typography, colors, layout, meta, cssRules } = snapshot;

  return (
    <ScaleFade in initialScale={0.92} style={{ position: 'fixed', zIndex: card.zIndex }}>
      <Box
        position="fixed"
        left={`${position.x}px`}
        top={`${position.y}px`}
        w={`${CARD_WIDTH}px`}
        maxH={`${CARD_MAX_HEIGHT}px`}
        bg="bg.panel"
        color="text.primary"
        borderWidth="1px"
        borderColor="border.subtle"
        borderRadius="xl"
        boxShadow="lg"
        overflow="hidden"
        display="flex"
        flexDirection="column"
        onPointerMove={onPointerMove}
        onPointerUp={handleMoveEnd}
      >
        <Box
          px={3}
          py={2}
          borderBottomWidth="1px"
          borderColor="border.subtle"
          cursor="grab"
          _active={{ cursor: 'grabbing' }}
          onPointerDown={onPointerDown}
          display="grid"
          gridTemplateColumns="minmax(0, 1fr) auto"
          alignItems="center"
          columnGap={2}
          bg="bg.elevated"
          flexShrink={0}
        >
          <VStack align="start" spacing={0} minW={0} overflow="hidden">
            <Text
              fontSize="sm"
              fontWeight="semibold"
              fontFamily="mono"
              color="text.primary"
              noOfLines={1}
              w="full"
              title={`<${meta.tagName}>${meta.id !== '—' ? `#${meta.id}` : ''}`}
            >
              &lt;{meta.tagName}&gt;
              {meta.id !== '—' && `#${meta.id}`}
            </Text>
            <Text
              fontSize="10px"
              color="text.muted"
              noOfLines={1}
              w="full"
              title={meta.className !== '—' ? meta.className : meta.selectorPath}
            >
              {meta.className !== '—' ? meta.className : meta.selectorPath}
            </Text>
          </VStack>
          <CardToolbar
            pinned={pinned}
            onPin={() => onPin(id, !pinned)}
            onClose={() => onClose(id)}
            onCopyAll={handleCopyAll}
            onExport={handleExport}
          />
        </Box>

        <Box flex="1" minH={0} overflowY="auto" py={2}>
          <PropertySection
            title="Typography"
            rows={[
              { label: 'Family', value: typography.fontFamily },
              { label: 'Size', value: typography.fontSize },
              { label: 'Weight', value: typography.fontWeight },
              { label: 'Style', value: typography.fontStyle },
              { label: 'Line height', value: typography.lineHeight },
              { label: 'Letter spacing', value: typography.letterSpacing },
              { label: 'Transform', value: typography.textTransform },
              { label: 'Decoration', value: typography.textDecoration },
            ]}
          />
          <PropertySection
            title="Color & appearance"
            rows={[
              { label: 'Text', value: colors.color, swatch: colors.color },
              {
                label: 'Background',
                value: colors.backgroundColor,
                swatch: colors.backgroundColor,
              },
              { label: 'Opacity', value: colors.opacity },
            ]}
          />
          <PropertySection
            title="Layout"
            rows={[
              { label: 'Margin', value: layout.margin },
              { label: 'Padding', value: layout.padding },
              { label: 'Radius', value: layout.borderRadius },
              { label: 'Width', value: layout.width },
              { label: 'Height', value: layout.height },
            ]}
          />
          <PropertySection
            title="Element"
            rows={[
              { label: 'Tag', value: meta.tagName },
              { label: 'ID', value: meta.id },
              { label: 'Classes', value: meta.className },
            ]}
          />
          {cssRules.length > 0 && (
            <PropertySection
              title="Active CSS rules"
              collapsible
              defaultOpen={false}
              rows={cssRules.flatMap((rule, i) => [
                {
                  label: `Rule ${i + 1}`,
                  value: rule.selector,
                },
                {
                  label: 'Source',
                  value: rule.href,
                },
                ...(rule.properties.length
                  ? [{ label: 'Props', value: rule.properties.join(', ') }]
                  : []),
              ])}
            />
          )}
        </Box>

        <HStack
          px={3}
          py={2}
          borderTopWidth="1px"
          borderColor="border.subtle"
          bg="bg.elevated"
          spacing={2}
          flexShrink={0}
        >
          <Button
            size="sm"
            variant="solid"
            leftIcon={<FiCopy />}
            colorScheme="brand"
            flex={1}
            minW={0}
            onClick={(e) => {
              e.stopPropagation();
              void handleCopyAll();
            }}
          >
            Copy styles
          </Button>
          <Button
            size="sm"
            variant="outline"
            colorScheme="gray"
            leftIcon={<FiDownload />}
            borderColor="border.subtle"
            color="text.primary"
            flexShrink={0}
            onClick={(e) => {
              e.stopPropagation();
              handleExport();
            }}
          >
            Export
          </Button>
        </HStack>
      </Box>
    </ScaleFade>
  );
}
