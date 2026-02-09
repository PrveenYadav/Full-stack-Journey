import multer from "multer";

// Use memory storage to keep the files in RAM (buffer)
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per file
        fieldSize: 10 * 1024 * 1024, // 10MB for text fields
    },
});

export default upload;