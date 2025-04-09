import {db} from "@/server/db"

export const POST = async (req: Request) => {
    
      const {data} = await req.json();
      console.log("Webhook received:", data);
        const emailAddress = data.email_addresses[0].email_address;
        const firstName = data.first_name;
        const lastName = data.last_name;
        const imageURL = data.image_url;
        const id = data.id;
      // Handle the webhook data as needed

      await db.user.create({
        data: {
          emailAddress : emailAddress,
          firstName : firstName,
          lastName : lastName,
          imageURL : imageURL
        }
      })
      console.log("User created");
      return new Response("Webhook received", { status: 200 });

     
    
  };