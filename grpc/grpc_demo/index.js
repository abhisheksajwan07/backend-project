const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync("./todo.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
var todoService = protoDescriptor.TodoService;
const server = new grpc.Server();

const todos = [
  {
    id: "1",
    title: "Todo1",
    content: "Content of todo 1",
  },
  {
    id: "2",
    title: "Todo2",
    content: "Content of todo 2",
  },
];

// u can add implementation of services
server.addService(todoService.service, {
  ListTodos: (call, callback) => {
    callback(null, { todos });
  },
  createTodo: (call, callback) => {
    let incomingNewTodo = call.request;
    todos.push(incomingNewTodo);
    console.log(todos)
    callback(null, incomingNewTodo);
  },
  getTodo: (call, callback) => {
    // const todo = todos.find((t) => t.id === call.request.id);
    //if (todo) callback(null, todo);
    //else callback({ message: "Todo not found" });
    let incomingTodoRequest = call.request;
    let todoId = incomingTodoRequest.id;
    const response = todos.filter((todo) => todo.id === todoId);
    if (response.length > 0) {
      callback(null, response);
    } else {
      callback(
        {
          message: "Todo not found",
        },
        null
      );
    }
  },
});

// server.bindAsync(address, credentials, callback);

server.bindAsync(
  "127.0.0.1:50051",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`gRPC server running at 127.0.0.1:${port}`);
  }
);
