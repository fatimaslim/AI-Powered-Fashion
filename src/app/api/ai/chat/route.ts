import { NextResponse } from "next/server";

// System prompt ready for OpenAI/Gemini integration
// const SYSTEM_PROMPT = `You are StyleMind AI...`

// Smart fashion responses based on keywords
function generateFashionResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("interview") || lower.includes("job")) {
    return `Great question! Here's my interview dressing guide:\n\n**For a Corporate Interview:**\n- **Top:** A well-fitted blazer in navy, charcoal, or black over a crisp white or light blue shirt\n- **Bottom:** Tailored trousers or a pencil skirt in a matching or complementary tone\n- **Shoes:** Closed-toe leather shoes — oxford, loafer, or modest heel\n- **Colors:** Stick to neutrals — navy, charcoal, white, beige. One subtle accent is fine\n\n**For a Creative/Tech Interview:**\n- **Top:** Smart casual — a structured knit, clean button-down, or elevated tee under a blazer\n- **Bottom:** Dark jeans (no rips) or chinos\n- **Shoes:** Clean sneakers or desert boots\n\n**Key Tips:**\n✅ Fit is everything — ensure nothing is too tight or too loose\n✅ Iron/steam your clothes the night before\n✅ Keep accessories minimal and professional\n✅ When in doubt, overdress slightly — it shows respect\n\nWould you like me to suggest specific outfit combinations for your industry?`;
  }

  if (lower.includes("color") && (lower.includes("olive") || lower.includes("skin"))) {
    return `Olive skin tones are incredibly versatile! Here's your color guide:\n\n**🌟 Best Colors for Olive Skin:**\n- **Jewel Tones:** Emerald green, sapphire blue, ruby red, amethyst purple\n- **Earth Tones:** Rust, terracotta, camel, olive green (yes, it works!)\n- **Warm Neutrals:** Cream, warm white, tan, chocolate brown\n- **Bold Choices:** Mustard yellow, coral, teal\n\n**🚫 Colors to Approach Carefully:**\n- Pale pastels (can wash you out)\n- Neon yellow or lime green\n- Very pale pink\n- Washed-out beige too close to your skin tone\n\n**💡 Pro Tips:**\n- Warm metals (gold, rose gold) complement olive skin beautifully\n- High contrast combinations (dark + light) create striking looks\n- Deep burgundy and forest green are your power colors\n\nWould you like outfit suggestions in any of these color families?`;
  }

  if (lower.includes("winter") || lower.includes("cold")) {
    return `Winter styling is all about mastering layers! Here's your cold-weather guide:\n\n**🧥 Essential Winter Layers:**\n1. **Base:** Merino wool turtleneck or thermal long-sleeve\n2. **Mid:** Cashmere sweater, cardigan, or fleece vest\n3. **Outer:** Wool overcoat, puffer jacket, or shearling coat\n\n**Key Winter Pieces:**\n- A quality wool coat in camel or black (investment piece)\n- Chunky knit scarves in rich colors\n- Leather gloves and a structured beanie\n- Ankle or knee-high boots in leather or suede\n\n**Color Palette:**\n🎨 Rich burgundy, forest green, navy, charcoal, cream, rust\n\n**Styling Tips:**\n✅ Monochromatic outfits in dark tones look incredibly chic\n✅ Play with textures — mix knit, leather, wool, and velvet\n✅ A bright scarf or beanie can lift a neutral outfit\n✅ Invest in waterproof boots that still look stylish\n\nWant me to build you a winter capsule wardrobe?`;
  }

  if (lower.includes("handbag") || lower.includes("bag") || lower.includes("luxury")) {
    return `Here are my top handbag recommendations across budgets:\n\n**💎 Luxury Investment Pieces:**\n- **Classic:** Hermès Birkin/Kelly, Chanel Classic Flap, Louis Vuitton Neverfull\n- **Modern Luxury:** Bottega Veneta Jodie, Celine Triomphe, Loewe Puzzle\n- **Understated:** The Row Margaux, Loro Piana Extra Pocket\n\n**✨ Premium Mid-Range:**\n- Polène Numéro Un — exceptional quality-to-price ratio\n- DeMellier London — sustainable and elegant\n- A.P.C. Half Moon — minimalist Parisian chic\n\n**🌟 Smart Buys:**\n- Mansur Gavriel — clean lines, beautiful leather\n- Coach Tabby — great modern classic\n- Madewell Transport Tote — reliable everyday option\n\n**Pro Tips for Bag Selection:**\n✅ A black or tan crossbody is the most versatile first purchase\n✅ Consider bag size relative to your body proportions\n✅ Structured bags work for professional settings\n✅ Quality leather develops a beautiful patina over time\n\nWhat style are you looking for — everyday carry, evening, or professional?`;
  }

  // Default fashion advice
  return `That's a great fashion question! Here are my thoughts:\n\n**General Styling Principles:**\n\n1. **Fit First:** The best outfit in the wrong size won't look right. Prioritize how clothes fit your body over brands or trends.\n\n2. **Build a Core Wardrobe:** Start with versatile basics — well-fitted jeans, white tees, neutral blazer, classic sneakers, and a quality bag.\n\n3. **The 3-Color Rule:** Keep outfits to 3 main colors maximum for a cohesive look. Include one neutral and one accent.\n\n4. **Invest in Quality:** Spend more on pieces you wear often (shoes, outerwear, bags) and save on trend pieces.\n\n5. **Know Your Body:** Understand which silhouettes flatter you and build around those shapes.\n\n**Quick Style Upgrades:**\n✨ Roll your sleeves — instant polish\n✨ Add a structured watch or simple jewelry\n✨ Tuck in your shirt (even partially)\n✨ Match your belt to your shoes\n✨ Iron your clothes — wrinkle-free = put-together\n\nFeel free to ask me about specific occasions, colors, body types, or any fashion topic! I'm here to help you style smarter. 🎨`;
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    const response = generateFashionResponse(lastMessage.content);

    return NextResponse.json({
      role: "assistant",
      content: response,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
