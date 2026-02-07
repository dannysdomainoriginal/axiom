const fs = require("fs-extra");
const path = require("path");

// Map source folders/files to their destination paths in dist
const folderMap = { db: "dist/db" };
const filesToCopy = ["package.json", ".env"];

const buildFiles = async () => {
  const distDir = path.resolve("dist");
  await fs.ensureDir(distDir);

  // Copy individual files
  for (const file of filesToCopy) {
    const srcPath = path.resolve(file);
    const destPath = path.join(distDir, file);

    if (file === "package.json") {
      const pkg = await fs.readJSON(srcPath);
      pkg.type = "commonjs";
      await fs.writeJSON(destPath, pkg, { spaces: 2 });
      console.log(`[INFO] Processed package.json`);
    } else {
      await fs.copy(srcPath, destPath);
      console.log(`[INFO] Copied file: ${file}`);
    }
  }

  // Copy folders/files based on folderMap
  for (const [srcFolder, destFolder] of Object.entries(folderMap)) {
    const absoluteSrc = path.resolve(srcFolder);
    const absoluteDest = path.resolve(destFolder);

    fs.cpSync(absoluteSrc, absoluteDest, { recursive: true });
    console.log(`[INFO] Copied: ${srcFolder} → ${destFolder}`);
  }

  console.log("[SUCCESS] Build completed successfully.");
};

buildFiles().catch((err) => {
  console.error("[ERROR] Build failed:", err);
});
