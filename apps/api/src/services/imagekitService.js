import ImageKit from "imagekit";
import { env } from "../config/env.js";

let client = null;

export function isImageKitConfigured() {
  return Boolean(
    env.imagekit.publicKey &&
      env.imagekit.privateKey &&
      env.imagekit.urlEndpoint
  );
}

function getClient() {
  if (!isImageKitConfigured()) {
    throw new Error("ImageKit credentials are not configured.");
  }
  if (!client) {
    client = new ImageKit({
      publicKey: env.imagekit.publicKey,
      privateKey: env.imagekit.privateKey,
      urlEndpoint: env.imagekit.urlEndpoint,
    });
  }
  return client;
}

export async function uploadImageToImageKit({ fileBuffer, fileName, base64Data, folder }) {
  const ik = getClient();
  const targetFolder = folder || env.imagekit.folder || "Ornate_Firnitures";
  const filePayload = fileBuffer || base64Data;

  if (!filePayload) {
    throw new Error("No image file or base64 payload provided.");
  }

  const safeName = (fileName || `ornate-${Date.now()}.jpg`).replace(
    /[^a-zA-Z0-9._-]/g,
    "-"
  );

  const response = await ik.upload({
    file: filePayload,
    fileName: safeName,
    folder: `/${targetFolder.replace(/^\/+|\/+$/g, "")}`,
    useUniqueFileName: true,
    tags: ["ornate", "furniture"],
  });

  return {
    fileId: response.fileId,
    name: response.name,
    url: response.url,
    thumbnailUrl: response.thumbnailUrl || response.url,
    filePath: response.filePath,
    size: response.size,
  };
}

export async function deleteImageFromImageKit(fileId) {
  if (!fileId || !isImageKitConfigured()) return false;
  const ik = getClient();
  await ik.deleteFile(fileId);
  return true;
}

export function getImageKitStatus() {
  return {
    configured: isImageKitConfigured(),
    urlEndpoint: env.imagekit.urlEndpoint,
    folder: env.imagekit.folder,
  };
}
