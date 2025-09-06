type Todo = { id: string; title: string; completed: boolean };

let todos: Todo[] = [];

const validateTitle = (title: unknown): title is string =>
  typeof title === 'string' && title.trim().length > 0 && title.length <= 100;

export async function GET() {
  return Response.json(todos);
}

export async function POST(req: Request) {
  const { title } = await req.json();
  if (!validateTitle(title)) {
    return new Response('Invalid title', { status: 400 });
  }
  const todo: Todo = { id: crypto.randomUUID(), title: title.trim(), completed: false };
  todos.push(todo);
  return Response.json(todo, { status: 201 });
}

export async function PATCH(req: Request) {
  const { id, title, completed } = await req.json();
  const todo = todos.find((t) => t.id === id);
  if (!todo) return new Response('Not found', { status: 404 });

  if (title !== undefined) {
    if (!validateTitle(title)) return new Response('Invalid title', { status: 400 });
    todo.title = title.trim();
  }
  if (completed !== undefined) {
    todo.completed = !!completed;
  }
  return Response.json(todo);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return new Response('Not found', { status: 404 });
  const [removed] = todos.splice(index, 1);
  return Response.json(removed);
}
