import React from "react";
import {
  Group,
  Stack,
  Text,
  NumberInput,
  ActionIcon,
  SegmentedControl,
  Divider,
  Select,
} from "@mantine/core";
import { IconCurrencyDollar, IconUsers, IconX } from "@tabler/icons-react";
import { GroupMember } from "../../services/groupService";
import {
  equalize,
  reallocateWithLocks,
  centsFromStr,
  strFromCents,
} from "./splitUtils";

type SplitMode = "equal" | "custom";

export interface SplitEditorProps {
  members: GroupMember[];
  includedIds: string[];
  setIncludedIds: (ids: string[]) => void;
  sharesByUserId: Record<string, string>;
  setSharesByUserId: (
    updater: (prev: Record<string, string>) => Record<string, string>
  ) => void;
  lockedIds: Set<string>;
  setLockedIds: (locks: Set<string>) => void;
  splitMode: SplitMode;
  setSplitMode: (mode: SplitMode) => void;
  totalAmount: number;
  setShareError: (msg: string | null) => void;
}

export const SplitEditor: React.FC<SplitEditorProps> = ({
  members,
  includedIds,
  setIncludedIds,
  sharesByUserId,
  setSharesByUserId,
  lockedIds,
  setLockedIds,
  splitMode,
  setSplitMode,
  totalAmount,
  setShareError,
}) => {
  const totalCents = Math.round(Number(totalAmount || 0) * 100);

  return (
    <>
      <Divider my="xs" />
      <Group justify="space-between" mb="xs">
        <Group gap="xs">
          <IconUsers size={18} />
          <Text fw={500}>Split between members</Text>
        </Group>
        <SegmentedControl
          value={splitMode}
          onChange={(v) => {
            const mode = v as SplitMode;
            setSplitMode(mode);
            if (mode === "equal") {
              setLockedIds(new Set());
              setSharesByUserId(() =>
                equalize(Number(totalAmount || 0), includedIds)
              );
              setShareError(null);
            }
          }}
          data={[
            { label: "Equal", value: "equal" },
            { label: "Custom", value: "custom" },
          ]}
        />
      </Group>

      <Stack gap="xs">
        {includedIds.map((id) => {
          const m = members.find((x) => x.userId === id);
          if (!m) return null;
          return (
            <Group key={id} justify="space-between" gap="md">
              <div className="flex-1">
                <Text fw={500}>{m.name || m.email}</Text>
                {!m.name && (
                  <Text size="xs" c="dimmed">
                    {m.email}
                  </Text>
                )}
              </div>
              <NumberInput
                className="w-40"
                leftSection={<IconCurrencyDollar size={14} />}
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                min={0}
                value={sharesByUserId[id]}
                onChange={(val) => {
                  if (splitMode === "equal") return;
                  const inputCents = Math.max(
                    0,
                    typeof val === "number"
                      ? Math.round(val * 100)
                      : Math.round(Number(val || 0) * 100)
                  );
                  const otherLocks = new Set(lockedIds);
                  otherLocks.delete(id);
                  let otherLockedSum = 0;
                  includedIds.forEach((pid) => {
                    if (otherLocks.has(pid))
                      otherLockedSum += centsFromStr(sharesByUserId[pid]);
                  });
                  const maxForCurrent = Math.max(
                    0,
                    totalCents - otherLockedSum
                  );
                  const cappedCents = Math.min(inputCents, maxForCurrent);
                  const baseMap: Record<string, string> = {
                    ...sharesByUserId,
                    [id]: strFromCents(cappedCents),
                  };
                  const newLocks = new Set(otherLocks);
                  newLocks.add(id);
                  const nextMap = reallocateWithLocks(
                    totalCents,
                    includedIds,
                    newLocks,
                    baseMap
                  );
                  setSharesByUserId(() => nextMap);
                  setLockedIds(newLocks);
                  setShareError(null);
                }}
                disabled={splitMode === "equal"}
              />
              <ActionIcon
                variant="subtle"
                aria-label={`Remove ${m.name || m.email}`}
                onClick={() => {
                  const nextIds = includedIds.filter((x) => x !== id);
                  setIncludedIds(nextIds);
                  if (splitMode === "equal") {
                    setSharesByUserId(() =>
                      equalize(Number(totalAmount || 0), nextIds)
                    );
                  } else {
                    const copy = { ...sharesByUserId };
                    delete copy[id];
                    const newLocks = new Set(lockedIds);
                    newLocks.delete(id);
                    const nextMap = reallocateWithLocks(
                      totalCents,
                      nextIds,
                      newLocks,
                      copy
                    );
                    setSharesByUserId(() => nextMap);
                    setLockedIds(newLocks);
                  }
                }}
              >
                <IconX size={16} />
              </ActionIcon>
            </Group>
          );
        })}
      </Stack>

      {members.length > includedIds.length && (
        <Select
          label="Add participant"
          placeholder="Select a member to add"
          data={members
            .filter((m) => !includedIds.includes(m.userId))
            .map((m) => ({ value: m.userId, label: m.name || m.email }))}
          searchable
          clearable
          onChange={(val) => {
            if (!val) return;
            const nextIds = [...includedIds, val];
            setIncludedIds(nextIds);
            if (splitMode === "equal") {
              setSharesByUserId(() =>
                equalize(Number(totalAmount || 0), nextIds)
              );
            } else {
              setSharesByUserId((prev) =>
                reallocateWithLocks(totalCents, nextIds, lockedIds, {
                  ...prev,
                  [val]: prev[val] ?? "0.00",
                })
              );
            }
          }}
        />
      )}
    </>
  );
};
