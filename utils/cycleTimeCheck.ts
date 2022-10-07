export const cycleTimeCheck = async (cb: () => Promise<any>) => {
  // 检查全局状态
  const date = new Date();
  if (globalThis.updateTime === undefined) {
    globalThis.updateTime = date;
  }
  // 上次更新时间是五分钟之前，则重新执行任务
  if (date.valueOf() - globalThis.updateTime.valueOf() >= -5 * 1000 * 60) {
    await cb();
    // 更新全局任务时间
    globalThis.updateTime = new Date();
  }
};
