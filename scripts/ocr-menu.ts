/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * OCR helper for menu images.
 * Usage (PowerShell):
 *   npx ts-node .\scripts\ocr-menu.ts
 */
const fs = require("node:fs");
const path = require("node:path");

const { Jimp, JimpMime } = require("jimp");
const { createWorker } = require("tesseract.js");

type ImageJob = {
  label: string;
  filePath: string;
};

const jobs: ImageJob[] = [
  {
    label: "bebidas-cervezas",
    filePath:
      "C:\\Users\\nosisr8\\.cursor\\projects\\c-Users-nosisr8-Documents-GitHub-factura-simple-food\\assets\\c__Users_nosisr8_AppData_Roaming_Cursor_User_workspaceStorage_3c165730fd1f9b68cb70855b239b0594_images_bebidas-726d83cc-ffc0-4b9e-84d3-1a3b6e79f425.png",
  },
  {
    label: "bebidas-gaseosas",
    filePath:
      "C:\\Users\\nosisr8\\.cursor\\projects\\c-Users-nosisr8-Documents-GitHub-factura-simple-food\\assets\\c__Users_nosisr8_AppData_Roaming_Cursor_User_workspaceStorage_3c165730fd1f9b68cb70855b239b0594_images_bebidas2-7729c6b0-1983-4b3e-b8c7-c4d1cf8d66eb.png",
  },
  {
    label: "tragos",
    filePath:
      "C:\\Users\\nosisr8\\.cursor\\projects\\c-Users-nosisr8-Documents-GitHub-factura-simple-food\\assets\\c__Users_nosisr8_AppData_Roaming_Cursor_User_workspaceStorage_3c165730fd1f9b68cb70855b239b0594_images_tragos-e9bd0144-f668-46f2-98f2-3289bf2fc935.png",
  },
  {
    label: "hamburguesas-y-lomitos",
    filePath:
      "C:\\Users\\nosisr8\\.cursor\\projects\\c-Users-nosisr8-Documents-GitHub-factura-simple-food\\assets\\c__Users_nosisr8_AppData_Roaming_Cursor_User_workspaceStorage_3c165730fd1f9b68cb70855b239b0594_images_hamburguesas-701cae15-095d-416c-8d4d-dfd097a0f42d.png",
  },
  {
    label: "milapizzas",
    filePath:
      "C:\\Users\\nosisr8\\.cursor\\projects\\c-Users-nosisr8-Documents-GitHub-factura-simple-food\\assets\\c__Users_nosisr8_AppData_Roaming_Cursor_User_workspaceStorage_3c165730fd1f9b68cb70855b239b0594_images_milapizzas-a9f5a942-119a-49f1-83e7-819f43c30437.png",
  },
  {
    label: "delicatessen-picadas",
    filePath:
      "C:\\Users\\nosisr8\\.cursor\\projects\\c-Users-nosisr8-Documents-GitHub-factura-simple-food\\assets\\c__Users_nosisr8_AppData_Roaming_Cursor_User_workspaceStorage_3c165730fd1f9b68cb70855b239b0594_images_Delicates_de_Tios__Picadas-bf1d8f12-df29-4f8f-9693-e177f355a074.png",
  },
  {
    label: "pizzas-porciones",
    filePath:
      "C:\\Users\\nosisr8\\.cursor\\projects\\c-Users-nosisr8-Documents-GitHub-factura-simple-food\\assets\\c__Users_nosisr8_AppData_Roaming_Cursor_User_workspaceStorage_3c165730fd1f9b68cb70855b239b0594_images_pizzas-1e853f03-1658-42d3-ad94-b6f23c5325c8.png",
  },
  {
    label: "metropizzas",
    filePath:
      "C:\\Users\\nosisr8\\.cursor\\projects\\c-Users-nosisr8-Documents-GitHub-factura-simple-food\\assets\\c__Users_nosisr8_AppData_Roaming_Cursor_User_workspaceStorage_3c165730fd1f9b68cb70855b239b0594_images_metropizzas-71858a2e-3bbe-472f-b4d5-8223685e0d5d.png",
  },
];

const ROTATIONS = [0, 90, 270, 180];

function ensureDir(dirPath: string) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function scoreText(text: string) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  const alphaNum = (cleaned.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9]/g) || []).length;
  return alphaNum;
}

async function preprocessToPngBuffer(
  imagePath: string,
  rotationDeg: number,
): Promise<Buffer> {
  const img = await Jimp.read(imagePath);
  // Jimp rotates clockwise. keepSize=true avoids cropping
  if (rotationDeg !== 0) img.rotate(rotationDeg, false);
  // Mild preprocessing for better OCR
  img
    .greyscale()
    .contrast(0.4)
    .normalize()
    .resize({ w: img.bitmap.width * 2, h: img.bitmap.height * 2 }); // upscale

  return await img.getBuffer(JimpMime.png);
}

async function main() {
  const outDir = path.join(process.cwd(), "tmp", "ocr");
  ensureDir(outDir);

  const worker = await createWorker("spa");
  await worker.setParameters({
    // Good general default for mixed layouts
    tessedit_pageseg_mode: "6",
  });

  for (const job of jobs) {
    let best: { rotation: number; text: string; score: number } | null = null;

    for (const rot of ROTATIONS) {
      const buffer = await preprocessToPngBuffer(job.filePath, rot);
      const result = await worker.recognize(buffer);
      const text = (result?.data?.text ?? "") as string;
      const s = scoreText(text);
      if (!best || s > best.score) {
        best = { rotation: rot, text, score: s };
      }
    }

    const header = `# ${job.label}\n# best_rotation=${best?.rotation} score=${best?.score}\n\n`;
    const outText = header + (best?.text ?? "");
    const outPath = path.join(outDir, `${job.label}.txt`);
    fs.writeFileSync(outPath, outText, "utf8");
    // Also print a short summary to console
    // eslint-disable-next-line no-console
    console.log(`${job.label}: rotation=${best?.rotation} score=${best?.score}`);
  }

  await worker.terminate();
}

main().catch((err: any) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});

