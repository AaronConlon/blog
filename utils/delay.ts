/**
 * 描述 至少显示 Loading 若干毫秒
 * @date 2022-10-07
 * @param {function} func: 异步函数
 * @param {{ params, onError, delayMs }} options: 异步函数参数,出错回调函数，等待毫秒数，默认500ms
 * @returns {T}
 */
export const loadingDelay = async <T, P>(
  func: (params?: P) => Promise<T>,
  options: {
    params?: P;
    onError?: (err: any) => void;
    delayMs?: number;
  } = {}
): Promise<T | undefined> => {
  const { onError, params, delayMs = 500 } = options;

  try {
    const [res] = await Promise.all([
      func(params),
      () => new Promise((resolve) => setTimeout(resolve, delayMs)),
    ]);
    return res;
  } catch (error) {
    onError?.(error);
  }
};
