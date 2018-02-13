module.exports = function() {
    this.add = function(app, db) {
        return function (req, res) {
            const movie = {
                title: req.headers.title,
                description: req.headers.description,
                image: req.headers.image,
                rating: req.headers.rating,
                tags: req.headers.tags
            };
            db.collection('films').insert(movie, (err, result) => {
                if (err) {
                    res.send({'error': 'An error has occurred'});
                } else {
                    res.send(result.ops[0]);
                }
            });
        }
    }

    this.byId = function(app, db) {
        return function (req, res) {
            const id = req.params.id;
            const details = {'_id': new ObjectID(id)};
            db.collection('films').findOne(details, (err, item) => {
                if (err) {
                    res.send({'error': 'An error has occurred'});
                } else {
                    res.send(item);
                }
            });
        }
    }

    this.list = (app, db) => {
        return function (req, res) {
            db.collection("films").find({isParsed: true}).toArray(function (err, result) {
                if (err) throw err;
                res.json(result);
                console.log(result);
                // db.close();
            });
        }
    }
}