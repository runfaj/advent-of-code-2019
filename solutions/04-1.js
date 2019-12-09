var inputRange = [172851, 675869];
var count = 0;

// loop once for each number in range O(n)
for(var num=inputRange[0]; num<=inputRange[1]; num++) {
  var numStr = num.toString();
  var valid = true;
  var hasRepeat = false;

  // loop through each digit of number to check conditions O(6)
  for(var j=1; j<numStr.length; j++) {
    var thisDigit = parseInt(numStr[j]);
    var prevDigit = parseInt(numStr[j-1]);
    
    if (thisDigit < prevDigit) {
      valid = false;
      break;
    }
    if (thisDigit === prevDigit) {
      hasRepeat = true;
    }
  }

  if (hasRepeat && valid) {
    count++;
  }
}

console.log(count);