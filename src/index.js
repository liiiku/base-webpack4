// import _ from 'lodash';
// import $ from 'jquery';
// import { ui } from './jquery.ui';

// ui();
// const dom = $('<div></div>');
// dom.html(_.join(['abc', '123'], '***'));
// $('body').append(dom);

console.log(this === window); // 这个this指向模块自身，现在希望这this指向window