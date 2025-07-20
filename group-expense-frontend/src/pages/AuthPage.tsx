import React from "react";
import { Container, Paper, Title, Text, Center } from "@mantine/core";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../lib/supabase";

const AuthPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Container size="sm">
        <Center>
          <Paper shadow="lg" radius="lg" p="xl" className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <Title order={1} className="text-gray-800 mb-2">
                GroupExpense
              </Title>
              <Text size="md" c="dimmed">
                Track shared expenses and split costs easily
              </Text>
            </div>

            {/* Supabase Auth UI Component */}
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: "#228be6",
                      brandAccent: "#1971c2",
                    },
                  },
                },
                style: {
                  button: {
                    borderRadius: "8px",
                    fontSize: "14px",
                    padding: "10px 16px",
                  },
                  input: {
                    borderRadius: "8px",
                    fontSize: "14px",
                    padding: "10px 12px",
                  },
                },
              }}
              providers={[]}
              redirectTo={window.location.origin}
              onlyThirdPartyProviders={false}
            />
          </Paper>
        </Center>
      </Container>
    </div>
  );
};

export default AuthPage;
