import { v2 as cloudinary } from "cloudinary";
import { mkdir, unlink } from "node:fs/promises";
import { get } from "node:https";
import path from "node:path";
import AppError from "../errors/app.error";
import { createWriteStream } from "node:fs";
import { File } from "../generated/prisma/client";
import { NextFunction, Response } from "express";

const downloadFile = async (
  fileData: File,
  res: Response,
  next: NextFunction,
) => {
  // runtime debug: confirm cloudinary config is loaded (does NOT print secrets)
  try {
    const cfg = cloudinary.config();
    // only show cloud_name and whether api_key is present
    // this helps debug 401s without revealing the API secret
    // (safe to log in local dev only)
    // eslint-disable-next-line no-console
    console.log("[debug] cloudinary config:", { cloud_name: cfg.cloud_name, api_key_present: !!cfg.api_key });
  } catch (e) {
    // ignore
  }
  const downloadURL = cloudinary.url(fileData.public_id, {
    resource_type: fileData.resource_type,
    version: fileData.version,
    flags: "attachment",
    sign_url: true,
    type: "authenticated",
  });

  const finalDownloadFileName = `${fileData.name}_${Math.round(Math.random() * 10000)}.${fileData.ext}`;

  const fileNameForUser = `${fileData.name}.${fileData.ext}`;

  const localTempFilePath = path.join(
    process.cwd(),
    "downloads",
    finalDownloadFileName,
  );

  await mkdir(path.dirname(localTempFilePath), { recursive: true });

  const request = get(downloadURL, (response) => {
    response.on("error", async (err) => {
      try {
        await unlink(localTempFilePath);
      } catch (errr) {}
      return next(err);
    });

    if (response.statusCode != 200) {
      response.resume();
      return next(
        new AppError(Number(response.statusCode), "Failed to download File"),
      );
    }

    const fileStream = createWriteStream(localTempFilePath);

    response.pipe(fileStream);

    fileStream.on("error", async (err) => {
      try {
        await unlink(localTempFilePath);
      } catch (errr) {}
      return next(err);
    });

    fileStream.on("finish", () => {
      res.download(localTempFilePath, fileNameForUser, async (err) => {
        try {
          await unlink(localTempFilePath);
        } catch (errr) {}
        next(err);
      });
    });
  });

  request.on("error", (err) => next(err));
};

const FileStreamUtil = { downloadFile };

export default FileStreamUtil;
