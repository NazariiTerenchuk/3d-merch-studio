/** Mirror the API FileUpload settings so obviously invalid files are rejected before uploading. */
export const UPLOAD_LIMITS = {
  model: { extensions: ['.glb'], maxSizeMb: 50, accept: '.glb,model/gltf-binary' },
  print: { extensions: ['.png'], maxSizeMb: 10, accept: '.png,image/png' },
  preview: { extensions: ['.png', '.jpg', '.jpeg', '.webp'], maxSizeMb: 5, accept: '.png,.jpg,.jpeg,.webp,image/*' },
} as const;

export type UploadKind = keyof typeof UPLOAD_LIMITS;
