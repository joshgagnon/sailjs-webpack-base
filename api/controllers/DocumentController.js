/**
 * DocumentController
 *
 * @description :: Server-side logic for managing documents
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));
var PDFImage = require("pdf-image").PDFImage;

function hexEncode(sails){
    return sails.config.models.connection.indexOf('pg') === 0 ;
}

function readBinary(sails, fd){
    return fs.readFileAsync(fd, hexEncode(sails) ? 'hex' : 'binary')
    .then(function(file){
        if(hexEncode(sails)){
            file = '\\x' + file;
        }
        return file;
    })
}


function makePreview(sails, fd, type){
    var pdfImage = new PDFImage(fd, {convertOptions: {'-resize': '256x'}});
    return pdfImage.convertPage(0)
        .then(function(fd){
            return readBinary(sails, fd);
        });
}

module.exports = {
    uploadDocument: function(req, res) {
        req.file('document').upload({
            // don't allow the total upload size to exceed ~20MB
            maxBytes: 20000000
        }, function whenDone(err, uploadedFiles) {
            if (err) {
                return res.negotiate(err);
            }

            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0) {
                return res.badRequest('No file was uploaded');
            }

            var type = uploadedFiles[0].filename.split('.').pop();
            Promise.join(readBinary(sails, uploadedFiles[0].fd),
                        makePreview(sails, uploadedFiles[0].fd, type))
                .spread(function(file, preview){
                    sails.log.debug('Uploaded, saving to db');
                    return Document.create({
                        filename: uploadedFiles[0].filename,
                        createdBy: req.user.id,
                        owner: req.user.id,
                        type: type,
                        documentData: {
                             data: file,
                        },
                        documentPreview: {
                            data: preview
                        }
                    })
                })
                .then(function(newInstance){
                    sails.log.debug('Saved to db');
                    // If we have the pubsub hook, use the model class's publish method
                    // to notify all subscribers about the created item
                    if (req._sails.hooks.pubsub) {
                        if (req.isSocket) {
                            Document.subscribe(req, newInstance);
                            Document.introduce(newInstance);
                        }
                        Document.publishCreate(newInstance.toJSON(), !req.options.mirror && req);
                    }
                    res.created({id: newInstance.id });
                })

        });
    },
    getDocument: function(req, res){
        Document.findOne(req.param('id'))
            .populate('documentData')
            .then(function(doc){
                if (!doc) return res.notFound();
                res.attachment(doc.filename)
                res.write(new Buffer(doc.documentData.data, 'binary'));
                res.end();
            })
            .catch(function(err){
               return res.negotiate(err);
            })
    },
    getDocumentPreview: function(req, res){
        Document.findOne(req.param('id'))
            .populate('documentPreview')
            .then(function(doc){
                if (!doc) return res.notFound();
                res.contentType('image/png');
                res.write(new Buffer(doc.documentPreview.data, 'binary'));
                res.end();
            })
            .catch(function(err){
               return res.negotiate(err);
            })
    }
};