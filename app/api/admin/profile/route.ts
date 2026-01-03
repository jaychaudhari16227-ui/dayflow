import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Get user ID from session/auth - replace with your auth logic
    const userId = request.headers.get('x-user-id') || 'replace-with-actual-user-id';
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        employee: {
          include: {
            documents: {
              where: {
                documentType: 'RESUME'
              },
              take: 1
            }
          }
        }
      }
    });

    if (!user || !user.employee) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const profile = {
      name: `${user.employee.firstName} ${user.employee.lastName}`,
      loginId: user.employeeId,
      email: user.email,
      mobile: user.employee.phone || 'Not provided',
      company: 'Dayflow HRMS',
      department: user.employee.department,
      role: user.role,
      location: user.employee.address || 'Not specified',
      profilePicture: user.employee.profilePicture,
      baseSalary: user.employee.baseSalary?.toString(),
      allowances: user.employee.allowances?.toString(),
      deductions: user.employee.deductions?.toString(),
      netSalary: user.employee.netSalary?.toString(),
      joiningDate: user.employee.joiningDate,
      employmentStatus: user.employee.employmentStatus,
      resume: user.employee.documents[0]?.fileUrl
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
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

    // Update user email if provided
    if (body.email) {
      await prisma.user.update({
        where: { id: userId },
        data: { email: body.email }
      });
    }

    // Update employee data
    const updateData: any = {};
    if (body.firstName) updateData.firstName = body.firstName;
    if (body.lastName) updateData.lastName = body.lastName;
    if (body.phone) updateData.phone = body.phone;
    if (body.address) updateData.address = body.address;
    if (body.department) updateData.department = body.department;
    if (body.jobTitle) updateData.jobTitle = body.jobTitle;
    if (body.profilePicture) updateData.profilePicture = body.profilePicture;

    const updatedEmployee = await prisma.employee.update({
      where: { id: user.employee.id },
      data: updateData
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully',
      employee: updatedEmployee 
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}