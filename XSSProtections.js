/**
 * BBCode takes a string value and returns a corresponding HTML tag. 
 * This allows my users to incorporate certain elements of their choosing on their 
 * profiles WITHOUT sacrificing the protection against XSS
 * @param {String} value 
 * @returns 
 */

function BBCode(value) {
    const codes = {
        0: { bb: "[br]", html: "<br>" },
        1: { bb: "[img]", html: "<span class='bb-img'>" },
        2: { bb: "[/img]", html: "</span>" },
        3: { bb: "[b]", html: "<b>" },
        4: { bb: "[/b]", html: "</b>" },
        5: { bb: "[i]", html: "<i>" },
        6: { bb: "[/i]", html: "</i>" },
        7: { bb: "[s]", html: "<s>" },
        8: { bb: "[/s]", html: "</s>" },
        9: { bb: "[h1]", html: "<h1>" },
        10: { bb: "[/h1]", html: "</h1>" },
        11: { bb: "[h2]", html: "<h2>" },
        12: { bb: "[/h2]", html: "</h2>" },
        13: { bb: "[h3]", html: "<h3>" },
        14: { bb: "[/h3]", html: "</h3>" },
        15: { bb: "[h4]", html: "<h4>" },
        16: { bb: "[/h4]", html: "</h4>" },
        17: { bb: "[list]", html: "<ul>" },
        18: { bb: "[/list]", html: "</ul>" },
        19: { bb: "[li]", html: "<li>" },
        20: { bb: "[/li]", html: "</li>" },
        21: { bb: /\r?\n|\r|\n/g, html: "<br>" },
        22: { bb: "[style]", html: "<style class='bb-style'>" },
        23: { bb: "[/style]", html: "</style>" }
    }
    for (var i = 0; i < Object.values(codes).length; i++) if (codes[i]) value = value.replaceAll(codes[i].bb, codes[i].html);
    return value;
}

/**
 * Takes a string, val, and replaces all instances of an opening or closing tag 
 * with a safe string
 * @param {String} val 
 * @returns 
 */

function filter(val) {
    var lt = /</g,
        gt = />/g;

    return val.toString().replace(lt, "&lt;").replace(gt, "&gt;");
}

/**
 * Filters out CSS that I don't wany my users to use on their profiles
 * @param {String} style 
 * @returns 
 */
function styleFilter(style) {
    var styles = {
        0: 'content:',
        1: 'visibility:'
    }

    for(var i in styles) {
        return style.replaceAll(styles[i], 'disabled-style-tag'+styles[i]);
    }
}

module.exports = {
    filter,
    BBCode,
    styleFilter
}