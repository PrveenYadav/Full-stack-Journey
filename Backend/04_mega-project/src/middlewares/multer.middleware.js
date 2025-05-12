import multer from "multer"

const storage = multer.diskStorage({
    destination: function(req, res, cb) {
        cb(null, '/tmp/my-uploads')
    },
    filename: function(req, res, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, this.file.fieldname + '-' + uniqueSuffix);
    }
})

const upload = multer({storage: storage})