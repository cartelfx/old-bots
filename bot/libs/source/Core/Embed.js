const { EmbedBuilder, ColorResolvable, Colors } = require('discord.js');

class Embed extends EmbedBuilder {
  constructor() { 
    super();
    this.setColor('Random');
  }

  /**
   * @param {string} content
   * @returns {this}
   */
  title(content) {
    return this.setTitle(content);
  }

  /**
   * @param {string} url
   * @returns {this}
   */
  thumbnail(url) {
    return this.setThumbnail(url);
  }

  /**
   * @param {string} url
   * @returns {this}
   */
  image(url) {
    return this.setImage(url);
  }

  /**
   * @param {Date} [date]
   * @returns {this}
   */
  timestamp(date) {
    return this.setTimestamp(date);
  }

  /**
   * @param {string} content
   * @returns {this}
   */
  description(content) {
    if(content) {
      return this.setDescription(content);
    }
    return this;
  }

  /**
   * @param {string} content
   * @param {string} [iconURL]
   * @returns {this}
   */
  footer(content, iconURL) {
    return this.setFooter({ text: content, iconURL: iconURL });
  }

  /**
   * @param {string} content
   * @param {string} [iconURL]
   * @returns {this}
   */
  author(content, iconURL) {
    return this.setAuthor({ name: content, iconURL: iconURL });
  }

  /**
   * @param {ColorResolvable} color
   * @returns {this}
   */
  color(color) {
    return this.setColor(color);
  }
}

module.exports = Embed;