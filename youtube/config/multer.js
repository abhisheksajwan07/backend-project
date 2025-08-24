import multer from "multer";
import fs from "fs"; // nodeks file system module used ofr creating,deleting,reaad
import path from "path";

const tmpdir = path.join(".", "tmp"); // ./tmp
// if folder exist , else create
if (!fs.existsSync(tmpdir)) {
  fs.mkdirSync(tmpdir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./tmp/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage });
