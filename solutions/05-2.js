var list = [
  3,225,1,225,6,6,1100,1,238,225,104,0,1102,27,28,225,1,113,14,224,1001,224,-34,224,4,224,102,8,223,223,101,7,224,224,1,224,223,223,1102,52,34,224,101,-1768,224,224,4,224,1002,223,8,223,101,6,224,224,1,223,224,223,1002,187,14,224,1001,224,-126,224,4,224,102,8,223,223,101,2,224,224,1,224,223,223,1102,54,74,225,1101,75,66,225,101,20,161,224,101,-54,224,224,4,224,1002,223,8,223,1001,224,7,224,1,224,223,223,1101,6,30,225,2,88,84,224,101,-4884,224,224,4,224,1002,223,8,223,101,2,224,224,1,224,223,223,1001,214,55,224,1001,224,-89,224,4,224,102,8,223,223,1001,224,4,224,1,224,223,223,1101,34,69,225,1101,45,67,224,101,-112,224,224,4,224,102,8,223,223,1001,224,2,224,1,223,224,223,1102,9,81,225,102,81,218,224,101,-7290,224,224,4,224,1002,223,8,223,101,5,224,224,1,223,224,223,1101,84,34,225,1102,94,90,225,4,223,99,0,0,0,677,0,0,0,0,0,0,0,0,0,0,0,1105,0,99999,1105,227,247,1105,1,99999,1005,227,99999,1005,0,256,1105,1,99999,1106,227,99999,1106,0,265,1105,1,99999,1006,0,99999,1006,227,274,1105,1,99999,1105,1,280,1105,1,99999,1,225,225,225,1101,294,0,0,105,1,0,1105,1,99999,1106,0,300,1105,1,99999,1,225,225,225,1101,314,0,0,106,0,0,1105,1,99999,1007,677,677,224,102,2,223,223,1005,224,329,101,1,223,223,1108,226,677,224,1002,223,2,223,1005,224,344,101,1,223,223,1008,677,677,224,102,2,223,223,1005,224,359,101,1,223,223,8,226,677,224,1002,223,2,223,1006,224,374,101,1,223,223,108,226,677,224,1002,223,2,223,1006,224,389,1001,223,1,223,1107,226,677,224,102,2,223,223,1005,224,404,1001,223,1,223,7,226,677,224,1002,223,2,223,1005,224,419,101,1,223,223,1107,677,226,224,102,2,223,223,1006,224,434,1001,223,1,223,1107,226,226,224,1002,223,2,223,1006,224,449,101,1,223,223,1108,226,226,224,1002,223,2,223,1005,224,464,101,1,223,223,8,677,226,224,102,2,223,223,1005,224,479,101,1,223,223,8,226,226,224,1002,223,2,223,1006,224,494,1001,223,1,223,1007,226,677,224,1002,223,2,223,1006,224,509,1001,223,1,223,108,226,226,224,1002,223,2,223,1006,224,524,1001,223,1,223,1108,677,226,224,102,2,223,223,1006,224,539,101,1,223,223,1008,677,226,224,102,2,223,223,1006,224,554,101,1,223,223,107,226,677,224,1002,223,2,223,1006,224,569,101,1,223,223,107,677,677,224,102,2,223,223,1006,224,584,101,1,223,223,7,677,226,224,102,2,223,223,1005,224,599,101,1,223,223,1008,226,226,224,1002,223,2,223,1005,224,614,1001,223,1,223,107,226,226,224,1002,223,2,223,1005,224,629,101,1,223,223,7,226,226,224,102,2,223,223,1006,224,644,1001,223,1,223,1007,226,226,224,102,2,223,223,1006,224,659,101,1,223,223,108,677,677,224,102,2,223,223,1005,224,674,1001,223,1,223,4,223,99,226
];

//list = [3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,
//1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,
//999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99];

var input = 5;

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
    console.log("output: " + value);
  }
  if (opcode === EXIT) {
    throw EXIT;
  }
  if (opcode === INPUT) {
    list[outputPos] = input;
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
        console.log('EXIT')
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