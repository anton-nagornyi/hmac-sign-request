export const extractTimeSig = (sigData: string): [number, string, string] => {
  const separator = sigData.indexOf(',');
  if (separator < 0) {
    return [0, '', ''];
  }
  const timeStr = sigData.substring(0, separator);
  const sigStr = sigData.substring(separator + 1);

  if (!timeStr.startsWith('t=') || !sigStr.startsWith('v1=')) {
    return [0, '', ''];
  }

  const time = timeStr.substring(timeStr.indexOf('=') + 1);
  const sig = sigStr.substring(sigStr.indexOf('=') + 1);

  const timeNum = parseInt(time, 10);
  if (Number.isNaN(timeNum)) {
    return [0, '', ''];
  }
  return [timeNum, time, sig];
};
