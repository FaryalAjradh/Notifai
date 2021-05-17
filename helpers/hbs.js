const moment = require('moment')

module.exports = {
    formatDate: function (date, format) {
        return moment(date).utc().format(format)
    },

    truncate: function (str, len){
        if (str.length > len && str.length > 0) {
            let new_str = str + ' '
            new_str = str.substr(0, len)
            new_str = str.substr(0, new_str.lastIndexOf(' '))
            new_str = new_str.length > 0 ? new_str : str.substr(0, len)
            return new_str + '...'
        }
        return str
    },
    stripTags: function (input) {
        return input.replace(/<(?:.|\n)*?>/gm, '')
    },
    editIcon: function (noteUser, loggedUser, noteId, floating = true) {
       if (noteUser._id.toString() == loggedUser._id.toString()) {
           if (floating) {
           return `<a href="/notes/edit/${noteId}" class="btn-floating
           halfway-fab"><i class="fas fa-edit fa-small"></i></a>`
       }
       else {
           return `<a href="/notes/edit/${noteId}"><i class="fas fa-edit"></i></a>`
       }
    }
       else {
           return ''
       }
   },
   select: function (selected, options) {
       return options
       .fn(this)
       .replace(
           new RegExp(' value="' + selected + '"'),
           '$& selected="selected"'
       )
       .replace(
        new RegExp('>' + selected + '</option>'),
        ' selected="selected"$&'
       )
   },
}