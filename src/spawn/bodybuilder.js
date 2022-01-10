let spawnBody = {
    body: function (energy) {
        let body = []
        let level = Math.floor(energy / 200)
        for (let i = 0; i < level; i++) {
            body = body.concat(["move", "carry", "work"]);
        }
        return body;
    }
};

module.exports = spawnBody;