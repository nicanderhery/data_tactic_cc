import {
  ActionIcon,
  Box,
  Button,
  Card,
  Checkbox,
  Flex,
  List,
  Modal,
  ScrollArea,
  Text,
  TextInput,
  rem,
} from '@mantine/core';
import { DateInput, TimeInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { IconClock } from '@tabler/icons-react';
import React from 'react';
import './App.css';

interface Todo {
  id: string;
  text: string;
  dueDate?: Date;
}

function App() {
  const [opened, { open, close }] = useDisclosure(false);
  const [todoString, setTodoString] = React.useState<string>('');
  const [dueDate, setDueDate] = React.useState<Date | null>(null);
  const [dueTime, setDueTime] = React.useState<string>('');
  const clockRef = React.useRef<HTMLInputElement>(null);

  const pickerControl = (
    <ActionIcon variant="subtle" color="gray" onClick={() => clockRef.current?.showPicker()}>
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );

  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [completed, setCompleted] = React.useState<Todo[]>([]);

  // Get from local storage on load
  React.useEffect(() => {
    const todos = localStorage.getItem('todos');
    if (todos) {
      const parsed = JSON.parse(todos) as Todo[];
      parsed.forEach((todo) => {
        todo.dueDate = todo.dueDate ? new Date(todo.dueDate) : undefined;
      });
      setTodos(parsed);
    }

    const completed = localStorage.getItem('completed');
    if (completed) {
      setCompleted(JSON.parse(completed) as Todo[]);
    }
  }, []);

  // Save to local storage
  React.useEffect(() => {
    if (todos.length > 0 || completed.length > 0) {
      localStorage.setItem('todos', JSON.stringify(todos));
      localStorage.setItem('completed', JSON.stringify(completed));
    }
  }, [todos, completed]);

  // Clear due date when modal is closed
  React.useEffect(() => {
    if (!opened) {
      setDueDate(null);
      setDueTime('');
    }
  }, [opened]);

  return (
    <Flex p="lg" justify="center" gap="lg">
      <Card shadow="sm" padding="lg" radius="md" mih="40rem" w="30rem">
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
              <ScrollArea h="40rem" scrollbars="y">
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
                      <Box w="25rem">
                        <Text truncate="end">{todo.text}</Text>
                      </Box>
                      {todo.dueDate && (
                        <Text c={todo.dueDate < new Date() ? 'red' : 'gray'} size="xs">
                          due on {todo.dueDate.toLocaleString()}
                        </Text>
                      )}
                    </List.Item>
                  );
                })}
              </ScrollArea>
            </List>
          </Flex>
          <TextInput
            pt="md"
            placeholder="Add your new task here (Press Enter to add)"
            value={todoString}
            onChange={(event) => setTodoString(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                const todo = {
                  id: new Date().getTime().toString() + Math.random().toString(36).substring(7),
                  text: todoString,
                };
                setTodos((prev) => [...prev, todo]);
                setTodoString('');
              }
            }}
          />
          <Button variant="light" disabled={!todoString} onClick={open} mt="md">
            <Text size="sm">Add due date</Text>
          </Button>
        </Flex>
      </Card>
      <Card shadow="sm" padding="lg" radius="md" mih="40rem" w="30rem">
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
              <ScrollArea h="40rem" scrollbars="y">
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
                      <Box w="25rem">
                        <Text truncate="end" td="line-through">
                          {todo.text}
                        </Text>
                      </Box>
                    </List.Item>
                  );
                })}
              </ScrollArea>
            </List>
          </Flex>
        </Flex>
      </Card>

      <Modal opened={opened} onClose={close} size="md">
        <Flex direction="column" gap={'md'}>
          <Modal.Title>Choose date</Modal.Title>
          <DateInput
            minDate={new Date()}
            value={dueDate}
            onChange={setDueDate}
            label="Due date"
            placeholder="Due date"
          />
          <TimeInput
            label="Due time"
            ref={clockRef}
            rightSection={pickerControl}
            value={dueTime}
            onChange={(event) => setDueTime(event.currentTarget.value)}
          />
          <Button
            variant="light"
            onClick={() => {
              // Check if due date is empty
              if (!dueDate) {
                alert('Please choose a due date');
                return;
              }

              const todo = {
                id: new Date().getTime().toString() + Math.random().toString(36).substring(7),
                text: todoString,
                dueDate: new Date(`${dueDate?.toDateString()} ${dueTime}`),
              };
              setTodos((prev) => [...prev, todo]);
              setTodoString('');
              close();
            }}
          >
            <Text size="sm">Add todo</Text>
          </Button>
        </Flex>
      </Modal>
    </Flex>
  );
}

export default App;
