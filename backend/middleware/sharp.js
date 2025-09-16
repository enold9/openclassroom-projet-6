const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const convertToWebp = async (req, res, next) => {
  if (!req.file || path.extname(req.file.filename).toLowerCase() === '.webp') return next()
  
  const inputPath = req.file.path;
  const outputFilename = req.file.filename.replace(/\.[^.]+$/, '.webp');
  const outputPath = path.join('images', outputFilename);

  try {
    await sharp(inputPath)
      .webp({ quality: 20 })
      .toFile(outputPath);

    fs.unlinkSync(inputPath); 
    req.file.path = outputPath;
    req.file.filename = outputFilename;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = convertToWebp;