import React from "react";
import { Modal, Drawer } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export interface ResponsiveSheetProps {
  opened: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  modalSize?: string | number;
  footer?: React.ReactNode;
}

// Renders a bottom-sheet Drawer on small screens, and a centered Modal on desktop
export const ResponsiveSheet: React.FC<ResponsiveSheetProps> = ({
  opened,
  onClose,
  title,
  children,
  modalSize = "md",
  footer,
}) => {
  const isMobile = useMediaQuery("(max-width: 640px)"); // Tailwind 'sm'

  if (isMobile) {
    return (
      <Drawer
        opened={opened}
        onClose={onClose}
        title={title}
        position="bottom"
        size="auto"
        offset={0}
        radius="md"
        styles={{
          content: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            height: "auto",
            maxHeight: "calc(100dvh - 80px)",
            overflow: "hidden",
          },
        }}
      >
        <div className="flex flex-col" style={{ maxHeight: "100%" }}>
          <div
            className="overflow-y-auto"
            style={{
              paddingBottom: footer
                ? "calc(env(safe-area-inset-bottom) + 96px)"
                : "env(safe-area-inset-bottom)",
            }}
          >
            {children}
          </div>
          {footer && (
            <div
              className="sticky bottom-0 left-0 right-0 bg-white border-t p-3"
              style={{
                paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)",
              }}
            >
              {footer}
            </div>
          )}
        </div>
      </Drawer>
    );
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      size={modalSize}
      centered
    >
      <div className="flex flex-col gap-0">
        <div>{children}</div>
        {footer && <div className="mt-md">{footer}</div>}
      </div>
    </Modal>
  );
};
