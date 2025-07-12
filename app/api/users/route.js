import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';

// Upsert user on login
export async function POST(req) {
  await dbConnect();
  const data = await req.json();
  const user = await User.findOneAndUpdate(
    { uuid: data.uuid },
    { $set: data },
    { upsert: true, new: true }
  );
  return Response.json(user, { status: 201 });
}

// Get all users (for admin panel)
export async function GET() {
  await dbConnect();
  const users = await User.find({}).sort({ createdAt: -1 });
  return Response.json(users);
} 