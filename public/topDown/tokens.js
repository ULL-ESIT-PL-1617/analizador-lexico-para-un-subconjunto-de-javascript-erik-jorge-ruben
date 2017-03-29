// tokens.js
// 2016-01-13

// (c) 2006 Douglas Crockford

// Produce an array of simple token objects from a string.
// A simple token object contains these members:
//      type: 'name', 'string', 'number', 'operator'
//      value: string or number value of the token
//      from: index of first character of the token
//      to: index of the last character + 1

// Comments of the // type are ignored.

// Operators are by default single characters. Multicharacter
// operators can be made by supplying a string of prefix and
// suffix characters.
// characters. For example,
//      '<>+-&', '=>&:'
// will match any of these:
//      <=  >>  >>>  <>  >=  +: -: &: &&: &&

/*jslint this */

RegExp.prototype.bexec = function(str) {
  var i = this.lastIndex;
  var m = this.exec(str);
  if (m && m.index == i) return m;
  return null;
}

String.prototype.tokens = function () {
    
    var from;                   // Ïndice de inicio del token
    var i = 0;                  // Ïndice del caracter actual
     var n;                      // Valor numérico
     var m;                     // Matching
    var result = [];            // Vector con los objetos token resultado
    
    
    
    ////// Expresiones regulares
    var WHITES = /\s+/g;                                                                // Espacios en blanco
    var ID = /[a-zA-Z_]\w*/g;                                                           // Identificadores de variables
    var NUM = /\b\d+(\.\d*)?([eE][+-]?\d+)?\b/g;                                        // Números
    var STRING = /('(\\.|[^'])*'|"(\\.|[^"])*")/g;                                      // Cadenas de caracteres
    var ONELINECOMMENT = /\/\/.*/g;                                                     // Comentarios de una sola línea
    var MULTIPLELINECOMMENT = /\/[*](.|\n)*[*]/g;                                       // Comentarios multilínea
    var TWOCHAROPERATORS = /(===|!==|[+][+=]|-[-=]|[*]=|%=|\/=|!=|=[=<>]|&&|\|\|)/g;    // Operadores de dos o más caracteres
    var ONECHAROPERATORS = /([-+*%\/=()&|;:,<>{}[\]])/g;                                // Operadores de un solo caracter
    //////
    
    var tokens = [WHITES, ID, NUM, STRING, ONELINECOMMENT, 
                  MULTIPLELINECOMMENT, TWOCHAROPERATORS, ONECHAROPERATORS ];            // Vector con todos las expresiones regulares

    var make = function (type, value) {     // Función que crea un objeto token 
        return {
            type: type,
            value: value,
            from: from,
            to: i
        };
    };

    var getTok = function() {
      var str = m[0];
      i += str.length;
      return str;
    };
    
    // Inicio del tokenizador

    if (!this) return;      // Si la cadena de origen está vacía devuelve null
    
    // Bucle para analizar la entrada
    while (i < this.length){
        tokens.forEach(function(t){ t.lastIndex = i;});
        from = i;
        // Ignora los espacios en blanco y los comentarios de una sola línea y multilínea
        if ( m = WHITES.bexec(this) || (m = ONELINECOMMENT.bexec(this)) 
                    ||( m = MULTIPLELINECOMMENT.bexec(this))) {getTok(); }
           
        // Identificador de variable         
        else if (m = ID.bexec(this)) {
            result.push(make('name', getTok()));
        }
        // Números
        else if(m = NUM.bexec(this)) {
            n = +getTok();
            if(isFinite(n)){    // Comprueba si el número es legal
                result.push(make('number', n));
            }
            else {
                make('number', m[0]).error("Bad number");
            }
        }
        // Cadena de caracteres
        else if ( m = STRING.bexec(this)){
            result.push(make('string', getTok().replace(/^["']|["']$/g,'')));
        }
        // Operadores de dos o más caracteres
        else if(m = TWOCHAROPERATORS.bexec(this)) {
            result.push(make('operator', getTok()));
        }
        // Operadores de un solo caracter
        else if (m = ONECHAROPERATORS.bexec(this)){
            result.push(make('operator', getTok()));
        }
        else {
            throw "SyntaxError near '"+ this.substr(i)+"'";
        }
    }
    return result
    
};

