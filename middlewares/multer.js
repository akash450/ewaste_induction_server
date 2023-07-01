import multer from "multer";

//temp storage
const storage = multer.memoryStorage();

export const singleUpload = multer({
    storage
}).single("file");