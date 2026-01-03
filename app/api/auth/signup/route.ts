import { NextResponse } from "next/server"
import {prisma} from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const signupSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

// Generate Employee ID: OT-YYYY-NNNN
async function generateEmployeeId() {
  const year = new Date().getFullYear()
  const prefix = "OT"
  
  const lastEmployee = await prisma.user.findFirst({
    where: {
      employeeId: {
        startsWith: `${prefix}-${year}-`
      }
    },
    orderBy: { createdAt: 'desc' }
  })
  
  let serialNumber = 1
  if (lastEmployee) {
    const lastSerial = parseInt(lastEmployee.employeeId.split('-')[2])
    serialNumber = lastSerial + 1
  }
  
  return `${prefix}-${year}-${serialNumber.toString().padStart(4, '0')}`
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = signupSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Generate employee ID
    const employeeId = await generateEmployeeId()

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // Generate verification token
    const verificationToken = crypto.randomUUID()

    // Create user and employee
    const user = await prisma.user.create({
      data: {
        employeeId,
        email: validatedData.email,
        password: hashedPassword,
        role: "EMPLOYEE", // Default role
        verificationToken,
        employee: {
          create: {
            firstName: validatedData.name.split(' ')[0],
            lastName: validatedData.name.split(' ').slice(1).join(' ') || validatedData.name.split(' ')[0],
            phone: validatedData.phone,
            jobTitle: "Employee", // Default
            department: validatedData.companyName,
            joiningDate: new Date()
          }
        }
      },
      include: {
        employee: true
      }
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "SIGNUP",
        description: `New user registered: ${user.email}`
      }
    })

    // TODO: Send verification email
    // await sendVerificationEmail(user.email, verificationToken)

    return NextResponse.json({
      message: "Account created successfully! Please check your email to verify.",
      employeeId: user.employeeId,
      user: {
        id: user.id,
        email: user.email,
        employeeId: user.employeeId
      }
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error },
        { status: 400 }
      )
    }

    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}