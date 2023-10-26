const stream = require("stream");

class SplitStream extends stream.Transform {
    constructor(options) {
        super(options);
    }

    _transform(chunk, encoding, callback) {
        // פצל את הנתונים לחלקים ושלח אותם
        const data = chunk.toString();
        const length = data.length;
        const halfLength = Math.ceil(length / 2);
        const firstHalf = data.slice(0, halfLength);
        const secondHalf = data.slice(halfLength);

        this.push(firstHalf);
        this.push(secondHalf);

        callback();
    }
}

module.exports = SplitStream;
