class CodeRando {

  #fontSize = 6;
  #totalLineCount = 0;
  #cvs;
  #ctx;

  constructor(canvas, fontSize) {
    this.#cvs = canvas;
    this.#ctx = this.#cvs.getContext('2d');
    this.#fontSize = !!fontSize ? fontSize : this.#fontSize;
  }

  go() {
    this.#ctx.font = `${this.#fontSize}px monospace`;
    let currY = this.#totalLineCount * this.#fontSize;

    // Keep making blocks until the whole height of the canvas is filled
    while (currY < this.#cvs.height) {
      currY = this.#totalLineCount * this.#fontSize;
      this.#totalLineCount += this.makeBlock(this.#ctx, currY);
    }
  }

  makeBlock(ctx, startY) {
    // temp example
    const blockArr = [
      // 'function handleGarbageIntake(x, opt_g) {',
      this.makeFuncLine(),
      this.makeVarDecArray(this.randomNum(8)),
      '',
      this.makeRandomBlock(this.randomNum(4)),
      '',
      this.makeRandomBlock(this.randomNum(3)),
      '',
      this.makeRandomBlock(this.randomNum(5)),
      '',
      [ 'return ' + this.randomVarName() + (Math.random() > 0.5 ? ' || null' : '') + ';' ],
      '}'
    ];

    const startYCoord = (typeof startY !== 'undefined') ? startY : 0;
    const lineHeight = this.#fontSize;
    const indentWidth = this.#fontSize * 2;
    let indentCount = 0;
    let lineCount = 0;

    function writeLineLoop (potentialArr, wasArr = false) {
      if (wasArr) {
        indentCount++;
      }

      for (var i = 0; i < potentialArr.length; i++) {
        const item = potentialArr[i];
        const isArray = Array.isArray(item);
        
        if (isArray) {          
          writeLineLoop(item, true);
        } else {
          lineCount++;
          ctx.fillText(item, indentWidth*indentCount, startYCoord + (lineHeight*lineCount));
        }
      }

      if (indentCount > 0) {
        indentCount--;
      }
    }

    writeLineLoop(blockArr)
    return lineCount+1;
  }



  makeFuncLine() {
    let result = [];
    if (Math.random() > 0.5) result.push( 'static' );
    result.push(Math.random() > 0.5 ? 'private' : 'public');
    result.push('function');
    result.push(this.randomFuncName());
    result.push('() {');

    return result.join(' ');
  }

  makeVarDecArray(maxCt) {
    let result = [];
    const numVars = 1 + Math.round( Math.random() * (maxCt-1) );
    for (var i = 0; i < numVars; i++) {
      result.push( this.makeVarDecLine() );
    }

    return result;
  }

  makeVarDecLine() {
    const varTypes = ['int', 'int*', 'string', 'string*', 'char', 'char*', 'array', 'array*', 'binaryTree', 'uint8array', 'uint32array', 'float', 'float*', 'vec2', 'vec2*', 'vec3', 'vec3*', 'vec4', 'vec4*'];
    let result = [];

    if (Math.random() > 0.5) result.push( 'private' );
    if (Math.random() > 0.5) result.push( 'static' );
    result.push( this.randomItem(varTypes) ); 
    result.push( this.randomVarName() + ';' );

    return result.join(' ');
  }


  makeRandomBlock(lineCt) {
    const blockFuncs = [
      this.makeIfBlock, this.makeIfBlock, //this.makeIfBlock, 
      this.makeForBlock, this.makeForBlock, //this.makeForBlock, 
      // Make switch blocks less frequent
      this.makeSwitchBlock
    ];

    const blockFunc = this.randomItem(blockFuncs);
    const lines = lineCt || this.randomNum(5);

    return blockFunc.call(this, lines);
    // return this.makeIfBlock(lines);
  }

  makeIfBlock(lineCt) {
    let result = [];
    let ifLine = ['if ('];
    const lines = lineCt || Math.round( Math.random() * 7 ) + 1;
    const compareCt = Math.round(Math.random() * 2) + 1;

    for (var i = 0; i < compareCt; i++) {
      ifLine.push(this.randomCompareStatement());

      if (i+1 != compareCt) {
        ifLine.push(this.randomCompare());
      } else {
        ifLine.push(')');
      }
    }
    ifLine.push('{');

    result.push(
      ifLine.join(' ')
    );
    
    let lineArr = [];
    for (var i = 0; i < lines; i++) {
      if (Math.random() > 0.5) {
        lineArr.push(this.randomVarLine());
      } else {
        lineArr.push(this.randomFuncName() + '(' + this.randomNumOrStr() + ');');    
      }
    }
    result.push(lineArr);
    result.push('}');

    return result;
  }

