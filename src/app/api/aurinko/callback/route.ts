//  /api/aurinko/callback/

// import { exchangeCodeForAccessToken, getAccountDetails } from "@/lib/aurinko"
// import { db } from "@/server/db"
// import { auth } from "@clerk/nextjs/server"
// import { NextResponse, NextRequest } from "next/server"
// import { waitUntil } from "@vercel/functions"
// import axios from "axios"

// export const GET = async (req: NextRequest) => {
//     const {userId} = await auth()

//     if(!userId) return NextResponse.json({
//         message: 'unauthorized',
//         status: 401
//     })

  
//     const params = req.nextUrl.searchParams
//     const status  = params.get('status')
//     if(status != 'success') return NextResponse.json({
//         message: 'failed to link account',
//         status: 400
//     })

//     // get the code to exhange for a token
//     const code = params.get('code')
//     if(!code) return NextResponse.json({
//         message: 'code not found',
//         status: 400
//     })

//     const token = await exchangeCodeForAccessToken (code)
//     if(!token) return NextResponse.json({
//         message: 'failed to exchange code for token',
//         status: 400
//     })

//     const accountDetails = await getAccountDetails(token.accessToken)
//     // upsert = update +  insert (it can do both)
//     if (!accountDetails) return NextResponse.json({ message: 'failed to get account details', status: 400 })

//     await db.account.upsert({
//         where : {
//             id : token.accountId.toString()
//         },

//         create : {
//             id : token.accountId.toString(),
//             accessToken : token.accessToken,
//             userId, 
//             emailAddress : accountDetails.email,
//             name : accountDetails.name
//         },
//         update : {
//             accessToken : token.accessToken,
//         },
//     })
//     // triggering initial sync endpoint here so that the user dont have to wait for the emails to sync 

//     waitUntil(
//         axios.post(`${process.env.NEXT_PUBLIC_URL}/api/initial-sync`,{
//             accountId : token.accountId.toString(),
//             userId
//         }).then(res =>{
//             console.log("Initial sync triggered", res.data)
//         }).catch(err =>{
//             console.log("Initial sync failed", err)
//         })
//     )
//     return NextResponse.redirect(new URL('/mail', req.url))

// }

import { exchangeCodeForAccessToken, getAccountDetails } from "@/lib/aurinko";
import { db } from "@/server/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import { waitUntil } from "@vercel/functions";
import axios from "axios";

export const GET = async (req: NextRequest) => {
  const { userId } = await auth();

  if (!userId)
    return NextResponse.json({
      message: "unauthorized",
      status: 401,
    });

  const clerkUser = await currentUser();
  if (!clerkUser)
    return NextResponse.json({
      message: "User not found in Clerk",
      status: 404,
    });

  // Ensure user exists in your DB
  const dbUser = await db.user.upsert({
    where: { id: userId },
    update: {}, // You can add profile updates here if needed
    create: {
      id: userId,
      emailAddress: clerkUser.emailAddresses[0]?.emailAddress || "",
      firstName: clerkUser.firstName || "",
      lastName: clerkUser.lastName || "",
      imageURL: clerkUser.imageUrl || "",
    },
  });

  console.log("✅ User ensured in DB:", dbUser);
  
  const params = req.nextUrl.searchParams;
  const status = params.get("status");

  if (status !== "success")
    return NextResponse.json({
      message: "failed to link account",
      status: 400,
    });

  const code = params.get("code");
  if (!code)
    return NextResponse.json({
      message: "code not found",
      status: 400,
    });

  try {
    const token = await exchangeCodeForAccessToken(code);
    const accountDetails = await getAccountDetails(token.accessToken);

    await db.account.upsert({
      where: {
        id: token.accountId.toString(),
      },
      create: {
        id: token.accountId.toString(),
        accessToken: token.accessToken,
        userId,
        emailAddress: accountDetails.email,
        name: accountDetails.name,
      },
      update: {
        accessToken: token.accessToken,
      },
    });

    // Fire async sync job
    waitUntil(
      axios
        .post(`${process.env.NEXT_PUBLIC_URL}/api/initial-sync`, {
          accountId: token.accountId.toString(),
          userId,
        })
        .then((res) => {
          console.log("Initial sync triggered", res.data);
        })
        .catch((err) => {
          console.log("Initial sync failed", err);
        })
    );

    return NextResponse.redirect(new URL("/mail", req.url));
  } catch (error) {
    console.error("Aurinko API error:", error);
    return NextResponse.json({
      message: error instanceof Error ? error.message : "Unexpected error",
      status: 400,
    });
  }
};