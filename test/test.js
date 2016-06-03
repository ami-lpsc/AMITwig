/*
 * AMI TWIG Engine
 *
 * Version: 0.1.0
 *
 * Copyright (c) 2014-2015 The AMI Team
 * http://www.cecill.info/licences/Licence_CeCILL-C_V1-en.html
 *
 */

/*-------------------------------------------------------------------------*/

var ami = require('../dist/ami-twig.js').ami;

/*-------------------------------------------------------------------------*/

var dict = {};

console.log(ami.twig.engine.render('{% set a = 1 + 1 %}', dict));
console.log(ami.twig.engine.render('{{ a }}', dict));
console.log(ami.twig.engine.render('{{ 1..9 }}', dict));

console.log(ami.twig.engine.render('{{ "http://xyz.com/?a=12&b=55" | escape }}'));
console.log(ami.twig.engine.render('{{ "http://xyz.com/?a=12&b=55" | escape(\'url\') }}'));

/*-------------------------------------------------------------------------*/
