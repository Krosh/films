module.exports = function () {
    this.add = function (app, db) {
        return function (req, res) {
            const user = {title: req.headers.title, movie: req.headers.description, rating: req.headers.rating};
            db.collection('films').insert(user, (err, result) => {
                if (err) {
                    res.send({'error': 'An error has occurred'});
                } else {
                    res.send(result.ops[0]);
                }
            });
        }
    }

    this.byId = function (app, db) {
        return function (req, res) {
            const id = req.params.id;
            const details = {'_id': new ObjectID(id)};
            db.collection('users').findOne(details, (err, item) => {
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
            db.collection("users").find({}).toArray(function (err, result) {
                if (err) throw err;
                res.send(result);
                console.log(result);
                // db.close();
            });
        }
    }
}