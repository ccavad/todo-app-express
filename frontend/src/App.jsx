import { useEffect, useState } from "react";
import "./App.css";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Container,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  SimpleGrid,
  VStack,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { resultTypes } from "./utils/constants";

const url = "http://localhost:3001/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [todoTitle, setTodoTitle] = useState("");
  const [updateTodoTitle, setUpdateTodoTitle] = useState("");
  const [todoContent, setTodoContent] = useState("");
  const [updateTodoContent, setUpdateTodoContent] = useState("");
  const [updatedTodoId, setUpdatedTodoId] = useState(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data) {
        setTodos(data);
      }
    } catch (error) {
      console.error("err", error);
    }
  };

  const createTodo = async () => {
    try {
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          title: todoTitle,
          content: todoContent,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data?.resultType !== resultTypes.success) {
        toast({
          title: "could not create todo",
          description: data?.resultType + " error",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top-right",
        });
      } else {
        fetchTodos();
        resetForm();
      }
    } catch (error) {
      console.error("err", error);
    }
  };

  const updateTodo = async () => {
    try {
      const res = await fetch(url + `/${updatedTodoId}`, {
        method: "PUT",
        body: JSON.stringify({
          title: updateTodoTitle,
          content: updateTodoContent,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data?.resultType === resultTypes.success) {
        fetchTodos();
      }
    } catch (error) {
      console.error("err", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const res = await fetch(url + `/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data?.resultType === resultTypes.success) {
        fetchTodos();
      }
      console.log("update", data);
    } catch (error) {
      console.error("err", error);
    }
  };

  const resetForm = () => {
    setTodoTitle("");
    setTodoContent("");
  };

  const renderEditModal = () => {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent color="black">
          <ModalHeader>Update Todo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack gap={5}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  type="text"
                  value={updateTodoTitle}
                  onChange={(e) => setUpdateTodoTitle(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Content</FormLabel>
                <Input
                  type="text"
                  value={updateTodoContent}
                  onChange={(e) => setUpdateTodoContent(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <Button onClick={updateTodo}>Update</Button>
              </FormControl>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };

  return (
    <Container
      maxW="100%"
      minH="100vh"
      py={6}
      bg={"linear-gradient(135deg, #141e30, #243b55)"}
    >
      <Heading>Todos</Heading>
      {/* create form  */}
      <VStack
        mt={10}
        gap={5}
        w={{ base: "100%", sm: "50%" }}
        maxW="500px"
        minW="270px"
      >
        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input
            type="text"
            value={todoTitle}
            onChange={(e) => setTodoTitle(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Content</FormLabel>
          <Input
            type="text"
            value={todoContent}
            onChange={(e) => setTodoContent(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <Button onClick={createTodo}>Add</Button>
        </FormControl>
      </VStack>

      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
        spacing={10}
        mt={10}
      >
        {todos.map((todo) => (
          <Card key={todo?.id} py={3}>
            <CardHeader py={1}>
              <Heading as="h5" fontSize="18px">
                {todo?.title}
              </Heading>
            </CardHeader>
            <CardBody py={1}>{todo?.content}</CardBody>
            <CardFooter py={1} display="flex" gap={4}>
              <IconButton
                icon={<EditIcon />}
                onClick={() => {
                  setUpdateTodoTitle(todo?.title);
                  setUpdateTodoContent(todo?.content);
                  setUpdatedTodoId(todo?.id);
                  onOpen();
                }}
              />
              <IconButton
                icon={<DeleteIcon />}
                onClick={() => {
                  deleteTodo(todo?.id);
                }}
              />
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>

      {renderEditModal()}
    </Container>
  );
}

export default App;
