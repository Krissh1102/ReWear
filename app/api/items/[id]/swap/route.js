import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Item from '@/lib/models/Item';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(req, { params }) {
  try {
    // Get user from Clerk
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 });
    }

    // Find and update the item
    const item = await Item.findById(id);
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    if (item.swappedBy) {
      return NextResponse.json({ error: 'Item already swapped' }, { status: 400 });
    }
    item.swappedBy = userId;
    item.swappedAt = new Date();
    item.status = 'swapped';
    await item.save();

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 