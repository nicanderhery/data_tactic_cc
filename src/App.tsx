import { Card, Checkbox, Flex, List, Text, TextInput } from '@mantine/core';
import React from 'react';
import './App.css';

interface Todo {
  id: string;
  text: string;
}

function App() {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [completed, setCompleted] = React.useState<Todo[]>([]);

  // Get from local storage on load
  React.useEffect(() => {
    const todos = localStorage.getItem('todos');
    if (todos) {
      console.log('Loaded from local storage for todos');
      setTodos(JSON.parse(todos) as Todo[]);
    }

    const completed = localStorage.getItem('completed');
    if (completed) {
      console.log('Loaded from local storage for completed');
      setCompleted(JSON.parse(completed) as Todo[]);
    }
  }, []);

  // Save to local storage
  React.useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
    if (completed.length > 0) {
      localStorage.setItem('completed', JSON.stringify(completed));
    }
  }, [todos, completed]);

  return (
    <Flex p="lg" justify="center" gap="lg">
      <Card shadow="sm" padding="lg" radius="md" mih="40rem" miw="30rem">
        <Flex h="100%" direction="column" justify="space-between">
          <Flex h="100%" direction="column" justify="flex-start">
            <Text fw={700} size="lg">
              Tasks that need to be done
            </Text>
            {todos.length > 0 ? (
              <Text pt="md" size="sm">
                Click on a task to mark it as complete
              </Text>
            ) : (
              <Text pt="md" size="sm">
                You have no tasks to complete
              </Text>
            )}
            <List pt="md">
              {todos.map((todo) => {
                return (
                  <List.Item
                    key={todo.id}
                    icon={
                      <Checkbox
                        onChange={(event) => {
                          if (event.currentTarget.checked) {
                            setCompleted((prev) => [...prev, todo]);
                            setTodos((prev) => prev.filter((item) => item.id !== todo.id));
                          }
                        }}
                      />
                    }
                  >
                    <Text>{todo.text}</Text>
                  </List.Item>
                );
              })}
            </List>
          </Flex>
          <TextInput
            pt="md"
            placeholder="Add your new task here (Press Enter to add)"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                const todo = {
                  id: new Date().getTime().toString() + Math.random().toString(36).substring(7),
                  text: event.currentTarget.value,
                };
                setTodos((prev) => [...prev, todo]);
                event.currentTarget.value = '';
              }
            }}
          />
        </Flex>
      </Card>
      <Card shadow="sm" padding="lg" radius="md" mih="40rem" miw="30rem">
        <Flex h="100%" direction="column" justify="space-between">
          <Flex h="100%" direction="column" justify="flex-start">
            <Text fw={700} size="lg">
              Completed tasks
            </Text>
            {completed.length > 0 ? (
              <Text pt="md" size="sm">
                Click on a task to mark it as incomplete
              </Text>
            ) : (
              <Text pt="md" size="sm">
                You have no completed tasks
              </Text>
            )}
            <List pt="md">
              {completed.map((todo) => {
                return (
                  <List.Item
                    key={todo.id}
                    icon={
                      <Checkbox
                        defaultChecked
                        onChange={(event) => {
                          if (!event.currentTarget.checked) {
                            setTodos((prev) => [...prev, todo]);
                            setCompleted((prev) => prev.filter((item) => item.id !== todo.id));
                          }
                        }}
                      />
                    }
                  >
                    <Text td="line-through">{todo.text}</Text>
                  </List.Item>
                );
              })}
            </List>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}

export default App;
