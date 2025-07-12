import dbConnect from '@/lib/dbConnect';
import Item from '@/lib/models/Item';

export async function GET(req) {
  await dbConnect();
  const items = await Item.find({}).sort({ createdAt: -1 });
  return Response.json(items);
}

export async function POST(req) {
  await dbConnect();
  const data = await req.json();
  const item = await Item.create(data);
  return Response.json(item, { status: 201 });
} 