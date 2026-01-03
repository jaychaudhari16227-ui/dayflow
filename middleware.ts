// export { default } from "next-auth/middleware"

// export const config = {
//   matcher: [
//     "/dashboard/:path*",
//     "/profile/:path*",
//     "/attendance/:path*",
//     "/leave/:path*",
//     "/admin/:path*"
//   ]
// }


import NextAuth from "next-auth/middleware"

export default NextAuth

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/attendance/:path*",
    "/leave/:path*",
    "/admin/:path*"
  ]
}
