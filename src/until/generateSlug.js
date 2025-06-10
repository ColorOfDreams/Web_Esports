const slugify = require('slugify')

function generateSlug(schema) {
    schema.pre('save', function (next) {
        if (this.team1?.name && this.team2?.name) {
            const slugSource = `${this.team1.name} vs ${this.team2.name}`
            this.slug = slugify(slugSource, { lower: true, strict: true })
        }
        next();
    });
}

module.exports = generateSlug
