import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { usePathname } from "expo-router";

export interface Controller {
  present(): void;
  dismiss(): void;
}

const registry: { [key: string]: Controller | undefined } = {};

const usePageKey = () => usePathname() || "root";

export function useBottomSheet(): Controller {
  const key = usePageKey();
  return {
    present: () => registry[key]?.present?.(),
    dismiss: () => registry[key]?.dismiss?.(),
  };
}

export function BottomSheet({
  snapPoints = ["40%"],
  index = 1,
  children,
}: {
  snapPoints?: string[];
  index?: number;
  children?: ReactNode;
}) {
  const key = usePageKey();
  const ref = useRef<BottomSheetModal>(null);
  const points = useMemo(() => snapPoints, [snapPoints]);

  useEffect(() => {
    registry[key] = {
      present: () => ref.current?.present(),
      dismiss: () => ref.current?.dismiss(),
    };
    return () => {
      delete registry[key];
    };
  }, [key]);

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={points}
      index={index}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
        />
      )}>
      <BottomSheetView className="flex-1 py-8">{children}</BottomSheetView>
    </BottomSheetModal>
  );
}
