// Test script to verify Connect component functionality
const fs = require("fs");
const path = require("path");

console.log("Testing Connect component implementation...");

// Check if the Connect.tsx file exists and has the expected structure
const connectPath = path.join(__dirname, "app/components/Connect.tsx");
if (fs.existsSync(connectPath)) {
  const content = fs.readFileSync(connectPath, "utf8");

  // Check for key features
  const checks = [
    { name: "SocialLinkData interface", pattern: /interface SocialLinkData/ },
    { name: "getIconForPlatform function", pattern: /getIconForPlatform/ },
    {
      name: "All supported platforms",
      pattern: /hackerrank|leetcode|youtube|portfolio/,
    },
    { name: "Modal implementation", pattern: /createPortal/ },
    {
      name: "API integration",
      pattern: /\/api\/getSocialLinks|\/api\/updateSocialLinks/,
    },
  ];

  console.log("\n✅ Connect.tsx exists");

  checks.forEach((check) => {
    if (check.pattern.test(content)) {
      console.log(`✅ ${check.name} - Found`);
    } else {
      console.log(`❌ ${check.name} - Missing`);
    }
  });

  // Check for all supported platforms in the icon function
  const platforms = [
    "email",
    "twitter",
    "linkedin",
    "instagram",
    "github",
    "medium",
    "blog",
    "leetcode",
    "youtube",
    "portfolio",
    "hackerrank",
  ];
  const missingPlatforms = platforms.filter(
    (platform) => !content.includes(`case "${platform}"`)
  );

  if (missingPlatforms.length === 0) {
    console.log("✅ All 11 platforms supported in icon function");
  } else {
    console.log(
      `❌ Missing platforms in icon function: ${missingPlatforms.join(", ")}`
    );
  }
} else {
  console.log("❌ Connect.tsx file not found");
}

// Check API routes
const getSocialLinksPath = path.join(
  __dirname,
  "app/api/getSocialLinks/route.ts"
);
const updateSocialLinksPath = path.join(
  __dirname,
  "app/api/updateSocialLinks/route.ts"
);

if (fs.existsSync(getSocialLinksPath)) {
  console.log("✅ getSocialLinks API route exists");
  const content = fs.readFileSync(getSocialLinksPath, "utf8");
  if (content.includes("findUnique")) {
    console.log("✅ getSocialLinks uses findUnique for new schema");
  } else {
    console.log("❌ getSocialLinks not updated for new schema");
  }
} else {
  console.log("❌ getSocialLinks API route not found");
}

if (fs.existsSync(updateSocialLinksPath)) {
  console.log("✅ updateSocialLinks API route exists");
  const content = fs.readFileSync(updateSocialLinksPath, "utf8");
  if (content.includes("upsert")) {
    console.log("✅ updateSocialLinks uses upsert for new schema");
  } else {
    console.log("❌ updateSocialLinks not updated for new schema");
  }
} else {
  console.log("❌ updateSocialLinks API route not found");
}

// Check schema
const schemaPath = path.join(__dirname, "prisma/schema.prisma");
if (fs.existsSync(schemaPath)) {
  console.log("✅ Prisma schema exists");
  const content = fs.readFileSync(schemaPath, "utf8");
  if (
    content.includes("email     String?") &&
    content.includes("hackerrank String?")
  ) {
    console.log("✅ Schema has predefined platform columns");
  } else {
    console.log("❌ Schema missing predefined platform columns");
  }
} else {
  console.log("❌ Prisma schema not found");
}

console.log("\n🎉 Test completed!");
