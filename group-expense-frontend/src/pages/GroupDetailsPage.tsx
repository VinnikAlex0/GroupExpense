import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Title,
  Button,
  Grid,
  Card,
  Text,
  Group,
  Stack,
  Badge,
  Divider,
  ActionIcon,
  Avatar,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconPlus,
  IconCurrencyDollar,
  IconUserPlus,
} from "@tabler/icons-react";
import { useExpenses } from "../hooks/useExpenses";
import { useGroups } from "../hooks/useGroups";
import {
  groupService,
  Group as GroupType,
  Role,
} from "../services/groupService";
import { CreateExpenseData } from "../services/expenseService";
import {
  LoadingSpinner,
  ErrorAlert,
  AddExpenseModal,
  InviteMembersModal,
} from "../components";
import { notifications } from "@mantine/notifications";

const GroupDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const groupId = parseInt(id || "0", 10);

  const [group, setGroup] = useState<GroupType | null>(null);
  const [groupLoading, setGroupLoading] = useState(true);
  const [groupError, setGroupError] = useState<string | null>(null);
  const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
  const [inviteMembersModalOpen, setInviteMembersModalOpen] = useState(false);
  const [inviting, setInviting] = useState(false);

  const {
    expenses,
    categories,
    summary,
    loading: expensesLoading,
    creating,
    error: expensesError,
    createExpense,
    deleteExpense,
  } = useExpenses(groupId);

  const { refreshGroups } = useGroups();

  // Fetch group details
  useEffect(() => {
    const fetchGroup = async () => {
      if (!groupId) {
        navigate("/groups");
        return;
      }

      setGroupLoading(true);
      setGroupError(null);
      try {
        const groupData = await groupService.getGroupById(groupId);
        setGroup(groupData);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to load group";
        setGroupError(errorMsg);
      } finally {
        setGroupLoading(false);
      }
    };

    fetchGroup();
  }, [groupId, navigate]);

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(typeof amount === "string" ? parseFloat(amount) : amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleInviteMember = async (
    email: string,
    role: Role
  ): Promise<boolean> => {
    setInviting(true);
    try {
      const newMember = await groupService.addMember(groupId, { email, role });

      // Update the group state to include the new member
      setGroup((prevGroup) => {
        if (!prevGroup) return prevGroup;
        return {
          ...prevGroup,
          members: [...prevGroup.members, newMember],
        };
      });

      // Refresh the groups list so the invited user sees the new group
      // This ensures the group appears on their groups page immediately
      await refreshGroups();

      return true;
    } catch (error: any) {
      console.error("Failed to invite member:", error);
      notifications.show({
        title: "Failed to Invite Member",
        message:
          error.message ||
          "There was an error inviting the member. Please try again.",
        color: "red",
      });
      return false;
    } finally {
      setInviting(false);
    }
  };

  const handleCreateExpense = async (
    data: CreateExpenseData
  ): Promise<void> => {
    await createExpense(data);
  };

  // Debug: Remove after confirming fix works
  // console.log("Summary structure:", summary?.total.expenseCount);

  if (groupLoading) {
    return <LoadingSpinner />;
  }

  if (groupError || !group) {
    return (
      <Container size="md" py="xl">
        <ErrorAlert
          message={groupError || "Group not found"}
          onRetry={() => window.location.reload()}
        />
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      {/* Group Header Info */}
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl">
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={2} mb="xs">
                {String(group.name || "Unnamed Group")}
              </Title>
              {group.description && (
                <Text c="dimmed" size="sm">
                  {String(group.description)}
                </Text>
              )}
            </div>
            {group.userRole && (
              <Badge color="blue" variant="light">
                {String(group.userRole)}
              </Badge>
            )}
          </Group>

          <Divider />

          {/* Members Section */}
          <div>
            <Group justify="space-between" align="center" mb="sm">
              <Text fw={500}>
                Members ({String(group.members?.length || 0)})
              </Text>
              {(group.userRole === Role.OWNER ||
                group.userRole === Role.ADMIN) && (
                <Button
                  size="xs"
                  variant="light"
                  leftSection={<IconUserPlus size={14} />}
                  onClick={() => setInviteMembersModalOpen(true)}
                  loading={inviting}
                >
                  Invite Member
                </Button>
              )}
            </Group>
            <Group gap="xs">
              {group.members.map((member) => (
                <Group key={member.id} gap="xs">
                  <Avatar
                    size="sm"
                    radius="xl"
                    name={member.name || member.email}
                    color="blue"
                  >
                    {String(member.name || member.email)
                      .substring(0, 2)
                      .toUpperCase()}
                  </Avatar>
                  <div>
                    <Text size="sm" fw={500}>
                      {String(member.name || member.email.split("@")[0])}
                    </Text>
                    <Badge size="xs" variant="outline">
                      {String(member.role)}
                    </Badge>
                  </div>
                </Group>
              ))}
            </Group>
          </div>
        </Stack>
      </Card>

      {/* Summary Stats */}
      {summary && (
        <Grid mb="xl">
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group gap="xs" mb="xs">
                <IconCurrencyDollar size={20} color="green" />
                <Text fw={500}>Total Expenses</Text>
              </Group>
              <Text size="xl" fw={700} c="green">
                {formatCurrency(summary.total.amount)}
              </Text>
              <Text size="sm" c="dimmed">
                {summary.total.expenseCount?.id || 0}{" "}
                {(summary.total.expenseCount?.id || 0) === 1
                  ? "expense"
                  : "expenses"}
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text fw={500} mb="xs">
                Top Category
              </Text>
              {summary.byCategory.length > 0 ? (
                <>
                  <Text size="lg" fw={600}>
                    {String(
                      summary.byCategory[0].category?.name || "Unknown Category"
                    )}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {formatCurrency(summary.byCategory[0].totalAmount)}
                  </Text>
                </>
              ) : (
                <Text c="dimmed" size="sm">
                  No expenses yet
                </Text>
              )}
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text fw={500} mb="xs">
                Your Share
              </Text>
              <Text size="lg" fw={600} c="blue">
                {formatCurrency(
                  group.members?.length > 0
                    ? parseFloat(summary.total.amount || "0") /
                        group.members.length
                    : 0
                )}
              </Text>
              <Text size="sm" c="dimmed">
                Split equally
              </Text>
            </Card>
          </Grid.Col>
        </Grid>
      )}

      {/* Expenses Section */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="lg">
          <Title order={3}>Recent Expenses</Title>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setAddExpenseModalOpen(true)}
            leftSection={<IconPlus size={16} />}
          >
            Add Expense
          </Button>
        </Group>

        {/* Loading State */}
        {expensesLoading && <LoadingSpinner />}

        {/* Error State */}
        {expensesError && (
          <ErrorAlert
            message={expensesError}
            onRetry={() => window.location.reload()}
          />
        )}

        {/* Expenses List */}
        {!expensesLoading && !expensesError && (
          <Stack gap="sm">
            {expenses.length === 0 ? (
              <div className="text-center py-12">
                <Text c="dimmed" size="lg" mb="sm">
                  No expenses yet
                </Text>
                <Text c="dimmed" size="sm" mb="lg">
                  Add your first expense to get started tracking your group's
                  spending.
                </Text>
                <Button
                  onClick={() => setAddExpenseModalOpen(true)}
                  leftSection={<IconPlus size={16} />}
                >
                  Add First Expense
                </Button>
              </div>
            ) : (
              expenses.map((expense) => (
                <Card
                  key={expense.id}
                  padding="md"
                  radius="sm"
                  withBorder
                  className="hover:shadow-sm transition-shadow"
                >
                  <Group justify="space-between" align="flex-start">
                    <div className="flex-1">
                      <Group gap="sm" mb="xs">
                        <Text fw={500}>
                          {String(expense.description || "No description")}
                        </Text>
                        {expense.category && (
                          <Badge
                            size="sm"
                            variant="light"
                            color={expense.category.color || "blue"}
                          >
                            {String(expense.category.name || "Category")}
                          </Badge>
                        )}
                      </Group>
                      <Group gap="sm">
                        <Text size="sm" c="dimmed">
                          Paid by{" "}
                          {String(
                            expense.paidBy?.name ||
                              expense.paidBy?.email ||
                              "Unknown"
                          )}
                        </Text>
                        <Text size="sm" c="dimmed">
                          •
                        </Text>
                        <Text size="sm" c="dimmed">
                          {formatDate(expense.date)}
                        </Text>
                      </Group>
                    </div>
                    <Text fw={600} c="green" size="lg">
                      {formatCurrency(expense.amount)}
                    </Text>
                  </Group>
                </Card>
              ))
            )}
          </Stack>
        )}
      </Card>

      {/* Add Expense Modal */}
      <AddExpenseModal
        opened={addExpenseModalOpen}
        onClose={() => setAddExpenseModalOpen(false)}
        onSubmit={handleCreateExpense}
        categories={categories}
        loading={creating}
        groupId={groupId}
      />

      {/* Invite Members Modal */}
      {group && (
        <InviteMembersModal
          opened={inviteMembersModalOpen}
          onClose={() => setInviteMembersModalOpen(false)}
          onSubmit={handleInviteMember}
          loading={inviting}
          groupName={group.name}
        />
      )}
    </Container>
  );
};

export default GroupDetailsPage;
