// app/api/admin/notes/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import { requireAdmin } from '@lib/auth';

// Получаем все заметки
export async function GET(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const notes = await prisma.note.findMany({ orderBy: { createdAt: 'desc' } });
  await prisma.$disconnect();
  return NextResponse.json(notes);
}

// Создаём новую заметку
export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { title, content } = await req.json();
  const note = await prisma.note.create({ data: { title, content } });
  await prisma.$disconnect();
  return NextResponse.json(note, { status: 201 });
}

// Обновляем существующую заметку
export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id, title, content } = await req.json();
  const note = await prisma.note.update({
    where: { id },
    data: { title, content },
  });
  await prisma.$disconnect();
  return NextResponse.json(note);
}

// Удаляем заметку
export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await req.json();
  await prisma.note.delete({ where: { id } });
  await prisma.$disconnect();
  return NextResponse.json({ success: true });
}
