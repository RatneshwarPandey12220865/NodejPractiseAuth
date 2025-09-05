const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

//file filter function

const filefilter = (req, file, cb) => {
  // if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
  //
  if (file.mimetype.startsWith("image/")) {
    console.log(file.mimetype);
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};

//multer middleware

module.exports = multer({
  storage: storage,
  fileFilter: filefilter,
  limit: {
    fileSize: 1024 * 1024 * 5, // means 5 mb
  },
});

// Notes

// * destination - determines within which folder the files would be saved

// * filename - tells the name of the file that would be saved in the destination folder. if no filename is given , multer will generate a filename based on the file's original name and the current timestamp.

// * multer .diskStorage() - returns an object that contains the destination and filename functions. this object is then passed
//* to the multer() function to configure it to use the diskStorage() method.

//* multer is a middleware function that is used to handle multipart/form-data requests. it is used to handle file uploads.