  makeSwitchBlock() {
    let result = [];
    const caseCount = this.randomNum(3);
    result.push('switch(' + this.randomVarName() + ') {');

    for (var i = 0; i < caseCount; i++) {
      const caseLineCount = this.randomNum(3);

      let caseResult = [];
      let caseLines = [];
      caseResult.push('case ' + this.randomNum() + ':');

      for (var j = 0; j < caseLineCount; j++) {
        if (Math.random() > 0.5) {
          caseLines.push(this.randomFuncName() + '(' + this.randomNumOrStr() + ');');
        } else {
          caseLines.push(this.randomVarName() + ' = ' + this.randomNumOrStr() + ';');
        }
      }
      caseLines.push('break;');
      
      caseResult.push(caseLines);
      result.push(caseResult);
    }

    let defaultCase = [
      'default:', 
      [
        'break;'
      ]
    ];
    result.push(defaultCase);

    result.push('}');

    return result;
  }

  makeForBlock(lineCt) {
    let result = [];
    let forLines = [];
    const forLineCount = lineCt || this.randomNum(5);
    result.push(`for(i = 0; i < ${this.randomVarName()}.length; i++) {`);

    for (var i = 0; i < forLineCount; i++) {
      if (Math.random() > 0.5) {
        forLines.push(this.randomFuncName() + '(' + this.randomNumOrStr() + ');');
      } else {
        forLines.push(this.randomVarName() + ' = ' + this.randomNumOrStr() + ' * i;');
      }
    }

    result.push(forLines);

    result.push('}');
    return result;
  }






  /* 

      Randomizers and Utilities 

  */

  randomItem(arrOrStr) {
    return arrOrStr[ Math.round( Math.random() * (arrOrStr.length-1) )];
  }

  randomFuncName() {
    let result = [];
    const comboWordsFirst = ['handle', 'manage', 'sort', 'filter', 'prioritize', 'set', 'get', 'make', 'create', 'remove', 'delete', 'init', 'write', 'send', 'receive', 'jack'];
    const comboWords = ['hash', 'change', 'integer', 'boolean', 'string', 'array', 'uint', 'portal', 'server', 'ajax', 'phantom', 'servlet', 'service', 'java', 'hook', 'webhook', 'stylesheet', 'script', 'pusher', 'array', 'handler', 'kill', 'test', 'spec'];
    const numComboWords = 1 + (Math.round(Math.random() * 2));

    result.push( this.randomItem(comboWordsFirst) );
    for (var i = 0; i < numComboWords; i++) {
      result.push( this.capitalize( this.randomItem(comboWords) ));  
    }

    return result.join('');
  }

  randomVarName() {
    let result = [];
    const comboNames = ['field', 'asset', 'holder', 'pointer', 'factor', 'bool', 'count', 'width', 'height', 'round', 'hash', 'counter', 'renderer', 'context', 'high', 'low', 'search', 'loop'];
    const numComboWords = 2 + (Math.round(Math.random() * 2));

    for (var i = 0; i < numComboWords; i++) {
      if (i == 0) {        
        result.push( this.randomItem(comboNames) );
      } else {
        result.push( this.capitalize( this.randomItem(comboNames) ) );
      }
    }

    return result.join('');
  }

  randomVarLine() {
    let result = [];
    result.push(this.randomVarName() + ' = ' + (Math.random() > 0.5 ? this.randomNum() : this.randomStr()) + ';');
    return result.join(' ');
  }

  randomCompare() {
    const compares = ['&&', '||', '>', '>=', '<', '<=', '==', '===', '!=', '!=='];
    return this.randomItem(compares);
  }

  randomStr(letterCt, letterMin) {
    let result = '';
    const ct = letterCt || Math.round( Math.random() * 12 );
    const min = letterMin || Math.round( Math.random() * 4) + 1;
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';

    for (var i = 0; i < ct; i++) {
      result += this.randomItem(alphabet);
    }

    return result;
  }

  randomNum(numMax) {
    const max = numMax || 255;
    return 1 + Math.round(Math.random() * max);
  }

  randomNumOrStr() {
    return Math.random() > 0.5 ? this.randomNum() : this.randomStr();
  }

  randomCompareStatement() {
    return [this.randomVarName(), this.randomCompare(), this.randomNumOrStr() ].join(' ');
  }

  capitalize(str) {
    // let result = '';
    const f = str.charAt(0).toUpperCase();
    const rest = str.slice(1);
    return f + rest;
  }
}
