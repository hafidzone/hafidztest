var config, fs, http, https, im, rest;

config = require('konfig')();

rest = require('restler');

http = require('http');

https = require('https');

fs = require('fs');

im = require('imagemagick-composite');

exports.get = function(req, res) {
  var file, file_with_overlay, id, overlay;
  id = req.param('id').replace(".png", "");
  file = "tmp/" + id + ".jpg";
  overlay = "play-overlay@2x.png";
  file_with_overlay = "tmp/" + id + ".png";
  return rest.get(config.app.API + '/presents/' + id).on('complete', function(data, response) {
    if (response.statusCode === 200 && data.video.cover) {
      return https.get(data.video.cover, function(response) {
        var image;
        if (response.statusCode === 200) {
          response.setEncoding('binary');
          image = '';
          response.on('data', function(chunk) {
            return image += chunk;
          });
          return response.on('end', function() {
            return fs.writeFile(file, image, 'binary', function(err) {
              if (err) {
                return res.status(500).send('Server error');
              }
              return im.composite(['-gravity', 'center', overlay, file, file_with_overlay], function(err, metadata) {
                return fs.readFile(file_with_overlay, function(err, data) {
                  if (err) {
                    return res.status(500).send('Server error');
                  }
                  res.header('Content-Type', 'image/png');
                  res.send(data);
                  try {
                    fs.unlinkSync(file);
                    return fs.unlinkSync(file_with_overlay);
                  } catch (_error) {
                    err = _error;
                    return console.trace(err);
                  }
                });
              });
            });
          });
        } else {
          return res.status(404).send('Not found');
        }
      });
    } else {
      return res.status(404).send('Not found');
    }
  });
};
