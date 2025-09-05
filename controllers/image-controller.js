const Image = require("../models/images");
const { uploadToCloudinary } = require("../helper/cloudinaryHelper");

const fs = require("fs");

// const uploadImage = async (req, res) => {
//     try {
//         const { name, description } = req.body
//         const image = new Image({
//             name,
//             description,
//             image: req.file.path
//         })
//         await image.save()
//         res.status(201).json({ message: "Image uploaded successfully" })
//     } catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// }

// ? Note here we are using multer to handle multipart/form-data
// ? note here req object will contain the url for the image consider we have frontend and when we upload the image path there will be the url of the image

const uploadImageController = async (req, res) => {
  try {
    // check if the file is missing

    if (req.file == undefined) {
      // or (!req.file)
      return res.status(400).json({
        success: false,
        message: "File missing. You must select a file",
      });
    }

    //upload to cloudinary

    const { url, publicId } = await uploadToCloudinary(req.file.path);

    //store the url and the public id with the uploaded user id in the database
    const newlyCreatedImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.id,
    });

    await newlyCreatedImage.save();

    // delete the image from the local storage
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error deleting local file:", err);
    });

    // this will delete the image from the local storage ie the uploads folder if we are using multer, if we do not to remove it we should comment this line

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      image: newlyCreatedImage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

const fetchImageController = async (req, res) => {
  //now we apply pagination and sorting
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder || "asc";
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    const sortObject = {};
    sortObject[sortBy] = sortOrder === "asc" ? 1 : -1;
    const imagelist = await Image.find({})
      .sort(sortObject)
      .skip(skip)
      .limit(limit);

  /* -> simpler way
  !  let { page = 1, limit = 5 } = req.query;
  !  page = parseInt(page);
  !  limit = parseInt(limit);
  !  
  !  const result = await Order.aggregate([
  !    { $sort: { _id: -1 } },               // latest first
  !    { $skip: (page - 1) * limit },        // skip previous pages
  !    { $limit: limit }                     // limit current page
  !  ]);


*/ 




    if (!imagelist) {
      return res.status(400).json({
        success: false,

        message: "No images found",
      });
    }

    res.status(200).json({
      success: true,
      totalImages,
      totalPages,
      currentPage: page,
      message: "Images fetched successfully",
      images: imagelist,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

const deleteImageController = async (req, res) => {
  try {
    // todo  Note we will first delete the image from the cloudinary and then delete the image from the database
    //todo also we will need to check the user who is deleting the image only that user who uploaded the image can delete the image

    const getCurrentImageId = req.params.id; //geting the current image id
    const userId = req.userInfo.id; // get the user id who is deleting the image

    const image = await Image.findById(getCurrentImageId); //checking if the image is present in db

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    //check if this image is uploaded by the current user who is deleting the image

    if (image.uploadedBy.toString() !== userId) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to delete this image",
      });
    }

    //delete this image from the cloudinary  first

    await cloudinary.uploader.destroy(image.publicId);

    //now delete the image from the database

    await Image.findByIdAndDelete(getCurrentImageId);

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: `Some eror happened : ${err.message}`,
    });
  }
};

module.exports = {
  uploadImageController,
  fetchImageController,
  deleteImageController,
};

// some random data after uplaodin a imge

//  "publicId": "yyofkew451lnspzhelti",
//         "uploadedBy": "68793500a1ffebd6a8d59c3a",
//         "_id": "68793831a1ffebd6a8d59c3e",
