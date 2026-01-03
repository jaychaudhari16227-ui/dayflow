import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id') || 'replace-with-actual-user-id';
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        employee: {
          include: {
            documents: {
              where: {
                documentType: {
                  in: ['CERTIFICATE', 'OTHER']
                }
              },
              orderBy: {
                uploadedAt: 'desc'
              }
            }
          }
        }
      }
    });

    if (!user || !user.employee) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Map documents to skills/certifications
    const skills = user.employee.documents
      .filter(doc => doc.documentType === 'OTHER')
      .map(doc => ({
        id: doc.id,
        name: doc.title,
        type: 'skill',
        documentUrl: doc.fileUrl,
        uploadedAt: doc.uploadedAt
      }));

    const certifications = user.employee.documents
      .filter(doc => doc.documentType === 'CERTIFICATE')
      .map(doc => ({
        id: doc.id,
        name: doc.title,
        type: 'certification',
        documentUrl: doc.fileUrl,
        uploadedAt: doc.uploadedAt
      }));

    return NextResponse.json({
      skills,
      certifications
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = request.headers.get('x-user-id') || 'replace-with-actual-user-id';
    const body = await request.json();
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { employee: true }
    });

    if (!user || !user.employee) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const documentType = body.type === 'certification' ? 'CERTIFICATE' : 'OTHER';

    const document = await prisma.document.create({
      data: {
        employeeId: user.employee.id,
        title: body.name,
        documentType,
        fileUrl: body.fileUrl || `/uploads/placeholder-${body.type}.pdf`,
        fileSize: 0
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: `${body.type} added successfully`,
      document 
    });
  } catch (error) {
    console.error('Error adding skill/certification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('id');

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
    }

    await prisma.document.delete({
      where: { id: documentId }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Item deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting skill/certification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}