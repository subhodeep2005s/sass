import { auth, clerkMiddleware,createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';


const isPublickRoute=createRouteMatcher([
    "/sign-in",
    "/sign-up",
    "/",
    "/home"
])
const isPublicApikRoute=createRouteMatcher([
    "/api/videos"
])


export default  clerkMiddleware(async (auth,req)=>{
    const {userId}= await auth();
    const currentUrl=new URL(req.url);
    const isAccessingDashboard=currentUrl.pathname==="/home"
   const isApRequest= currentUrl.pathname.startsWith("/api")
   
// taking loged  user to dashboard route 
   if (userId && isPublickRoute(req) && !isAccessingDashboard) {
    return NextResponse.redirect(new URL("/home",req.url))
    
   }
//    not loged in
if(!userId){
   if (!isPublickRoute(req) && !isPublicApikRoute(req) ) {
    return NextResponse.redirect(new URL("/sign-in",req.url))
    
   }
   if (isApRequest && !isPublicApikRoute ) {
    return NextResponse.redirect(new URL("/sign-up",req.url))   
   }
}
return NextResponse.next()

})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}