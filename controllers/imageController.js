const fs = require('fs');
const path = require('path');

class ImageController {
  static serveImage(req, res) {
    try {
      const { filename } = req.params;
      const imagePath = path.join(__dirname, '../uploads', filename);
      
      if (!fs.existsSync(imagePath)) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Image not found'
        });
      }
      
      const stats = fs.statSync(imagePath);
      if (!stats.isFile()) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Image not found'
        });
      }
      
      res.sendFile(imagePath, (err) => {
        if (err) {
          console.error('Error serving image:', err);
          res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to serve image'
          });
        }
      });
      
    } catch (error) {
      console.error('Error in serveImage:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred while serving the image'
      });
    }
  }
}

module.exports = ImageController;