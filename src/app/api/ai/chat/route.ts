import { NextResponse } from "next/server";

// Smart fashion responses based on keywords — with many more topics
function generateFashionResponse(message: string): string {
  const lower = message.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|salam|salut|bonjour|hola|yo|sup|what'?s up|howdy|good morning|good evening|good afternoon|marhaba|assalam)/i.test(lower)) {
    const greetings = [
      `Hello! 👋 Welcome to StyleMind AI — your personal fashion assistant!\n\nI'm here to help with:\n✨ **Outfit ideas** for any occasion\n🎨 **Color matching** based on your skin tone\n👗 **Style recommendations** for your body type\n🧕 **Hijab styling** tips and combinations\n💼 **Professional dressing** for work and interviews\n🛍️ **Brand suggestions** across all budgets\n\nWhat would you like help with today?`,
      `Hey there! 🌟 I'm StyleMind, your AI fashion stylist!\n\nAsk me anything about:\n- What to wear for a specific occasion\n- Color palettes that suit your skin tone\n- Hijab and modest fashion styling\n- Building a capsule wardrobe\n- Trending fashion this season\n\nWhat's on your mind? 💫`,
      `Salam! 👋 So glad you're here!\n\nI can help you with fashion advice, outfit planning, hijab styling, color theory, and so much more. Whether you need help for a special event or daily outfits — I've got you covered!\n\nGo ahead and ask me anything! 🎨`,
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Thank you
  if (/^(thanks|thank you|thx|merci|shukran|jazak)/i.test(lower)) {
    return `You're very welcome! 😊 I'm always here if you need more styling advice.\n\nFeel free to come back anytime — whether you need outfit ideas, hijab styling tips, or help planning a wardrobe. Happy styling! ✨`;
  }

  // Hijab styling
  if (lower.includes("hijab") || lower.includes("veil") || lower.includes("headscarf") || lower.includes("modest")) {
    return `Great topic! Here's my hijab & modest fashion guide:\n\n**🧕 Hijab Styling Tips:**\n- **Face Shape Matters:** Round faces suit loosely draped styles, while oval faces can pull off most wraps\n- **Fabric Choice:** Jersey for everyday comfort, chiffon for elegance, silk for special occasions\n- **Color Coordination:** Match your hijab to one accent color in your outfit, not the dominant color\n\n**Trending Hijab Styles:**\n✨ **Turkish style** — elegant draping with volume at the crown\n✨ **Simple wrap** — clean, modern, and professional\n✨ **Layered look** — undercap + loose wrap for dimension\n✨ **Side pin** — asymmetric drape for a chic vibe\n\n**Color Pairing Ideas:**\n🎨 Neutral outfit + jewel-toned hijab (emerald, burgundy, navy)\n🎨 Pastel outfit + contrasting or matching pastel hijab\n🎨 All-black outfit + bold colored hijab as a statement piece\n\n**Modest Fashion Brands to Explore:**\n- **Modanisa** — huge variety, affordable\n- **Haute Hijab** — premium quality wraps\n- **Inayah** — minimal, elegant abayas\n- **Aab Collection** — contemporary modest wear\n\nWant me to suggest specific hijab + outfit combinations? 💫`;
  }

  // Summer / hot weather
  if (lower.includes("summer") || lower.includes("hot") || lower.includes("beach") || lower.includes("vacation")) {
    return `Summer styling is all about staying cool while looking chic! ☀️\n\n**Essential Summer Pieces:**\n- **Linen everything:** Shirts, pants, dresses — linen is your best friend\n- **Flowy maxi dresses** in light fabrics\n- **Wide-leg pants** paired with a simple tank or crop top\n- **Lightweight blazer** for air-conditioned spaces\n\n**Best Summer Colors:**\n🎨 White, cream, soft pastels, sky blue, coral, mint green, lavender\n\n**Summer Accessories:**\n👒 Straw hat or bucket hat\n🕶️ Oversized sunglasses\n👡 Leather sandals or espadrilles\n👜 Raffia or canvas tote\n\n**Styling Tips:**\n✅ Stick to natural fabrics (cotton, linen, chambray)\n✅ Light colors reflect heat — stay cooler\n✅ Monochrome outfits in white or beige look incredibly polished\n✅ A good pair of white sneakers goes with everything\n\nNeed outfit ideas for a specific summer event? 🏖️`;
  }

  // Date night / romantic
  if (lower.includes("date") || lower.includes("romantic") || lower.includes("dinner") || lower.includes("evening out")) {
    return `Date night calls for confidence and style! 💕\n\n**For a Dinner Date:**\n- **Classic:** Little black dress with heels and minimal jewelry\n- **Modern:** Silk cami + tailored trousers + strappy heels\n- **Casual chic:** Well-fitted jeans + elegant blouse + ankle boots\n\n**For a Casual Date:**\n- **Coffee date:** Flowy midi skirt + tucked-in tee + sneakers\n- **Movie night:** Stylish jumpsuit or maxi dress\n- **Outdoor:** Sundress + denim jacket + comfortable sandals\n\n**Color Choices:**\n🎨 Red — bold and confident\n🎨 Black — timeless and elegant\n🎨 Emerald green — sophisticated and unique\n🎨 Blush pink — soft and romantic\n\n**Pro Tips:**\n✨ Wear something you've worn before and feel confident in\n✨ A signature scent completes the outfit\n✨ Less is more with accessories — one statement piece\n✨ Comfortable shoes you can walk in = confidence\n\nWhat kind of date are you planning? I can get more specific! 🌹`;
  }

  // Wedding guest
  if (lower.includes("wedding") || lower.includes("ceremony") || lower.includes("formal event")) {
    return `Wedding guest styling — let's make you shine (without upstaging the bride)! 💒\n\n**General Rules:**\n🚫 Avoid white, ivory, or cream (reserved for the bride)\n🚫 Skip overly casual fabrics like denim or jersey\n✅ Dress code matters — read the invitation carefully\n\n**By Dress Code:**\n\n**Black Tie:** Floor-length gown, elegant clutch, statement jewelry\n**Cocktail:** Midi dress or dressy jumpsuit + heels\n**Semi-Formal:** A-line dress or tailored separates\n**Garden/Outdoor:** Floral maxi dress, block heels (no sinking!)\n\n**Best Colors for Weddings:**\n🎨 Emerald green, navy blue, burgundy, dusty rose, lavender, champagne gold\n\n**Modest Options:**\n🧕 Long-sleeve maxi dress in rich fabric + coordinating hijab\n👗 High-neck gown + elegant wrap\n\n**Accessories:**\n✨ Small clutch in metallic tone\n✨ Delicate jewelry — don't compete with the bride\n✨ Comfortable shoes — you'll be standing/dancing!\n\nWhat type of wedding is it? I can give more tailored advice! 🎊`;
  }

  // Capsule wardrobe
  if (lower.includes("capsule") || lower.includes("basic") || lower.includes("essential") || lower.includes("minimal")) {
    return `Let's build your perfect capsule wardrobe! 🎯\n\n**The Essential 15-Piece Capsule:**\n\n**Tops (5):**\n1. White cotton t-shirt\n2. Black or navy blouse\n3. Striped Breton top\n4. Neutral knit sweater\n5. Button-down shirt (white or light blue)\n\n**Bottoms (4):**\n1. Dark wash straight-leg jeans\n2. Black tailored trousers\n3. Neutral chinos or wide-leg pants\n4. A-line midi skirt\n\n**Outerwear (2):**\n1. Structured blazer (navy or camel)\n2. Trench coat or leather jacket\n\n**Dresses (2):**\n1. Little black dress\n2. Casual day dress (wrap or shirt dress)\n\n**Shoes (2):**\n1. Clean white sneakers\n2. Classic leather boots or loafers\n\n**The Magic Formula:**\n✅ Stick to 3-4 neutral base colors\n✅ Every piece should mix with at least 3 others\n✅ Invest in quality over quantity\n✅ Add personality with accessories\n\nThis capsule creates 50+ unique outfits! Want me to customize it for your lifestyle? 👗`;
  }

  // Brands / shopping
  if (lower.includes("brand") || lower.includes("shop") || lower.includes("store") || lower.includes("where to buy") || lower.includes("recommend")) {
    return `Here are my brand recommendations across price points! 🛍️\n\n**💎 Luxury:**\n- Bottega Veneta, Celine, Loro Piana, The Row\n- Best for: Investment pieces, timeless quality\n\n**✨ Premium:**\n- COS, Sandro, Maje, Reiss, AllSaints\n- Best for: Elevated basics, trend-aware\n\n**🌟 Mid-Range:**\n- Massimo Dutti, & Other Stories, Arket, Uniqlo U\n- Best for: Quality daily wear\n\n**💫 Budget-Friendly:**\n- Zara, H&M, Mango, Uniqlo\n- Best for: Trends and everyday staples\n\n**🧕 Modest Fashion:**\n- Modanisa, Inayah, Haute Hijab, Aab\n- Best for: Hijab-friendly fashion\n\n**🌿 Sustainable:**\n- Everlane, Reformation, Veja (shoes), Pangaia\n- Best for: Eco-conscious shopping\n\n**Shopping Tips:**\n✅ Know your measurements before online shopping\n✅ Check return policies always\n✅ Sales are best for basics, not trends\n✅ Quality fabrics > brand name\n\nLooking for something specific? Tell me your budget and style! 💰`;
  }

  // Interview / job
  if (lower.includes("interview") || lower.includes("job") || lower.includes("office") || lower.includes("work") || lower.includes("professional")) {
    return `Great question! Here's my interview dressing guide:\n\n**For a Corporate Interview:**\n- **Top:** A well-fitted blazer in navy, charcoal, or black over a crisp white or light blue shirt\n- **Bottom:** Tailored trousers or a pencil skirt in a matching or complementary tone\n- **Shoes:** Closed-toe leather shoes — oxford, loafer, or modest heel\n- **Colors:** Stick to neutrals — navy, charcoal, white, beige. One subtle accent is fine\n\n**For a Creative/Tech Interview:**\n- **Top:** Smart casual — a structured knit, clean button-down, or elevated tee under a blazer\n- **Bottom:** Dark jeans (no rips) or chinos\n- **Shoes:** Clean sneakers or desert boots\n\n**Modest/Hijab Option:**\n🧕 Tailored long blazer + wide-leg trousers + solid color hijab\n\n**Key Tips:**\n✅ Fit is everything — ensure nothing is too tight or too loose\n✅ Iron/steam your clothes the night before\n✅ Keep accessories minimal and professional\n✅ When in doubt, overdress slightly — it shows respect\n\nWould you like me to suggest specific outfit combinations for your industry?`;
  }

  // Colors / skin tone
  if (lower.includes("color") || lower.includes("colour") || lower.includes("skin") || lower.includes("tone") || lower.includes("complexion")) {
    return `Color theory for fashion is so important! Here's a guide for different skin tones:\n\n**🌟 Fair/Light Skin:**\n- Best: Jewel tones (emerald, sapphire), pastels, navy, burgundy\n- Avoid: Pale yellow, washed-out beige\n\n**🌟 Medium/Olive Skin:**\n- Best: Earth tones (rust, terracotta), emerald green, coral, mustard\n- Avoid: Neon colors, pale pastels\n\n**🌟 Warm/Golden Skin:**\n- Best: Warm reds, orange, camel, gold, olive green\n- Avoid: Cool pastels, icy blue\n\n**🌟 Deep/Dark Skin:**\n- Best: Bright colors (cobalt, fuchsia, yellow), white, metallic gold\n- Avoid: Dark brown too close to skin tone\n\n**Universal Colors (Look Great on Everyone):**\n🎨 True red, navy blue, white, blush pink, teal\n\n**💡 Pro Tips:**\n- Hold fabric near your face in natural light to test\n- Warm metals (gold) = warm undertones, Cool metals (silver) = cool undertones\n- Your "power color" is the one that makes your eyes pop\n\nWant to know your specific undertone? Tell me if gold or silver jewelry looks better on you! 💎`;
  }

  // Winter / cold
  if (lower.includes("winter") || lower.includes("cold") || lower.includes("coat") || lower.includes("layer")) {
    return `Winter styling is all about mastering layers! Here's your cold-weather guide:\n\n**🧥 Essential Winter Layers:**\n1. **Base:** Merino wool turtleneck or thermal long-sleeve\n2. **Mid:** Cashmere sweater, cardigan, or fleece vest\n3. **Outer:** Wool overcoat, puffer jacket, or shearling coat\n\n**Key Winter Pieces:**\n- A quality wool coat in camel or black (investment piece)\n- Chunky knit scarves in rich colors\n- Leather gloves and a structured beanie\n- Ankle or knee-high boots in leather or suede\n\n**Color Palette:**\n🎨 Rich burgundy, forest green, navy, charcoal, cream, rust\n\n**Hijab in Winter:**\n🧕 Wool or cashmere hijabs for warmth\n🧕 Layer with a turtleneck underneath\n🧕 Match hijab color to scarf or coat accent\n\n**Styling Tips:**\n✅ Monochromatic outfits in dark tones look incredibly chic\n✅ Play with textures — mix knit, leather, wool, and velvet\n✅ A bright scarf or beanie can lift a neutral outfit\n✅ Invest in waterproof boots that still look stylish\n\nWant me to build you a winter capsule wardrobe?`;
  }

  // Bags / luxury
  if (lower.includes("handbag") || lower.includes("bag") || lower.includes("luxury") || lower.includes("purse")) {
    return `Here are my top handbag recommendations across budgets:\n\n**💎 Luxury Investment Pieces:**\n- **Classic:** Hermès Birkin/Kelly, Chanel Classic Flap, Louis Vuitton Neverfull\n- **Modern Luxury:** Bottega Veneta Jodie, Celine Triomphe, Loewe Puzzle\n- **Understated:** The Row Margaux, Loro Piana Extra Pocket\n\n**✨ Premium Mid-Range:**\n- Polène Numéro Un — exceptional quality-to-price ratio\n- DeMellier London — sustainable and elegant\n- A.P.C. Half Moon — minimalist Parisian chic\n\n**🌟 Smart Buys:**\n- Mansur Gavriel — clean lines, beautiful leather\n- Coach Tabby — great modern classic\n- Madewell Transport Tote — reliable everyday option\n\n**Pro Tips for Bag Selection:**\n✅ A black or tan crossbody is the most versatile first purchase\n✅ Consider bag size relative to your body proportions\n✅ Structured bags work for professional settings\n✅ Quality leather develops a beautiful patina over time\n\nWhat style are you looking for — everyday carry, evening, or professional?`;
  }

  // Trend / what's in
  if (lower.includes("trend") || lower.includes("fashion 2026") || lower.includes("what's in") || lower.includes("popular") || lower.includes("in style")) {
    return `Here are the hottest fashion trends right now! 🔥\n\n**🌟 Top Trends 2026:**\n\n1. **Quiet Luxury** — Clean lines, no logos, exceptional fabrics\n2. **Wide-leg everything** — Trousers, jeans, culottes\n3. **Butter yellow** — The color of the season\n4. **Sheer layers** — Delicate, layered transparent fabrics\n5. **Cherry red** — Bold, confident, statement-making\n6. **Oversized blazers** — Structured meets relaxed\n7. **Ballet flats** — The shoe of the moment (again!)\n8. **Textured knits** — Crochet, cable knit, bouclé\n\n**What's Fading:**\n📉 Micro bags (finally practical sizes are back!)\n📉 Neon colors\n📉 Skinny jeans (still divisive!)\n\n**How to Wear Trends Smartly:**\n✅ Pick 1-2 trends that match your personal style\n✅ Mix trends with timeless pieces\n✅ Don't overhaul your wardrobe every season\n✅ Thrift first before buying new\n\nWant me to help you incorporate any of these trends into your wardrobe? 💫`;
  }

  // Shoes / footwear
  if (lower.includes("shoe") || lower.includes("sneaker") || lower.includes("boot") || lower.includes("heel") || lower.includes("sandal") || lower.includes("footwear")) {
    return `Let's talk shoes — the foundation of every outfit! 👟\n\n**Essential Shoe Collection (5 Pairs):**\n1. 🤍 **White sneakers** — Goes with literally everything\n2. 🖤 **Black ankle boots** — Dresses, jeans, skirts\n3. 👡 **Neutral sandals** — Summer essential\n4. 👞 **Classic loafers** — Smart casual perfection\n5. 👠 **One pair of heels** — For special occasions\n\n**Top Sneaker Picks:**\n- Nike Air Force 1 — timeless classic\n- Adidas Samba — trending and versatile\n- New Balance 550 — retro cool\n- Veja Campo — sustainable and stylish\n\n**Boot Guide:**\n- Chelsea boots — sleek and easy\n- Combat boots — edgy and practical\n- Knee-high boots — elegant for fall/winter\n\n**Shoe + Outfit Rules:**\n✅ White sneakers = instant casual cool\n✅ Pointed shoes elongate the leg\n✅ Match shoe formality to outfit formality\n✅ Nude shoes create an unbroken leg line\n\nWhat type of shoes are you shopping for? 👠`;
  }

  // Body type
  if (lower.includes("body") || lower.includes("figure") || lower.includes("shape") || lower.includes("petite") || lower.includes("plus size") || lower.includes("tall") || lower.includes("curvy")) {
    return `Dressing for your body type is about celebrating your shape! 💃\n\n**🍎 Apple Shape (Wider middle):**\n- V-necks and wrap dresses\n- A-line skirts\n- Structured jackets that cinch at the waist\n\n**🍐 Pear Shape (Wider hips):**\n- Statement tops to balance proportions\n- A-line and flared skirts\n- Boat necks and off-shoulder tops\n\n**⏳ Hourglass (Balanced with defined waist):**\n- Wrap dresses and fitted styles\n- High-waisted everything\n- Belted outfits to highlight your waist\n\n**📏 Rectangle (Straight up and down):**\n- Create curves with peplum tops\n- Ruffles and textured fabrics\n- Belts to define the waist\n\n**🔺 Inverted Triangle (Broader shoulders):**\n- Wide-leg pants to balance\n- V-necks to soften the shoulder line\n- A-line skirts and fuller bottoms\n\n**Universal Tip:** The most important thing is wearing clothes that make YOU feel confident. These are guidelines, not rules! ✨\n\nWant specific outfit suggestions for your body type?`;
  }

  // Default — varied and helpful
  const defaults = [
    `I'd love to help with that! Here's some general fashion wisdom:\n\n**The Golden Rules of Style:**\n\n1. **Fit > Brand** — A $20 shirt that fits perfectly looks better than a $200 one that doesn't\n2. **The 3-Color Rule** — Keep outfits to 3 main colors for cohesion\n3. **Dress for the Occasion** — Always slightly overdress rather than underdress\n4. **Invest in Basics** — Quality neutrals are the foundation of great style\n5. **Confidence is Key** — The best outfit is one you feel amazing in\n\nTry asking me about:\n🧕 Hijab styling\n👗 Outfit ideas for specific occasions\n🎨 Colors that suit your skin tone\n👜 Brand recommendations\n📐 Dressing for your body type\n\nWhat would you like to know more about? ✨`,
    `Great question! Here's what I can tell you:\n\n**Quick Style Upgrades Anyone Can Do:**\n✨ Roll your sleeves — instant polish\n✨ Tuck in your shirt (even a French tuck)\n✨ Add one accessory — watch, scarf, or earrings\n✨ Match metals — all gold or all silver\n✨ Iron your clothes — wrinkle-free = put-together\n✨ A structured bag elevates any outfit\n\n**I can also help with:**\n- Building a capsule wardrobe\n- Hijab and modest fashion styling\n- Wedding guest outfits\n- Interview dressing\n- Seasonal trend updates\n- Color theory for your skin tone\n\nJust ask! I'm your personal AI stylist 🎨`,
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
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
