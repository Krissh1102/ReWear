import dbConnect from '@/lib/dbConnect';
import Item from '@/lib/models/Item';
import User from '@/lib/models/User';

export async function GET(req) {
  await dbConnect();
  // Count swapped items
  const totalSwapped = await Item.countDocuments({ status: 'swapped' });
  // Estimate textile waste saved (2.4kg per item)
  const textileWasteSaved = (totalSwapped * 2.4) / 1000; // tons
  // Count users
  const totalUsers = await User.countDocuments();
  return Response.json({
    totalSwapped,
    textileWasteSaved: textileWasteSaved.toFixed(2),
    totalUsers
  });
} 