import { Injectable } from '@nestjs/common';
// import { S3 } from 'aws-sdk';
import { InjectRepository } from '@nestjs/typeorm';
import { level, logger } from 'src/config';
import fs from "fs";
import { v1 as uuidv1 } from 'uuid';
import mime from "mime";
import path from 'path';

@Injectable()
export class FileUploadService {

    // https://stackoverflow.com/questions/61402054/nestjs-how-to-upload-image-to-aws-s3


    // async upload(file) {
    //     const { originalname } = file;
    //     const bucketS3 = 'my-aws-bucket';
    //     await this.uploadS3(file.buffer, bucketS3, originalname);
    // }

    // async uploadS3(file, bucket, name) {
    //     const s3 = this.getS3();
    //     const params = {
    //         Bucket: bucket,
    //         Key: String(name),
    //         Body: file,
    //     };
    //     return new Promise((resolve, reject) => {
    //         s3.upload(params, (err, data) => {
    //         if (err) {
    //             logger.log(level.error, err);
    //             reject(err.message);
    //         }
    //         resolve(data);
    //         });
    //     });
    // }

    createDirectoryPath(uploadPath) {
        try {
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true })
            }
        } catch (error) {
            logger.log(level.error, `Error to Create DirectoryPath path=${uploadPath} error=${error}`)
            throw Error(error)
        }
    }

    uploadFileToDest(dest, memoryStoredFile): Promise<any> {
        logger.log(level.info, `upload destnation=${dest}`);
        return new Promise(async (resolve, reject) => {
            try {
                await this.createDirectoryPath(dest);
                const uuid = uuidv1();
                const ext = memoryStoredFile?.mimetype ? mime.extension(memoryStoredFile.mimetype) : path.extname(memoryStoredFile.originalName)
                const name = `${Date.now()}_po_${uuid}.${ext}`;
                return await fs.writeFile(`${dest}/${name}`, memoryStoredFile.buffer, (error) => {
                    if (error) {
                        logger.log(level.error, `File Upload Error:${error}`);
                        resolve(null);
                    } else {
                        logger.log(level.info, "File Uploaded Successfully");
                        resolve({
                            name: name,
                            url: `${dest}/${name}`
                        })
                    }

                })

            } catch (error) {
                logger.log(level.error, `Fiel Uploading Error: ${error}`);
                resolve(null);
            }
        })
    }

    deleteFileFromDest(url) {
        logger.log(level.info, `delete destnation=${url}`);
        return new Promise(async (resolve) => {
            try {
                return await fs.unlink(url, (error) => {
                    if (error) {
                        logger.log(level.error, `File Delete Error:${error}`);
                        resolve(null);
                    } else {
                        logger.log(level.info, "File Deleted Successfully");
                        resolve({ url })
                    }

                })

            } catch (error) {
                logger.log(level.error, `Fiel Deleting Error: ${error}`);
                resolve(null);
            }
        })
    }

}
