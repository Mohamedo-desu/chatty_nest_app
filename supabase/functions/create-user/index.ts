import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log("Server is starting...");

serve(async (req: Request) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);

  if (req.method !== "POST") {
    console.log("Rejected request: Method not allowed");
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    console.log("Request body:", JSON.stringify(body));

    const { id, email_addresses, first_name, unsafe_metadata, image_url } =
      body.data;
    const email = email_addresses[0].email_address;
    const { displayName } = unsafe_metadata;

    console.log(
      `Processing user: ID=${id}, Email=${email}, Name=${
        first_name || displayName
      }`
    );

    const { data, error } = await supabase.from("users").insert({
      user_id: id,
      email_address: email,
      display_name: first_name || displayName,
      photo_url: image_url,
      user_name: `@${displayName.trim().toLowerCase()}`,
      user_bio: "Hey there! i am using chatty nest",
    });

    if (error) {
      console.error("Database insert error:", error);
      return new Response(JSON.stringify(error), { status: 400 });
    }

    console.log("User successfully inserted into database:", data);
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
      status: 201,
    });
  } catch (err) {
    console.error("Request processing error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
