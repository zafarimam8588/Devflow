/* eslint-disable camelcase */
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createUser, updateUser, deleteUser } from "@/lib/actions/user.action";

export async function POST(req: Request) {
  const allowedOrigin = "https://code-flow-rust.vercel.app"; // Your frontend URL

  // Get headers using next/headers function
  const headerPayload = headers(); // This returns a ReadonlyHeaders object

  // Access headers from the returned ReadonlyHeaders object
  const origin = headerPayload.get("Origin");
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", { status: 400 });
  }

  // Allow only specific origin (your frontend URL) to send requests
  if (origin && origin !== allowedOrigin) {
    return new Response("Forbidden", { status: 403 });
  }

  // CORS headers to allow the frontend to interact with the server
  const responseHeaders = new Headers();
  responseHeaders.set("Access-Control-Allow-Origin", allowedOrigin);
  responseHeaders.set("Access-Control-Allow-Methods", "POST");
  responseHeaders.set(
    "Access-Control-Allow-Headers",
    "Content-Type, svix-id, svix-timestamp, svix-signature"
  );
  responseHeaders.set("Access-Control-Allow-Credentials", "true"); // Allows credentials (cookies)

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: responseHeaders,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const WEBHOOK_SECRET = process.env.NEXT_CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", { status: 400 });
  }

  // ALL THE LOGIC WILL BE WRITTEN FROM HERE
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, image_url, username, first_name, last_name } =
      evt.data;

    // Create a new user in the database
    const mongoUser = await createUser({
      clerkId: id,
      name: `${first_name}${last_name ? ` ${last_name}` : ""}}`,
      username: username!, // <- ! means that we know that the username is not going to be undefined
      email: email_addresses[0].email_address,
      picture: image_url,
    });

    return NextResponse.json({ message: "OK", user: mongoUser });
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, image_url, username, first_name, last_name } =
      evt.data;

    // Create a new user in the database
    console.log("Inside update ");
    const mongoUser = await updateUser({
      clerkId: id,
      updateData: {
        name: `${first_name}${last_name ? ` ${last_name}` : ""}}`,
        username: username!, // <- ! means that we know that the username is not going to be undefined
        email: email_addresses[0].email_address,
        picture: image_url,
      },
      path: `/profile/${id}`,
    });

    return NextResponse.json({ message: "OK", user: mongoUser });
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;
    console.log("Inside delete ");

    const deletedUser = await deleteUser({ clerkId: id! });

    return NextResponse.json({ message: "OK", user: deletedUser });
  }
  return new Response("", { status: 200 });
}
