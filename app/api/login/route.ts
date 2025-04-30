export async function POST(request: Request) {
  const { password } = await request.json();

  if (password === process.env.LOGIN_PASSWORD) {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ success: false }), { status: 401 });
  }
}
