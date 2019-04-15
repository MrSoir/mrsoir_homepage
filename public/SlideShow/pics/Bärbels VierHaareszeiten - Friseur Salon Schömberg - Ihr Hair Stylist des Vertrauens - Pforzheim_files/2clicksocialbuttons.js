/**
 * @Copyright
 * @package     2CSB - 2 Click Social Buttons - Module
 * @author      Viktor Vogel <admin@kubik-rubik.de>
 * @version     3.1.0 - 2015-07-30
 * @link        https://joomla-extensions.kubik-rubik.de/2csb-2-click-social-buttons
 *
 * @license     GNU/GPL
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

jQuery(document).ready(function () {
    var url = document.location.href;
    var title = document.title;

    if (jQuery("#facebook_button")) {
        function fb_replace() {
            var fb_button = '<iframe src=\"https://www.facebook.com/plugins/like.php?href=' + url + '&amp;send=false&amp;layout=button_count&amp;width=120&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font&amp;height=21\" scrolling=\"no\" frameborder=\"0\" style=\"border:none; overflow:hidden; width:120px; height:21px;\" allowTransparency=\"true\"></iframe>';

            jQuery("#facebook_button").replaceWith(function () {
                return "<li id=\"facebook_button_on\"><span class=\"switch on\"></span>" + fb_button + "</li>";
            });

            if (jQuery("#loadall_button")) {
                jQuery("#loadall_button").unbind("click");
                loadall_replace();
            }
        }

        jQuery("#facebook_button").click(fb_replace);

        if (jQuery("#loadall_button")) {
            jQuery("#loadall_button").click(fb_replace);
        }
    }

    if (jQuery("#twitter_button")) {
        function twitter_replace() {
            var via;

            if (typeof twittername != 'undefined') {
                via = '&amp;via=' + twittername;
            }
            else {
                via = '';
            }

            var twitter_button = '<iframe allowtransparency=\"true\" frameborder=\"0\" scrolling=\"no\" src=\"https://platform.twitter.com/widgets/tweet_button.html?text=' + title + via + '\" style=\"width:110px; height:21px;\"></iframe>';

            jQuery("#twitter_button").replaceWith(function () {
                return "<li id=\"twitter_button_on\"><span class=\"switch on\"></span>" + twitter_button + "</li>";
            });

            if (jQuery("#loadall_button")) {
                jQuery("#loadall_button").unbind("click");
                loadall_replace();
            }
        }

        jQuery("#twitter_button").click(twitter_replace);

        if (jQuery("#loadall_button")) {
            jQuery("#loadall_button").click(twitter_replace);
        }
    }

    if (jQuery("#googleplus_button")) {
        function googleplus_replace() {
            var googleplus_button = '<iframe src=\"https://plusone.google.com/u/0/_/+1/fastbutton?url=' + url + '&amp;size=medium&amp;count=true&amp;lang=de\" scrolling=\"no\" frameborder=\"0\" style=\"border:none; overflow:hidden; width:80px; height:35px;\" align=\"left\"></iframe>';

            jQuery("#googleplus_button").replaceWith(function () {
                return "<li id=\"googleplus_button_on\"><span class=\"switch on\"></span>" + googleplus_button + "</li>";
            });

            if (jQuery("#loadall_button")) {
                jQuery("#loadall_button").unbind("click");
                loadall_replace();
            }
        }

        jQuery("#googleplus_button").click(googleplus_replace);

        if (jQuery("#loadall_button")) {
            jQuery("#loadall_button").click(googleplus_replace);
        }
    }

    if (jQuery("#loadall_button")) {
        function loadall_replace() {
            jQuery("#loadall_button").replaceWith(function () {
                return "<li id=\"load_button_on\"></li>";
            });
        }

        jQuery("#loadall_button").click(loadall_replace);
    }
});