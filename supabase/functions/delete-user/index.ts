import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log("Server is starting...");

// Function to delete a user by their ID
async function deleteUser(userId: string) {
  console.log(`Deleting user with ID=${userId}`);
  const { data, error } = await supabase
    .from("users")
    .delete()
    .eq("user_id", userId);

  if (error) {
    console.error("Database delete error:", error);
    throw new Error(error.message);
  }

  console.log("User successfully deleted:", data);
  return data;
}

serve(async (req: Request) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);

  if (req.method !== "POST") {
    console.log("Rejected request: Method not allowed");
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    console.log("Request body:", JSON.stringify(body));

    // Validate that the event indicates deletion
    if (
      !body ||
      !body.data ||
      !body.type ||
      body.type !== "user.deleted" ||
      body.data.deleted !== true
    ) {
      console.log("Event does not indicate a valid user deletion");
      return new Response(
        JSON.stringify({
          error: "Event does not indicate a valid user deletion",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Extract the user ID from the event data
    const { id } = body.data;
    if (!id) {
      console.log("User ID missing in event data");
      return new Response(
        JSON.stringify({ error: "User ID missing in event data" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Call the delete function to remove the user
    const data = await deleteUser(id);

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("Request processing error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
