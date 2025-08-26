import { NodeIO } from '@gltf-transform/core';
// FIXED: Removed 'unlit' as it was not being used
import { draco, resample, textureCompress } from '@gltf-transform/functions';
import { KHRTextureBasisu, KHRDracoMeshCompression } from '@gltf-transform/extensions';
import draco3d from 'draco3d';

// --- CONFIGURATION ---
const INPUT_FILE = 'public/assets/models/bakedfinal21final.glb';
const OUTPUT_FILE = 'public/assets/models/bakedfinal_optimized3.glb';
const TEXTURES_TO_EXCLUDE = ["BG1", "BG2", "BG3", "BG4", "BG5", "BG6", "BG7"];

// ---------------------

async function runOptimization() {
  console.log('🚀 Starting model optimization...');

  const dracoDecoder = await draco3d.createDecoderModule();
  const dracoEncoder = await draco3d.createEncoderModule();

  const io = new NodeIO()
    .registerExtensions([KHRTextureBasisu, KHRDracoMeshCompression])
    .registerDependencies({
      'draco3d.decoder': dracoDecoder,
      'draco3d.encoder': dracoEncoder,
    });

  const document = await io.read(INPUT_FILE);

  console.log('✅ Model read, applying transforms...');

  await document.transform(
    resample({ resample: 'nearest', powerOfTwo: true, size: [1024, 1024] }),
    draco(),
    // FIXED: Replaced the incorrect 'encoder' property with the correct 'codec' property.
    textureCompress({
      codec: 'uastc', // Use 'uastc' for high quality KTX2
      quality: 4,
      exclude: new RegExp(TEXTURES_TO_EXCLUDE.join('|')),
    })
  );

  console.log('✅ Transforms applied, writing output file...');

  await io.write(OUTPUT_FILE, document);

  // draco3d.destroy(dracoDecoder);
  // draco3d.destroy(dracoEncoder);

  console.log(`✨ Optimization complete: ${OUTPUT_FILE}`);
}

runOptimization().catch((e) => {
  console.error(e);
  process.exit(1);
});