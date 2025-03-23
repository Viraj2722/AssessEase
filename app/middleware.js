import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the path
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/';
  
  // Get the token from cookies
  const token = request.cookies.get('user')?.value;
  
  // If the path is not public and there's no token, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If the path is login and there's a token, redirect based on role
  if (isPublicPath && token) {
    try {
      const userData = JSON.parse(token);
      const role = userData?.user?.role;
      
      if (role === 'teacher') {
        return NextResponse.redirect(new URL('/teacherPanel', request.url));
      } else if (role === 'student') {
        return NextResponse.redirect(new URL('/studentPanel', request.url));
      }
    } catch (error) {
      // If there's an error parsing the token, clear it and continue
      const response = NextResponse.next();
      response.cookies.delete('user');
      return response;
    }
  }
  
  return NextResponse.next();
}

// Configure which paths should be processed by this middleware
export const config = {
  matcher: [
    '/login',
    '/studentPanel/:path*',
    '/teacherPanel/:path*',
    '/studentDashboard/:path*',
    '/teacherDashboard/:path*',
  ],
};
