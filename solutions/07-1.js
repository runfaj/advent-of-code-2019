function runAmplifier(instructions, phase, prevInput) {
  var list = instructions;

  var input = [phase, prevInput];
  var output = [];

  // param modes
  var POSITION = 0;
  var IMMEDIATE = 1;

  // opcodes
  var ADD = 1;
  var MULTIPLY = 2;
  var INPUT = 3;
  var OUTPUT = 4;
  var JUMPIFTRUE = 5;
  var JUMPIFFALSE = 6;
  var LESSTHAN = 7;
  var EQUALS = 8;
  var EXIT = 99;

  function doInstruction(pointer) {
    var codes = list[pointer].toString();
    var opcode = parseInt(codes.slice(codes.length - 2));
    
    codes = codes.split('').reverse().join('');
    var modes = [
      parseInt(codes[2] || 0),
      parseInt(codes[3] || 0),
      parseInt(codes[4] || 0)
    ];

    var start = pointer + 1;
    var mid = start + (opcode === OUTPUT ? 1 : 2);
    if (opcode === INPUT) mid = start;
    var end = mid + 1;
    if (opcode === OUTPUT) end = mid;

    var inputs = list.slice(start, mid);
    var outputPos = list.slice(mid, end)[0];

    //console.log(codes, inputs, outputPos, end - 1, modes);
    var newPointer = doCommand(opcode, modes, inputs, outputPos, pointer);
    return newPointer !== false ? newPointer : end;
  }

  function doCommand(opcode, modes, inputs, outputPos, currPointer) {
    function getValue(input, mode) {
      if (mode === IMMEDIATE) return input;
      return list[input];
    }
    
    var inputValues = inputs.map((input,i) => getValue(input, modes[i]));

    if (opcode === ADD) {
      var value = inputValues.reduce((a,b) => a+b, 0);
      list[outputPos] = value;
    }
    if (opcode === MULTIPLY) {
      var value = inputValues.reduce((a,b) => a*b, 1);
      list[outputPos] = value;
    }
    if (opcode === OUTPUT) {
      var value = getValue(inputs[0], modes[0]);
      output.push(value);
    }
    if (opcode === EXIT) {
      throw EXIT;
    }
    if (opcode === INPUT) {
      list[outputPos] = input[0];
      input.splice(0,1);
    }
    if (opcode === JUMPIFTRUE) {
      var value1 = getValue(inputs[0], modes[0]);
      var value2 = getValue(inputs[1], modes[1]);
      if (value1 !== 0) {
        return value2;
      }
      return currPointer + 3; // skip past the two params and outputPos
    }
    if (opcode === JUMPIFFALSE) {
      var value1 = getValue(inputs[0], modes[0]);
      var value2 = getValue(inputs[1], modes[1]);
      if (value1 === 0) {
        return value2;
      }
      return currPointer + 3; // skip past the two params and outputPos
    }
    if (opcode === LESSTHAN) {
      var value1 = getValue(inputs[0], modes[0]);
      var value2 = getValue(inputs[1], modes[1]);
      list[outputPos] = value1 < value2 ? 1 : 0;
    }
    if (opcode === EQUALS) {
      var value1 = getValue(inputs[0], modes[0]);
      var value2 = getValue(inputs[1], modes[1]);
      list[outputPos] = value1 === value2 ? 1 : 0;
    }

    return false;
  } 

  var pointer = 0;
  try {
    while (pointer < list.length) {
      try {
        //console.log(list);
        pointer = doInstruction(pointer);
      } catch (e) {
        if (e === EXIT) {
          //console.log('EXIT')
          break;
        } else {
          throw e;
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
  //console.log(list);
  return output;
}

function perm(xs) {
  let ret = [];

  for (let i = 0; i < xs.length; i = i + 1) {
    let rest = perm(xs.slice(0, i).concat(xs.slice(i + 1)));

    if(!rest.length) {
      ret.push([xs[i]])
    } else {
      for(let j = 0; j < rest.length; j = j + 1) {
        ret.push([xs[i]].concat(rest[j]))
      }
    }
  }
  return ret;
}

var instructions = [3,8,1001,8,10,8,105,1,0,0,21,38,63,88,97,118,199,280,361,442,99999,3,9,1002,9,3,9,101,2,9,9,1002,9,4,9,4,9,99,3,9,101,3,9,9,102,5,9,9,101,3,9,9,1002,9,3,9,101,3,9,9,4,9,99,3,9,1002,9,2,9,1001,9,3,9,102,3,9,9,101,2,9,9,1002,9,4,9,4,9,99,3,9,102,2,9,9,4,9,99,3,9,102,4,9,9,101,5,9,9,102,2,9,9,101,5,9,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,99,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,99,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,99,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,99];
var perms = perm([0,1,2,3,4]);

var highest = [0, null];
perms.forEach(phases => {
  var prevInput = 0;
  phases.forEach(phase => {
    [prevInput] = runAmplifier(instructions, parseInt(phase), parseInt(prevInput));
  });
  if (prevInput > highest[0]) {
    highest = [prevInput, phases];
  }
});
console.log(highest);