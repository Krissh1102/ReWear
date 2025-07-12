import dbConnect from '@/lib/dbConnect';
import Testimonial from '@/lib/models/Testimonial';

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit')) || 10;
  const testimonials = await Testimonial.find({}).sort({ createdAt: -1 }).limit(limit);
  return Response.json(testimonials);
}

export async function POST(req) {
  await dbConnect();
  const data = await req.json();
  const testimonial = await Testimonial.create(data);
  return Response.json(testimonial, { status: 201 });
} 