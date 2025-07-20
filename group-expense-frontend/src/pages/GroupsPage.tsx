import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Title,
  Card,
  Text,
  SimpleGrid,
  Loader,
  Alert,
} from "@mantine/core";

type Group = {
  id: number;
  name: string;
  createdBy: string;
  createdAt: string;
};

const GroupsPage: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/groups")
      .then((res) => {
        setGroups(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch groups");
        setLoading(false);
      });
  }, []);

  return (
    <Container size="md" py="xl">
      <Title order={2} mb="md">
        Group List
      </Title>

      {loading && <Loader />}
      {error && <Alert color="red">{error}</Alert>}

      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        {groups.map((group) => (
          <Card key={group.id} shadow="sm" radius="md" p="lg" withBorder>
            <Text fw={500}>{group.name}</Text>
            <Text size="sm" c="dimmed">
              Created by: {group.createdBy}
            </Text>
            <Text size="xs" mt="xs">
              {new Date(group.createdAt).toLocaleString()}
            </Text>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default GroupsPage;
