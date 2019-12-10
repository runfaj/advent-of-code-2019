/* unsolved - seems like my logic matches the requirements, but 945 isn't correct */

//var inputRange = [112233, 112301];
var inputRange = [172851, 675869];
//var inputRange = [111111, 112234];
var count = 0;

// loop once for each number in range O(n)
for (var num = inputRange[0]; num <= inputRange[1]; num++) {
  var numStr = num.toString();
  var valid = true;
  var hasRepeat = false;
  var highestDigit = parseInt(numStr[0]);
  var highestDigitCount = 1;
  var highestDigitStart = 0;

  // loop through each digit of number to check conditions O(6) and find highest group num
  for (var j = 1; j < numStr.length; j++) {
    var thisDigit = parseInt(numStr[j]);
    var prevDigit = parseInt(numStr[j - 1]);

    if (thisDigit < prevDigit) {
      valid = false;
      break;
    }
    
    if (thisDigit === prevDigit) {
      hasRepeat = true;

      if (thisDigit === highestDigit) {
        highestDigitCount++;
      }
      else if (thisDigit > highestDigit && prevDigit > highestDigit) {
        highestDigit = thisDigit;
        highestDigitCount = 2;
      }

    }
  }

  if (highestDigitCount > 2) {
    valid = false;
  }

  // if (hasRepeat) {
  //   console.log(num, highestDigit, highestDigitCount, valid);
  // }

  if (hasRepeat && valid) {
    //console.log(num, highestDigit, highestDigitCount)
    count++;
  }
}

console.log(count);