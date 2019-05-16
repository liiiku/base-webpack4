import _ from 'lodash';
import $ from 'jquery';

const dom = $('<div></div>');
dom.html(_.join(['abc', '123'], '***'));
$('body').append(dom);